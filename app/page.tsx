import { PageContainer } from "@/components/layout/Nav";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <PageContainer>
      <section className="py-12 sm:py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700 ring-1 ring-teal-200 mb-6">
            Guided Implementation Journeys
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Turn big goals into{" "}
            <span className="text-teal-600">Action Tracks</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            Action Tracks is a guided implementation journey platform where
            guides create structured experiences with stages, support elements,
            and accountability — helping participants move forward one stage at
            a time.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/library" size="lg">
              View Action Tracks Library
            </Button>
            <Button href="/guide/tracks" variant="accent" size="lg">
              Guide Dashboard
            </Button>
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-6 mt-8 pb-12">
        {[
          {
            title: "Structured Stages",
            desc: "Break complex goals into clear, achievable stages with defined outcomes.",
            icon: "🗺️",
          },
          {
            title: "Support Elements",
            desc: "Live calls, AI mentors, task lists, and more — configured per stage.",
            icon: "🧩",
          },
          {
            title: "Guided Progress",
            desc: "Participants move through the journey with accountability and community.",
            icon: "🚀",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 text-center"
          >
            <span className="text-3xl">{item.icon}</span>
            <h3 className="mt-3 font-semibold text-gray-900">{item.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </section>
    </PageContainer>
  );
}
