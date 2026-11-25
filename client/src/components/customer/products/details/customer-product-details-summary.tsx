import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { extractSalePrice } from "@/features/customer/products/product-list.shared";
import type {
  CustomerProduct,
  ProductSize,
} from "@/features/customer/products/types";
import { formatPrice } from "@/lib/utils";
import CustomerProductOptionsGroup from "./customer-product-options-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  RotateCcw,
  Truck,
  Minus,
  Plus,
} from "lucide-react";

type CustomerProductDetailsSummaryProps = {
  product: CustomerProduct;
  selectedColor: string;
  selectedSize: string;
  setSelectedColor: (value: string) => void;
  setSelectedSize: (value: ProductSize) => void;
  toggleWishlist: () => Promise<void>;
  isWishlistActive: boolean;
  onAddToCart: (quantity?: number) => Promise<void>;
};

function CustomerProductDetailsSummary({
  product,
  selectedColor,
  selectedSize,
  setSelectedColor,
  setSelectedSize,
  toggleWishlist,
  isWishlistActive,
  onAddToCart,
}: CustomerProductDetailsSummaryProps) {
  const [quantity, setQuantity] = useState(1);
  const salePrice = extractSalePrice(product);
  const hasSale = product.salePercentage > 0;
  const savings = hasSale ? product.price - salePrice : 0;

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) =>
      product.stock && prev < product.stock ? prev + 1 : prev,
    );
  };

  return (
    <section className="space-y-6">
      {/* Category & Stock Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="text-xs uppercase tracking-wider font-semibold">
          {product?.category?.name || "General"}
        </Badge>

        {product?.stock > 0 ? (
          <Badge className="border-primary/30 bg-primary/10 text-primary hover:bg-primary/10">
            {product.stock <= 5 ? `Only ${product.stock} left in stock` : "In stock"}
          </Badge>
        ) : (
          <Badge variant="destructive">Out of stock</Badge>
        )}

        {hasSale ? (
          <Badge className="border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold">
            {product.salePercentage}% OFF
          </Badge>
        ) : null}
      </div>

      {/* Brand & Title */}
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          {product?.brand}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {product?.title}
        </h1>
      </div>

      {/* Price block */}
      <div className="space-y-1.5 pb-2 border-b border-border/50">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-foreground">
            {formatPrice(salePrice)}
          </span>
          {hasSale && (
            <>
              <span className="text-lg text-muted-foreground line-through font-normal">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Save {formatPrice(savings)}
              </span>
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Taxes included. Free shipping on orders over $50.</p>
      </div>

      {/* Color Selection */}
      {product?.colors?.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-foreground">Color</span>
            <span className="text-xs text-muted-foreground font-medium">
              Selected: <span className="text-foreground font-semibold">{selectedColor || "None"}</span>
            </span>
          </div>
          <CustomerProductOptionsGroup
            values={product.colors}
            selectedValue={selectedColor}
            onSelect={setSelectedColor}
            variant="color"
          />
        </div>
      )}

      {/* Size Selection */}
      {product?.sizes?.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-foreground">Size</span>
            <span className="text-xs text-muted-foreground font-medium">
              Selected: <span className="text-foreground font-semibold">{selectedSize || "None"}</span>
            </span>
          </div>
          <CustomerProductOptionsGroup
            values={product.sizes}
            selectedValue={selectedSize}
            onSelect={setSelectedSize}
            variant="size"
          />
        </div>
      )}

      {/* Quantity & Action Buttons */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-foreground">Quantity</span>
          <div className="flex items-center rounded-lg border border-border bg-card">
            <button
              type="button"
              onClick={handleDecrease}
              disabled={quantity <= 1}
              className="flex h-9 w-9 items-center justify-center text-muted-foreground transition hover:text-foreground disabled:opacity-40 cursor-pointer"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-10 text-center text-sm font-semibold text-foreground">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrease}
              disabled={quantity >= product.stock}
              className="flex h-9 w-9 items-center justify-center text-muted-foreground transition hover:text-foreground disabled:opacity-40 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          {product.stock > 0 && (
            <span className="text-xs text-muted-foreground">
              Max available: {product.stock}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            size="lg"
            className="flex-1 rounded-lg gap-2 text-base font-semibold shadow-sm cursor-pointer"
            disabled={product.stock < 1}
            onClick={() => void onAddToCart(quantity)}
          >
            <ShoppingBag className="h-5 w-5" />
            Add to Cart
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="rounded-lg gap-2 text-sm font-medium border-border/80 hover:bg-secondary cursor-pointer"
            onClick={() => void toggleWishlist()}
          >
            <Heart
              className={`h-4 w-4 ${isWishlistActive ? "fill-destructive text-destructive" : ""}`}
            />
            {isWishlistActive ? "Wishlisted" : "Save to Wishlist"}
          </Button>
        </div>
      </div>

      {/* Description */}
      {product?.description && (
        <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Product Details & Materials
          </h3>
          <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
            {product.description}
          </p>
        </div>
      )}

      {/* Trust & Policy Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-muted-foreground border-t border-border/50">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-primary shrink-0" />
          <span>Free shipping over $50</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4 text-primary shrink-0" />
          <span>7-day easy returns</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          <span>100% Authentic quality</span>
        </div>
      </div>
    </section>
  );
}

export default CustomerProductDetailsSummary;
