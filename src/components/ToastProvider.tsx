"use client";

import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <>
      <div className="sm:hidden">
        <Toaster position="top-right" richColors visibleToasts={1} expand />
      </div>

      {/* Desktop */}
      <div className="hidden sm:block">
        <Toaster position="bottom-right" richColors visibleToasts={1} expand />
      </div>
    </>
  );
}
