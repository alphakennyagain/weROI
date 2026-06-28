"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Minus, Plus, Printer, X } from "lucide-react";
import ResumeContent from "./ResumeContent";
import { downloadResumePdf } from "@/lib/resumePdf";

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
}

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 1.4;
const ZOOM_STEP = 0.1;

export default function ResumeModal({ open, onClose }: ResumeModalProps) {
  const [zoom, setZoom] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) setZoom(1);
  }, [open]);

  const handlePrint = useCallback(() => {
    const node = contentRef.current?.querySelector(".resume-document");
    if (!node) return;
    const printWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en"><head>
        <meta charset="UTF-8" />
        <title>Zachary Hutton Resume</title>
        <style>
          body { margin: 0; font-family: Georgia, "Times New Roman", serif; color: #111; }
          a { color: #111; }
          strong { font-weight: 700; }
          .resume-section-title { font-size: 10.5pt; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid #222; margin: 0.7rem 0 0.35rem; padding-bottom: 0.12rem; }
          hr { border: none; border-top: 1px solid #ccc; margin: 1rem 0; }
          @media print { body { padding: 0.4in; } a { text-decoration: underline; } }
        </style>
      </head><body>${node.innerHTML}</body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }, []);

  const handleDownloadPdf = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadResumePdf();
    } catch {
      handlePrint();
    } finally {
      setDownloading(false);
    }
  }, [downloading, handlePrint]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Resume"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--color-slate)] bg-[var(--color-charcoal)] px-4 py-3 sm:px-6">
        <h2 className="text-sm font-medium text-[var(--color-paper)]">Resume</h2>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-slate)] text-[var(--color-pearl)] transition hover:border-[var(--color-paper)]"
            aria-label="Zoom out"
          >
            <Minus size={16} />
          </button>
          <span className="min-w-[3rem] text-center text-xs text-[var(--color-ash)]">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-slate)] text-[var(--color-pearl)] transition hover:border-[var(--color-paper)]"
            aria-label="Zoom in"
          >
            <Plus size={16} />
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="hidden h-9 items-center gap-1.5 rounded-full border border-[var(--color-slate)] px-3 text-xs text-[var(--color-pearl)] transition hover:border-[var(--color-paper)] sm:inline-flex"
          >
            <Printer size={14} />
            Print PDF
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="flex h-9 items-center gap-1.5 rounded-full border border-[var(--color-slate)] px-3 text-xs text-[var(--color-pearl)] transition hover:border-[var(--color-paper)] disabled:opacity-60"
          >
            <Download size={14} />
            <span className="hidden sm:inline">{downloading ? "Saving..." : "Download PDF"}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-slate)] text-[var(--color-pearl)] transition hover:border-[var(--color-paper)]"
            aria-label="Close resume"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-auto overscroll-contain touch-pan-y"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div
          className="mx-auto w-full max-w-4xl origin-top px-2 py-6 sm:px-4 sm:py-8"
          style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
        >
          <div ref={contentRef} className="shadow-2xl">
            <ResumeContent />
          </div>
        </div>
      </div>
    </div>
  );
}
