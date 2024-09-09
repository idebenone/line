"use client";

import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import { repositoriesAtom, userAtom } from "@/lib/atoms";
import { fetchRepositories } from "@/app/api/github-api";

import TopRepositories from "../../../components/top-repositories";
import Activity from "../../../components/activity";
import Header from "../../../components/header";

export default function UserPage() {
  const user = useAtomValue(userAtom);
  const setRepositories = useSetAtom(repositoriesAtom);

  async function handleFetchRepos(username: string) {
    try {
      const response = await fetchRepositories(username);
      setRepositories(response.data);
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
