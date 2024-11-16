"use client";

import { useEffect, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useAtomValue, useSetAtom } from "jotai";

import { clearCache, fetchRepositories, fetchUser } from "@/app/api/github-api";
import { topRepositoriesAtom, userAtom } from "@/lib/atoms";
import { decryptCode } from "@/lib/utils";
import { Repository } from "@/lib/types";

import Events from "../../../components/events";
import Header from "../../../components/header";
import TopRepositories from "../../../components/top-repositories";
import { Skeleton } from "@/components/ui/skeleton";
import ActivityGraph from "@/components/activity-graph";

export default function CodePage({ params }: { params: { code: string } }) {
  const searchParams = useSearchParams();
  const { setTheme } = useTheme();
  const user = useAtomValue(userAtom);
  const setUser = useSetAtom(userAtom);
  const setSelectedRepositories = useSetAtom(topRepositoriesAtom);

  const [isPending, setTransition] = useTransition();

  function handleFetchDetails(username: string, repo_id: string[]) {
    setTransition(async () => {
      try {
        await clearCache();

        const user_response = await fetchUser(username);
        setUser(user_response);

        const repo_response = await fetchRepositories(username);
        const tempSelectedRepos: Repository[] = [];
        repo_response.map((repo: Repository) => {
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
      handleFetchDetails(data["user"] as string, data["repo"] as string[]);
    }

    const theme = searchParams.get("theme");
    if (theme) setTheme(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.code]);

  return (
    user && (
      <div className="h-full flex justify-center">
        <div className="w-full lg:w-1/2 p-2 flex flex-col gap-4">
          {isPending ? <Skeleton className="w-full h-[100px]" /> : <Header />}
          {isPending ? (
            <Skeleton className="w-full h-[200px]" />
          ) : (
            <TopRepositories type="code" />
          )}
          <ActivityGraph />
          <Events />
        </div>
      </div>
    )
  );
}
