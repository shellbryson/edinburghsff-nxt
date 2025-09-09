"use client";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

export default function EmotionClientProvider({ children }: { children: React.ReactNode }) {
  const cache = createCache({ key: "css", prepend: true });
  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
