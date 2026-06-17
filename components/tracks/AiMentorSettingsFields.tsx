"use client";

import { asString } from "@/lib/utils/element-settings";
import { useState } from "react";
import { MentorEmbedPreview } from "./MentorEmbedPreview";

interface AiMentorSettingsFieldsProps {
  settings: Record<string, unknown>;
}

export function AiMentorSettingsFields({ settings }: AiMentorSettingsFieldsProps) {
  const [embedCode, setEmbedCode] = useState(asString(settings.embed_code));

  return (
    <div className="space-y-3">
      <Field
        label="Mentor Name"
        name="mentor_name"
        defaultValue={asString(settings.mentor_name)}
      />
      <Field
        label="Mentor Purpose / Goal"
        name="mentor_purpose"
        defaultValue={asString(settings.mentor_purpose)}
        textarea
      />
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Mentor Studio Embed Code
        </label>
        <textarea
          name="embed_code"
          value={embedCode}
          onChange={(e) => setEmbedCode(e.target.value)}
          rows={6}
          placeholder="Paste your Mentor Studio embed code here..."
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono"
        />
        <p className="mt-1.5 text-xs text-gray-500">
          Paste the embed code from your Mentor Studio mentor here. This will
          display the mentor inside this stage.
        </p>
      </div>

      <div className="pt-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Mentor Preview
        </p>
        <MentorEmbedPreview embedCode={embedCode} />
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  textarea = false,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          rows={2}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
      )}
    </div>
  );
}
