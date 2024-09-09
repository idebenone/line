"use client";

import { Copy } from "lucide-react";
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
  function handleCopyLink() {
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
  }

  return (
    <Dialog open={dialogState} onOpenChange={setDialogState}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>how do you wanna share?</DialogTitle>
          <DialogDescription>Spread word....make me famous!</DialogDescription>

          <div className="flex gap-3 items-center">
            <Input
              value={link}
              disabled
              className="text-xs max-w-full overflow-auto break-all whitespace-pre-wrap"
            />
            <Copy
              className="text-muted-foreground cursor-pointer h-4 w-4"
              onClick={handleCopyLink}
            />
          </div>
          <code className="bg-muted text-xs p-2 h-full w-full max-w-full overflow-auto break-all">
            {`<iframe src="${link}" height="600" width="400" allowFullScreen></iframe>`}
          </code>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
