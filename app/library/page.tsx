import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getCurrentUser } from "@/lib/auth/guide";

const PREVIEW_CATEGORIES = [
  { label: "Business & Marketing", icon: "📈" },
  { label: "Personal Growth", icon: "🌱" },
  { label: "Courses & Masterclasses", icon: "🎓" },
  { label: "Wellness & Lifestyle", icon: "🧘" },
  { label: "Creativity & Writing", icon: "✍️" },
  { label: "Leadership & Community", icon: "🤝" },
] as const;

export default async function LibraryPage() {
  const user = await getCurrentUser();

  return (
    <PageContainer className="max-w-4xl">
      <Card
        padding="lg"
        className="mx-auto text-center bg-gradient-to-br from-white to-gray-50 shadow-md border-gray-200"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-3xl shadow-sm">
          📚
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Action Tracks Library Coming Soon
        </h1>

        <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Soon this library will feature guided Action Tracks from approved
          guides across business, creativity, personal growth, wellness,
          leadership, and more.
        </p>

        <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto">
          Each Action Track will walk participants through a focused journey
          with stages, live calls, resources, AI mentor support, reflection, and
          accountability to help them create a real result.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
          {PREVIEW_CATEGORIES.map((category) => (
            <div
              key={category.label}
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
            >
              <span className="text-xl" aria-hidden>
                {category.icon}
              </span>
              <span className="text-sm font-medium text-gray-800">
                {category.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-gray-100">
          {user ? (
            <Button href="/guide/tracks" variant="primary" size="lg">
              Go to Guide Dashboard
            </Button>
          ) : (
            <Button href="/login" variant="primary" size="lg">
              Guide Login
            </Button>
          )}
        </div>
      </Card>
    </PageContainer>
  );
}
