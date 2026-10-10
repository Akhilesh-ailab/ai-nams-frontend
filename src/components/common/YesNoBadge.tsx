interface YesNoBadgeProps {
  value: boolean;
  goodWhen?: boolean;
}

export default function YesNoBadge({ value, goodWhen = true }: YesNoBadgeProps) {
  const good = value === goodWhen;
  return (
    <span
      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
        good ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
      }`}
    >
      {value ? "Yes" : "No"}
    </span>
  );
}