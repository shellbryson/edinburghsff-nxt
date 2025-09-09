"use client";
import NavBar from "./NavBar";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./mui-theme";
import createEmotionCache from "./emotion-cache";
import { CacheProvider } from "@emotion/react";

const clientSideEmotionCache = createEmotionCache();

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
