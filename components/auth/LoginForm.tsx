"use client";

import { login } from "@/lib/actions/auth";
import { AccessPendingCard } from "@/components/auth/AccessPendingCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { useState, useTransition } from "react";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleSubmit(formData: FormData) {
    setError(null);
    setPending(false);

    startTransition(async () => {
      const result = await login(formData);
      if (result?.pending) {
        setPending(true);
        return;
      }
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  if (pending) {
    return <AccessPendingCard />;
  }

  return (
    <Card padding="lg" className="max-w-md mx-auto">
      <form action={handleSubmit} className="space-y-5">
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
          autoComplete="current-password"
          required
        />

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" className="w-full" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </Button>
      </form>
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
