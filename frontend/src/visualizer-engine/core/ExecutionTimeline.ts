import { TimelineSnapshot } from '../types/core';

export class ExecutionTimeline<TState = any> {
  private snapshots: TimelineSnapshot<TState>[] = [];
  private currentIndex: number = 0;

  constructor(snapshots: TimelineSnapshot<TState>[] = []) {
    this.snapshots = snapshots;
    this.currentIndex = 0;
  }

  public setSnapshots(snapshots: TimelineSnapshot<TState>[]): void {
    this.snapshots = snapshots;
    this.currentIndex = 0;
  }

  public getCurrentSnapshot(): TimelineSnapshot<TState> | null {
    if (this.snapshots.length === 0) return null;
    return this.snapshots[this.currentIndex] || null;
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  public getTotalSteps(): number {
    return this.snapshots.length;
  }

  public isAtStart(): boolean {
    return this.currentIndex === 0;
  }

  public isAtEnd(): boolean {
    return this.snapshots.length === 0 || this.currentIndex >= this.snapshots.length - 1;
  }

  public next(): TimelineSnapshot<TState> | null {
    if (this.isAtEnd()) return this.getCurrentSnapshot();
    this.currentIndex++;
    return this.getCurrentSnapshot();
  }

  public prev(): TimelineSnapshot<TState> | null {
    if (this.isAtStart()) return this.getCurrentSnapshot();
    this.currentIndex--;
    return this.getCurrentSnapshot();
  }

  public seek(index: number): TimelineSnapshot<TState> | null {
    if (index < 0) this.currentIndex = 0;
    else if (index >= this.snapshots.length) this.currentIndex = Math.max(0, this.snapshots.length - 1);
    else this.currentIndex = index;
    return this.getCurrentSnapshot();
  }

  public reset(): TimelineSnapshot<TState> | null {
    this.currentIndex = 0;
    return this.getCurrentSnapshot();
  }

  public getAllSnapshots(): TimelineSnapshot<TState>[] {
    return this.snapshots;
  }
}
