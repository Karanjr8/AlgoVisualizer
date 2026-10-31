import { IVisualizerEngine, EngineMeta, TimelineSnapshot } from '../../types/core';
import { StackQueueVisualizerState, StackQueueItem, StackQueueKind } from '../../types/ds-states';

export class StackQueueEngine implements IVisualizerEngine<StackQueueVisualizerState> {
  public meta: EngineMeta = {
    id: 'stack-queue-engine',
    name: 'Stack & Queue Engine',
    dataStructure: 'stack-queue',
    category: 'Linear Data Structures',
    supportedOperations: [
      'push',
      'pop',
      'peek',
      'enqueue',
      'dequeue',
      'circular-enqueue',
      'circular-dequeue',
      'deque-push-front',
      'deque-push-rear',
      'deque-pop-front',
      'deque-pop-rear',
      'clear',
    ],
    defaultInput: [15, 27, 42],
  };

  public generateInitialState(input?: (number | string)[], kind: StackQueueKind = 'stack'): StackQueueVisualizerState {
    const raw = Array.isArray(input) && input.length > 0 ? input : this.meta.defaultInput;
    const capacity = 8;
    const items: StackQueueItem[] = raw.slice(0, capacity).map((val: number | string, idx: number) => ({
      id: `sq-${idx}-${val}`,
      value: val,
      state: 'default',
      label: kind === 'stack' && idx === raw.length - 1 ? 'TOP' : undefined,
    }));

    return {
      kind,
      capacity,
      items,
      topIndex: kind === 'stack' ? items.length - 1 : -1,
      frontIndex: items.length > 0 ? 0 : -1,
      rearIndex: items.length > 0 ? items.length - 1 : -1,
      overflow: false,
      underflow: false,
      message: `${kind.toUpperCase()} initialized with capacity ${capacity} and ${items.length} items.`,
    };
  }

  public executeOperation(
    operation: string,
    params: any = {},
    currentState: StackQueueVisualizerState
  ): TimelineSnapshot<StackQueueVisualizerState>[] {
    switch (operation) {
      case 'push':
        return this.runPush(currentState, params.value ?? 88);
      case 'pop':
        return this.runPop(currentState);
      case 'peek':
        return this.runPeek(currentState);
      case 'enqueue':
        return this.runEnqueue(currentState, params.value ?? 55);
      case 'dequeue':
        return this.runDequeue(currentState);
      case 'circular-enqueue':
        return this.runCircularEnqueue(currentState, params.value ?? 73);
      case 'circular-dequeue':
        return this.runCircularDequeue(currentState);
      case 'deque-push-front':
        return this.runDequePushFront(currentState, params.value ?? 90);
      case 'deque-push-rear':
        return this.runDequePushRear(currentState, params.value ?? 90);
      case 'deque-pop-front':
        return this.runDequePopFront(currentState);
      case 'deque-pop-rear':
        return this.runDequePopRear(currentState);
      case 'clear':
        return this.runClear(currentState);
      default:
        return this.runPeek(currentState);
    }
  }

  // ================= STACK PUSH =================
  private runPush(state: StackQueueVisualizerState, val: number | string): TimelineSnapshot<StackQueueVisualizerState>[] {
    const snapshots: TimelineSnapshot<StackQueueVisualizerState>[] = [];

    // Check overflow
    if (state.items.length >= state.capacity) {
      snapshots.push({
        stepIndex: 0,
        totalSteps: 1,
        event: { id: 'overflow', type: 'STACK_OVERFLOW', description: 'Stack Overflow Condition!' },
        state: {
          ...state,
          overflow: true,
          message: `Stack Overflow! Cannot push onto full stack (Capacity: ${state.capacity}).`,
        },
        explanation: 'Stack Overflow error occurs when attempting to push onto an already full stack.',
        pseudocodeLine: 1,
      });
      return snapshots;
    }

    const newItem: StackQueueItem = {
      id: `item-${Date.now()}`,
      value: val,
      state: 'pushed',
      label: 'NEW TOP',
    };

    snapshots.push({
      stepIndex: 0,
      totalSteps: 2,
      event: { id: 'push-start', type: 'PUSH_PREPARE', description: `Prepare to Push(${val})` },
      state: {
        ...state,
        overflow: false,
        underflow: false,
        message: `Increment top index: top = ${state.topIndex + 1}. Preparing to insert ${val}.`,
      },
      explanation: 'top = top + 1 advances top pointer to next available slot.',
      pseudocodeLine: 2,
    });

    const newItems = [...state.items, newItem].map((item, idx, arr) => ({
      ...item,
      state: idx === arr.length - 1 ? ('active' as const) : ('default' as const),
      label: idx === arr.length - 1 ? 'TOP' : undefined,
    }));

    snapshots.push({
      stepIndex: 1,
      totalSteps: 2,
      event: { id: 'push-done', type: 'PUSH_DONE', description: `Pushed ${val} onto Stack` },
      state: {
        ...state,
        items: newItems,
        topIndex: newItems.length - 1,
        message: `Successfully pushed ${val} onto TOP of stack. Size = ${newItems.length}.`,
      },
      explanation: 'stack[top] = value completed in O(1) constant time.',
      pseudocodeLine: 3,
    });

    return snapshots;
  }

  // ================= STACK POP =================
  private runPop(state: StackQueueVisualizerState): TimelineSnapshot<StackQueueVisualizerState>[] {
    const snapshots: TimelineSnapshot<StackQueueVisualizerState>[] = [];

    if (state.items.length === 0) {
      snapshots.push({
        stepIndex: 0,
        totalSteps: 1,
        event: { id: 'underflow', type: 'STACK_UNDERFLOW', description: 'Stack Underflow Condition!' },
        state: { ...state, underflow: true, message: 'Stack Underflow! Cannot pop from an empty stack.' },
        explanation: 'Stack Underflow occurs when attempting to pop from an empty structure (top == -1).',
        pseudocodeLine: 1,
      });
      return snapshots;
    }

    const poppedItem = state.items[state.items.length - 1];

    snapshots.push({
      stepIndex: 0,
      totalSteps: 2,
      event: { id: 'pop-highlight', type: 'POP_SELECT', description: `Extracting TOP item (${poppedItem.value})` },
      state: {
        ...state,
        items: state.items.map((it, i) => ({
          ...it,
          state: i === state.items.length - 1 ? ('popped' as const) : ('default' as const),
          label: i === state.items.length - 1 ? 'POPPING' : undefined,
        })),
        message: `Extracting element ${poppedItem.value} from TOP of stack.`,
      },
      explanation: 'Read value = stack[top] before decrementing pointer.',
      pseudocodeLine: 2,
    });

    const remaining = state.items.slice(0, -1).map((it, i, arr) => ({
      ...it,
      state: 'default' as const,
      label: i === arr.length - 1 ? 'TOP' : undefined,
    }));

    snapshots.push({
      stepIndex: 1,
      totalSteps: 2,
      event: { id: 'pop-done', type: 'POP_DONE', description: `Popped ${poppedItem.value}` },
      state: {
        ...state,
        items: remaining,
        topIndex: remaining.length - 1,
        message: `Popped ${poppedItem.value}. Top index decremented to ${remaining.length - 1}.`,
      },
      explanation: 'top = top - 1 removes element in O(1) time.',
      pseudocodeLine: 3,
    });

    return snapshots;
  }

  // ================= PEEK =================
  private runPeek(state: StackQueueVisualizerState): TimelineSnapshot<StackQueueVisualizerState>[] {
    if (state.items.length === 0) {
      return [
        {
          stepIndex: 0,
          totalSteps: 1,
          event: { id: 'peek-empty', type: 'PEEK', description: 'Stack is empty' },
          state: { ...state, message: 'Stack is empty. Peek returns null.' },
          explanation: 'Peek inspects the top element without removing it.',
          pseudocodeLine: 1,
        },
      ];
    }

    const topItem = state.items[state.items.length - 1];
    return [
      {
        stepIndex: 0,
        totalSteps: 1,
        event: { id: 'peek-val', type: 'PEEK', description: `Top element is ${topItem.value}` },
        state: {
          ...state,
          items: state.items.map((it, i) => ({
            ...it,
            state: i === state.items.length - 1 ? ('peeked' as const) : ('default' as const),
            label: i === state.items.length - 1 ? 'TOP' : undefined,
          })),
          message: `Peek inspected TOP: ${topItem.value}. No modification to stack.`,
        },
        explanation: 'return stack[top] in O(1) time without mutating data structure.',
        pseudocodeLine: 2,
      },
    ];
  }

  // ================= QUEUE ENQUEUE =================
  private runEnqueue(state: StackQueueVisualizerState, val: number | string): TimelineSnapshot<StackQueueVisualizerState>[] {
    const snapshots: TimelineSnapshot<StackQueueVisualizerState>[] = [];

    if (state.items.length >= state.capacity) {
      snapshots.push({
        stepIndex: 0,
        totalSteps: 1,
        event: { id: 'q-overflow', type: 'QUEUE_OVERFLOW', description: 'Queue Full!' },
        state: { ...state, overflow: true, message: `Queue is full! Capacity = ${state.capacity}.` },
        explanation: 'Queue overflow occurs when REAR reaches capacity.',
        pseudocodeLine: 1,
      });
      return snapshots;
    }

    const newItem: StackQueueItem = {
      id: `q-item-${Date.now()}`,
      value: val,
      state: 'pushed',
      label: 'REAR',
    };

    const newItems = [...state.items, newItem].map((it, idx, arr) => {
      const labels: string[] = [];
      if (idx === 0) labels.push('FRONT');
      if (idx === arr.length - 1) labels.push('REAR');
      return {
        ...it,
        state: idx === arr.length - 1 ? ('active' as const) : ('default' as const),
        label: labels.join(' & '),
      };
    });

    snapshots.push({
      stepIndex: 0,
      totalSteps: 1,
      event: { id: 'enq-done', type: 'ENQUEUE', description: `Enqueued ${val} at REAR` },
      state: {
        ...state,
        kind: 'queue',
        items: newItems,
        frontIndex: 0,
        rearIndex: newItems.length - 1,
        message: `Enqueued ${val} at REAR. FIFO (First In First Out) maintained.`,
      },
      explanation: 'rear = rear + 1; queue[rear] = val executes in O(1) time.',
      pseudocodeLine: 2,
    });

    return snapshots;
  }

  // ================= QUEUE DEQUEUE =================
  private runDequeue(state: StackQueueVisualizerState): TimelineSnapshot<StackQueueVisualizerState>[] {
    const snapshots: TimelineSnapshot<StackQueueVisualizerState>[] = [];

    if (state.items.length === 0) {
      snapshots.push({
        stepIndex: 0,
        totalSteps: 1,
        event: { id: 'q-underflow', type: 'QUEUE_UNDERFLOW', description: 'Queue Empty!' },
        state: { ...state, underflow: true, message: 'Queue Underflow! Cannot dequeue from empty queue.' },
        explanation: 'Cannot remove from empty queue.',
        pseudocodeLine: 1,
      });
      return snapshots;
    }

    const removed = state.items[0];

    // Step 1: Highlight front
    snapshots.push({
      stepIndex: 0,
      totalSteps: 2,
      event: { id: 'deq-start', type: 'DEQUEUE_SELECT', description: `Extracting FRONT item (${removed.value})` },
      state: {
        ...state,
        items: state.items.map((it, i) => ({
          ...it,
          state: i === 0 ? ('popped' as const) : ('default' as const),
          label: i === 0 ? 'DEQUEUING' : undefined,
        })),
        message: `Extracting element ${removed.value} from FRONT of queue.`,
      },
      explanation: 'First element in queue is serviced first (FIFO).',
      pseudocodeLine: 2,
    });

    // Step 2: Shift remaining
    const remaining = state.items.slice(1).map((it, idx, arr) => {
      const labels: string[] = [];
      if (idx === 0) labels.push('FRONT');
      if (idx === arr.length - 1) labels.push('REAR');
      return {
        ...it,
        state: 'default' as const,
        label: labels.join(' & '),
      };
    });

    snapshots.push({
      stepIndex: 1,
      totalSteps: 2,
      event: { id: 'deq-done', type: 'DEQUEUE_DONE', description: `Dequeued ${removed.value}` },
      state: {
        ...state,
        items: remaining,
        frontIndex: remaining.length > 0 ? 0 : -1,
        rearIndex: remaining.length > 0 ? remaining.length - 1 : -1,
        message: `Dequeued ${removed.value}. Next item promoted to FRONT.`,
      },
      explanation: 'front = front + 1 advances front pointer.',
      pseudocodeLine: 3,
    });

    return snapshots;
  }

  // ================= CIRCULAR QUEUE ENQUEUE =================
  private runCircularEnqueue(state: StackQueueVisualizerState, val: number | string): TimelineSnapshot<StackQueueVisualizerState>[] {
    const snapshots: TimelineSnapshot<StackQueueVisualizerState>[] = [];
    const capacity = state.capacity;
    const isFull = state.items.length >= capacity;

    if (isFull) {
      snapshots.push({
        stepIndex: 0,
        totalSteps: 1,
        event: { id: 'circ-full', type: 'CIRCULAR_FULL', description: 'Circular Queue Full' },
        state: {
          ...state,
          kind: 'circular-queue',
          overflow: true,
          message: `Circular Queue is Full! (rear + 1) % capacity == front.`,
        },
        explanation: 'Modulo arithmetic wraps rear pointer back to 0 when end is reached.',
        pseudocodeLine: 1,
      });
      return snapshots;
    }

    const nextRear = state.items.length === 0 ? 0 : (state.rearIndex + 1) % capacity;
    const newItem: StackQueueItem = {
      id: `circ-${Date.now()}`,
      value: val,
      state: 'pushed',
      label: `REAR (${nextRear})`,
    };

    const newItems = [...state.items, newItem];
    snapshots.push({
      stepIndex: 0,
      totalSteps: 1,
      event: { id: 'circ-enq', type: 'CIRCULAR_ENQUEUE', description: `Circular Enqueue ${val}` },
      state: {
        ...state,
        kind: 'circular-queue',
        items: newItems,
        frontIndex: 0,
        rearIndex: nextRear,
        message: `Circular Enqueue: rear = (${state.rearIndex} + 1) % ${capacity} = ${nextRear}. Stored ${val}.`,
      },
      explanation: 'Circular queue reuses empty slots from previous dequeues.',
      pseudocodeLine: 2,
    });

    return snapshots;
  }

  // ================= CIRCULAR QUEUE DEQUEUE =================
  private runCircularDequeue(state: StackQueueVisualizerState): TimelineSnapshot<StackQueueVisualizerState>[] {
    const snapshots: TimelineSnapshot<StackQueueVisualizerState>[] = [];
    if (state.items.length === 0) {
      snapshots.push({
        stepIndex: 0,
        totalSteps: 1,
        event: { id: 'circ-empty', type: 'CIRCULAR_EMPTY', description: 'Circular Queue is Empty' },
        state: { ...state, kind: 'circular-queue', underflow: true, message: 'Circular Queue is empty.' },
        explanation: 'front == -1 indicates circular queue underflow.',
        pseudocodeLine: 1,
      });
      return snapshots;
    }

    const removed = state.items[0];
    const remaining = state.items.slice(1);
    const nextFront = remaining.length === 0 ? -1 : (state.frontIndex + 1) % state.capacity;

    snapshots.push({
      stepIndex: 0,
      totalSteps: 1,
      event: { id: 'circ-deq', type: 'CIRCULAR_DEQUEUE', description: `Circular Dequeue ${removed.value}` },
      state: {
        ...state,
        kind: 'circular-queue',
        items: remaining,
        frontIndex: nextFront,
        rearIndex: remaining.length === 0 ? -1 : state.rearIndex,
        message: `Circular Dequeue: removed ${removed.value}. front = (${state.frontIndex} + 1) % ${state.capacity} = ${nextFront}.`,
      },
      explanation: 'front pointer moves in circular ring O(1).',
      pseudocodeLine: 2,
    });

    return snapshots;
  }

  // ================= DEQUE OPERATIONS =================
  private runDequePushFront(state: StackQueueVisualizerState, val: number | string): TimelineSnapshot<StackQueueVisualizerState>[] {
    const newItem: StackQueueItem = { id: `dq-${Date.now()}`, value: val, state: 'pushed', label: 'FRONT' };
    const items = [newItem, ...state.items];
    return [
      {
        stepIndex: 0,
        totalSteps: 1,
        event: { id: 'dq-pf', type: 'DEQUE_PUSH_FRONT', description: `Push Front ${val}` },
        state: { ...state, kind: 'deque', items, message: `Deque Push Front: inserted ${val} at the front end.` },
        explanation: 'Double-ended queue allows O(1) insertions at both front and rear.',
        pseudocodeLine: 1,
      },
    ];
  }

  private runDequePushRear(state: StackQueueVisualizerState, val: number | string): TimelineSnapshot<StackQueueVisualizerState>[] {
    const newItem: StackQueueItem = { id: `dq-${Date.now()}`, value: val, state: 'pushed', label: 'REAR' };
    const items = [...state.items, newItem];
    return [
      {
        stepIndex: 0,
        totalSteps: 1,
        event: { id: 'dq-pr', type: 'DEQUE_PUSH_REAR', description: `Push Rear ${val}` },
        state: { ...state, kind: 'deque', items, message: `Deque Push Rear: appended ${val} at the rear end.` },
        explanation: 'Double-ended queue allows O(1) insertions at both front and rear.',
        pseudocodeLine: 1,
      },
    ];
  }

  private runDequePopFront(state: StackQueueVisualizerState): TimelineSnapshot<StackQueueVisualizerState>[] {
    if (state.items.length === 0) return this.runDequeue(state);
    const popped = state.items[0];
    const items = state.items.slice(1);
    return [
      {
        stepIndex: 0,
        totalSteps: 1,
        event: { id: 'dq-pop-front', type: 'DEQUE_POP_FRONT', description: `Pop Front ${popped.value}` },
        state: { ...state, kind: 'deque', items, message: `Deque Pop Front: removed ${popped.value} from front.` },
        explanation: 'Removed front item in O(1) time.',
        pseudocodeLine: 2,
      },
    ];
  }

  private runDequePopRear(state: StackQueueVisualizerState): TimelineSnapshot<StackQueueVisualizerState>[] {
    if (state.items.length === 0) return this.runPop(state);
    const popped = state.items[state.items.length - 1];
    const items = state.items.slice(0, -1);
    return [
      {
        stepIndex: 0,
        totalSteps: 1,
        event: { id: 'dq-pop-rear', type: 'DEQUE_POP_REAR', description: `Pop Rear ${popped.value}` },
        state: { ...state, kind: 'deque', items, message: `Deque Pop Rear: removed ${popped.value} from rear.` },
        explanation: 'Removed rear item in O(1) time.',
        pseudocodeLine: 2,
      },
    ];
  }

  private runClear(state: StackQueueVisualizerState): TimelineSnapshot<StackQueueVisualizerState>[] {
    return [
      {
        stepIndex: 0,
        totalSteps: 1,
        event: { id: 'clear', type: 'CLEAR', description: 'Reset stack/queue' },
        state: { ...state, items: [], topIndex: -1, frontIndex: -1, rearIndex: -1, message: 'Structure cleared.' },
        explanation: 'Reset pointers and emptied container.',
        pseudocodeLine: 1,
      },
    ];
  }
}
