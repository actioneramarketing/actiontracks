"use client";

import { saveCommitment } from "@/lib/actions/commitments";
import { StageElement } from "@/lib/types/database";
import {
  mapSavedAnswersToQuestions,
  ParticipantCommitmentView,
} from "@/lib/utils/commitment";
import { asRecord, asStringArray } from "@/lib/utils/element-settings";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface CommitmentBuilderElementProps {
  element: StageElement;
  trackId: string;
  stageId: string;
  trackSlug: string;
  stageSlug: string;
  savedCommitment?: ParticipantCommitmentView;
}

export function CommitmentBuilderElement({
  element,
  trackId,
  stageId,
  trackSlug,
  stageSlug,
  savedCommitment,
}: CommitmentBuilderElementProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const settings = asRecord(element.settings_json);
  const questions = asStringArray(settings.questions, 10).filter(Boolean);
  const savedAnswers = mapSavedAnswersToQuestions(
    questions,
    savedCommitment?.answers ?? []
  );

  if (questions.length === 0) {
    return (
      <div className="px-6 pb-6 border-t border-slate-100 pt-4 text-sm text-slate-500">
        Commitment questions will appear here once configured.
      </div>
    );
  }

  function handleSave(formData: FormData) {
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await saveCommitment(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setMessage("Commitment saved.");
      router.refresh();
    });
  }

  return (
    <div className="px-6 pb-6 border-t border-slate-100 pt-4">
      <form
        key={savedCommitment?.updatedAt ?? "new"}
        action={handleSave}
        className="space-y-4"
      >
        <input type="hidden" name="track_id" value={trackId} />
        <input type="hidden" name="stage_id" value={stageId} />
        <input type="hidden" name="element_id" value={element.id} />
        <input type="hidden" name="track_slug" value={trackSlug} />
        <input type="hidden" name="stage_slug" value={stageSlug} />
        <input type="hidden" name="question_count" value={String(questions.length)} />

        {questions.map((question, index) => (
          <div key={index}>
            <label
              htmlFor={`commitment-${element.id}-${index}`}
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              {question}
            </label>
            <input type="hidden" name={`question_${index}`} value={question} />
            {index === 1 ? (
              <textarea
                id={`commitment-${element.id}-${index}`}
                name={`answer_${index}`}
                defaultValue={savedAnswers[index] ?? ""}
                placeholder="Share your deeper motivation..."
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            ) : (
              <input
                id={`commitment-${element.id}-${index}`}
                name={`answer_${index}`}
                type="text"
                defaultValue={savedAnswers[index] ?? ""}
                placeholder={
                  index === 0
                    ? "e.g., A masterclass on Email Marketing for Coaches"
                    : "Your answer..."
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            )}
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <i className="fa-solid fa-check" />
            {isPending ? "Saving..." : "Save My Commitment"}
          </button>
          {message ? <span className="text-sm text-teal-700">{message}</span> : null}
          {error ? (
            <span className="text-sm text-red-600" role="alert">
              {error}
            </span>
          ) : null}
        </div>
      </form>
    </div>
  );
}
