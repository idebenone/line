"use client";

import { Copy, LucideGithub, Twitter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { toast } from "sonner";

interface ShareDialogProps {
  dialogState: boolean;
  setDialogState: () => void;
  link: string;
}

export default function ShareDialog({
  dialogState,
  setDialogState,
  link,
}: ShareDialogProps) {
  function handleCopyLink(type: string) {
    if (type.includes("preview")) {
      if (typeof window !== "undefined") {
        navigator.clipboard
          .writeText(link)
          .then(() => {
            toast.success("link has been copied!");
          })
          .catch(() => {
            toast.error("failed to copy the link.");
          });
      }
    } else {
      if (typeof window !== "undefined") {
        navigator.clipboard
          .writeText(
            `<iframe src="${link}" height="600" width="400" allowFullScreen></iframe>`
          )
          .then(() => {
            toast.success("link has been copied!");
          })
          .catch(() => {
            toast.error("failed to copy the link.");
          });
      }
    }
  }

  return (
    <Dialog open={dialogState} onOpenChange={setDialogState}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>sharing is caring</DialogTitle>
          <DialogDescription>spread word....make me famous!</DialogDescription>
        </DialogHeader>

        <div className="w-full">
          <p className="text-muted-foreground text-xs font-semibold">
            preview link
          </p>
          <div className="mt-2 flex gap-3 items-center relative">
            <Input
              value={link}
              disabled
              className="text-xs max-w-full overflow-auto break-all whitespace-pre-wrap cursor-text"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-muted">
              <Copy
                className="text-muted-foreground cursor-pointer h-4 w-4"
                onClick={() => handleCopyLink("preview")}
              />
            </span>
          </div>
        </div>
        <div className="relative w-full h-full bg-muted p-2">
          <p className="text-muted-foreground text-xs font-semibold">
            embed link
          </p>
          <code className="text-xs h-full w-full break-all">
            {`<iframe src="${link}" height="600" width="400" allowFullScreen></iframe>`}
          </code>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-muted">
            <Copy
              className="text-muted-foreground cursor-pointer h-4 w-4"
              onClick={() => handleCopyLink("embed")}
            />
          </span>
        </div>

        <div className="flex flex-col justify-center items-center">
          <p className="text-xs text-muted-foreground">
            i&apos;m available here
          </p>

          <div className="flex items-center gap-2 mt-2">
            <a
              href="https://github.com/idebenone/line"
              target="_blank"
              className="p-1 hover:bg-muted border rounded-lg group"
            >
              <LucideGithub className="h-4 w-4 cursor-pointer text-muted-foreground group-hover:text-primary" />
            </a>
            <a
              href="https://x.com/laz__en"
              target="_blank"
              className="p-1 hover:bg-muted border rounded-lg group"
            >
              <Twitter className="h-4 w-4 cursor-pointer text-muted-foreground group-hover:text-primary" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
