"use client";

import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import { repositoriesAtom, topRepositoriesAtom } from "@/lib/atoms";
import { formatDate } from "@/lib/utils";

import { Cross1Icon, StarIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Repository } from "@/lib/types";

const LANGUAGES: { [key: string]: string } = {
  typescript: "text-blue-600",
  javascript: "text-yellow-600",
  html: "text-red-600",
  java: "text-orange-600",
  php: "text-grey-600",
};

interface TopRepositoriesProps {
  type: string;
}

export default function TopRepositories({ type }: TopRepositoriesProps) {
  const selectedRepositories = useAtomValue(topRepositoriesAtom);
  const setSelectedRepositories = useSetAtom(topRepositoriesAtom);
  const repositories = useAtomValue(repositoriesAtom);

  const [repositoryCount, setRepositoryCount] = useState<number>(() =>
    type === "preview" ? 3 : 6
  );

  const handleSelectRepository = (repo: Repository) => {
    if (selectedRepositories.length < repositoryCount) {
      setSelectedRepositories([...selectedRepositories, repo]);
    }
  };

  const handleRemoveRepository = (repoId: number) => {
    setSelectedRepositories(
      selectedRepositories.filter((repo) => repo.id !== repoId)
    );
  };

  const renderRepositoryCountControls = () => (
    <div className="flex gap-2">
      {[3, 5].map((count) => (
        <p
          key={count}
          className={`p-1 border border-muted text-xs h-6 w-6 text-center cursor-pointer hover:bg-muted ${
            repositoryCount === count && "bg-muted"
          }`}
          onClick={() => setRepositoryCount(count)}
        >
          {count}
        </p>
      ))}
    </div>
  );

  const renderRepository = (repo: Repository) => (
    <div
      key={repo.id}
      className="flex flex-col justify-between p-3 border border-dotted group relative hover:bg-muted"
    >
      <div>
        <p className="font-semibold">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer hover:underline"
          >
            {repo.name}
          </a>
        </p>
        <p className="text-muted-foreground text-xs">{repo.description}</p>
      </div>

      <div className="flex gap-4 items-center mt-2">
        <p
          className={`text-xs ${
            LANGUAGES[repo.language!.toLowerCase()] ?? "text-primary"
          }`}
        >
          {repo.language ?? "readme"}
        </p>

        <span className="flex gap-1 items-center">
          <StarIcon className="h-4 w-4" />
          <p className="text-xs">{repo.stargazers_count}</p>
        </span>

        <p className="text-xs text-muted-foreground">
          updated on {formatDate(repo.updated_at)}
        </p>
      </div>

      {type === "preview" && (
        <Cross1Icon
          onClick={() => handleRemoveRepository(repo.id)}
          className="h-3 w-3 hidden group-hover:block absolute top-2 right-2 cursor-pointer"
        />
      )}
    </div>
  );

  if (type !== "preview" && selectedRepositories.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-primary text-xs">Top Repositories</p>

        {type === "preview" && renderRepositoryCountControls()}
      </div>

      <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
        {selectedRepositories
          .slice(0, repositoryCount)
          .map((repo) => renderRepository(repo))}
      </div>

      {type === "preview" && selectedRepositories.length < repositoryCount && (
        <div className="flex justify-center items-center h-[100px] border border-dashed">
          <Select onValueChange={handleSelectRepository}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="repositories" />
            </SelectTrigger>
            <SelectContent>
              {repositories.map((repo) => (
                <SelectItem key={repo.id} value={repo}>
                  {repo.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
