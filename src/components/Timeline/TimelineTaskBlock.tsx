"use client";

interface TimelineTaskBlockProps {
  task: {
    title: string;
    startTime: string;
    endTime: string;
  };
}

export default function TimelineTaskBlock({ task }: TimelineTaskBlockProps) {
  return (
    <div
      className="absolute top-0 left-[100px] w-[150px] h-10 bg-green-200 rounded-md shadow-md"
      style={{
        // TODO: position based on time range
      }}
    >
      <p className="text-xs p-2">{task.title}</p>
    </div>
  );
}
