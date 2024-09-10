"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";

import { userAtom } from "@/lib/atoms";

import { Input } from "@/components/ui/input";
import { fetchUser } from "./api/github-api";

export default function RootPage() {
  const router = useRouter();
  const setUser = useSetAtom(userAtom);

  const [username, setUsername] = useState<string>("");

  async function handleFetchGitHubUser() {
    try {
      localStorage.setItem("username", username);
      const response = await fetchUser(username);
      setUser(response.data);
      router.push(`/preview/${username}`);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("username"))
      router.push(`/preview/${localStorage.getItem("username")}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
