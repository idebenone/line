"use client";

import { repositoriesAtom, userAtom } from "@/lib/atoms";
import { useAtomValue, useSetAtom } from "jotai";
import TopRepositories from "../../../components/top-repositories";
import Activity from "../../../components/activity";
import Header from "../../../components/header";
import { useEffect } from "react";

export default function UserPage() {
  const user = useAtomValue(userAtom);
  const setRepositories = useSetAtom(repositoriesAtom);

  async function handleFetchRepos(username: string) {
    try {
      const data = await fetch(
        `https://api.github.com/users/${username}/repos`,
        {
          method: "GET",
          headers: [["content-type", "application/json"]],
        }
      );
      data.json().then((data) => setRepositories(data));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (user) handleFetchRepos(user.login);
  }, [user]);

  return (
    user && (
      <div className="h-full flex justify-center">
        <div className="lg:w-1/2 p-2 flex flex-col gap-4">
          <Header />
          <TopRepositories type="preview" />
          <Activity />
        </div>
      </div>
    )
  );
}
