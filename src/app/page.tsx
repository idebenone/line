"use client";

import { Input } from "@/components/ui/input";
import { userAtom } from "@/lib/atoms";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootPage() {
  const setUser = useSetAtom(userAtom);
  const router = useRouter();

  const [username, setUsername] = useState<string>("");

  async function handleFetchGitHubUser() {
    try {
      localStorage.setItem("username", username);
      const data = await fetch(`https://api.github.com/users/${username}`, {
        method: "GET",
        headers: [["content-type", "application/json"]],
      });
      data.json().then((data) => {
        setUser(data);
        router.push(`/preview/${username}`);
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("username"))
      router.push(`/preview/${localStorage.getItem("username")}`);
  }, []);

  return (
    <div className="flex h-full justify-center items-center">
      <div>
        <p className="text-muted-foreground font-semibold">
          what is your github username?
        </p>
        <Input
          placeholder="type here"
          className="mt-2 w-[300px]"
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key == "Enter") handleFetchGitHubUser();
          }}
        />
      </div>
    </div>
  );
}
