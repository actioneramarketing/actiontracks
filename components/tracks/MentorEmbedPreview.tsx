"use client";

import { Component, ReactNode } from "react";

class EmbedErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <p className="text-sm text-gray-500 text-center py-4">
          Unable to render mentor preview. Check your embed code and try again.
        </p>
      );
    }
    return this.props.children;
  }
}

interface MentorEmbedPreviewProps {
  embedCode: string;
  emptyMessage?: string;
}

export function MentorEmbedPreview({
  embedCode,
  emptyMessage = "No embed code added yet. Paste your Mentor Studio embed code above to preview the mentor.",
}: MentorEmbedPreviewProps) {
  if (!embedCode.trim()) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500 text-center">
        {emptyMessage}
      </div>
    );
  }

  return (
    <EmbedErrorBoundary>
      <div className="rounded-lg border border-gray-200 bg-white p-4 overflow-hidden">
        <div dangerouslySetInnerHTML={{ __html: embedCode }} />
      </div>
    </EmbedErrorBoundary>
  );
}
