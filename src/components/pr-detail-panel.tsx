"use client";

import { useState, useTransition } from "react";
import {
  generateImpactSummary,
  generateResumeBullet,
  updateImpactSummary,
  updateResumeBullet,
} from "@/app/actions";

type PR = {
  id: string;
  number: number;
  title: string;
  url: string;
  mergedAt: string | null;
  linesAdded: number;
  linesDeleted: number;
  category: string;
  achievementType: string;
  summary: string | null;
  impactSummary: string | null;
  resumeBullet: string | null;
  repository: { fullName: string };
};

export function PRDetailPanel({
  pr,
  onClose,
}: {
  pr: PR;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Panel */}
      <div className="relative w-full max-w-lg overflow-y-auto border-l border-[var(--color-border-default)] bg-[var(--color-canvas-default)]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[var(--color-border-muted)] bg-[var(--color-canvas-default)] px-6 py-4">
          <div className="min-w-0">
            <a
              href={pr.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--color-fg-default)] hover:text-[var(--color-accent-fg)]"
            >
              {pr.title}
            </a>
            <div className="mt-1 flex items-center gap-2 text-xs text-[var(--color-fg-muted)]">
              <span className="font-mono">{pr.repository.fullName}</span>
              <span>#{pr.number}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 cursor-pointer rounded p-1 text-[var(--color-fg-muted)] hover:bg-[var(--color-canvas-subtle)] hover:text-[var(--color-fg-default)]"
            aria-label="Close panel"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <MetaItem label="Category" value={pr.category} />
            <MetaItem label="Type" value={pr.achievementType} />
            <MetaItem
              label="Lines added"
              value={`+${pr.linesAdded.toLocaleString()}`}
              className="text-[var(--color-success-fg)]"
            />
            <MetaItem
              label="Lines deleted"
              value={`-${pr.linesDeleted.toLocaleString()}`}
              className="text-[var(--color-danger-fg)]"
            />
            <MetaItem
              label="Merged"
              value={
                pr.mergedAt
                  ? new Date(pr.mergedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"
              }
            />
          </div>

          {/* PR Summary */}
          {pr.summary && (
            <div>
              <SectionLabel>PR Summary</SectionLabel>
              <p className="text-sm text-[var(--color-fg-muted)]">
                {pr.summary}
              </p>
            </div>
          )}

          {/* Impact Summary */}
          <GeneratedField
            label="Impact Summary"
            value={pr.impactSummary}
            prId={pr.id}
            onGenerate={generateImpactSummary}
            onSave={updateImpactSummary}
          />

          {/* Resume Bullet */}
          <GeneratedField
            label="Resume Bullet"
            value={pr.resumeBullet}
            prId={pr.id}
            onGenerate={generateResumeBullet}
            onSave={updateResumeBullet}
          />
        </div>
      </div>
    </div>
  );
}

function GeneratedField({
  label,
  value,
  prId,
  onGenerate,
  onSave,
}: {
  label: string;
  value: string | null;
  prId: string;
  onGenerate: (id: string) => Promise<string>;
  onSave: (id: string, text: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    startTransition(async () => {
      const result = await onGenerate(prId);
      setDraft(result);
    });
  }

  function handleSave() {
    startTransition(async () => {
      await onSave(prId, draft);
      setEditing(false);
    });
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <SectionLabel>{label}</SectionLabel>
        <div className="flex gap-2">
          {value && !editing && (
            <SmallButton onClick={() => { setDraft(value); setEditing(true); }}>
              Edit
            </SmallButton>
          )}
          <SmallButton onClick={handleGenerate} disabled={isPending}>
            {isPending ? "Generating..." : value ? "Regenerate" : "Generate"}
          </SmallButton>
        </div>
      </div>

      {editing ? (
        <div className="space-y-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            className="w-full resize-y rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-inset)] px-3 py-2 text-sm text-[var(--color-fg-default)] focus:border-[var(--color-accent-fg)] focus:outline-2 focus:outline-[var(--color-accent-fg)]"
          />
          <div className="flex gap-2">
            <SmallButton onClick={handleSave} disabled={isPending}>
              Save
            </SmallButton>
            <SmallButton onClick={() => setEditing(false)}>Cancel</SmallButton>
          </div>
        </div>
      ) : value ? (
        <p className="text-sm text-[var(--color-fg-muted)]">{value}</p>
      ) : (
        <p className="text-xs italic text-[var(--color-fg-subtle)]">
          Not generated yet
        </p>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--color-fg-subtle)]">
      {children}
    </h3>
  );
}

function MetaItem({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div>
      <div className="text-xs text-[var(--color-fg-subtle)]">{label}</div>
      <div className={`text-sm font-medium ${className ?? ""}`}>{value}</div>
    </div>
  );
}

function SmallButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="cursor-pointer rounded border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-2 py-1 text-xs text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-border-muted)] hover:text-[var(--color-fg-default)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}
