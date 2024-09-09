"use client";

import { useSetAtom } from "jotai";

import { themeAtom } from "@/lib/atoms";

import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const THEME_COLORS = [
  { name: "light", value: "light" },
  { name: "dark", value: "dark" },
  { name: "rose", value: "rose" },
];

export default function ThemeSelector() {
  const setTheme = useSetAtom(themeAtom);

  return (
    <Popover>
      <Button variant="secondary">
        <PopoverTrigger>theme</PopoverTrigger>
      </Button>
      <PopoverContent>
        <div>
          <p className="text-xs font-semibold">color</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {THEME_COLORS.map((color, index) => (
              <div
                key={index}
                className="px-4 py-2 border cursor-pointer hover:bg-muted"
                onClick={() => setTheme(color.value)}
              >
                <p className="text-xs">{color.name}</p>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
