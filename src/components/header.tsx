/* eslint-disable @next/next/no-img-element */
"use client";

import { useAtomValue } from "jotai";
import { usePathname, useRouter } from "next/navigation";

import { userAtom } from "@/lib/atoms";
import ThemeSelector from "./theme-selector";

import { Button } from "./ui/button";
import { Hammer, X } from "lucide-react";
import Link from "next/link";

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
      {!pathname.includes("/preview") && (
        <div className="flex gap-2">
          <Link href="/utilities">
            <Button
              className="md:hidden flex gap-2 items-center"
              variant="outline"
              size="icon"
            >
              <Hammer className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/utilities">
            <Button
              className="hidden md:flex gap-2 items-center"
              variant="outline"
            >
              <p>utilities</p>
              <Hammer className="h-4 w-4" />
            </Button>
          </Link>
          <ThemeSelector />
          <Button
            variant="default"
            onClick={handleResetProfile}
            className="hidden md:flex gap-2 items-center"
          >
            <p>clear</p>
            <X className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
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
