export type WidgetWealthItemProps = {
  label: string;
  value: number;
  evolution: number;
  percentage?: string;
  gain?: { value: number; instrument: string };
  onClick?: () => void;
};
