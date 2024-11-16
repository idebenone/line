/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Trash, TriangleAlert } from "lucide-react";

import { formatDate } from "@/lib/utils";

import {
  _fetchRepositories,
  deleteDeployment,
  getDeployments,
  getDeploymentStatus,
  setDeploymentInactive,
} from "../api/github-api";
import { Deployments, Repository } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function Utilities() {
  const router = useRouter();
  const [user, setUser] = useState<string>("");
  const [repo, setRepo] = useState<string>("");
  const [token, setToken] = useState<string>("");

  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [noRepo, setNoRepo] = useState<boolean>(false);
  const [deployments, setDeployments] = useState<Deployments[]>([]);

  async function handleFetchRepos() {
    try {
      const response = await _fetchRepositories({ user, token });
      setRepositories(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleFetchDeploymenst() {
    try {
      const response = await getDeployments({ repo, user, token });
      setDeployments(response);
      console.log(response);
    } catch (error) {
      toast.error("Something went wrong while fetching deployments.");
    }
  }

  async function handleDeleteDeployment(id: number) {
    try {
      const response = await getDeploymentStatus({
        repo,
        user,
        token,
        deployment_id: id,
      });

      if (response.state !== "failure") {
        await setDeploymentInactive({
          repo,
          user,
          token,
          deployment_id: id,
        });
      }

      await deleteDeployment({
        repo,
        user,
        token,
        deployment_id: id,
      });
      setDeployments(deployments.filter((value) => value.id !== id));
      toast.success("Successfully deleted the deployment.");
    } catch (error) {
      toast.error("Something went wrong while deleting a deployment.");
    }
  }

  return (
    <div className="h-full flex justify-center items-center">
      <div className="px-2 w-full lg:px-0 lg:w-1/2 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <p className="font-semibold text-xl text-primary">
              delete deployments
            </p>

            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground mt-1" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[300px]">
                  We don&apos;t store any user information.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          <p
            className="underline text-xs cursor-pointer"
            onClick={() => router.back()}
          >
            back
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Input
            placeholder="token"
            type="password"
            onChange={(e) => setToken(e.target.value)}
          />
          <div className="relative">
            <Input
              placeholder="username"
              onChange={(e) => setUser(e.target.value)}
              onKeyDownCapture={(e) => {
                if (e.key === "Enter") handleFetchRepos();
              }}
              disabled={!token}
            />
            <p className="absolute right-2 top-2 text-xs text-muted-foreground italic">
              press enter to search
            </p>
          </div>
          {!noRepo ? (
            <>
              <Select
                onValueChange={(value) => setRepo(value)}
                disabled={!user || !token}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="repositories" />
                </SelectTrigger>
                <SelectContent>
                  {repositories.map((repo) => (
                    <SelectItem key={repo.id} value={repo.name}>
                      {repo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p
                className="text-end underline cursor-pointer text-xs text-muted-foreground"
                onClick={() => setNoRepo(!noRepo)}
              >
                don&apos;t see repo name ?
              </p>
            </>
          ) : (
            <>
              <Input
                placeholder="repo"
                onChange={(e) => setRepo(e.target.value)}
                disabled={!user || !token}
              />
              <p
                className="text-end underline cursor-pointer text-xs text-muted-foreground"
                onClick={() => setNoRepo(!noRepo)}
              >
                back
              </p>
            </>
          )}
          <div className="flex gap-2 items-center justify-end">
            <Tooltip>
              <TooltipTrigger>
                <Button size="icon" variant="outline">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[300px]">
                  Github api doesn&apos;t provide sufficient metadata to
                  identify deployments based on a particular commit/merge.
                  Please identify deployments that needs to be deleted from the
                  id/ref.
                </p>
              </TooltipContent>
            </Tooltip>
            <Button
              disabled={!user || !repo || !token}
              onClick={handleFetchDeploymenst}
            >
              search
            </Button>
          </div>
        </div>

        {deployments.length !== 0 && (
          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            <div className="flex flex-col gap-2">
              {deployments.map((deployment, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 hover:bg-muted px-4 py-2 cursor-pointer group"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                      <img
                        src={deployment.creator.avatar_url}
                        alt=""
                        className="h-6 rounded-full"
                      />
                      <div>
                        <p className="font-bold text-sm">{deployment.id}</p>
                        <p className="text-xs text-muted-foreground">
                          {deployment.ref}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-center">
                      <p className="text-xs text-muted-foreground italic">
                        {formatDate(deployment.created_at)}
                      </p>

                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Trash className="h-4 w-4 cursor-pointer invisible group-hover:visible text-primary" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              <Alert variant="destructive">
                                <TriangleAlert className="h-4 w-4" />
                                <AlertTitle>Heads up!</AlertTitle>
                                <AlertDescription>
                                  If the deployment is active, it will be set to
                                  inactive before deleting.
                                </AlertDescription>
                              </Alert>

                              <p className="mt-4">
                                This action cannot be undone. Deleting this
                                deployment will permanently remove it from your
                                project.
                              </p>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDeleteDeployment(deployment.id)
                              }
                            >
                              delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
