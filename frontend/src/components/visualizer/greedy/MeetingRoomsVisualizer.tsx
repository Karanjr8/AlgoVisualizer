import React from 'react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const MeetingRoomsVisualizer: React.FC<Props> = ({ frame }) => {
  const rooms = frame?.greedyState?.meetingRooms || [
    { roomId: 1, currentMeeting: '[0,30]' },
    { roomId: 2, currentMeeting: '[15,20]' }
  ];

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* HEADER BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold rounded-lg uppercase tracking-wider">
            Meeting Rooms Allocation
          </span>
          <span className="text-muted-foreground">Criterion: Sort by Start Time + Min-Heap of End Times</span>
        </div>

        <div className="text-xs font-mono text-emerald-400 font-bold">
          Minimum Rooms Required: {rooms.length}
        </div>
      </div>

      <div className="bg-card/60 border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-sans px-2.5 py-1 bg-amber-500/10 rounded-lg border border-amber-500/30">
          Allocated Conference Rooms
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-mono text-xs">
          {rooms.map((r) => (
            <div
              key={`room-${r.roomId}`}
              className="p-5 rounded-2xl bg-background/60 border border-border/80 flex items-center justify-between shadow-sm"
            >
              <div>
                <span className="text-xs text-muted-foreground uppercase font-bold">Room #{r.roomId}</span>
                <div className="text-base font-bold text-foreground mt-1">
                  {r.currentMeeting || 'Available'}
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] uppercase">
                Active Room
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
