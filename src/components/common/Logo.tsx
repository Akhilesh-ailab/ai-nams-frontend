import { cn } from "@/lib/utils";
import { APP_NAME, APP_TAGLINE } from "@/constants/app";

// Emblem cut out of the full logo (public/logo-mark.jpg), with a transparent background.
const EMBLEM_SRC = "/logo-emblem.png";

type Tone = "dark" | "light";

const SIZES = {
  sm: { mark: "h-9 w-9", word: "text-lg" },
  md: { mark: "h-11 w-11", word: "text-xl" },
  lg: { mark: "h-16 w-16", word: "text-3xl" },
} as const;

// "dark" text is for light backgrounds, "light" text is for dark backgrounds.
const TEXT = {
  dark: { initials: "text-slate-900", accent: "text-cyan-600", tagline: "text-slate-500" },
  light: { initials: "text-white", accent: "text-cyan-400", tagline: "text-cyan-200/80" },
} as const;

export function LogoMark({ className }: { className?: string }) {
  return <img src={EMBLEM_SRC} alt={APP_NAME} draggable={false} className={cn("select-none object-contain", className)} />;
}

interface LogoProps {
  tone?: Tone;
  size?: keyof typeof SIZES;
  showTagline?: boolean;
  uppercaseTagline?: boolean;
  className?: string;
}

export default function Logo({
  tone = "dark",
  size = "md",
  showTagline = false,
  uppercaseTagline = false,
  className,
}: LogoProps) {
  const text = TEXT[tone];
  const mark = <LogoMark className={SIZES[size].mark} />;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {tone === "light" ? (
        <div className="rounded-2xl bg-white p-1 shadow-lg shadow-black/20">{mark}</div>
      ) : (
        mark
      )}
      <div className="min-w-0">
        <p className={cn("font-black leading-none tracking-tight", SIZES[size].word)}>
          <span className={text.initials}>A.I.</span>
          <span className={text.accent}>-NAMS</span>
        </p>
        {showTagline && (
          <p className={cn("mt-1 text-[10px] font-medium leading-tight", text.tagline, uppercaseTagline && "uppercase tracking-widest")}>
            {APP_TAGLINE}
          </p>
        )}
      </div>
    </div>
  );
}