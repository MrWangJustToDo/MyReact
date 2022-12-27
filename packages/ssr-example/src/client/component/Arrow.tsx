import { memo } from "react";

const _Arrow = ({ className }: { className: string }) => {
  return (
    <svg className={className} width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 7L7 1L13 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const Arrow = memo(_Arrow);
