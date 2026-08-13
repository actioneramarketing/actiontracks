"use server";

import { upsertGuideForUser, resolveGuideForUser } from "@/lib/actions/guides";
import {
  ensureParticipantForUser,
  upsertParticipantForUser,
} from "@/lib/actions/participants";
import { createClient } from "@/lib/supabase/server";
import { getSafeReturnPath } from "@/lib/utils/safe-return-path";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function getRequestOrigin(): Promise<string | null> {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  if (!host) {
    return null;
  }
  const proto = headerStore.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

function metadataFullName(user: { user_metadata?: Record<string, unknown> }): string | undefined {
  const value = user.user_metadata?.full_name;
  return typeof value === "string" ? value : undefined;
}

export async function registerGuide(
  formData: FormData
): Promise<{ error?: string; needsEmailConfirmation?: boolean }> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  if (!fullName) {
    return { error: "Full name is required." };
  }

  if (!email) {
    return { error: "Email is required." };
  }

  if (!password) {
    return { error: "Password is required." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: "Authentication is not configured." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });

  if (error) {
    console.error("[registerGuide] Supabase signUp failed", {
      message: error.message,
    });
    return { error: error.message };
  }

  const user = data.user;
  if (!user) {
    return { error: "Registration failed. Please try again." };
  }

  try {
    await upsertGuideForUser({
      userId: user.id,
      email,
      fullName,
    });
  } catch (guideError) {
    console.error("[registerGuide] Guide profile setup failed", {
      userId: user.id,
      error: guideError,
    });
    return {
      error:
        "Your account was created but the guide profile could not be set up. Please contact support.",
    };
  }

  revalidatePath("/guide/profile");

  if (data.session) {
    redirect("/guide/profile");
  }

  return { needsEmailConfirmation: true };
}

export async function login(
  formData: FormData
): Promise<{ error?: string; pending?: boolean }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: "Authentication is not configured." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("[login] Supabase signIn failed", {
      message: error.message,
    });
    return { error: error.message };
  }

  const user = data.user;
  if (!user?.email) {
    return { error: "Login failed. Please try again." };
  }

  const guide = await resolveGuideForUser(user.id, user.email);

  if (!guide) {
    redirect("/guide/profile");
  }

  if (guide.status && guide.status !== "approved") {
    return { pending: true };
  }

  redirect("/guide/tracks");
}

export async function logout() {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

export async function registerParticipant(
  formData: FormData
): Promise<{ error?: string; needsEmailConfirmation?: boolean }> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  if (!fullName) {
    return { error: "Full name is required." };
  }

  if (!email) {
    return { error: "Email is required." };
  }

  if (!password) {
    return { error: "Password is required." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: "Authentication is not configured." };
  }

  const origin = await getRequestOrigin();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: origin
        ? `${origin}/auth/callback?next=${encodeURIComponent("/my-tracks")}`
        : undefined,
    },
  });

  if (error) {
    console.error("[registerParticipant] Supabase signUp failed", {
      message: error.message,
    });
    return { error: error.message };
  }

  const user = data.user;
  if (!user) {
    return { error: "Registration failed. Please try again." };
  }

  try {
    await upsertParticipantForUser({
      userId: user.id,
      email,
      fullName,
    });
  } catch (participantError) {
    console.error("[registerParticipant] Participant profile setup failed", {
      userId: user.id,
      error: participantError,
    });
    return {
      error:
        "Your account was created but the participant profile could not be set up. Please contact support.",
    };
  }

  revalidatePath("/my-tracks");

  if (data.session) {
    redirect("/my-tracks");
  }

  return { needsEmailConfirmation: true };
}

export async function loginParticipant(
  formData: FormData
): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: "Authentication is not configured." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("[loginParticipant] Supabase signIn failed", {
      message: error.message,
    });
    return { error: error.message };
  }

  const user = data.user;
  if (!user?.email) {
    return { error: "Login failed. Please try again." };
  }

  try {
    await ensureParticipantForUser(
      user.id,
      user.email,
      metadataFullName(user)
    );
  } catch (participantError) {
    console.error("[loginParticipant] Participant profile setup failed", {
      userId: user.id,
      error: participantError,
    });
    return {
      error:
        "You were signed in but the participant profile could not be set up. Please contact support.",
    };
  }

  revalidatePath("/my-tracks");
  const returnTo = getSafeReturnPath(String(formData.get("return_to") ?? "").trim());
  redirect(returnTo || "/my-tracks");
}

export async function logoutParticipant() {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirect("/participant/login");
}
