/* eslint-disable @next/next/no-img-element */
"use client";

import { useAtomValue } from "jotai";
import { usePathname, useRouter } from "next/navigation";

import { userAtom } from "@/lib/atoms";
import ThemeSelector from "./theme-selector";

import { Button } from "./ui/button";
import { X } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAtomValue(userAtom);

  function handleResetProfile() {
    localStorage.removeItem("username");
    router.push("/");
  }

  return (
    <div className="px-1 sm:px-0 sticky top-0 backdrop-blur-md z-10 flex justify-between items-center py-2">
      {user && (
        <div className="flex gap-2 items-center">
          <img
            src={user.avatar_url}
            alt={user.name}
            className="h-10 w-10 rounded-lg"
          />
          <div>
            <a href={user.html_url} className="hover:underline" target="_blank">
              <p className="text-sm md:text-lg font-semibold ">{user.name}</p>
            </a>
            <p className="text-xs italic text-muted-foreground">{user.login}</p>
          </div>
        </div>
      )}
      {!pathname.includes("/embed") && (
        <div className="flex gap-2">
          <ThemeSelector />
          <Button
            variant="outline"
            onClick={handleResetProfile}
            className="hidden md:flex gap-2 items-center"
          >
            <p>clear</p>
            <X className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={handleResetProfile}
            size="icon"
            className="flex justify-center md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
