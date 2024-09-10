/* eslint-disable @next/next/no-img-element */
"use client";

import { userAtom } from "@/lib/atoms";
import { useAtomValue } from "jotai";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import ThemeSelector from "./theme-selector";
import { Cross1Icon } from "@radix-ui/react-icons";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAtomValue(userAtom);

  function handleResetProfile() {
    localStorage.removeItem("username");
    router.push("/");
  }

  return (
    <div className="sticky top-0 backdrop-blur-md z-10 flex justify-between items-center">
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
          <Button
            variant="outline"
            onClick={handleResetProfile}
            className="flex gap-2 items-center"
          >
            <p>clear</p>
            <Cross1Icon className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
