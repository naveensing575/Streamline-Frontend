"use client";

import { DatePicker } from "@/components/DatePicker";
import { Button } from "@/components/ui/button";

export default function TimelineHeader() {
  return (
    <div className="flex flex-wrap justify-end items-center gap-4">

      <DatePicker
        value={new Date()}
        onChange={(date) => console.log(date)}
      />

      <Button variant="outline">Filter</Button>
    </div>
  );
}
