import Link from "next/link";
import { headers } from "next/headers";

export default async function PagesList() {
  const hdrs = await headers();
  const host = hdrs.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const res = await fetch(`${protocol}://${host}/api/pages`, { cache: "no-store" });
  const pages = await res.json();
  return (
    <main style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h1>Pages</h1>
      <ul>
        {pages.map((page: any) => (
          <li key={page.id}>
            <Link href={`/page/${page.slug}`}>{page.title || page.slug}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
