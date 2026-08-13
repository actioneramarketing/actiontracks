"use server";

import {
  createAdminClient,
  tryCreateAdminClient,
} from "@/lib/supabase/admin";
import { ActionTrackParticipant } from "@/lib/types/database";
import { normalizeParticipant } from "@/lib/utils/normalize-participant";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function requireParticipantRow(
  raw: unknown,
  context: string
): ActionTrackParticipant {
  const participant = normalizeParticipant(raw);
  if (!participant) {
    throw new Error(`Participant profile could not be read after ${context}.`);
  }
  return participant;
}

export async function getParticipantByUserId(
  userId: string
): Promise<ActionTrackParticipant | null> {
  const supabase = tryCreateAdminClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("action_track_participants")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[getParticipantByUserId] Supabase query failed", {
      userId,
      message: error.message,
      code: error.code,
    });
    return null;
  }

  return normalizeParticipant(data);
}

export async function getParticipantByEmail(
  email: string
): Promise<ActionTrackParticipant | null> {
  const supabase = tryCreateAdminClient();
  if (!supabase) {
    return null;
  }

  const normalizedEmail = normalizeEmail(email);

  const { data, error } = await supabase
    .from("action_track_participants")
    .select("*")
    .ilike("email", normalizedEmail)
    .maybeSingle();

  if (error) {
    console.error("[getParticipantByEmail] Supabase query failed", {
      message: error.message,
      code: error.code,
    });
    return null;
  }

  return normalizeParticipant(data);
}

async function updateParticipantRow(
  participantId: string,
  updates: Record<string, unknown>
): Promise<ActionTrackParticipant> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("action_track_participants")
    .update(updates)
    .eq("id", participantId)
    .select("*")
    .single();

  if (error) {
    console.error("[updateParticipantRow] Supabase update failed", {
      participantId,
      message: error.message,
      code: error.code,
    });
    throw new Error(error.message);
  }

  return requireParticipantRow(data, "update");
}

async function insertParticipantRow(params: {
  userId: string;
  email: string;
  fullName?: string;
}): Promise<ActionTrackParticipant> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("action_track_participants")
    .insert({
      user_id: params.userId,
      email: normalizeEmail(params.email),
      full_name: params.fullName?.trim() || null,
      status: "active",
    })
    .select("*")
    .single();

  if (error) {
    console.error("[insertParticipantRow] Supabase insert failed", {
      userId: params.userId,
      message: error.message,
      code: error.code,
    });
    throw new Error(error.message);
  }

  return requireParticipantRow(data, "creation");
}

export async function upsertParticipantForUser(params: {
  userId: string;
  email: string;
  fullName?: string;
}): Promise<ActionTrackParticipant> {
  const normalizedEmail = normalizeEmail(params.email);
  const fullName = params.fullName?.trim() || "";
  const now = new Date().toISOString();

  const existingByUserId = await getParticipantByUserId(params.userId);
  if (existingByUserId) {
    const updates: Record<string, unknown> = {
      email: normalizedEmail,
      updated_at: now,
    };

    if (fullName) {
      updates.full_name = fullName;
    }

    if (!existingByUserId.status) {
      updates.status = "active";
    }

    return updateParticipantRow(existingByUserId.id, updates);
  }

  const existingByEmail = await getParticipantByEmail(normalizedEmail);
  if (existingByEmail) {
    const updates: Record<string, unknown> = {
      user_id: params.userId,
      email: normalizedEmail,
      updated_at: now,
    };

    if (fullName) {
      updates.full_name = fullName;
    }

    if (!existingByEmail.status) {
      updates.status = "active";
    }

    return updateParticipantRow(existingByEmail.id, updates);
  }

  return insertParticipantRow({
    userId: params.userId,
    email: normalizedEmail,
    fullName,
  });
}

export async function resolveParticipantForUser(
  userId: string,
  email: string
): Promise<ActionTrackParticipant | null> {
  const byUserId = await getParticipantByUserId(userId);
  if (byUserId) {
    return byUserId;
  }

  const byEmail = await getParticipantByEmail(email);
  if (!byEmail) {
    return null;
  }

  try {
    return await updateParticipantRow(byEmail.id, {
      user_id: userId,
      email: normalizeEmail(email),
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[resolveParticipantForUser] Link by email failed", {
      participantId: byEmail.id,
      userId,
      error,
    });
    return byEmail;
  }
}

export async function ensureParticipantForUser(
  userId: string,
  email: string,
  fullName?: string
): Promise<ActionTrackParticipant> {
  const existing = await resolveParticipantForUser(userId, email);
  if (existing) {
    if (fullName?.trim() && !existing.full_name.trim()) {
      return updateParticipantRow(existing.id, {
        full_name: fullName.trim(),
        updated_at: new Date().toISOString(),
      });
    }
    return existing;
  }

  return insertParticipantRow({ userId, email, fullName });
}
