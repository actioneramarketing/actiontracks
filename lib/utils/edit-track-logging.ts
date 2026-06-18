const ROUTE = "/guide/tracks/[trackId]/edit";

export type EditTrackStep =
  | "reading params"
  | "loading track"
  | "normalizing track"
  | "rendering form data"
  | "loading related data";

interface LogEditTrackErrorOptions {
  trackId: string;
  step: EditTrackStep;
  error: unknown;
  supabase?: {
    message?: string;
    code?: string;
    details?: string;
    hint?: string;
  };
}

export function logEditTrackError({
  trackId,
  step,
  error,
  supabase,
}: LogEditTrackErrorOptions): void {
  const payload: Record<string, unknown> = {
    route: ROUTE,
    trackId,
    step,
  };

  if (supabase) {
    payload.supabase = supabase;
  }

  if (error instanceof Error) {
    payload.message = error.message;
    payload.stack = error.stack;
  } else if (error != null) {
    payload.message = String(error);
  }

  console.error("[EditTrackPage] Server render error", payload);
}
