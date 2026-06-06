"use client";

import { PageMobile } from "@/components/global/components";

export const MobileGate = ({
  isMobile,
  children,
}: {
  isMobile: boolean;
  children: React.ReactNode;
}) => {
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-9 bg-background">
        <PageMobile />
      </div>
    );
  }

  return <>{children}</>;
};
