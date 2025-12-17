import { useState, useLayoutEffect, useRef } from "react";
import Dropdown from "./Dropdown";
import SliderGroup from "./SliderGroup";
import { sliders } from "./slidersData";
import { categories } from "../../mock/categories";
import { sliderPresets } from "./sliderPresets";

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

  const onSliderChange = (key: string, value: number) => {
    if (handleSliderChange) {
      handleSliderChange(key, value);
    } else {
      setInternalSliderValues({ ...internalSliderValues, [key]: value });
    }
  };

  const [internalAttributes, setInternalAttributes] = useState(
    sliders.reduce((acc, s) => {
      // default: pokud atribut existuje v options, použij jeho value
      const option = attributesOptions.find((o) => o.value === s.key);
      acc[s.key] = option ? option.value : ""; // pokud není, nech "-"
      return acc;
    }, {} as Record<string, string>)
  );

  const [selectedPreset, setSelectedPreset] = useState("custom");
  const isCustom = selectedPreset === "custom";

  const onAttributeChange = (key: string, attr: string) => {
    if (Object.values(internalAttributes).includes(attr)) return;

    setInternalAttributes((prev: typeof internalAttributes) => ({
      ...prev,
      [key]: attr,
    }));
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
            <>
              <Dropdown
                className="premade-options-dropdown"
                label="Možnosti"
                options={sliderPresets.map((p) => ({
                  label: p.label,
                  value: p.key,
                }))}
                selected={selectedPreset}
                onChange={(val) => {
                  setSelectedPreset(val);

                  if (val === "custom") return;

                  const preset = sliderPresets.find((p) => p.key === val);
                  if (!preset) return;

                  // Nastavení atributů podle presetu
                  if (preset) {
                    const newAttributes: Record<string, string> = {};
                    const newValues: Record<string, number> = {};

                    sliders.forEach((s) => {
                      if (preset.sliders[s.key]) {
                        // pokud preset má slider, použij jeho hodnoty
                        newAttributes[s.key] = preset.sliders[s.key].attribute;
                        newValues[s.key] = preset.sliders[s.key].value;
                      } else {
                        // jinak nech default
                        newAttributes[s.key] = s.key; // nebo null/first option
                        newValues[s.key] = s.value;
                      }
                    });

                    setInternalAttributes(newAttributes);
                    setInternalSliderValues(newValues);
                  }
                }}
              />
            </>
          )}

          {selectedSort === "combined" && (
            <div
              className="slider-container priority-slider"
              ref={sliderContainerRef}
            >
              {(() => {
                // Definice proměnné před renderem
                const slidersToRender =
                  selectedPreset === "custom"
                    ? sliders
                    : sliders.filter(
                        (s) =>
                          sliderPresets.find((p) => p.key === selectedPreset)
                            ?.sliders[s.key]
                      );

                return slidersToRender.map((s) => (
                  <SliderGroup
                    key={s.key}
                    slider={s}
                    value={internalSliderValues[s.key]}
                    disabled={!isCustom}
                    attributesOptions={attributesOptions}
                    selectedAttr={internalAttributes[s.key]}
                    usedAttributes={Object.values(internalAttributes)}
                    onChange={(val) => onSliderChange(s.key, val)}
                    onAttributeChange={(attr) => {
                      if (!isCustom) return;
                      onAttributeChange(s.key, attr);
                      updateDropdownWidths();
                    }}
                  />
                ));
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
