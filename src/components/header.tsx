/* eslint-disable @next/next/no-img-element */
"use client";

import { userAtom } from "@/lib/atoms";
import { useAtomValue } from "jotai";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import ThemeSelector from "./theme-selector";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAtomValue(userAtom);

  function handleResetProfile() {
    localStorage.removeItem("username");
    router.push("/");
  }

  return (
    <div className="flex justify-between items-center">
      {user && (
        <div className="flex gap-2 items-center">
          <img src={user.avatar_url} alt={user.name} className="h-10 w-10" />
          <div>
            <a href={user.html_url} className="hover:underline" target="_blank">
              <p className="text-xl font-semibold ">{user.name}</p>
            </a>
            <p className="text-xs italic">{user.login}</p>
          </div>
        </div>
      )}
      {!pathname.includes("/embed") && (
        <div className="flex gap-2">
          <ThemeSelector />
          <Button variant="destructive" onClick={handleResetProfile}>
            vanish
          </Button>
        </div>
      )}
    </div>
  );
}
