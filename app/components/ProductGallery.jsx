import {Image} from '@shopify/hydrogen';

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */
export function ProductGallery({media, className, selectedVariant}) {
  if (!media.length) {
    return null;
  }

  return (
    <div
      className={`swimlane md:grid-flow-row hiddenScroll md:p-0 md:overflow-x-auto md:grid-cols-2 ${className}`}
    >
      <div className="snap-center card-image bg-white w-mobileGallery md:w-full md:col-span-2">
        <Image
          loading={'eager'}
          data={selectedVariant?.image}
          aspectRatio={undefined}
          sizes={'(min-width: 48em) 60vw, 90vw'}
          className="object-cover w-full h-full aspect-square fadeIn"
        ></Image>
      </div>
      {media
        .filter((med) => med.image.id != selectedVariant?.image.id)
        .map((med, i) => {
          i = i + 1;
          const isFullWidth = i % 3 === 0;

          const image =
            med.__typename === 'MediaImage'
              ? {...med.image, altText: med.alt || 'Product image'}
              : null;

          const style = [
            isFullWidth ? 'md:col-span-2' : 'md:col-span-1',

            'snap-center card-image bg-white dark:bg-contrast/10 w-mobileGallery md:w-full',
          ].join(' ');

          return (
            <div className={style} key={med.id || image?.id}>
              {image && (
                <Image
                  loading={i === 0 ? 'eager' : 'lazy'}
                  data={image}
                  sizes={'(min-width: 48em) 30vw, 90vw'}
                  className="object-cover w-full h-full fadeIn"
                />
              )}
            </div>
          );
        })}
    </div>
  );
}
