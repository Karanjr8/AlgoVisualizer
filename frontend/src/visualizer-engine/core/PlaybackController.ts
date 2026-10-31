import { PlaybackStatus, TimelineSnapshot } from '../types/core';
import { ExecutionTimeline } from './ExecutionTimeline';
import { EventDispatcher } from './EventDispatcher';

export class PlaybackController<TState = any> {
  private timeline: ExecutionTimeline<TState>;
  private dispatcher: EventDispatcher;
  private status: PlaybackStatus = 'idle';
  private speedMs: number = 600; // Delay between steps
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private loop: boolean = false;

  constructor(timeline: ExecutionTimeline<TState>, dispatcher: EventDispatcher) {
    this.timeline = timeline;
    this.dispatcher = dispatcher;
  }

  public getStatus(): PlaybackStatus {
    return this.status;
  }

  public getSpeed(): number {
    return this.speedMs;
  }

  public setSpeed(ms: number): void {
    this.speedMs = Math.max(50, Math.min(3000, ms));
    this.dispatcher.emit('speedChanged', this.speedMs);
  }

  public setLoop(loop: boolean): void {
    this.loop = loop;
  }

  public play(): void {
    if (this.status === 'playing') return;

    // If at end, reset first
    if (this.timeline.isAtEnd()) {
      this.timeline.reset();
      this.dispatchCurrent();
    }

    this.status = 'playing';
    this.dispatcher.emit('statusChanged', this.status);
    this.scheduleNextTick();
  }

  public pause(): void {
    if (this.status !== 'playing') return;
    this.clearTimer();
    this.status = 'paused';
    this.dispatcher.emit('statusChanged', this.status);
  }

  public togglePlay(): void {
    if (this.status === 'playing') {
      this.pause();
    } else {
      this.play();
    }
  }

  public stepForward(): TimelineSnapshot<TState> | null {
    this.pause();
    const snap = this.timeline.next();
    this.dispatchCurrent();
    if (this.timeline.isAtEnd()) {
      this.status = 'completed';
      this.dispatcher.emit('statusChanged', this.status);
    }
    return snap;
  }

  public stepBackward(): TimelineSnapshot<TState> | null {
    this.pause();
    const snap = this.timeline.prev();
    this.dispatchCurrent();
    return snap;
  }

  public seek(index: number): TimelineSnapshot<TState> | null {
    this.pause();
    const snap = this.timeline.seek(index);
    this.dispatchCurrent();
    return snap;
  }

  public reset(): TimelineSnapshot<TState> | null {
    this.pause();
    const snap = this.timeline.reset();
    this.status = 'idle';
    this.dispatcher.emit('statusChanged', this.status);
    this.dispatchCurrent();
    return snap;
  }

  public destroy(): void {
    this.clearTimer();
    this.status = 'idle';
  }

  private scheduleNextTick(): void {
    this.clearTimer();
    this.timerId = setTimeout(() => {
      this.tick();
    }, this.speedMs);
  }

  private tick(): void {
    if (this.status !== 'playing') return;

    if (this.timeline.isAtEnd()) {
      if (this.loop) {
        this.timeline.reset();
        this.dispatchCurrent();
        this.scheduleNextTick();
      } else {
        this.status = 'completed';
        this.dispatcher.emit('statusChanged', this.status);
      }
      return;
    }

    this.timeline.next();
    this.dispatchCurrent();
    this.scheduleNextTick();
  }

  private clearTimer(): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private dispatchCurrent(): void {
    const snap = this.timeline.getCurrentSnapshot();
    if (snap) {
      this.dispatcher.emit('stepChanged', snap);
    }
  }
}
