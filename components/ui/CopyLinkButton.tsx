"use client";

import { Button } from "@/components/ui/Button";
import { useState } from "react";

interface CopyLinkButtonProps {
  value: string;
  label: string;
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function CopyLinkButton({
  value,
  label,
  variant = "secondary",
  size = "sm",
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.error("[CopyLinkButton] Clipboard write failed", { error });
    }
  }

  return (
    <Button type="button" variant={variant} size={size} onClick={handleCopy}>
      {copied ? "Copied!" : label}
    </Button>
  );
}
