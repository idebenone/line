"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";

import { userAtom } from "@/lib/atoms";

import { Input } from "@/components/ui/input";
import { fetchUser } from "./api/github-api";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RootPage() {
  const router = useRouter();
  const setUser = useSetAtom(userAtom);

  const [generateProfile, setGenerateProfile] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");

  async function handleFetchGitHubUser() {
    try {
      localStorage.setItem("username", username);
      const response = await fetchUser(username);
      setUser(response);
      router.push(`/edit/${username}`);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex h-full justify-center items-center">
      <div className="flex flex-col gap-2 w-full lg:w-1/4">
        <p className="font-semibold text-muted-foreground">
          Create a personalized, shareable profile page powered by GitHub API!
          Showcase your GitHub stats and access exclusive utilities inspired by
          GitHub CLI, all in one user-friendly website.
        </p>
        {generateProfile && (
          <Input
            placeholder="github username"
            className="mt-2"
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") handleFetchGitHubUser();
            }}
          />
        )}
        <div className="flex gap-2 mt-4">
          {generateProfile && (
            <Button onClick={() => handleFetchGitHubUser()}>submit</Button>
          )}
          {!generateProfile && (
            <Button onClick={() => setGenerateProfile(true)}>
              generate a profile
            </Button>
          )}
          <Link href="/utilities">
            <Button>utilities</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
