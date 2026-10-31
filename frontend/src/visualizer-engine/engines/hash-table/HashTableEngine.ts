import { IVisualizerEngine, EngineMeta, TimelineSnapshot } from '../../types/core';
import {
  HashTableVisualizerState,
  HashBucket,
  CollisionResolutionMethod,
} from '../../types/ds-states';

export class HashTableEngine implements IVisualizerEngine<HashTableVisualizerState> {
  public meta: EngineMeta = {
    id: 'hash-table-engine',
    name: 'Hash Table Engine',
    dataStructure: 'hash-table',
    category: 'Hashing & Mapping',
    supportedOperations: [
      'put',
      'get',
      'remove',
      'set-method-chaining',
      'set-method-linear',
      'set-method-quadratic',
      'set-method-double',
      'clear',
    ],
    defaultInput: [
      { key: 'apple', value: 100 },
      { key: 'banana', value: 200 },
      { key: 'cherry', value: 300 },
    ],
  };

  public generateInitialState(
    input?: Array<{ key: string | number; value: any }>,
    method: CollisionResolutionMethod = 'separate-chaining'
  ): HashTableVisualizerState {
    const capacity = 7; // prime number
    const buckets: HashBucket[] = Array.from({ length: capacity }, (_, i) => ({
      index: i,
      entries: [],
      isColliding: false,
    }));

    const raw = Array.isArray(input) ? input : this.meta.defaultInput;
    let size = 0;

    for (const item of raw) {
      const hash = this.computeHash(item.key, capacity);
      buckets[hash].entries.push({
        id: `entry-${item.key}`,
        key: item.key,
        value: item.value,
        hash,
        state: 'default',
      });
      if (buckets[hash].entries.length > 1) {
        buckets[hash].isColliding = true;
      }
      size++;
    }

    return {
      capacity,
      size,
      method,
      buckets,
      currentProbeIndices: [],
      loadFactor: Number((size / capacity).toFixed(2)),
      message: `Hash Table initialized with capacity ${capacity} (Prime). Method: ${method}.`,
    };
  }

  public executeOperation(
    operation: string,
    params: any = {},
    currentState: HashTableVisualizerState
  ): TimelineSnapshot<HashTableVisualizerState>[] {
    switch (operation) {
      case 'put':
        return this.runPut(currentState, params.key ?? 'grape', params.value ?? 450);
      case 'get':
        return this.runGet(currentState, params.key ?? 'banana');
      case 'remove':
        return this.runRemove(currentState, params.key ?? 'banana');
      case 'set-method-chaining':
        return this.changeMethod(currentState, 'separate-chaining');
      case 'set-method-linear':
        return this.changeMethod(currentState, 'linear-probing');
      case 'set-method-quadratic':
        return this.changeMethod(currentState, 'quadratic-probing');
      case 'set-method-double':
        return this.changeMethod(currentState, 'double-hashing');
      case 'clear':
        return [
          {
            stepIndex: 0,
            totalSteps: 1,
            event: { id: 'clear', type: 'CLEAR', description: 'Emptied Hash Table' },
            state: this.generateInitialState([], currentState.method),
            explanation: 'Cleared all buckets and entries.',
            pseudocodeLine: 1,
          },
        ];
      default:
        return this.runGet(currentState, 'apple');
    }
  }

  // ================= PUT (INSERT) =================
  private runPut(
    state: HashTableVisualizerState,
    key: string | number,
    value: any
  ): TimelineSnapshot<HashTableVisualizerState>[] {
    const snapshots: TimelineSnapshot<HashTableVisualizerState>[] = [];
    const capacity = state.capacity;
    const baseHash = this.computeHash(key, capacity);

    snapshots.push({
      stepIndex: 0,
      totalSteps: 4,
      event: { id: 'hash-calc', type: 'HASH_CALC', description: `hash("${key}") = ${baseHash}` },
      state: {
        ...state,
        lastCalculatedHash: baseHash,
        currentProbeIndices: [baseHash],
        message: `Hash function computed: hash("${key}") = ASCII_sum % ${capacity} = ${baseHash}.`,
      },
      explanation: 'Calculate primary hash index using modulus of table capacity.',
      pseudocodeLine: 1,
    });

    if (state.method === 'separate-chaining') {
      const buckets: HashBucket[] = JSON.parse(JSON.stringify(state.buckets));
      const targetBucket = buckets[baseHash];
      const hadCollision = targetBucket.entries.length > 0;

      if (hadCollision) {
        snapshots.push({
          stepIndex: 1,
          totalSteps: 4,
          event: { id: 'collision-detected', type: 'COLLISION', description: `Collision at bucket ${baseHash}` },
          state: {
            ...state,
            currentProbeIndices: [baseHash],
            message: `Bucket [${baseHash}] already contains ${targetBucket.entries.length} items. Appending to linked chain!`,
          },
          explanation: 'Separate Chaining resolves collisions by appending entries to a linked list chain at that bucket index.',
          pseudocodeLine: 2,
        });
      }

      // Append new entry
      targetBucket.entries.push({
        id: `entry-${key}-${Date.now()}`,
        key,
        value,
        hash: baseHash,
        state: 'inserted',
      });
      targetBucket.isColliding = targetBucket.entries.length > 1;

      const newSize = state.size + 1;
      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: snapshots.length + 1,
        event: { id: 'put-chain-done', type: 'INSERT_DONE', description: `Inserted "${key}": ${value}` },
        state: {
          ...state,
          buckets,
          size: newSize,
          loadFactor: Number((newSize / capacity).toFixed(2)),
          currentProbeIndices: [baseHash],
          message: `Successfully inserted key "${key}" into Bucket [${baseHash}]. Chain length = ${targetBucket.entries.length}.`,
        },
        explanation: 'Average O(1) insertion in separate chaining hash table.',
        pseudocodeLine: 3,
      });

      return snapshots;
    }

    // Open Addressing (Linear Probing, Quadratic Probing, Double Hashing)
    const buckets: HashBucket[] = JSON.parse(JSON.stringify(state.buckets));
    const probeIndices: number[] = [];
    let placedIndex = -1;

    for (let i = 0; i < capacity; i++) {
      let probeIdx = 0;
      if (state.method === 'linear-probing') {
        probeIdx = (baseHash + i) % capacity;
      } else if (state.method === 'quadratic-probing') {
        probeIdx = (baseHash + i * i) % capacity;
      } else {
        // Double Hashing
        const h2 = 1 + (baseHash % (capacity - 1));
        probeIdx = (baseHash + i * h2) % capacity;
      }

      probeIndices.push(probeIdx);

      if (buckets[probeIdx].entries.length === 0) {
        placedIndex = probeIdx;
        break;
      } else {
        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 5,
          event: { id: `probe-col-${i}`, type: 'PROBE_COLLISION', description: `Slot ${probeIdx} occupied` },
          state: {
            ...state,
            currentProbeIndices: [...probeIndices],
            message: `Probe step i=${i}: Bucket [${probeIdx}] occupied. Probing next slot with ${state.method}...`,
          },
          explanation: `Open addressing probes forward to find the next available unoccupied bucket.`,
          pseudocodeLine: 2,
        });
      }
    }

    if (placedIndex === -1) {
      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: snapshots.length + 1,
        event: { id: 'table-full', type: 'TABLE_FULL', description: 'Hash Table is full' },
        state: { ...state, message: 'Hash Table is full! Need rehashing with larger prime capacity.' },
        explanation: 'All probed buckets are full. Dynamic table resizing is required.',
        pseudocodeLine: 4,
      });
      return snapshots;
    }

    buckets[placedIndex].entries = [
      {
        id: `entry-${key}`,
        key,
        value,
        hash: baseHash,
        state: 'inserted',
      },
    ];

    const newSize = state.size + 1;
    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'open-inserted', type: 'INSERT_DONE', description: `Placed at bucket ${placedIndex}` },
      state: {
        ...state,
        buckets,
        size: newSize,
        loadFactor: Number((newSize / capacity).toFixed(2)),
        currentProbeIndices: [placedIndex],
        message: `Placed key "${key}" into Bucket [${placedIndex}] after ${probeIndices.length} probe(s).`,
      },
      explanation: `Stored using ${state.method}. Load factor is now ${(newSize / capacity).toFixed(2)}.`,
      pseudocodeLine: 3,
    });

    return snapshots;
  }

  // ================= GET (SEARCH) =================
  private runGet(state: HashTableVisualizerState, key: string | number): TimelineSnapshot<HashTableVisualizerState>[] {
    const snapshots: TimelineSnapshot<HashTableVisualizerState>[] = [];
    const capacity = state.capacity;
    const baseHash = this.computeHash(key, capacity);

    snapshots.push({
      stepIndex: 0,
      totalSteps: 3,
      event: { id: 'get-hash', type: 'HASH_CALC', description: `Lookup hash("${key}") = ${baseHash}` },
      state: {
        ...state,
        lastCalculatedHash: baseHash,
        currentProbeIndices: [baseHash],
        message: `Lookup: hash("${key}") points to Bucket [${baseHash}].`,
      },
      explanation: 'Calculate primary bucket index for instant O(1) lookup.',
      pseudocodeLine: 1,
    });

    if (state.method === 'separate-chaining') {
      const bucket = state.buckets[baseHash];
      const match = bucket.entries.find((e) => e.key === key);

      if (match) {
        snapshots.push({
          stepIndex: 1,
          totalSteps: 2,
          event: { id: 'get-found', type: 'FOUND', description: `Found "${key}": ${match.value}` },
          state: {
            ...state,
            currentProbeIndices: [baseHash],
            message: `Found key "${key}" in Bucket [${baseHash}] with value = ${match.value}!`,
          },
          explanation: 'Key located in separate chaining bucket list.',
          pseudocodeLine: 2,
        });
      } else {
        snapshots.push({
          stepIndex: 1,
          totalSteps: 2,
          event: { id: 'get-not-found', type: 'NOT_FOUND', description: `Key "${key}" not in table` },
          state: { ...state, message: `Key "${key}" not found in Bucket [${baseHash}].` },
          explanation: 'Bucket inspected; key does not exist.',
          pseudocodeLine: 3,
        });
      }
      return snapshots;
    }

    // Probing lookup
    for (let i = 0; i < capacity; i++) {
      let probeIdx = 0;
      if (state.method === 'linear-probing') probeIdx = (baseHash + i) % capacity;
      else if (state.method === 'quadratic-probing') probeIdx = (baseHash + i * i) % capacity;
      else {
        const h2 = 1 + (baseHash % (capacity - 1));
        probeIdx = (baseHash + i * h2) % capacity;
      }

      const bucket = state.buckets[probeIdx];
      if (bucket.entries.length === 0) {
        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: snapshots.length + 1,
          event: { id: 'empty-slot', type: 'NOT_FOUND', description: `Reached empty slot ${probeIdx}` },
          state: {
            ...state,
            currentProbeIndices: [probeIdx],
            message: `Encountered empty bucket [${probeIdx}]. Key "${key}" does not exist in table.`,
          },
          explanation: 'In open addressing, hitting an empty bucket terminates search with failure.',
          pseudocodeLine: 3,
        });
        return snapshots;
      }

      if (bucket.entries[0].key === key) {
        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: snapshots.length + 1,
          event: { id: 'probe-found', type: 'FOUND', description: `Found "${key}" at slot ${probeIdx}` },
          state: {
            ...state,
            currentProbeIndices: [probeIdx],
            message: `Found key "${key}" at Bucket [${probeIdx}]! Value = ${bucket.entries[0].value}.`,
          },
          explanation: `Key located after ${i + 1} probe(s).`,
          pseudocodeLine: 2,
        });
        return snapshots;
      }
    }

    return snapshots;
  }

  // ================= REMOVE =================
  private runRemove(state: HashTableVisualizerState, key: string | number): TimelineSnapshot<HashTableVisualizerState>[] {
    const snapshots: TimelineSnapshot<HashTableVisualizerState>[] = [];
    const capacity = state.capacity;
    const baseHash = this.computeHash(key, capacity);
    const buckets: HashBucket[] = JSON.parse(JSON.stringify(state.buckets));

    if (state.method === 'separate-chaining') {
      const bucket = buckets[baseHash];
      const initialLen = bucket.entries.length;
      bucket.entries = bucket.entries.filter((e) => e.key !== key);
      bucket.isColliding = bucket.entries.length > 1;

      if (bucket.entries.length < initialLen) {
        const newSize = state.size - 1;
        snapshots.push({
          stepIndex: 0,
          totalSteps: 1,
          event: { id: 'del-success', type: 'DELETE_DONE', description: `Removed key "${key}"` },
          state: {
            ...state,
            buckets,
            size: newSize,
            loadFactor: Number((newSize / capacity).toFixed(2)),
            currentProbeIndices: [baseHash],
            message: `Removed key "${key}" from Bucket [${baseHash}]. Remaining chain length = ${bucket.entries.length}.`,
          },
          explanation: 'Removed node from bucket linked list in O(1) average time.',
          pseudocodeLine: 2,
        });
      } else {
        snapshots.push({
          stepIndex: 0,
          totalSteps: 1,
          event: { id: 'del-missing', type: 'NOT_FOUND', description: `Key "${key}" not in table` },
          state: { ...state, message: `Cannot delete: key "${key}" does not exist in table.` },
          explanation: 'Key not found.',
          pseudocodeLine: 3,
        });
      }
    } else {
      // Open addressing deletion
      for (let i = 0; i < capacity; i++) {
        let probeIdx = (baseHash + i) % capacity;
        if (buckets[probeIdx].entries.length > 0 && buckets[probeIdx].entries[0].key === key) {
          buckets[probeIdx].entries = [];
          const newSize = state.size - 1;
          snapshots.push({
            stepIndex: 0,
            totalSteps: 1,
            event: { id: 'del-open', type: 'DELETE_DONE', description: `Deleted key "${key}"` },
            state: {
              ...state,
              buckets,
              size: newSize,
              loadFactor: Number((newSize / capacity).toFixed(2)),
              currentProbeIndices: [probeIdx],
              message: `Deleted key "${key}" from Bucket [${probeIdx}].`,
            },
            explanation: 'Slot cleared.',
            pseudocodeLine: 2,
          });
          return snapshots;
        }
      }
    }

    return snapshots;
  }

  private changeMethod(state: HashTableVisualizerState, method: CollisionResolutionMethod): TimelineSnapshot<HashTableVisualizerState>[] {
    const freshState = this.generateInitialState(
      state.buckets.flatMap((b) => b.entries.map((e) => ({ key: e.key, value: e.value }))),
      method
    );

    return [
      {
        stepIndex: 0,
        totalSteps: 1,
        event: { id: 'method-change', type: 'METHOD_CHANGE', description: `Switched collision method to ${method}` },
        state: { ...freshState, message: `Collision resolution changed to ${method.toUpperCase()}. Table rehashed.` },
        explanation: `Re-inserted all keys using ${method} rules.`,
        pseudocodeLine: 1,
      },
    ];
  }

  private computeHash(key: string | number, capacity: number): number {
    const str = String(key);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) % capacity;
    }
    return Math.abs(hash);
  }
}
