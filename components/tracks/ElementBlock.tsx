"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ElementBlockProps {
  name: string;
  description: string;
  icon?: string;
  enabled?: boolean;
  children?: React.ReactNode;
}

export function ElementBlock({
  name,
  description,
  icon = "📦",
  enabled = true,
  children,
}: ElementBlockProps) {
  const [open, setOpen] = useState(enabled);

  return (
    <div
      className={cn(
        "rounded-xl border bg-white transition-shadow",
        open ? "border-teal-200 shadow-sm" : "border-gray-200"
      )}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <span className="text-xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-900">{name}</h4>
            {enabled && (
              <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs text-teal-700">
                Enabled
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        </div>
        <span className="text-gray-400 text-lg">{open ? "−" : "+"}</span>
      </button>

      {open && children && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

export function ElementConfigField({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          placeholder={placeholder}
          rows={2}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          readOnly
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          readOnly
        />
      )}
    </div>
  );
}
