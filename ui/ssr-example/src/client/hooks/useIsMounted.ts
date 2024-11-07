import { useState, useEffect, startTransition } from "react";

export const useIsMounted = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    })
  }, []);

  return mounted;
};
