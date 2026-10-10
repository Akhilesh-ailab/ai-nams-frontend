import { memo } from "react";
import type { ReactElement, SVGProps } from "react";

function VialIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M9 3h6" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 3v6.5L5.6 17a3 3 0 002.6 4.5h7.6a3 3 0 002.6-4.5L14 9.5V3" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6.5 15h11" strokeWidth="1.5" />
      <rect x="7" y="15" width="10" height="5.2" rx="2" fill="currentColor" opacity="0.4" stroke="none" />
    </svg>
  );
}
function DropperBottleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M10 2h4v3l1.5 2.5v11a2 2 0 01-2 2h-3a2 2 0 01-2-2v-11L10 5V2z" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 12h6" strokeWidth="1.5" />
      <rect x="9" y="12" width="6" height="7" rx="1.5" fill="currentColor" opacity="0.35" stroke="none" />
    </svg>
  );
}
function MicroscopeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M9 21h9M12 21v-4M8 17h6a1 1 0 001-1v-1a3 3 0 00-3-3H9a2 2 0 01-2-2c0-1.5 1-2.5 2-3.5" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="5" r="2" strokeWidth="1.5" />
      <path d="M7 21h6" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function MonitorChartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="4" width="18" height="12" rx="1.5" strokeWidth="1.5" />
      <path d="M9 20h6M12 16v4" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5.5 12l3-4 2.5 3 3-5 4 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 2l8 3v6c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11V5l8-3z" strokeWidth="1.5" />
      <path d="M9 12l2 2 4-4" strokeWidth="1.5" />
    </svg>
  );
}
function CapsuleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="2.5" y="9.5" width="19" height="7" rx="3.5" transform="rotate(-30 12 13)" strokeWidth="1.5" />
      <path d="M9.3 7.6L14.7 18.4" strokeWidth="1.5" />
    </svg>
  );
}

interface FloatingItem {
  Icon: (props: SVGProps<SVGSVGElement>) => ReactElement;
  position: string;
  size: number;
  animClass: string;
  delay: string;
  color: string;
}

const items: FloatingItem[] = [
  { Icon: VialIcon, position: "top-[10%] left-[8%]", size: 48, animClass: "animate-[float-a_10s_ease-in-out_infinite]", delay: "0s", color: "text-rose-500" },
  { Icon: ShieldIcon, position: "top-[62%] left-[10%]", size: 56, animClass: "animate-[float-b_13s_ease-in-out_infinite]", delay: "0.4s", color: "text-indigo-600" },
  { Icon: MicroscopeIcon, position: "top-[18%] left-[76%]", size: 62, animClass: "animate-[float-c_11s_ease-in-out_infinite]", delay: "0.8s", color: "text-indigo-500" },
  { Icon: DropperBottleIcon, position: "top-[74%] left-[68%]", size: 50, animClass: "animate-[float-a_12s_ease-in-out_infinite]", delay: "1.2s", color: "text-sky-500" },
  { Icon: MonitorChartIcon, position: "top-[42%] left-[42%]", size: 58, animClass: "animate-[float-b_14s_ease-in-out_infinite]", delay: "0.6s", color: "text-teal-500" },
  { Icon: CapsuleIcon, position: "top-[85%] left-[28%]", size: 42, animClass: "animate-[float-c_9s_ease-in-out_infinite]", delay: "1s", color: "text-violet-500" },
];

interface FloatingBackgroundProps {
  /** "vivid" — visible colored icons for the light brand panel. "subtle" — near-invisible texture for app pages. */
  variant?: "vivid" | "subtle";
}

const FloatingBackground = memo(function FloatingBackground({ variant = "subtle" }: FloatingBackgroundProps) {
  const opacityClass = variant === "vivid" ? "opacity-40" : "opacity-[0.06]";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map(({ Icon, position, size, animClass, delay, color }, i) => (
        <Icon
          key={i}
          className={`absolute ${position} ${animClass} ${color} ${opacityClass}`}
          style={{ width: size, height: size, animationDelay: delay }}
        />
      ))}
    </div>
  );
});

export default FloatingBackground;