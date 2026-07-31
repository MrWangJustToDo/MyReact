"use client";

import { useMemo, useState } from "@my-react/react";

type ProfileCardProps = {
  userId: string;
};

export default function ProfileCard({ userId }: ProfileCardProps) {
  const [count, setCount] = useState(0);
  const label = useMemo(() => `user-${userId}`, [userId]);

  return (
    <div className="widget">
      <p className="widget-label">Client island</p>
      <p className="widget-value">{label}</p>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Clicks: {count}
      </button>
    </div>
  );
}
