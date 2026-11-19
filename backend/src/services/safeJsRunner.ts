/**
 * Safe JavaScript isolated sandbox runner.
 * Executed in a separate child process with strict memory and time limits.
 */
import vm from 'vm';

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null || typeof a !== 'object') return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
  }
  return true;
}

let inputData = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk: string) => {
  inputData += chunk;
});

process.stdin.on('end', () => {
  try {
    const payload = JSON.parse(inputData);
    const { code, functionName, testCases } = payload;

    // Create safe sandbox environment
    const sandboxLogs: string[] = [];
    const sandbox: Record<string, any> = {
      console: {
        log: (...args: any[]) => sandboxLogs.push(args.map((a: any) => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
        warn: (...args: any[]) => sandboxLogs.push(args.map((a: any) => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
        error: (...args: any[]) => sandboxLogs.push(args.map((a: any) => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
      },
      Math,
      Array,
      Object,
      String,
      Number,
      Boolean,
      Date,
      RegExp,
      Map,
      Set,
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
      JSON,
    };

    const context = vm.createContext(sandbox);

    // Compile and execute user code within context
    const script = new vm.Script(code, {
      filename: 'user_submission.js',
    });
    script.runInContext(context, { timeout: 2000 });

    // Locate target function
    let targetFn: any = null;
    if (functionName && typeof context[functionName] === 'function') {
      targetFn = context[functionName];
    } else {
      // Find the first user function defined in the context
      const candidates = Object.keys(context).filter(
        (key) => typeof context[key] === 'function' && !sandbox[key]
      );
      if (candidates.length > 0) {
        targetFn = context[candidates[0]];
      }
    }

    if (!targetFn) {
      process.stdout.write(
        JSON.stringify({
          success: false,
          error: `Function "${functionName || 'entry'}" was not found or is not callable in submitted code.`,
          testResults: [],
        })
      );
      process.exit(0);
    }

    const testResults: any[] = [];
    let passedCount = 0;

    for (let i = 0; i < (testCases || []).length; i++) {
      const tc = testCases[i];
      const start = process.hrtime.bigint();
      let actualOutput: any = null;
      let error: string | null = null;
      let passed = false;

      try {
        let args: any[] = [];
        if (Array.isArray(tc.input)) {
          args = tc.input;
        } else if (typeof tc.input === 'object' && tc.input !== null) {
          args = Object.values(tc.input);
        } else {
          args = [tc.input];
        }

        // Clone inputs so user code mutating parameters doesn't poison other tests
        const clonedArgs = JSON.parse(JSON.stringify(args));
        actualOutput = targetFn(...clonedArgs);

        passed = deepEqual(actualOutput, tc.expectedOutput);
      } catch (err: any) {
        error = err?.message || 'Execution error';
      }

      const end = process.hrtime.bigint();
      const executionTimeMs = Number(end - start) / 1000000;

      if (passed) passedCount++;

      testResults.push({
        testCaseId: tc.id || `test_${i + 1}`,
        passed,
        input: typeof tc.input === 'object' ? JSON.stringify(tc.input) : String(tc.input),
        expected: typeof tc.expectedOutput === 'object' ? JSON.stringify(tc.expectedOutput) : String(tc.expectedOutput),
        actual: error ? 'ERROR' : (typeof actualOutput === 'object' ? JSON.stringify(actualOutput) : String(actualOutput)),
        error: error || undefined,
        executionTimeMs: Math.round(executionTimeMs * 100) / 100,
        isHidden: !!tc.isHidden,
      });
    }

    process.stdout.write(
      JSON.stringify({
        success: true,
        passedCount,
        totalCount: testCases.length,
        allPassed: passedCount === testCases.length,
        logs: sandboxLogs.slice(0, 20),
        testResults,
      })
    );
  } catch (err: any) {
    process.stdout.write(
      JSON.stringify({
        success: false,
        error: err?.message || 'Sandbox execution failed',
        testResults: [],
      })
    );
  }
});
