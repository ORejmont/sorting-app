import { useState, useRef, useEffect } from "react";

/*
  DropdownProps = definice toho, jaká data komponenta přijímá zvenku

  - label: text nad dropdownem (nepovinný)
  - options: seznam možností (text + hodnota)
  - selected: výchozí vybraná hodnota
  - onChange: funkce, která se zavolá při změně (např. pro rodičovskou komponentu)
*/
interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  selected?: string;
  onChange?: (value: string) => void;
  onLabelUpdate?: () => void;
  disabled?: boolean;
  className?: string;
}

/*
  Hlavní komponenta Dropdown
*/
export default function Dropdown({
  label,
  options,
  selected,
  onChange,
  onLabelUpdate,
  disabled = false,
  className = "", // default hodnota
}: DropdownProps) {
  /*
    open = určuje, jestli je dropdown otevřený nebo zavřený

    - false = zavřený
    - true = otevřený

    Podobné jako: let open = false;
  */
  const [open, setOpen] = useState(false);

  /*
    currentLabel = text, který se zobrazuje v tlačítku

    Pokud přijde "selected", najdeme k němu label z options
    Pokud ne, zobrazíme "-"
  */
  const currentLabel =
    options.find((opt) => opt.value === selected)?.label || "-";

  /*
    menuRef = reference na HTML element ".dropdown-menu"
    buttonRef = reference na HTML element ".dropdown-btn"

    V čistém JS by to odpovídalo:
    document.querySelector(".dropdown-menu")
  */
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  /*
    Funkce, která se zavolá při kliknutí na položku v menu
  */
  const handleSelect = (value: string) => {
    const opt = options.find((o) => o.value === value);
    if (!opt) return;

    onLabelUpdate?.();
    setOpen(false);
    onChange?.(opt.value);
  };

  /*
    Tento useEffect se stará o:
    "Klikneš kamkoliv mimo dropdown → dropdown se zavře"

    Je to ekvivalent:
    document.addEventListener("mousedown", function(e) { ... })
  */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      /*
        Zavřeme dropdown POUZE když:
        - dropdown je otevřený
        - klik není uvnitř menu
        - klik není na tlačítku

        Tím pádem:
        ✔ klik do menu = nic se nestane
        ✔ klik na tlačítko = jen toggle
        ✔ klik mimo = zavře se
      */
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    // Přidání posluchače na celý dokument
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup – při zničení komponenty posluchač odstraníme
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]); // Sledujeme jen změnu "open"

  /*
    HTML část komponenty
  */
  return (
    <div className={`dropdown-wrapper ${open ? "open" : ""} ${className}`}>
      {/* Popisek nad dropdownem */}
      <span className="dropdown-label">{label}</span>

      {/* Tlačítko dropdownu */}
      <button
        ref={buttonRef}
        className="dropdown-btn"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
      >
        {currentLabel}
      </button>

      {/* Menu dropdownu */}
      <div className="dropdown-menu" ref={menuRef}>
        <div className="dropdown-menu-inner">
          {options.map((opt) => (
            <div
              className={`dropdown-option ${
                opt.label === currentLabel ? "active" : ""
              } ${opt.disabled ? "disabled" : ""}`}
              key={opt.value}
              onClick={() =>
                !disabled && !opt.disabled && handleSelect(opt.value)
              }
            >
              {opt.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
