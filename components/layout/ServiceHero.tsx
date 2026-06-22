import type { ReactNode } from "react";

/**
 * Shared dark hero for the service pages — ports the static site's
 * aurora-orb + noise background and the rotating conic-gradient ring around
 * the icon badge. No client APIs, so it works inside both server and client
 * page components.
 */
export default function ServiceHero({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <section
      className="relative overflow-hidden px-4 pb-16 pt-28 text-center sm:pt-36"
      style={{ backgroundColor: "#070B14" }}
    >
      {/* Aurora background */}
      <div
        aria-hidden
        className="aurora-orb aurora-float-1"
        style={{
          top: "-5rem",
          left: "-4rem",
          width: "22rem",
          height: "22rem",
          background:
            "radial-gradient(circle, rgba(5,150,105,0.35), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="aurora-orb aurora-float-2"
        style={{
          bottom: "-6rem",
          right: "-3rem",
          width: "24rem",
          height: "24rem",
          background:
            "radial-gradient(circle, rgba(16,185,129,0.25), transparent 70%)",
        }}
      />
      <div aria-hidden className="noise-overlay" />

      <div className="relative mx-auto max-w-3xl">
        <div className="ring-wrap mx-auto mb-6 h-20 w-20">
          <div className="ring-inner grid h-full w-full place-items-center text-emerald-light">
            {icon}
          </div>
        </div>
        <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-xl text-slate-300">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
