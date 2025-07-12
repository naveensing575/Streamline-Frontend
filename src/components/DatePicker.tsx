import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { format, parse, isValid, startOfMonth } from "date-fns";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  error?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "dd/mm/yyyy",
  error,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
    if (value && isValid(value)) {
      setInputValue(format(value, "dd/MM/yyyy"));
    } else {
      setInputValue("");
    }
  }, [value]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = /[0-9/]/;
    if (e.key.length === 1 && !allowed.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim();
    if (input.length > 10) return;
    setInputValue(input);

    if (input.length === 10) {
      const parsed = parse(input, "dd/MM/yyyy", new Date());
      if (isValid(parsed)) {
        onChange(parsed);
      } else {
        onChange(undefined);
      }
    } else {
      onChange(undefined);
    }
  };

  return (
    <div className="flex flex-col space-y-1">
      <div className="relative">
        <Input
          placeholder={placeholder}
          value={inputValue}
          onKeyDown={handleInputKeyDown}
          onChange={handleInputChange}
          className={error ? "border-red-500 focus-visible:ring-red-500 pr-10" : "pr-10"}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <CalendarIcon
              className="absolute right-3 top-3 h-4 w-4 text-gray-400 cursor-pointer"
              onClick={() => setOpen(!open)}
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              defaultMonth={value && isValid(value) ? startOfMonth(value) : undefined}
              captionLayout="dropdown"
              startMonth={new Date(2000, 0)}
              endMonth={new Date(2030, 11)}
              onSelect={(date) => {
                onChange(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
