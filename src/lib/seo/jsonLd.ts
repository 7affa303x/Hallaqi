/** Compact JSON-LD serialization (#169). */
export function minifyJsonLd(data: unknown): string {
  return JSON.stringify(data);
}

export function upsertJsonLdScript(id: string, data: unknown): () => void {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.text = minifyJsonLd(data);
  document.head.appendChild(script);
  return () => {
    document.getElementById(id)?.remove();
  };
}
