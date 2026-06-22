"use client";

import { deleteStage, moveStage } from "@/lib/actions/stages";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface StageCardControlsProps {
  trackId: string;
  stageId: string;
  isFirst: boolean;
  isLast: boolean;
}

export function StageCardControls({
  trackId,
  stageId,
  isFirst,
  isLast,
}: StageCardControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleMove(direction: "up" | "down") {
    setMessage(null);
    startTransition(async () => {
      const result = await moveStage(stageId, direction);
      if (result.error) {
        setMessage(result.error);
        return;
      }
      router.refresh();
    });
  }

  function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this stage? This will also remove the elements inside this stage. This cannot be undone."
    );
    if (!confirmed) {
      return;
    }

    setMessage(null);
    startTransition(async () => {
      const result = await deleteStage(stageId);
      if (result.error) {
        setMessage(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="mt-5 pt-4 border-t border-gray-100">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isFirst || isPending}
          onClick={() => handleMove("up")}
          aria-label="Move stage up"
          className="text-gray-600"
        >
          ↑ Move Up
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isLast || isPending}
          onClick={() => handleMove("down")}
          aria-label="Move stage down"
          className="text-gray-600"
        >
          ↓ Move Down
        </Button>
        <Button
          href={`/guide/tracks/${trackId}/stages/${stageId}`}
          variant="secondary"
          size="sm"
        >
          Edit Stage
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={handleDelete}
          className="text-red-700 border-red-200 hover:bg-red-50 hover:border-red-300"
        >
          Delete Stage
        </Button>
      </div>
      {message && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {message}
        </p>
      )}
    </div>
  );
}
