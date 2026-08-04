"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

interface HeaderSlotContextValue {
  slotEl: HTMLElement | null;
  setSlotEl: (el: HTMLElement | null) => void;
}

const HeaderSlotContext = React.createContext<HeaderSlotContextValue | null>(null);

export function HeaderSlotProvider({ children }: { children: React.ReactNode }) {
  const [slotEl, setSlotEl] = React.useState<HTMLElement | null>(null);
  const value = React.useMemo(() => ({ slotEl, setSlotEl }), [slotEl]);

  return <HeaderSlotContext.Provider value={value}>{children}</HeaderSlotContext.Provider>;
}

function useHeaderSlotContext() {
  const context = React.useContext(HeaderSlotContext);
  if (!context) {
    throw new Error("Header slot components must be used within HeaderSlotProvider");
  }
  return context;
}

/** Mount point in the sticky app header. Pages portal content here. */
export function HeaderSlot({ className }: { className?: string }) {
  const { setSlotEl } = useHeaderSlotContext();

  return <div ref={setSlotEl} className={cn("min-w-0", className)} />;
}

/** Renders children into the sticky app header for the lifetime of this tree. */
export function HeaderSlotContent({ children }: { children: React.ReactNode }) {
  const { slotEl } = useHeaderSlotContext();
  if (!slotEl) return null;
  return createPortal(children, slotEl);
}
