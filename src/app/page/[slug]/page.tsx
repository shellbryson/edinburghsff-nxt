import { notFound } from "next/navigation";
import React from "react";
import ReactMarkdown from "react-markdown";
import { headers } from "next/headers";

export default async function Page({ params }: { params: { slug: string } }) {
  const hdrs = await headers();
  const host = hdrs.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const res = await fetch(`${protocol}://${host}/api/page/${params.slug}`, { cache: "no-store" });
  if (!res.ok) return notFound();
  const page = await res.json();
  return (
    <main style={{ maxWidth: 700, margin: "2rem auto" }}>
      <h1>{page.title || page.slug}</h1>
      <ReactMarkdown>{page.content || ""}</ReactMarkdown>
    </main>
  );
}
