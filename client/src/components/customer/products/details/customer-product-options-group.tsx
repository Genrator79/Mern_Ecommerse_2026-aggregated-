import { getSwatchColor } from "@/features/customer/products/product-list.shared";
import type { ProductSize } from "@/features/customer/products/types";
import { Check } from "lucide-react";

type CustomerProductOptionsGroupProps = {
  values: string[];
  selectedValue: string;
  onSelect: (value: ProductSize) => void;
  variant: "color" | "size";
};

function CustomerProductOptionsGroup({
  values,
  variant,
  selectedValue,
  onSelect,
}: CustomerProductOptionsGroupProps) {
  if (variant === "color") {
    return (
      <div role="radiogroup" className="flex flex-wrap gap-2.5">
        {values.map((color) => {
          const isActive =
            selectedValue.trim().toLowerCase() === color.trim().toLowerCase();
          const hex = getSwatchColor(color);
          const isLight =
            color.toLowerCase() === "white" ||
            color.toLowerCase() === "cream" ||
            color.toLowerCase() === "beige";

          return (
            <button
              key={color}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onSelect(color as ProductSize)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/30 shadow-xs"
                  : "border-border/80 bg-card text-foreground hover:bg-secondary/70 hover:border-foreground/30"
              }`}
            >
              <span
                className={`relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  isLight ? "border-muted-foreground/30" : "border-transparent"
                }`}
                style={{ backgroundColor: hex }}
              >
                {isActive && (
                  <Check
                    className={`h-2.5 w-2.5 ${
                      isLight ? "text-foreground" : "text-white"
                    }`}
                  />
                )}
              </span>
              <span>{color}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Size variant
  return (
    <div role="radiogroup" className="flex flex-wrap gap-2.5">
      {values.map((size) => {
        const isActive = selectedValue === size;

        return (
          <button
            key={size}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onSelect(size as ProductSize)}
            className={`min-w-12 h-10 px-4 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
              isActive
                ? "border-primary bg-primary text-primary-foreground shadow-xs"
                : "border-border/80 bg-card text-foreground hover:bg-secondary/70 hover:border-foreground/30"
            }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}

export default CustomerProductOptionsGroup;
