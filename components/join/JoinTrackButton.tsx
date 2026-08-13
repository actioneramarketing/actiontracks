"use client";

import { joinActionTrack } from "@/lib/actions/join-track";
import { Button } from "@/components/ui/Button";
import { useState, useTransition } from "react";

export function JoinTrackButton({ trackSlug }: { trackSlug: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await joinActionTrack(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form action={handleSubmit} className="w-full">
      <input type="hidden" name="track_slug" value={trackSlug} />
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? "Joining..." : "Join This Action Track"}
      </Button>
      {error ? (
        <p className="mt-3 text-sm text-red-600 text-center" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
