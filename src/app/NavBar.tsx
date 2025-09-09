"use client";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import Box from "@mui/material/Box";

export default function NavBar() {
  return (
    <AppBar position="fixed" color="primary" sx={{ zIndex: 1201 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <img src="/logo.svg" alt="Logo" style={{ height: 32, marginLeft: 4, marginRight: 8 }} />
          </Link>
        </Box>
        <Link href="/pages" style={{ color: "inherit", textDecoration: "none", fontWeight: 500, fontSize: "1rem" }}>
          Pages
        </Link>
      </Toolbar>
    </AppBar>
  );
}
