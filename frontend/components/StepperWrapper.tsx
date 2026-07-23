"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import ProgressStepper from "./ProgressStepper";

export default function StepperWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showStepper = pathname !== "/";

  return (
    <div className="pt-[56px]">
      {showStepper && <ProgressStepper />}
      {children}
    </div>
  );
}
