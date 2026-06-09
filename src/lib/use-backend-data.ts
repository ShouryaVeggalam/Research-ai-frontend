"use client";

import { useEffect, useState } from "react";

/**
 * Fetch backend data on mount; keep `fallback` when the API is empty or unreachable.
 */
export function useBackendData<T>(
  fetcher: () => Promise<T | null>,
  fallback: T,
  isEmpty: (data: T) => boolean = (d) => (Array.isArray(d) ? d.length === 0 : false),
): T {
  const [data, setData] = useState<T>(fallback);

  useEffect(() => {
    let active = true;
    fetcher()
      .then((live) => {
        if (active && live != null && !isEmpty(live)) setData(live);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
    // fetcher identity is intentionally stable per page (inline arrow in caller)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return data;
}
