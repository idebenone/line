"use client";

import { useEffect, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useAtomValue, useSetAtom } from "jotai";

import { fetchRepositories, fetchUser } from "@/app/api/github-api";
import { topRepositoriesAtom, userAtom } from "@/lib/atoms";
import { decryptCode } from "@/lib/utils";
import { Repository } from "@/lib/types";

import Events from "../../../components/events";
import Header from "../../../components/header";
import TopRepositories from "../../../components/top-repositories";
import { Skeleton } from "@/components/ui/skeleton";

export default function CodePage({ params }: { params: { code: string } }) {
  const searchParams = useSearchParams();
  const { setTheme } = useTheme();
  const user = useAtomValue(userAtom);
  const setUser = useSetAtom(userAtom);
  const setSelectedRepositories = useSetAtom(topRepositoriesAtom);

  const [isPendingUser, setTransitionUser] = useTransition();
  const [isPendingRepository, setTransitionRepository] = useTransition();

  function handleFetchGitHubUser(username: string) {
    setTransitionUser(async () => {
      try {
        const response = await fetchUser(username);
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    });
  }

  function handleFetchRepos(username: string, repo_id: string[]) {
    setTransitionRepository(async () => {
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
    });
  }

  useEffect(() => {
    const data = decryptCode(atob(params.code));
    if (data["user"] as string) {
      handleFetchGitHubUser(data["user"] as string);
      handleFetchRepos(data["user"] as string, data["repo"] as string[]);
    }

    const theme = searchParams.get("theme");
    if (theme) setTheme(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.code]);

  return (
    user && (
      <div className="h-full flex justify-center">
        <div className="lg:w-1/2 p-2 flex flex-col gap-4">
          {isPendingUser ? (
            <Skeleton className="w-full h-[100px]" />
          ) : (
            <Header />
          )}
          {isPendingRepository ? (
            <Skeleton className="w-full h-[200px]" />
          ) : (
            <TopRepositories type="code" />
          )}
          <Events />
        </div>
      </div>
    )
  );
}
