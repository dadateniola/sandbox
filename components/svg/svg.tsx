import React from "react";

// Types
import type { SVGProps } from "./types";

// SVGs
export const ArrowDown: React.FC<SVGProps> = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="88"
    viewBox="0 0 20 88"
    fill="none"
  >
    <g clipPath="url(#clip0_1_688)">
      <path
        d="M20 78L18.607 76.57L11 84.15L11 0L9 0L9 84.15L1.427 76.57L0 78L10 88L20 78Z"
        fill="#DB574D"
      />
    </g>

    <defs>
      <clipPath id="clip0_1_688">
        <rect
          width="88"
          height="20"
          fill="white"
          transform="matrix(0 1 -1 0 20 0)"
        />
      </clipPath>
    </defs>
  </svg>
);

export const ArrowDownLong: React.FC<SVGProps> = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="164"
    viewBox="0 0 20 164"
    fill="none"
  >
    <g clipPath="url(#clip0_1_384)">
      <path
        d="M20 154L18.607 152.57L11 160.15L11 0L9 0L9 160.15L1.427 152.57L0 154L10 164L20 154Z"
        fill="#DB574D"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_384">
        <rect
          width="164"
          height="20"
          fill="white"
          transform="matrix(0 1 -1 0 20 0)"
        />
      </clipPath>
    </defs>
  </svg>
);

export const ArrowTopRight: React.FC<SVGProps> = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
  >
    <path d="M4.94922 15.91L15.5558 5.30338" stroke="#DB574D" />
    <path d="M6.00977 4.94978H15.9093V14.8493" stroke="#DB574D" />
  </svg>
);

export const ArrowRight: React.FC<SVGProps> = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="15"
    viewBox="0 0 32 15"
    fill="none"
  >
    <path d="M0 7.35352H30" stroke="#101010" />
    <path d="M23.5 0.353516L30.5 7.35352L23.5 14.3535" stroke="#101010" />
  </svg>
);
