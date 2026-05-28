"use client";

import { PageContainer } from "@/components/layout/Nav";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { completionStats, demoTrack } from "@/lib/demo-data";
import { useState } from "react";

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card padding="none" className="overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        <span className="text-gray-400">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="border-t border-gray-100 px-5 pb-5 pt-4">{children}</div>
      )}
    </Card>
  );
}

export default function CompletePage() {
  return (
    <PageContainer wide>
      <Card
        padding="lg"
        className="mb-8 bg-gradient-to-r from-violet-600 to-teal-600 text-white border-0 text-center"
      >
        <Badge variant="purple" className="mb-4 bg-white/20 text-white ring-white/30">
          Final Stage Complete
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-bold">
          Congratulations — You Did It!
        </h1>
        <p className="mt-3 text-lg text-white/90 max-w-2xl mx-auto">
          You&apos;ve completed all {demoTrack.durationWeeks} weeks and every stage
          of {demoTrack.title}.
        </p>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {completionStats.map((stat) => (
          <Card key={stat.label} className="text-center">
            <p className="text-2xl font-bold text-teal-700">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Review What You&apos;ve Built
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: "Podcast Concept", desc: "Niche defined, audience mapped" },
              { title: "3 Episodes", desc: "Recorded, edited, and polished" },
              { title: "Launch Plan", desc: "Distribution and promotion ready" },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg bg-gray-50 p-4 ring-1 ring-gray-200"
              >
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Submit Your Work for Review
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Share your live podcast link and a brief reflection on your journey
            for final guide approval.
          </p>
          <div className="space-y-3">
            <input
              placeholder="https://your-podcast-link.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
              readOnly
            />
            <textarea
              placeholder="Share your biggest takeaway from this journey..."
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
              readOnly
            />
            <Button disabled className="opacity-60 cursor-not-allowed">
              Submit for Review
            </Button>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
          <div className="flex items-start gap-4">
            <span className="text-4xl">🏆</span>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                Activate Your Reward
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Unlock your Podcast Launch Certificate and exclusive alumni
                community access upon submission approval.
              </p>
              <Button
                variant="accent"
                size="sm"
                className="mt-4"
                disabled
              >
                Activate Reward
              </Button>
            </div>
          </div>
        </Card>

        <CollapsibleSection title="Track Feed" icon="💬">
          <p className="text-sm text-gray-600">
            Share your launch story with fellow participants and celebrate your
            achievement together.
          </p>
        </CollapsibleSection>

        <CollapsibleSection title="Reflect on Your Experience" icon="📝">
          <p className="text-sm text-gray-600">
            Take a moment to journal about your growth, challenges overcome, and
            what you&apos;ll do next.
          </p>
        </CollapsibleSection>

        <Card className="opacity-75">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl grayscale">
              🎖️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">Achievement Badge</h3>
                <Badge variant="default">Locked</Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Complete your submission to unlock the Podcast Launch Champion badge.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
