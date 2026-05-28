import Link from "next/link";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white text-sm font-bold">
            AT
          </span>
          <span className="text-lg font-semibold text-gray-900">
            Action Tracks
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/library"
            className="text-sm font-medium text-gray-600 hover:text-teal-700 transition-colors"
          >
            Library
          </Link>
          <Link
            href="/guide/tracks"
            className="text-sm font-medium text-gray-600 hover:text-teal-700 transition-colors"
          >
            Guide Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function PageContainer({
  children,
  className = "",
  wide = false,
}: {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <main
      className={`mx-auto flex-1 px-4 py-8 sm:px-6 ${wide ? "max-w-7xl" : "max-w-6xl"} ${className}`}
    >
      {children}
    </main>
  );
}
