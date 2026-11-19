import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export interface TestCaseInput {
  id?: string;
  input: any;
  expectedOutput: any;
  isHidden?: boolean;
}

export interface TestCaseResult {
  testCaseId: string;
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  error?: string;
  executionTimeMs: number;
  isHidden?: boolean;
}

export interface CodeExecutionResponse {
  success: boolean;
  passedCount: number;
  totalCount: number;
  allPassed: boolean;
  logs?: string[];
  error?: string;
  testResults: TestCaseResult[];
}

export class CodeRunnerService {
  /**
   * Securely executes submitted code against test cases in an isolated child process.
   * Enforces a hard timeout and sandboxed globals to protect the Express server.
   */
  public static async executeCode(params: {
    code: string;
    language: string;
    functionName?: string;
    testCases: TestCaseInput[];
    timeoutMs?: number;
  }): Promise<CodeExecutionResponse> {
    const { code, language, functionName, testCases, timeoutMs = 4000 } = params;

    // JavaScript / TypeScript execution
    if (language === 'javascript' || language === 'typescript' || language === 'js' || language === 'ts') {
      return this.executeJavaScriptInChildProcess({
        code,
        functionName,
        testCases,
        timeoutMs,
      });
    }

    // For other languages (Python/C++/Java) where native host compilers may vary,
    // evaluate with python if available or provide simulated structured execution
    return this.executeNonJsCode({ code, language, functionName, testCases, timeoutMs });
  }

  private static executeJavaScriptInChildProcess(params: {
    code: string;
    functionName?: string;
    testCases: TestCaseInput[];
    timeoutMs: number;
  }): Promise<CodeExecutionResponse> {
    return new Promise((resolve) => {
      let runnerPath = path.resolve(__dirname, 'safeJsRunner.js');
      if (!fs.existsSync(runnerPath)) {
        runnerPath = path.resolve(__dirname, '../../src/services/safeJsRunner.ts');
      }
      if (!fs.existsSync(runnerPath)) {
        runnerPath = path.resolve(__dirname, 'safeJsRunner.ts');
      }
      const child = spawn(
        process.execPath,
        ['--max-old-space-size=64', runnerPath],
        {
          stdio: ['pipe', 'pipe', 'pipe'],
          windowsHide: true,
        }
      );

      let stdout = '';
      let stderr = '';
      let killed = false;

      const timer = setTimeout(() => {
        killed = true;
        child.kill('SIGKILL');
        resolve({
          success: false,
          passedCount: 0,
          totalCount: params.testCases.length,
          allPassed: false,
          error: `Execution timed out (${params.timeoutMs}ms). Possible infinite loop or unbounded recursion detected.`,
          testResults: params.testCases.map((tc, idx) => ({
            testCaseId: tc.id || `test_${idx + 1}`,
            passed: false,
            input: JSON.stringify(tc.input),
            expected: JSON.stringify(tc.expectedOutput),
            actual: 'TIMEOUT',
            error: 'Time Limit Exceeded (TLE)',
            executionTimeMs: params.timeoutMs,
            isHidden: !!tc.isHidden,
          })),
        });
      }, params.timeoutMs);

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (exitCode) => {
        clearTimeout(timer);
        if (killed) return;

        if (exitCode !== 0 && !stdout.trim()) {
          return resolve({
            success: false,
            passedCount: 0,
            totalCount: params.testCases.length,
            allPassed: false,
            error: stderr.trim() || `Process exited with error code ${exitCode}`,
            testResults: [],
          });
        }

        try {
          const parsed = JSON.parse(stdout);
          resolve(parsed);
        } catch {
          resolve({
            success: false,
            passedCount: 0,
            totalCount: params.testCases.length,
            allPassed: false,
            error: stderr.trim() || stdout.trim() || 'Failed to parse execution result',
            testResults: [],
          });
        }
      });

      child.on('error', (err) => {
        clearTimeout(timer);
        if (killed) return;
        resolve({
          success: false,
          passedCount: 0,
          totalCount: params.testCases.length,
          allPassed: false,
          error: `Worker execution error: ${err.message}`,
          testResults: [],
        });
      });

      // Send payload to child stdin
      const payload = JSON.stringify({
        code: params.code,
        functionName: params.functionName,
        testCases: params.testCases,
      });

      child.stdin.write(payload);
      child.stdin.end();
    });
  }

  private static async executeNonJsCode(params: {
    code: string;
    language: string;
    functionName?: string;
    testCases: TestCaseInput[];
    timeoutMs: number;
  }): Promise<CodeExecutionResponse> {
    // For languages without a local C++/Java toolchain installed, inform user and test appropriately
    return {
      success: true,
      passedCount: 0,
      totalCount: params.testCases.length,
      allPassed: false,
      error: `Native compilation for ${params.language} requires a local compiler. Please select JavaScript or review the code logic directly.`,
      testResults: params.testCases.map((tc, idx) => ({
        testCaseId: tc.id || `test_${idx + 1}`,
        passed: false,
        input: JSON.stringify(tc.input),
        expected: JSON.stringify(tc.expectedOutput),
        actual: 'N/A',
        error: `Compiler for ${params.language} not installed in this environment.`,
        executionTimeMs: 0,
        isHidden: !!tc.isHidden,
      })),
    };
  }
}
