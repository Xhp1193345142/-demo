"use client";

export function NebulaBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-black">
      <iframe
        title="Nebula Background"
        src="/nebula/index.html"
        className="absolute inset-0 h-full w-full border-0"
        aria-hidden="true"
      />
      <div className="nebula-overlay absolute inset-0" />
    </div>
  );
}
