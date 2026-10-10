import { Card, CardContent } from "@/components/ui/card";

interface Metric {
  label: string;
  value: string;
}

interface MetricGridProps {
  title: string;
  subtitle?: string;
  items: Metric[];
}

export default function MetricGrid({ title, subtitle, items }: MetricGridProps) {
  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div>
          <h3 className="text-base font-extrabold">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-muted/40 p-3">
              <dt className="text-xs text-muted-foreground">{item.label}</dt>
              <dd className="text-lg font-black">{item.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}