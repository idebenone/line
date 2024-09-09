"use client";

import { useEffect, useState } from "react";
import { CommitIcon } from "@radix-ui/react-icons";
import { FolderGit2, GitPullRequest } from "lucide-react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useAtomValue } from "jotai";
import { userAtom } from "@/lib/atoms";
import { Event } from "@/lib/types";

export default function Activity() {
  const user = useAtomValue(userAtom);
  const [activities, setActivities] = useState<Event[]>([]);
  const [eventType, setEventType] = useState<string>("PullRequestEvent");
  const [showMoreStates, setShowMoreStates] = useState<Record<string, boolean>>(
    {}
  );
  const [showPRBody, setShowPRBody] = useState<Record<string, boolean>>({});
  const [mdxSources, setMdxSources] = useState<
    Record<string, MDXRemoteSerializeResult>
  >({});

  useEffect(() => {
    async function fetchActivity() {
      try {
        const response = await fetch(
          `https://api.github.com/users/${user.login}/events`
        );
        const result: Event[] = await response.json();
        const mdxData: Record<string, MDXRemoteSerializeResult> = {};

        for (const activity of result) {
          if (activity.type === "PullRequestEvent") {
            const mdxSource = await serialize(
              activity.payload?.pull_request?.body || ""
            );
            mdxData[activity.id] = mdxSource;
          }
        }
        setActivities(result);
        setMdxSources(mdxData);
      } catch (error) {
        console.error("Error fetching activities", error);
      }
    }

    fetchActivity();
  }, [user.login]);

  const toggleShowMoreCommits = (activityId: string) =>
    setShowMoreStates((prev) => ({
      ...prev,
      [activityId]: !prev[activityId],
    }));

  const toggleShowPRBody = (activityId: string) =>
    setShowPRBody((prev) => ({
      ...prev,
      [activityId]: !prev[activityId],
    }));

  return (
    <div className="flex flex-col gap-4">
      <p className="font-semibold text-primary text-xs">Activities</p>
      <div>
        <TabButton
          label="PR"
          active={eventType === "PullRequestEvent"}
          onClick={() => setEventType("PullRequestEvent")}
        />
        <TabButton
          label="Commit"
          active={eventType === "PushEvent"}
          onClick={() => setEventType("PushEvent")}
        />
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {activities
          .filter((activity) => activity.type === eventType)
          .map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              eventType={eventType}
              mdxSource={mdxSources[activity.id]}
              showMoreStates={showMoreStates[activity.id]}
              showPRBody={showPRBody[activity.id]}
              toggleShowMoreCommits={toggleShowMoreCommits}
              toggleShowPRBody={toggleShowPRBody}
            />
          ))}
      </div>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <span
      className={`px-4 py-2 hover:bg-muted cursor-pointer ${
        active ? "bg-primary text-primary-foreground hover:bg-primary" : ""
      }`}
      onClick={onClick}
    >
      {label.toLowerCase()}
    </span>
  );
}

function ToggleButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <p
      onClick={onClick}
      className="text-xs text-primary mt-2 text-center cursor-pointer"
    >
      {label}
    </p>
  );
}

function ActivityItem({
  activity,
  eventType,
  mdxSource,
  showMoreStates,
  showPRBody,
  toggleShowMoreCommits,
  toggleShowPRBody,
}: {
  activity: Event;
  eventType: string;
  mdxSource?: MDXRemoteSerializeResult;
  showMoreStates: boolean;
  showPRBody: boolean;
  toggleShowMoreCommits: (activityId: string) => void;
  toggleShowPRBody: (activityId: string) => void;
}) {
  return (
    <div>
      {eventType === "PushEvent" && (
        <PushEventItem
          activity={activity}
          showMoreStates={showMoreStates}
          toggleShowMoreCommits={toggleShowMoreCommits}
        />
      )}
      {eventType === "PullRequestEvent" && (
        <PullRequestEventItem
          activity={activity}
          mdxSource={mdxSource}
          showPRBody={showPRBody}
          toggleShowPRBody={toggleShowPRBody}
        />
      )}
    </div>
  );
}

function PushEventItem({
  activity,
  showMoreStates,
  toggleShowMoreCommits,
}: {
  activity: Event;
  showMoreStates: boolean;
  toggleShowMoreCommits: (activityId: string) => void;
}) {
  return (
    <>
      <div className="flex gap-2 items-center">
        <FolderGit2 className="h-4 w-4" />
        <p className="text-sm">
          created a commit in&nbsp;
          <a
            href={`https://github.com/${activity.repo.name}`}
            target="_blank"
            className="font-medium hover:underline"
          >
            {activity.repo.name}
          </a>
        </p>
      </div>
      {activity.payload.commits && activity.payload.commits.length !== 0 && (
        <div className="flex flex-col gap-1 bg-card p-4">
          {activity.payload.commits
            .slice(0, showMoreStates ? activity.payload.commits.length : 2)
            .map((commit) => (
              <CommitItem key={commit.sha} commit={commit} />
            ))}
          {activity.payload.commits.length > 2 && (
            <ToggleButton
              label={showMoreStates ? "View Less" : "View More"}
              onClick={() => toggleShowMoreCommits(activity.id)}
            />
          )}
        </div>
      )}
    </>
  );
}

function PullRequestEventItem({
  activity,
  mdxSource,
  showPRBody,
  toggleShowPRBody,
}: {
  activity: Event;
  mdxSource?: MDXRemoteSerializeResult;
  showPRBody: boolean;
  toggleShowPRBody: (activityId: string) => void;
}) {
  return (
    <>
      <div className="flex gap-2 items-center">
        <GitPullRequest className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          opened a pull request in&nbsp;
          <a
            href={activity.payload.pull_request?.base.repo.html_url}
            target="_blank"
            className="font-medium hover:underline"
          >
            {activity.repo.name}
          </a>
        </p>
      </div>
      <div className="mt-2 p-4 border border-dotted bg-card">
        <a
          href={activity.payload.pull_request?.html_url}
          target="_blank"
          className="hover:underline"
        >
          <p className="text-xl font-semibold">
            {activity.payload.pull_request?.title}
          </p>
        </a>
        {showPRBody && mdxSource && (
          <div className="max-w-full p-4 mt-2 prose">
            <MDXRemote {...mdxSource} />
          </div>
        )}
        {activity.payload.pull_request?.body && (
          <ToggleButton
            label={showPRBody ? "View Less" : "View More"}
            onClick={() => toggleShowPRBody(activity.id)}
          />
        )}
      </div>
    </>
  );
}

function CommitItem({ commit }: { commit: { message: string; url: string } }) {
  return (
    <div className="w-full flex items-center gap-2">
      <CommitIcon className="h-3 w-3 text-muted-foreground mt-1" />
      <a
        href={commit.url}
        target="_blank"
        className="cursor-pointer hover:underline text-xs text-muted-foreground w-[75%]"
      >
        <p>{commit.message}</p>
      </a>
    </div>
  );
}
