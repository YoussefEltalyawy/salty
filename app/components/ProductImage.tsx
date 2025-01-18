import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';
import {useState} from 'react';
type GalleryImage = {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

type ProductImageProps = {
  selectedVariantImage: ProductVariantFragment['image'];
  images: GalleryImage[];
};

function ProductImage({selectedVariantImage, images}: ProductImageProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalIndex, setModalIndex] = useState<number>(0);

  const [touchStart, setTouchStart] = useState<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const allImages = selectedVariantImage
    ? [
        selectedVariantImage,
        ...images.filter((img) => img.id !== selectedVariantImage.id),
      ]
    : images;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const currentTouch = e.targetTouches[0].clientX;
    const offset = currentTouch - touchStart;
    setDragOffset(offset);
  };
  const handleTouchEnd = () => {
    if (!isDragging) return;

    const minSwipeDistance = 50;
    if (Math.abs(dragOffset) > minSwipeDistance) {
      if (dragOffset > 0 && selectedIndex > 0) {
        setSelectedIndex((prev) => prev - 1);
        if (modalOpen) setModalIndex((prev) => prev - 1);
      } else if (dragOffset < 0 && selectedIndex < allImages.length - 1) {
        setSelectedIndex((prev) => prev + 1);
        if (modalOpen) setModalIndex((prev) => prev + 1);
      }
    }
    setIsDragging(false);
    setDragOffset(0);
  };
  const getImagePosition = (index: number) => {
    const baseTranform = isDragging ? dragOffset : 0;
    const diff = index - (modalOpen ? modalIndex : selectedIndex);
    return `translate3d(calc(${diff * 100}% + ${baseTranform}px),0,0)`;
  };

  const openModal = (index: number) => {
    setModalIndex(index);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = '';
  };
  if (allImages.length < 1) {
    return (
      <div className="aspect-square bg-brandBeige rounded-lg animate-pulse"></div>
    );
  }

  return (
    <>
      {/* Image Carousel */}
      <div className="space-y-4">
        {/* Main Image Container */}
        <div
          className="aspect-square relative rounded-lg overflow-hidden bg-brandBeige cursor-zoom-in"
          role="button"
          tabIndex={0}
          onClick={() => !isDragging && openModal(selectedIndex)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              !isDragging && openModal(selectedIndex);
            }
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Image Container */}
          <div className="absolute inset-0">
            {allImages.map((image, index) => (
              <div
                key={`${image.id || index}`}
                className={`absolute inset-0 w-full h-full transition-transform duration-300 ease-in-out ${
                  !isDragging
                    ? 'transition-transform duration-300'
                    : 'transition-none'
                }`}
                style={{transform: getImagePosition(index)}}
              >
                <Image
                  alt={image.altText || 'Product Image'}
                  data={image}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Modal / PopUp */}
    </>
  );
}
export default ProductImage;
