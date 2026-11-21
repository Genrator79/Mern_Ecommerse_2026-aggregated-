import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  extractSalePrice,
  getCoverImage,
  getSwatchColor,
} from "@/features/customer/products/product-list.shared";
import type { CustomerProduct } from "@/features/customer/products/types";
import { formatPrice } from "@/lib/utils";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

const cardClass =
  "group overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5";

const linkClass = "block";

const imageWrapClass = "relative aspect-[4/5] overflow-hidden bg-muted/40";

const imageClass =
  "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105";

const imageOverlayClass =
  "absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100";

const quickViewClass =
  "absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-foreground shadow-md opacity-0 transition-all duration-300 group-hover:opacity-100 backdrop-blur-sm";

const noImageClass =
  "flex h-full items-center justify-center text-sm text-muted-foreground";

const saleBadgeClass =
  "absolute right-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold text-primary-foreground shadow";

const contentClass = "space-y-3 p-4";

const detailsWrapClass = "space-y-0.5";

const brandClass = "text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70";

const titleClass = "line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-primary";

const categoryClass = "text-xs text-muted-foreground";

const priceRowClass = "flex items-center gap-2 pt-0.5";

const salePriceClass = "text-base font-bold text-foreground";

const originalPriceClass = "text-xs text-muted-foreground line-through";

const colorsWrapClass = "flex items-center gap-1.5";

const colorSwatchClass = "h-3.5 w-3.5 rounded-full border border-border shadow-sm";

const extraColorsClass = "text-xs text-muted-foreground";

const footerClass = "flex items-center justify-between gap-3 pt-1";

const buttonClass = "h-8 rounded-full px-4 text-xs font-semibold";

type CustomerProductCardProps = {
  product: CustomerProduct;
};

function CustomerProductCard({ product }: CustomerProductCardProps) {
  const coverImage = getCoverImage(product);
  const salePrice = extractSalePrice(product);
  const hasSale = product.salePercentage > 0;

  return (
    <Card className={cardClass}>
      <Link to={`/collection/${product._id}`} className={linkClass}>
        <div className={imageWrapClass}>
          {coverImage ? (
            <img src={coverImage} alt={product.title} className={imageClass} />
          ) : (
            <div className={noImageClass}>No Image</div>
          )}

          {/* gradient overlay + quick-view pill */}
          <div className={imageOverlayClass} />
          <div className={quickViewClass}>
            <Eye className="h-3.5 w-3.5" />
            Quick View
          </div>

          {hasSale ? (
            <Badge className={saleBadgeClass}>
              {product.salePercentage}% OFF
            </Badge>
          ) : null}
        </div>

        <CardContent className={contentClass}>
          <div className={detailsWrapClass}>
            <p className={brandClass}>{product.brand}</p>
            <p className={titleClass}>{product.title}</p>
            <p className={categoryClass}>{product.category?.name}</p>
          </div>

          <div className={priceRowClass}>
            <span className={salePriceClass}>{formatPrice(salePrice)}</span>
            {hasSale ? (
              <span className={originalPriceClass}>
                {formatPrice(product.price)}
              </span>

            ) : null}
          </div>

          {product.colors.length ? (
            <div className={colorsWrapClass}>
              {product.colors.slice(0, 4).map((color) => (
                <span
                  key={color}
                  className={colorSwatchClass}
                  style={{ backgroundColor: getSwatchColor(color) }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 ? (
                <span className={extraColorsClass}>
                  +{product.colors.length - 4}
                </span>
              ) : null}
            </div>
          ) : null}

          <div className={footerClass}>
            <Button className={buttonClass}>View Details</Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

export default CustomerProductCard;
