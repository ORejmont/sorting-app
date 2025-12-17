import { useState, useLayoutEffect, useRef } from "react";
import Dropdown from "./Dropdown";
import SliderGroup from "./SliderGroup";
import { sliders } from "./slidersData";
import { categories } from "../../mock/categories";

const sortOptions = [
  { label: "Kombinované", value: "combined" },
  { label: "Nejprodávanějších", value: "bestsellers" },
  { label: "Nejméně prodávaných", value: "worstsellers" },
  { label: "Nejvíce skladem", value: "stock-high" },
  { label: "Nejméně skladem", value: "stock-low" },
  { label: "Největší marže", value: "margin-high" },
  { label: "Nejmenší marže", value: "margin-low" },
  { label: "Nejlevnějších", value: "price-low" },
  { label: "Nejdražších", value: "price-high" },
];

// Možnosti pro dropdown sliderů (atributy)
const attributesOptions = [
  { label: "Cena", value: "price" },
  { label: "Sklad", value: "stock" },
  { label: "Marže", value: "margin" },
  { label: "Nejprodávanější", value: "sold" },
];

interface SortingSettingsProps {
  selectedCategory?: string;
  setSelectedCategory?: (val: string) => void;
  selectedSort?: string;
  setSelectedSort?: (val: string) => void;
  sliderValues?: Record<string, number>;
  handleSliderChange?: (key: string, value: number) => void;
  handleAttributeChange?: (key: string, attr: string) => void;
}

export default function SortingSettings({
  selectedCategory,
  setSelectedCategory,
  selectedSort,
  setSelectedSort,
  handleSliderChange,
  handleAttributeChange,
}: SortingSettingsProps) {
  const [internalSliderValues, setInternalSliderValues] = useState<
    Record<string, number>
  >(sliders.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {}));

  const [internalAttributes, setInternalAttributes] = useState<
    Record<string, string>
  >(
    sliders.reduce(
      (acc, s) => ({ ...acc, [s.key]: attributesOptions[0].value }),
      {}
    )
  );

  const onSliderChange = (key: string, value: number) => {
    if (handleSliderChange) {
      handleSliderChange(key, value);
    } else {
      setInternalSliderValues({ ...internalSliderValues, [key]: value });
    }
  };

  const onAttributeChange = (key: string, attr: string) => {
    if (handleAttributeChange) {
      handleAttributeChange(key, attr);
    } else {
      setInternalAttributes({ ...internalAttributes, [key]: attr });
    }
  };

  const sliderContainerRef = useRef<HTMLDivElement | null>(null);

  const updateDropdownWidths = () => {
    if (!sliderContainerRef.current) return;

    const dropdowns =
      sliderContainerRef.current.querySelectorAll<HTMLButtonElement>(
        ".dropdown-btn"
      );

    // Reset všech šířek na auto, aby se měřil přirozený obsah
    dropdowns.forEach((btn) => (btn.style.width = "auto"));

    // Po vykreslení DOM (nový text) měříme šířku
    requestAnimationFrame(() => {
      let maxWidth = 0;

      dropdowns.forEach((btn) => {
        const width = btn.getBoundingClientRect().width;
        if (width > maxWidth) maxWidth = width;
      });

      dropdowns.forEach((btn) => (btn.style.width = `${maxWidth}px`));
    });
  };

  // Použijeme useLayoutEffect místo useEffect
  useLayoutEffect(() => {
    if (selectedSort === "combined") {
      updateDropdownWidths(); // měření hned po renderu

      window.addEventListener("resize", updateDropdownWidths);
      return () => window.removeEventListener("resize", updateDropdownWidths);
    }
  }, [selectedSort, internalAttributes]);

  return (
    <div className="settings">
      {/* Kategorie dropdown */}
      <div className={`section ${!selectedCategory ? "not-selected" : ""}`}>
        <Dropdown
          label="Vyberte kategorii"
          options={categories.map((c) => ({ label: c.name, value: c.id }))}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      {selectedCategory && (
        <div className={`section ${!selectedSort ? "not-selected" : ""}`}>
          <Dropdown
            label="Řadit dle"
            options={sortOptions}
            selected={selectedSort}
            onChange={setSelectedSort}
          />

          {selectedSort === "combined" && (
            <div
              className="slider-container priority-slider"
              ref={sliderContainerRef}
            >
              {sliders.map((s) => (
                <SliderGroup
                  key={s.key}
                  slider={s}
                  onChange={(val) => onSliderChange(s.key, val)}
                  attributesOptions={attributesOptions}
                  onAttributeChange={(attr) => {
                    onAttributeChange(s.key, attr);
                    updateDropdownWidths(); // měření po změně dropdownu
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
