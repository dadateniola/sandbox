"use client";

// Types
import type { MobileGateProps } from "./types";

const MobileGate: React.FC<MobileGateProps> = ({ children }) => {
  const isMobile = false;

  if (isMobile) {
    return (
      <div className="w-full h-screen custom-flex-center">
        <p className="text-text-primary text-lg font-medium text-center leading-[110%]">
          This experience was designed for larger screens.
          <br />
          <br />
          I didn&apos;t have the strength to make the mobile version yet 🙂
          <br />
          <br />
          Please visit on a device wider than 1024px.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default MobileGate;
