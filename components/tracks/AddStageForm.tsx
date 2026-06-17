"use client";

import { createStage } from "@/lib/actions/stages";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface AddStageFormProps {
  trackId: string;
}

export function AddStageForm({ trackId }: AddStageFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await createStage(trackId, formData);
        router.refresh();
      } catch (error) {
        console.error(error);
      }
    });
  }

  return (
    <form action={handleSubmit} className="flex items-center gap-2">
      <Button type="submit" variant="accent" disabled={isPending}>
        {isPending ? "Adding..." : "Add Stage"}
      </Button>
    </form>
  );
}
