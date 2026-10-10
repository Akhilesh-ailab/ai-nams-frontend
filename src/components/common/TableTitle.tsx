interface TableTitleProps {
  title: string;
  subtitle?: string;
}

export default function TableTitle({ title, subtitle }: TableTitleProps) {
  return (
    <div className="p-5 border-b border-border">
      <h3 className="text-base font-extrabold">{title}</h3>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}