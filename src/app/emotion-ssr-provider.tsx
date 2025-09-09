import * as React from "react";
import { useServerInsertedHTML } from "next/navigation";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

const cache = createCache({ key: "css", prepend: true });

export function EmotionSSRProvider({ children }: { children: React.ReactNode }) {
  useServerInsertedHTML(() => (
    <style
      data-emotion-css={cache.key}
      dangerouslySetInnerHTML={{ __html: Object.values(cache.inserted).join(" ") }}
    />
  ));
  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
