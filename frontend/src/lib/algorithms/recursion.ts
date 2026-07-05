import { VisualizationFrame, CallStackFrame } from '../../types/visualizer';

export function generateFactorialFrames(n: number): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  let currentStack: CallStackFrame[] = [];
  let callIdCounter = 0;
  
  // To avoid infinite loops and overflowing the UI, cap n
  const safeN = Math.min(Math.max(n, 1), 6);

  function pushFrame(stack: CallStackFrame[]) {
    frames.push({
      elements: [], // not used for pure call stack
      event: { type: 'CALL', explanation: 'Current call stack state.' },
      callStack: JSON.parse(JSON.stringify(stack)),
      context: {
        phaseName: 'Recursion',
        goal: 'Calculate Factorial',
        totalPasses: safeN,
        currentPass: 0,
        overallProgress: 0,
      }
    });
  }

  function factorial(x: number): number {
    const id = `call-${callIdCounter++}`;
    
    // push to stack
    currentStack.push({
      id,
      name: 'factorial',
      args: { n: x.toString() },
      isActive: true,
      status: 'pending'
    });
    
    pushFrame(currentStack);

    let result = 1;
    if (x <= 1) {
      // Base case
      const top = currentStack[currentStack.length - 1];
      top.status = 'resolving';
      top.returnedValue = '1';
      pushFrame(currentStack);
      frames[frames.length - 1].event.type = 'BASE_CASE';
      frames[frames.length - 1].event.explanation = `Base case reached! n = ${x} <= 1, returning 1.`;
    } else {
      // Recursive case
      frames[frames.length - 1].event.explanation = `n > 1. We must calculate ${x} * factorial(${x-1}). Pausing execution.`;
      
      const prevResult = factorial(x - 1);
      
      result = x * prevResult;
      
      // Now resolving
      const top = currentStack.find(f => f.id === id)!;
      top.status = 'resolving';
      top.returnedValue = result.toString();
      top.locals = { 'factorial(n-1)': prevResult.toString(), 'result': result.toString() };
      
      pushFrame(currentStack);
      frames[frames.length - 1].event.explanation = `factorial(${x - 1}) returned ${prevResult}. Now computing ${x} * ${prevResult} = ${result}.`;
    }

    // pop from stack (mark as resolved first to show animation)
    const top = currentStack.find(f => f.id === id)!;
    top.status = 'resolved';
    pushFrame(currentStack);
    frames[frames.length - 1].event.type = 'RETURN';
    frames[frames.length - 1].event.explanation = `Returning ${result} to the caller.`;
    
    currentStack = currentStack.filter(f => f.id !== id);
    
    if (currentStack.length > 0) {
      pushFrame(currentStack);
      frames[frames.length - 1].event.explanation = `Popped factorial(${x}) from stack. Resuming previous call.`;
    }

    return result;
  }

  factorial(safeN);
  
  if (frames.length > 0) {
    frames[frames.length - 1].event.type = 'COMPLETE';
    frames[frames.length - 1].event.explanation = `Factorial calculation completed! Final result is ${frames[frames.length - 2]?.callStack?.[0]?.returnedValue || 1}.`;
  }
  
  return frames;
}


export function generateFibonacciFrames(n: number): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  let currentStack: CallStackFrame[] = [];
  let callIdCounter = 0;
  
  const safeN = Math.min(Math.max(n, 1), 5); // Fib branches exponentially, keep it small

  function pushFrame(stack: CallStackFrame[]) {
    frames.push({
      elements: [], 
      event: { type: 'CALL', explanation: 'Current call stack state.' },
      callStack: JSON.parse(JSON.stringify(stack)),
      context: {
        phaseName: 'Recursion',
        goal: 'Calculate Fibonacci',
        totalPasses: safeN,
        currentPass: 0,
        overallProgress: 0,
      }
    });
  }

  function fibonacci(x: number): number {
    const id = `call-${callIdCounter++}`;
    
    currentStack.push({
      id,
      name: 'fib',
      args: { n: x.toString() },
      isActive: true,
      status: 'pending'
    });
    
    pushFrame(currentStack);

    let result = 1;
    if (x <= 1) {
      const top = currentStack[currentStack.length - 1];
      top.status = 'resolving';
      top.returnedValue = x.toString();
      pushFrame(currentStack);
      frames[frames.length - 1].event.type = 'BASE_CASE';
      frames[frames.length - 1].event.explanation = `Base case reached! n = ${x}, returning ${x}.`;
      result = x;
    } else {
      frames[frames.length - 1].event.explanation = `n > 1. Must calculate fib(${x-1}) + fib(${x-2}). Calling fib(${x-1}) first.`;
      
      const leftResult = fibonacci(x - 1);
      
      const topAfterLeft = currentStack.find(f => f.id === id)!;
      topAfterLeft.locals = { 'fib(n-1)': leftResult.toString() };
      pushFrame(currentStack);
      frames[frames.length - 1].event.explanation = `fib(${x - 1}) returned ${leftResult}. Now calling fib(${x-2}).`;
      
      const rightResult = fibonacci(x - 2);
      
      result = leftResult + rightResult;
      
      const topAfterRight = currentStack.find(f => f.id === id)!;
      topAfterRight.status = 'resolving';
      topAfterRight.returnedValue = result.toString();
      topAfterRight.locals = { 
        'fib(n-1)': leftResult.toString(), 
        'fib(n-2)': rightResult.toString(),
        'sum': result.toString() 
      };
      
      pushFrame(currentStack);
      frames[frames.length - 1].event.explanation = `Both branches complete. ${leftResult} + ${rightResult} = ${result}.`;
    }

    const top = currentStack.find(f => f.id === id)!;
    top.status = 'resolved';
    pushFrame(currentStack);
    frames[frames.length - 1].event.type = 'RETURN';
    frames[frames.length - 1].event.explanation = `Returning ${result} to the caller.`;
    
    currentStack = currentStack.filter(f => f.id !== id);
    
    if (currentStack.length > 0) {
      pushFrame(currentStack);
      frames[frames.length - 1].event.explanation = `Popped fib(${x}) from stack. Resuming previous call.`;
    }

    return result;
  }

  fibonacci(safeN);
  
  if (frames.length > 0) {
    frames[frames.length - 1].event.type = 'COMPLETE';
    frames[frames.length - 1].event.explanation = `Fibonacci calculation completed!`;
  }
  
  return frames;
}
