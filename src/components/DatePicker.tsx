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

  // Sync input when value changes externally
  React.useEffect(() => {
    if (value && isValid(value)) {
      setInputValue(format(value, "dd/MM/yyyy"));
    } else {
      setInputValue("");
    }
  }, [value]);

  // Restrict typing to digits + slash
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = /[0-9/]/;
    if (e.key.length === 1 && !allowed.test(e.key)) {
      e.preventDefault();
    }
  };

  // Validate and parse only if format is complete
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim();
    if (input.length > 10) return; // dd/mm/yyyy max length
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
              //fix: jump to month if value is valid, else fallback to today
              month={value && isValid(value) ? startOfMonth(value) : undefined}
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
