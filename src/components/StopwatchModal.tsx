"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StopwatchIcon from "@/assets/image.png";
import timerSound from "@/assets/timer.mp3";

export default function StopwatchModal() {
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");

  const audioRef = useRef<HTMLAudioElement>(null);

  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);

  // Countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isRunning, timeLeft]);

  // Update display
  useEffect(() => {
    const hrs = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
    const mins = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
    const secs = String(timeLeft % 60).padStart(2, "0");
    setHours(hrs);
    setMinutes(mins);
    setSeconds(secs);
  }, [timeLeft]);

  // Play alarm when timer hits zero
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (timeLeft === 0 && isRunning) {
      audio.loop = true;
      audio.play().catch((err) => console.error("Alarm play failed:", err));
    }
  }, [timeLeft, isRunning]);

  // Stop alarm when paused/reset
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isRunning) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [isRunning]);

  const setTimeFromInput = () => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const total = h * 3600 + m * 60 + s;
    setTimeLeft(total);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setTimeFromInput();
      setIsRunning(!isRunning);
    }
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "");
    if (raw.length > 2) raw = raw.slice(0, 2);
    setHours(raw);
    if (raw.length === 2) {
      minuteRef.current?.focus();
      minuteRef.current?.select();
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "");
    if (raw.length > 2) raw = raw.slice(0, 2);
    setMinutes(raw);
    if (raw.length === 2) {
      secondRef.current?.focus();
      secondRef.current?.select();
    }
  };

  const handleSecondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "");
    if (raw.length > 2) raw = raw.slice(0, 2);
    setSeconds(raw);
  };

  const addTime = (secs: number) => {
    setTimeLeft((prev) => prev + secs);
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setHours("00");
    setMinutes("00");
    setSeconds("00");
  };

  return (
    <>
      {/* ✅ AUDIO: stays mounted so alarm works even if modal is closed */}
      <audio ref={audioRef} src={timerSound} preload="auto" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <img
            src={StopwatchIcon}
            alt="Open Stopwatch"
            className="w-12 h-12 cursor-pointer hover:scale-110 transition"
          />
        </DialogTrigger>
        <DialogContent className="bg-[#1a1a1a] text-gray-100 rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-amber-400">
              Focus Timer
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center text-5xl font-mono text-green-400">
              <input
                ref={hourRef}
                type="number"
                min="0"
                className="input-no-spinner w-20 bg-transparent text-center outline-none"
                value={hours}
                onChange={handleHourChange}
                onKeyDown={handleKeyPress}
                onFocus={(e) => e.target.select()}
                onBlur={() => setHours((v) => v.padStart(2, "0"))}
              />
              :
              <input
                ref={minuteRef}
                type="number"
                min="0"
                className="input-no-spinner w-20 bg-transparent text-center outline-none"
                value={minutes}
                onChange={handleMinuteChange}
                onKeyDown={handleKeyPress}
                onFocus={(e) => e.target.select()}
                onBlur={() => setMinutes((v) => v.padStart(2, "0"))}
              />
              :
              <input
                ref={secondRef}
                type="number"
                min="0"
                className="input-no-spinner w-20 bg-transparent text-center outline-none"
                value={seconds}
                onChange={handleSecondChange}
                onKeyDown={handleKeyPress}
                onFocus={(e) => e.target.select()}
                onBlur={() => setSeconds((v) => v.padStart(2, "0"))}
              />
            </div>

            <div className="flex gap-2">
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-black"
                onClick={() => addTime(30)}
              >
                +30s
              </Button>
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-black"
                onClick={() => addTime(60)}
              >
                +1m
              </Button>
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-black"
                onClick={() => addTime(300)}
              >
                +5m
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                className="bg-green-500 hover:bg-green-600 text-black"
                onClick={() => {
                  setTimeFromInput();
                  setIsRunning(!isRunning);
                }}
              >
                {isRunning ? "Pause" : "Start"}
              </Button>
              <Button variant="outline" onClick={reset} className="text-black">
                Reset
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
