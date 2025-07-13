import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function Layout() {
  const [boardType, setBoardType] = useState<"kanban" | "timeline">("timeline");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 bg-[#ECEFE9]">
        <Outlet context={{ boardType, setBoardType }} />
      </main>
    </div>
  );
}
