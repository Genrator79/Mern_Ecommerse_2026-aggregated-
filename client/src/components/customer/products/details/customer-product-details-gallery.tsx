import { Card } from "@/components/ui/card";
import { getCoverImage } from "@/features/customer/products/product-list.shared";
import type { CustomerProduct } from "@/features/customer/products/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CustomerProductDetailsGalleryProps = {
  product: CustomerProduct;
  selectedImage: string;
  setSelectedImage: (value: string) => void;
};

function CustomerProductDetailsGallery({
  product,
  selectedImage,
  setSelectedImage,
}: CustomerProductDetailsGalleryProps) {
  const galleryImages = product.images || [];
  const displayImage = selectedImage || getCoverImage(product);

  const currentIndex = galleryImages.findIndex((img) => img.url === displayImage);
  const effectiveIndex = currentIndex >= 0 ? currentIndex : 0;

  const handlePrev = () => {
    if (galleryImages.length <= 1) return;
    const newIndex =
      effectiveIndex > 0 ? effectiveIndex - 1 : galleryImages.length - 1;
    setSelectedImage(galleryImages[newIndex].url);
  };

  const handleNext = () => {
    if (galleryImages.length <= 1) return;
    const newIndex =
      effectiveIndex < galleryImages.length - 1 ? effectiveIndex + 1 : 0;
    setSelectedImage(galleryImages[newIndex].url);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <Card className="group relative overflow-hidden rounded-xl border border-border/60 bg-muted/20 shadow-sm">
        <div className="relative aspect-[4/5] sm:aspect-[3/4] max-h-[620px] w-full flex items-center justify-center bg-muted/30">
          {displayImage ? (
            <img
              src={displayImage}
              alt={product.title}
              className="h-full w-full object-cover object-center transition-all duration-300"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No Image Available
            </div>
          )}

          {/* Image counter indicator */}
          {galleryImages.length > 1 && (
            <div className="absolute top-3 right-3 rounded-full bg-background/80 backdrop-blur-md px-3 py-1 text-xs font-semibold text-foreground shadow-sm border border-border/40">
              {effectiveIndex + 1} / {galleryImages.length}
            </div>
          )}

          {/* Navigation Arrows */}
          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/85 backdrop-blur-md border border-border/50 text-foreground shadow-md transition hover:scale-110 hover:bg-background cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/85 backdrop-blur-md border border-border/50 text-foreground shadow-md transition hover:scale-110 hover:bg-background cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </Card>

      {/* Thumbnails Strip */}
      {galleryImages.length > 1 && (
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {galleryImages.map((item, idx) => {
            const isActive = displayImage === item.url;

            return (
              <button
                key={item.url || item.publicId || idx}
                type="button"
                onClick={() => setSelectedImage(item.url)}
                aria-label={`View image ${idx + 1}`}
                className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                  isActive
                    ? "border-primary ring-2 ring-primary/40 shadow-sm scale-105 opacity-100"
                    : "border-border/60 opacity-70 hover:opacity-100 hover:border-foreground/40"
                }`}
              >
                <img
                  src={item.url}
                  alt={`${product.title} thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CustomerProductDetailsGallery;
