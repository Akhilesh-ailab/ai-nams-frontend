interface BarItem {
  label: string;
  value: number;
}

interface HorizontalBarListProps {
  items: BarItem[];
  max?: number;
}

export default function HorizontalBarList({ items, max }: HorizontalBarListProps) {
  const scaleMax = max ?? Math.max(...items.map((item) => item.value), 1);

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-semibold">{item.label}</span>
            <span className="text-muted-foreground">{item.value}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${(item.value / scaleMax) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}