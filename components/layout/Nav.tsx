import Link from "next/link";
import { logout, logoutParticipant } from "@/lib/actions/auth";
import { getCurrentUser, getCurrentGuide } from "@/lib/auth/guide";
import { getCurrentParticipant } from "@/lib/auth/participant";

export async function Nav() {
  const user = await getCurrentUser();
  const guide = user ? await getCurrentGuide() : null;
  const participant = user ? await getCurrentParticipant() : null;

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

        <nav className="flex flex-wrap items-center justify-end gap-4 sm:gap-6">
          <Link
            href="/library"
            className="text-sm font-medium text-gray-600 hover:text-teal-700 transition-colors"
          >
            Library
          </Link>

          {user ? (
            <>
              {guide ? (
                <Link
                  href="/guide/tracks"
                  className="text-sm font-medium text-gray-600 hover:text-teal-700 transition-colors"
                >
                  Guide Dashboard
                </Link>
              ) : null}
              {participant ? (
                <Link
                  href="/my-tracks"
                  className="text-sm font-medium text-gray-600 hover:text-teal-700 transition-colors"
                >
                  My Tracks
                </Link>
              ) : null}
              {guide ? (
                <Link
                  href="/guide/profile"
                  className="text-sm font-medium text-gray-600 hover:text-teal-700 transition-colors"
                >
                  Guide Profile
                </Link>
              ) : null}
              <form action={guide ? logout : logoutParticipant}>
                <button
                  type="submit"
                  className="text-sm font-medium text-gray-600 hover:text-teal-700 transition-colors"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/participant/login"
                className="text-sm font-medium text-gray-600 hover:text-teal-700 transition-colors"
              >
                Participant Login
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-teal-700 transition-colors"
              >
                Guide Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
