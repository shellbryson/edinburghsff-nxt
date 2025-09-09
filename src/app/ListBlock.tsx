import React from "react";

export default function ListBlock({ list }: { list: any }) {
  if (!list || !list.items || !Array.isArray(list.items)) return null;
  return (
    <section style={{ margin: "2rem 0" }}>
      <h2>{list.title || "List"}</h2>
      <ul>
        {list.items.map((item: any, idx: number) => (
          <li key={idx}>{item.name || item.title || item}</li>
        ))}
      </ul>
    </section>
  );
}
