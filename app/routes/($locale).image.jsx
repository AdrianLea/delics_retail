import React, {useState, useRef, useEffect, Suspense} from 'react';
import ReactCrop, {makeAspectCrop, convertToPixelCrop} from 'react-image-crop';
import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData} from '@remix-run/react';

import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {ProductSwimlane, Skeleton} from '~/components';

export async function loader({params, context}) {
  return defer({
    featuredProducts: context.storefront.query(FEATURED_PRODUCTS_QUERY),
  });
}
const App = () => {
  const [userImage, setUserImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [savedImage, setSavedImage] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const previewCanvasRef = useRef(null);
  const croppingImage = useRef(null);
  const [crop, setCrop] = useState();
  const fileInputRef = useRef(null);
  const {featuredProducts} = useLoaderData();

  // Default background image
  const defaultBackground =
    'https://cdn.shopify.com/s/files/1/0526/0463/3276/files/ID_FRONT.png?v=1742320276';

  // Overlay image (to be added on top of the user's image)
  const overlayImage =
    'https://cdn.shopify.com/s/files/1/0526/0463/3276/files/ID_FRONT_OVERLAY.png?v=1740777757';

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUserImage(reader.result);
        setIsCropping(true); // Open crop modal
      };
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = (e) => {
    const {width, height} = e.currentTarget;
    const crop = makeAspectCrop(
      {
        unit: '%',
        width: 50,
      },
      265 / 279,
      width,
      height,
    );
    setCrop(crop);
  };

  useEffect(() => {
    if (croppedImage) {
      drawImages();
    }
  }, [croppedImage]);

  // Draw images on canvas
  const drawImages = () => {
    const canvas = window.document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Load default background image
    const backgroundImg = new Image();
    backgroundImg.crossOrigin = 'anonymous';
    backgroundImg.src = defaultBackground;
    backgroundImg.onload = () => {
      // Draw background image
      ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

      // Load user-selected image
      if (croppedImage) {
        const userImg = new Image();
        userImg.src = croppedImage;
        userImg.onload = () => {
          // Draw user image on top of the background
          ctx.drawImage(userImg, 20, 135, 266, 280); // Adjust position and size as needed

          // Load overlay image
          const overlayImg = new Image();
          overlayImg.crossOrigin = 'anonymous';
          overlayImg.src = overlayImage;
          overlayImg.onload = () => {
            // Draw overlay image on top of the user image
            ctx.drawImage(overlayImg, 50, 90, 200, 100); // Adjust position and size as needed
            const imageDataUrl = canvas.toDataURL('image/png');
            setSavedImage(imageDataUrl);
          };
        };
      }
    };
  };

  // Handle download
  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = 'composite-image.png';
    link.href = savedImage;
    link.click();
  };

  const handleCropComplete = (image, canvas, crop) => {
    if (userImage && crop.width && crop.height) {
      const pixelRatio = window.devicePixelRatio;

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = Math.floor(crop.width * pixelRatio * scaleX);
      canvas.height = Math.floor(crop.height * pixelRatio * scaleY);
      const ctx = canvas.getContext('2d');

      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = 'high';
      ctx.save();

      const cropX = crop.x * scaleX;
      const cropY = crop.y * scaleY;

      ctx.translate(-cropX, -cropY);

      ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

      const base64Image = canvas.toDataURL('image/png');
      setCroppedImage(base64Image);
      setIsCropping(false);
      drawImages();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Sleepy Student ID Generator</h1>
      <div
        className="relative w-full max-w-xl bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer"
        onClick={() => fileInputRef.current.click()}
      >
        {savedImage ? (
          <img
            src={savedImage}
            alt="ID Card Preview"
            className="w-full h-auto object-contain"
          />
        ) : (
          <img
            src={defaultBackground}
            alt="Default ID Card"
            className="w-full h-auto object-fill aspect-[900/500]"
          />
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        className="hidden"
      />

      {/* Crop Modal */}
      {isCropping && userImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[40]">
          <div className="bg-white rounded-lg p-4 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Crop Your Photo</h2>
            <ReactCrop
              crop={crop}
              onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
              keepSelection={true}
              aspect={265 / 279}
            >
              <img
                src={userImage}
                onLoad={onImageLoad}
                ref={croppingImage}
                alt="Cropping"
                className="max-w-full"
              />
            </ReactCrop>
            <button
              className="bg-black text-white px-4 py-2 rounded mt-4 w-full"
              onClick={() => {
                handleCropComplete(
                  croppingImage.current,
                  previewCanvasRef.current,
                  convertToPixelCrop(
                    crop,
                    croppingImage.current.width,
                    croppingImage.current.height,
                  ),
                );
              }}
            >
              Complete Crop
            </button>
            <canvas ref={previewCanvasRef} className="hidden"></canvas>
          </div>
        </div>
      )}

      {/* Download Button */}
      {savedImage && (
        <button
          onClick={handleDownload}
          className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-900 shadow-md"
        >
          Download Image
        </button>
      )}
      <Suspense fallback={<Skeleton className="h-32" />}>
        <Await
          errorElement="There was a problem loading related products"
          resolve={featuredProducts}
        >
          {(collections) => {
            return (
              <ProductSwimlane
                title="Shop the collection"
                products={collections.collections.nodes[0].products}
              />
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
};

export const FEATURED_PRODUCTS_QUERY = `#graphql
  query homepageFeaturedProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(first: 1, query:"title:New Arrivals", reverse: false) {
      nodes {
        products(first: 20, sortKey: CREATED) {
          nodes {
            id
            ...ProductCard
          }
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export default App;
