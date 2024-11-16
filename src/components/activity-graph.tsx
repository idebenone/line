"use client";

import { userAtom } from "@/lib/atoms";
import { useAtomValue } from "jotai";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import ActivityCalender from "react-github-calendar";

export default function ActivityGraph() {
  const user = useAtomValue(userAtom);
  const { theme } = useTheme();

  const [explicitTheme, setExplicitTheme] = useState({
    light: ["#000", "#fff"], // Default values
    dark: ["#000", "#fff"],
  });

  useEffect(() => {
    const updateTheme = () => {
      const rootStyles = getComputedStyle(document.documentElement);
      const wrapHSL = (value: string) => `hsl(${value.trim()})`;

      const lightPrimary = rootStyles.getPropertyValue("--primary-foreground");
      const lightForeground = rootStyles.getPropertyValue("--muted");
      const darkPrimary = rootStyles.getPropertyValue("--muted");
      const darkForeground = rootStyles.getPropertyValue("--primary");

      setExplicitTheme({
        light: [wrapHSL(lightPrimary), wrapHSL(lightForeground)],
        dark: [wrapHSL(darkPrimary), wrapHSL(darkForeground)],
      });
    };

    const timeout = setTimeout(updateTheme, 10);

    return () => clearTimeout(timeout);
  }, [theme]);

  return (
    user && (
      <div className="flex justify-center py-2">
        <ActivityCalender username={user.login} theme={explicitTheme} />
      </div>
    )
  );
}
