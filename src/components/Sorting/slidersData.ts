export interface SliderConfig {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
}

export const sliders: SliderConfig[] = [
  { key: "price", label: "Cena", min: 5, max: 100, step: 5, value: 50 },
  { key: "stock", label: "Sklad", min: 5, max: 100, step: 5, value: 50 },
  { key: "margin", label: "Marže", min: 5, max: 100, step: 5, value: 50 },
  { key: "sold", label: "Prodáno", min: 5, max: 100, step: 5, value: 50 },
];
