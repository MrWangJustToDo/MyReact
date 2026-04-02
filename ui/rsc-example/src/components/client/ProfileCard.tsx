"use client";

import { useMemo, useState } from "@my-react/react";

type ProfileCardProps = {
  userId: string;
};

export default function ProfileCard({ userId }: ProfileCardProps) {
  const [count, setCount] = useState(0);
  const label = useMemo(() => `user-${userId}`, [userId]);

  return (
    <div>
      <p>Profile ID: {label}</p>
      <button onClick={() => setCount((c) => c + 1)} className="btn">
        Clicks: {count}
      </button>
    </div>
  );
}
