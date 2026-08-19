"use client";

import { updateEnrollmentStatus } from "@/lib/actions/site-admin-members";
import { Button } from "@/components/ui/Button";
import { useState, useTransition } from "react";

interface EnrollmentStatusActionsProps {
  enrollmentId: string;
  status: string;
}

export function EnrollmentStatusActions({
  enrollmentId,
  status,
}: EnrollmentStatusActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const normalized = status.trim().toLowerCase();

  function handleUpdate(nextStatus: "active" | "paused", message: string) {
    if (!window.confirm(message)) {
      return;
    }

    setError(null);
    const formData = new FormData();
    formData.set("enrollment_id", enrollmentId);
    formData.set("status", nextStatus);

    startTransition(async () => {
      const result = await updateEnrollmentStatus(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-2">
      {normalized === "active" ? (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={isPending}
          onClick={() =>
            handleUpdate(
              "paused",
              "Pause this participant's access to this Action Track?"
            )
          }
        >
          {isPending ? "Saving..." : "Pause Access"}
        </Button>
      ) : null}

      {normalized === "paused" || normalized === "revoked" ? (
        <Button
          type="button"
          variant="primary"
          size="sm"
          disabled={isPending}
          onClick={() =>
            handleUpdate("active", "Reactivate this participant's access?")
          }
        >
          {isPending ? "Saving..." : "Reactivate"}
        </Button>
      ) : null}

      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
