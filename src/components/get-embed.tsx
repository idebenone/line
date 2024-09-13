"use client";

import { useAtomValue } from "jotai";

import { topRepositoriesAtom, userAtom } from "@/lib/atoms";

import { Button } from "./ui/button";
import ShareDialog from "./dialog/share-dialog";
import { useState } from "react";
import { useTheme } from "next-themes";

export default function GetEmbed() {
  const user = useAtomValue(userAtom);
  const repos = useAtomValue(topRepositoriesAtom);
  const { theme } = useTheme();

  const [shareDialogState, setShareDialogState] = useState<boolean>(false);
  const [link, setLink] = useState<string>("");

  function handleGenerateCode() {
    if (user) {
      let tempCode: string = "";
      tempCode += "user:" + user.login + "-";
      repos.map((repo) => {
        tempCode += "repo:" + repo.id + "-";
      });
      setLink(`${location.origin}/embed/` + btoa(tempCode) + `?theme=${theme}`);
      setShareDialogState(!shareDialogState);
    }
  }

  return (
    <div className="fixed bottom-2 right-2">
      <Button onClick={handleGenerateCode}>share</Button>
      <ShareDialog
        dialogState={shareDialogState}
        setDialogState={() => setShareDialogState(!shareDialogState)}
        link={link}
      />
    </div>
  );
}
