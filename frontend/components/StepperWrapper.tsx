"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import ProgressStepper from "./ProgressStepper";

export default function StepperWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showStepper = pathname !== "/";

  return (
    <div className="mt-6">
      {showStepper && <ProgressStepper />}
      {children}
    </div>
  );
}
