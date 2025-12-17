export interface SliderPreset {
  key: string;
  label: string;
  sliders: Record<
    string,
    {
      value: number;
      attribute: string;
    }
  >;
}

export const sliderPresets: SliderPreset[] = [
  {
    key: "custom",
    label: "Vlastní",
    sliders: {},
  },
  {
    key: "sales",
    label: "Prodejní",
    sliders: {
      sold: { value: 95, attribute: "sold" },
      margin: { value: 80, attribute: "margin" },
      stock: { value: 20, attribute: "stock" },
    },
  },
  {
    key: "clearance",
    label: "Zbavení skladu",
    sliders: {
      price: { value: 90, attribute: "price" },
      stock: { value: 80, attribute: "stock" },
      margin: { value: 10, attribute: "margin" },
    },
  },
];
