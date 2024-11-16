"use client";

import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import { fetchRepositories } from "@/app/api/github-api";
import { repositoriesAtom, userAtom } from "@/lib/atoms";

import Events from "../../../components/events";
import Header from "../../../components/header";
import TopRepositories from "../../../components/top-repositories";
import ActivtyGraph from "@/components/activity-graph";

export default function UserPage() {
  const user = useAtomValue(userAtom);
  const setRepositories = useSetAtom(repositoriesAtom);

  async function handleFetchRepos(username: string) {
    try {
      const response = await fetchRepositories(username);
      setRepositories(response);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (user) handleFetchRepos(user.login);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    user && (
      <div className="h-full flex justify-center">
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <Header />
          <TopRepositories type="preview" />
          <ActivtyGraph />
          <Events />
        </div>
      </div>
    )
  );
}
