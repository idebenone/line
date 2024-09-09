"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useAtomValue, useSetAtom } from "jotai";

import { topRepositoriesAtom, userAtom } from "@/lib/atoms";
import { decryptCode } from "@/lib/utils";

import Activity from "../../../components/activity";
import Header from "../../../components/header";
import TopRepositories from "../../../components/top-repositories";
import { fetchRepositories } from "@/app/api/github-api";
import { Repository } from "@/lib/types";

export default function CodePage({ params }: { params: { code: string } }) {
  const searchParams = useSearchParams();
  const { setTheme } = useTheme();
  const user = useAtomValue(userAtom);
  const setUser = useSetAtom(userAtom);
  const setSelectedRepositories = useSetAtom(topRepositoriesAtom);

  async function handleFetchGitHubUser(username: string) {
    try {
      const data = await fetch(`https://api.github.com/users/${username}`, {
        method: "GET",
        headers: [["content-type", "application/json"]],
      });
      data.json().then((data) => {
        setUser(data);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleFetchRepos(username: string, repo_id: string[]) {
    try {
      const response = await fetchRepositories(username);
      const tempSelectedRepos: Repository[] = [];
      response.data.map((repo: Repository) => {
        if (repo_id && repo_id.includes(repo.id.toString())) {
          tempSelectedRepos.push(repo);
        }
      });
      setSelectedRepositories(tempSelectedRepos);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const data = decryptCode(atob(params.code));
    if (data["user"] as string) {
      handleFetchGitHubUser(data["user"] as string);
      handleFetchRepos(data["user"] as string, data["repo"] as string[]);
    }

    const theme = searchParams.get("theme");
    if (theme) setTheme(theme);
  }, []);

  return (
    user && (
      <div className="h-full flex justify-center">
        <div className="lg:w-1/2 p-2 flex flex-col gap-4">
          <Header />
          <TopRepositories type="code" />
          <Activity />
        </div>
      </div>
    )
  );
}
