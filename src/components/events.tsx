"use client";

import { useEffect, useState, useTransition } from "react";
import { CommitIcon } from "@radix-ui/react-icons";
import { FolderGit2, GitPullRequest } from "lucide-react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useAtomValue } from "jotai";
import { userAtom } from "@/lib/atoms";
import { Event } from "@/lib/types";
import { fetchEvents } from "@/app/api/github-api";
import { Skeleton } from "./ui/skeleton";

export default function Events() {
  const user = useAtomValue(userAtom);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventType, setEventType] = useState<string>("PullRequestEvent");
  const [showMoreStates, setShowMoreStates] = useState<Record<string, boolean>>(
    {}
  );
  const [showPRBody, setShowPRBody] = useState<Record<string, boolean>>({});
  const [mdxSources, setMdxSources] = useState<
    Record<string, MDXRemoteSerializeResult>
  >({});

  const [isPending, setTransition] = useTransition();

  useEffect(() => {
    function handleFetchEvents() {
      setTransition(async () => {
        if (user)
          try {
            const response = await fetchEvents(user.login);
            const mdxData: Record<string, MDXRemoteSerializeResult> = {};

            for (const activity of response.data) {
              if (activity.type === "PullRequestEvent") {
                const mdxSource = await serialize(
                  activity.payload?.pull_request?.body || ""
                );
                mdxData[activity.id] = mdxSource;
              }
            }
            setEvents(response.data);
            setMdxSources(mdxData);
          } catch (error) {
            console.error("Error fetching activities", error);
          }
      });
    }

    handleFetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.login]);

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

  return !isPending ? (
    <div className="flex flex-col gap-2">
      <p className="font-semibold text-primary text-xs">events</p>
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

      <div className="flex flex-col gap-4 mt-2">
        {events.length !== 0 ? (
          events
            .filter((event) => event.type === eventType)
            .map((event) => (
              <EventItem
                key={event.id}
                event={event}
                eventType={eventType}
                mdxSource={mdxSources[event.id]}
                showMoreStates={showMoreStates[event.id]}
                showPRBody={showPRBody[event.id]}
                toggleShowMoreCommits={toggleShowMoreCommits}
                toggleShowPRBody={toggleShowPRBody}
              />
            ))
        ) : (
          <p className="text-xs font-semibold text-muted-foreground text-center mt-12">
            no recent events found
          </p>
        )}
      </div>
    </div>
  ) : (
    <Skeleton className="w-full h-[400px]" />
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
      className={`px-4 py-1 hover:bg-muted cursor-pointer text-xs ${
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

function EventItem({
  event,
  eventType,
  mdxSource,
  showMoreStates,
  showPRBody,
  toggleShowMoreCommits,
  toggleShowPRBody,
}: {
  event: Event;
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
          event={event}
          showMoreStates={showMoreStates}
          toggleShowMoreCommits={toggleShowMoreCommits}
        />
      )}
      {eventType === "PullRequestEvent" && (
        <PullRequestEventItem
          event={event}
          mdxSource={mdxSource}
          showPRBody={showPRBody}
          toggleShowPRBody={toggleShowPRBody}
        />
      )}
    </div>
  );
}

function PushEventItem({
  event,
  showMoreStates,
  toggleShowMoreCommits,
}: {
  event: Event;
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
            href={`https://github.com/${event.repo.name}`}
            target="_blank"
            className="font-medium hover:underline"
          >
            {event.repo.name}
          </a>
        </p>
      </div>
      {event.payload.commits && event.payload.commits.length !== 0 && (
        <div className="flex flex-col gap-1 border border-dotted bg-card p-4">
          {event.payload.commits
            .slice(0, showMoreStates ? event.payload.commits.length : 2)
            .map((commit) => (
              <CommitItem key={commit.sha} commit={commit} />
            ))}
          {event.payload.commits.length > 2 && (
            <ToggleButton
              label={showMoreStates ? "View Less" : "View More"}
              onClick={() => toggleShowMoreCommits(event.id)}
            />
          )}
        </div>
      )}
    </>
  );
}

function PullRequestEventItem({
  event,
  mdxSource,
  showPRBody,
  toggleShowPRBody,
}: {
  event: Event;
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
            href={event.payload.pull_request?.base.repo.html_url}
            target="_blank"
            className="font-medium hover:underline"
          >
            {event.repo.name}
          </a>
        </p>
      </div>
      <div className="p-4 border border-dotted bg-card">
        <a
          href={event.payload.pull_request?.html_url}
          target="_blank"
          className="hover:underline"
        >
          <p className="text-xl font-semibold">
            {event.payload.pull_request?.title}
          </p>
        </a>
        {showPRBody && mdxSource && (
          <div className="max-w-full p-4 mt-2 prose">
            <MDXRemote {...mdxSource} />
          </div>
        )}
        {event.payload.pull_request?.body && (
          <ToggleButton
            label={showPRBody ? "View Less" : "View More"}
            onClick={() => toggleShowPRBody(event.id)}
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
