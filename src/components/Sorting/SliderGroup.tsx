import { useRef, useState } from "react";
import type { SliderConfig } from "./slidersData";
import Dropdown from "./Dropdown";

interface SliderGroupProps {
  slider: SliderConfig;
  onChange?: (value: number) => void;
  attributesOptions: { label: string; value: string }[];
  onAttributeChange?: (value: string) => void;
}

export default function SliderGroup({
  slider,
  onChange,
  attributesOptions,
  onAttributeChange,
}: SliderGroupProps) {
  const [value, setValue] = useState(slider.value);
  const [inverted, setInverted] = useState(false);
  const [selectedAttr, setSelectedAttr] = useState(attributesOptions[0].value);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const max = slider.max;
  const min = slider.min;
  const step = slider.step;

  const updateValue = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();

    // pozice uvnitř slideru v px
    let pos = clientX - rect.left;
    pos = Math.max(0, Math.min(pos, rect.width));

    // počet kroků (nejbližší)
    const stepsCount = Math.round(((pos / rect.width) * (max - min)) / step);

    // nová hodnota
    const newValue = min + stepsCount * step;

    setValue(newValue);
    onChange?.(newValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    updateValue(e.clientX);
    const handleMouseMove = (moveEvent: MouseEvent) =>
      updateValue(moveEvent.clientX);
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const percent =
    ((inverted ? max + min - value : value - min) / (max - min)) * 100;

  return (
    <div className="slider-group">
      {/* Dropdown pro atribut */}
      <Dropdown
        options={attributesOptions}
        selected={selectedAttr}
        onChange={(val) => {
          setSelectedAttr(val);
          onAttributeChange?.(val);
        }}
      />

      {/* Slider */}
      <div className="slider-wrapper">
        <div
          className="custom-slider"
          ref={sliderRef}
          onMouseDown={handleMouseDown}
        >
          <div className="track"></div>
          <div className="progress" style={{ width: `${percent}%` }}></div>
          <div className="thumb" style={{ left: `${percent}%` }}></div>
          <div className="ticks">
            {Array.from({ length: (max - min) / step + 1 }).map((_, i) => {
              const left = ((i * step) / (max - min)) * 100;
              return (
                <div
                  key={i}
                  className="tick"
                  style={{ left: `${left}%` }}
                ></div>
              );
            })}
          </div>
        </div>

        {/* Zobrazení aktuální hodnoty */}
        <div className="value-display">
          Hodnota: <span>{value}</span>
        </div>
      </div>

      {/* Invert button za slider-wrapper */}
      <button
        className="invert-btn"
        onClick={() => setInverted(!inverted)}
        title="Invertovat hodnoty"
      >
        ↕
      </button>
    </div>
  );
}
