"use client";

import { registerGuide } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { useState, useTransition } from "react";

export function RegisterGuideForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

  function handleSubmit(formData: FormData) {
    setError(null);
    setNeedsEmailConfirmation(false);

    startTransition(async () => {
      const result = await registerGuide(formData);
      if (result?.needsEmailConfirmation) {
        setNeedsEmailConfirmation(true);
        return;
      }
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  if (needsEmailConfirmation) {
    return (
      <Card padding="lg" className="max-w-md mx-auto text-center">
        <h2 className="text-lg font-semibold text-gray-900">Check your email</h2>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
          Check your email to confirm your account. Once confirmed, you can log
          in and complete your guide profile.
        </p>
        <Button href="/login" variant="primary" className="mt-6">
          Go to Login
        </Button>
      </Card>
    );
  }

  return (
    <Card padding="lg" className="max-w-md mx-auto">
      <form action={handleSubmit} className="space-y-5">
        <FormField
          label="Full Name"
          name="full_name"
          type="text"
          autoComplete="name"
          required
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
        <FormField
          label="Confirm Password"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          required
        />

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" className="w-full" disabled={isPending}>
          {isPending ? "Creating account..." : "Create Guide Account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-teal-700 hover:underline">
          Log in
        </Link>
      </p>
    </Card>
  );
}

function FormField({
  label,
  name,
  type,
  autoComplete,
  required,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        required={required}
        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
      />
    </div>
  );
}
