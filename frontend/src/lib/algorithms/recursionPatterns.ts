import { VisualizationFrame, CallStackFrame } from '../../types/visualizer';

function createHelper() {
  const frames: VisualizationFrame[] = [];
  let currentStack: CallStackFrame[] = [];
  let callIdCounter = 0;

  function pushFrame(eventType: any, explanation: string, phaseName: string) {
    frames.push({
      elements: [], 
      event: { type: eventType, explanation },
      callStack: JSON.parse(JSON.stringify(currentStack)),
      context: { phaseName, goal: 'Pattern', totalPasses: 0, currentPass: 0, overallProgress: 0 }
    });
  }
  return { frames, currentStack, getCallId: () => `call-${callIdCounter++}`, pushFrame };
}

export function generateHeadRecursionFrames(n: number): VisualizationFrame[] {
  const { frames, currentStack, getCallId, pushFrame } = createHelper();
  const safeN = Math.min(Math.max(n, 1), 5);

  function headRec(x: number) {
    const id = getCallId();
    currentStack.push({ id, name: 'headRec', args: { n: x.toString() }, isActive: true, status: 'pending' });
    pushFrame('CALL', `Calling headRec(${x})`, 'Head Recursion');

    if (x === 0) {
      currentStack[currentStack.length - 1].status = 'resolving';
      pushFrame('BASE_CASE', `Base case reached (n=0). Returning.`, 'Head Recursion');
    } else {
      pushFrame('CALL', `Immediately calling headRec(${x-1}) BEFORE doing any work!`, 'Head Recursion');
      headRec(x - 1);
      
      const top = currentStack.find(f => f.id === id)!;
      top.status = 'resolving';
      top.locals = { 'action': `Printed ${x}` };
      pushFrame('CALL', `headRec(${x-1}) returned. Now performing deferred action: Print ${x}`, 'Head Recursion');
    }

    const top = currentStack.find(f => f.id === id)!;
    top.status = 'resolved';
    pushFrame('RETURN', `Returning from headRec(${x})`, 'Head Recursion');
    currentStack.pop();
  }

  headRec(safeN);
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

export function generateTailRecursionFrames(n: number): VisualizationFrame[] {
  const { frames, currentStack, getCallId, pushFrame } = createHelper();
  const safeN = Math.min(Math.max(n, 1), 5);

  function tailRec(x: number) {
    const id = getCallId();
    currentStack.push({ id, name: 'tailRec', args: { n: x.toString() }, isActive: true, status: 'pending' });
    pushFrame('CALL', `Calling tailRec(${x})`, 'Tail Recursion');

    if (x === 0) {
      currentStack[currentStack.length - 1].status = 'resolving';
      pushFrame('BASE_CASE', `Base case reached (n=0). Returning.`, 'Tail Recursion');
    } else {
      const top = currentStack.find(f => f.id === id)!;
      top.locals = { 'action': `Printed ${x}` };
      pushFrame('CALL', `Performing action first: Print ${x}. Now calling tailRec(${x-1})`, 'Tail Recursion');
      tailRec(x - 1);
      
      top.status = 'resolving';
      pushFrame('CALL', `tailRec(${x-1}) returned. No work left to do!`, 'Tail Recursion');
    }

    const top = currentStack.find(f => f.id === id)!;
    top.status = 'resolved';
    pushFrame('RETURN', `Returning from tailRec(${x})`, 'Tail Recursion');
    currentStack.pop();
  }

  tailRec(safeN);
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

export function generateTreeRecursionFrames(n: number): VisualizationFrame[] {
  const { frames, currentStack, getCallId, pushFrame } = createHelper();
  const safeN = Math.min(Math.max(n, 1), 3);

  function treeRec(x: number): number {
    const id = getCallId();
    currentStack.push({ id, name: 'treeRec', args: { n: x.toString() }, isActive: true, status: 'pending' });
    pushFrame('CALL', `Calling treeRec(${x})`, 'Tree Recursion');

    let result = 0;
    if (x <= 1) {
      result = x;
      currentStack[currentStack.length - 1].status = 'resolving';
      currentStack[currentStack.length - 1].returnedValue = result.toString();
      pushFrame('BASE_CASE', `Base case (n <= 1). Returning ${result}.`, 'Tree Recursion');
    } else {
      pushFrame('CALL', `Branch 1: Calling treeRec(${x-1})`, 'Tree Recursion');
      const left = treeRec(x - 1);
      
      const top = currentStack.find(f => f.id === id)!;
      top.locals = { 'left': left.toString() };
      pushFrame('CALL', `Branch 1 returned ${left}. Branch 2: Calling treeRec(${x-2})`, 'Tree Recursion');
      const right = treeRec(x - 2);
      
      result = left + right;
      top.status = 'resolving';
      top.locals = { 'left': left.toString(), 'right': right.toString(), 'sum': result.toString() };
      top.returnedValue = result.toString();
      pushFrame('CALL', `Both branches returned. Returning sum = ${result}.`, 'Tree Recursion');
    }

    const top = currentStack.find(f => f.id === id)!;
    top.status = 'resolved';
    pushFrame('RETURN', `Returning ${result} from treeRec(${x})`, 'Tree Recursion');
    currentStack.pop();
    return result;
  }

  treeRec(safeN);
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

export function generateIndirectRecursionFrames(n: number): VisualizationFrame[] {
  const { frames, currentStack, getCallId, pushFrame } = createHelper();
  const safeN = Math.min(Math.max(n, 1), 5); 

  function funA(x: number) {
    const id = getCallId();
    currentStack.push({ id, name: 'funA', args: { n: x.toString() }, isActive: true, status: 'pending' });
    pushFrame('CALL', `Calling funA(${x})`, 'Indirect Recursion');

    if (x <= 0) {
      currentStack[currentStack.length - 1].status = 'resolving';
      pushFrame('BASE_CASE', `Base case in funA! n <= 0.`, 'Indirect Recursion');
    } else {
      const top = currentStack.find(f => f.id === id)!;
      top.locals = { 'action': `Printed A:${x}` };
      pushFrame('CALL', `funA processing: Print A:${x}. Passing control to funB(${x-1})`, 'Indirect Recursion');
      funB(x - 1);
      top.status = 'resolving';
    }
    const top = currentStack.find(f => f.id === id)!;
    top.status = 'resolved';
    pushFrame('RETURN', `funA(${x}) returning.`, 'Indirect Recursion');
    currentStack.pop();
  }

  function funB(x: number) {
    const id = getCallId();
    currentStack.push({ id, name: 'funB', args: { n: x.toString() }, isActive: true, status: 'pending' });
    pushFrame('CALL', `Calling funB(${x})`, 'Indirect Recursion');

    if (x <= 0) {
      currentStack[currentStack.length - 1].status = 'resolving';
      pushFrame('BASE_CASE', `Base case in funB! n <= 0.`, 'Indirect Recursion');
    } else {
      const top = currentStack.find(f => f.id === id)!;
      top.locals = { 'action': `Printed B:${x}` };
      pushFrame('CALL', `funB processing: Print B:${x}. Passing control to funA(${x-1})`, 'Indirect Recursion');
      funA(x - 1);
      top.status = 'resolving';
    }
    const top = currentStack.find(f => f.id === id)!;
    top.status = 'resolved';
    pushFrame('RETURN', `funB(${x}) returning.`, 'Indirect Recursion');
    currentStack.pop();
  }

  funA(safeN);
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}
