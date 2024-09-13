"use client";

import { useTheme } from "next-themes";

import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Brush } from "lucide-react";

const THEME_COLORS = [
  { name: "light", value: "light", color: ["hsl(0,0%,98%)"] },
  { name: "dark", value: "dark", color: ["hsl(0,0%,9%)"] },
  {
    name: "rose",
    value: "rose",
    color: ["hsl(0,0%,98%)", "hsl(346.8,77.2%,49.8%)"],
  },
  {
    name: "d-rose",
    value: "dark-rose",
    color: ["hsl(0,0%,9%)", "hsl(346.8,77.2%,49.8%)"],
  },
  {
    name: "d-yellow",
    value: "dark-yellow",
    color: ["hsl(0,0%,9%)", "hsl(47.9,95.8%,53.1%)"],
  },
];

export default function ThemeSelector() {
  const { setTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <Button variant="secondary" className="hidden md:block">
            theme
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="flex md:hidden justify-center"
          >
            <Brush className="h-4 w-4" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {THEME_COLORS.map((color, index) => (
              <button
                key={index}
                className="px-4 py-2 border cursor-pointer flex gap-1 items-center"
                onClick={() => setTheme(color.value)}
                aria-label={`Set theme to ${color.name}`}
              >
                <p className="text-xs">{color.name}</p>
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
