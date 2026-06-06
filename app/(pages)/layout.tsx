"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { TransitionProvider } from "@/transition/engine/TransitionProvider";

const SlugLayout = () => {
  const pathname = usePathname();

  return (
    <TransitionProvider pathname={pathname}>
      <AppShell />
    </TransitionProvider>
  );
};

export default SlugLayout;
