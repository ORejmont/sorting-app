import { useState } from "react";
import SortingSettings from "../components/Sorting/SortingSettings";
import { products } from "../mock/products"; // mock produktů
import type { Product } from "../types/Product";

export default function Sorting() {
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedSort, setSelectedSort] = useState<string>();
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
  const [sliderAttributes, setSliderAttributes] = useState<
    Record<string, string>
  >({});

  // Mock filtrace produktů podle kategorie
  const filteredProducts: Product[] = selectedCategory
    ? products.filter((p) => p.categoryId === selectedCategory)
    : products;

  // Funkce pro výpočet kombinovaného skóre (zatím jednoduchá)
  const getCombinedScore = (product: Product) => {
    // Prozatím použijeme pouze mock hodnoty sliderů
    let score = 0;
    for (const key in sliderValues) {
      const attr = sliderAttributes[key];
      const value = sliderValues[key] || 0;

      // Pokud atribut existuje v produktu, přičti váženě
      if (attr && (product as any)[attr] !== undefined) {
        score += (product as any)[attr] * value;
      }
    }
    return score;
  };

  // Produkty seřazené podle vybraného typu řazení
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (selectedSort === "combined") {
      return getCombinedScore(b) - getCombinedScore(a); // sestupně podle kombinovaného skóre
    }
    // Jednoduché mock řazení pro ostatní typy
    if (selectedSort === "bestsellers") return (b.sold || 0) - (a.sold || 0);
    if (selectedSort === "worstsellers") return (a.sold || 0) - (b.sold || 0);
    if (selectedSort === "stock-high") return (b.stock || 0) - (a.stock || 0);
    if (selectedSort === "stock-low") return (a.stock || 0) - (b.stock || 0);
    if (selectedSort === "margin-high")
      return (b.margin || 0) - (a.margin || 0);
    if (selectedSort === "margin-low") return (a.margin || 0) - (b.margin || 0);
    if (selectedSort === "price-low") return (a.price || 0) - (b.price || 0);
    if (selectedSort === "price-high") return (b.price || 0) - (a.price || 0);

    return 0;
  });

  return (
    <div className="sorting-page">
      <div className="settings-wrapper">
        <h1>Řazení produktů</h1>

        <SortingSettings
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          sliderValues={sliderValues}
          handleSliderChange={(key, val) =>
            setSliderValues({ ...sliderValues, [key]: val })
          }
          handleAttributeChange={(key, attr) =>
            setSliderAttributes({ ...sliderAttributes, [key]: attr })
          }
        />
      </div>

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Název</th>
              <th>Cena</th>
              <th>Sklad</th>
              <th>Marže</th>
              <th>Nejprodávanější</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.stock}</td>
                <td>{p.margin}</td>
                <td>{p.sold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
