# Brands Page - Metafields Guide

## Overview
The brands page (`/brands`) showcases consignment brand collections in a widget-style grid layout. Collections are filtered and displayed based on custom metafields.

## Required Metafields

### Collection Metafields (namespace: "custom")

#### 1. `consignmentbrand`
- **Type**: Boolean (stored as string "true" or "false")
- **Purpose**: Controls whether this collection appears on the brands page
- **Example Value**: `"true"`
- **Usage**: Set to `"true"` for any collection that represents a consignment brand

#### 2. `consignmentimage`
- **Type**: File reference (image)
- **Purpose**: The brand's image/photo displayed as the full background in the brand widget
- **Recommended Size**: High-resolution square or landscape image (1500x1500px or larger)
- **Format**: JPG, PNG, or WebP recommended for photos
- **Note**: Images are automatically loaded at 1500x1500px resolution for crisp display
- **Example**: Upload a brand photo or styled product image

## How It Works

1. **Fetch Collections**: The loader queries all collections with these metafields
2. **Filter**: Only collections with `consignmentbrand: "true"` are displayed
3. **Render**: Each brand displays as a full-image card with:
   - Brand image covering the entire card (from `consignmentimage` metafield)
   - Dark gradient overlay for text readability
   - Collection title overlaid at the bottom
   - Collection description (optional)
   - "Shop Now" link to the collection

## Brand Widget Features

Each brand widget displays:
- **Full Background Image**: Image covers entire card at 1500x1500px resolution
- **Dark Gradient Overlay**: Bottom-to-top gradient for text readability
- **Brand Name**: Collection title in bold white text with drop shadow
- **Description**: First 2 lines of collection description (if provided)
- **Hover Effect**: Shadow effect and underline on "Shop Now" link
- **Square Aspect Ratio**: Maintains consistent square shape
- **Responsive Grid**: 
  - Mobile: 2 columns
  - Tablet: 3 columns
  - Desktop: 4 columns

## Example Configuration

### Collection: "Supreme Consignment"
- `consignmentbrand`: `"true"`
- `consignmentimage`: [Upload Supreme brand photo/styled product image]
- `title`: "Supreme"
- `description`: "Authentic Supreme streetwear and accessories"

### Collection: "Vintage Nike"
- `consignmentbrand`: `"true"`
- `consignmentimage`: [Upload Nike brand photo/product showcase]
- `title`: "Nike Vintage"
- `description`: "Rare and vintage Nike sneakers and apparel"

### Collection: "Designer Handbags"
- `consignmentbrand`: `"true"`
- `consignmentimage`: [Upload luxury handbag styled photo]
- `title`: "Luxury Handbags"
- `description`: "Authenticated designer handbags from top brands"

## Setup in Shopify Admin

1. Go to **Products > Collections**
2. Select a collection that represents a consignment brand
3. Scroll to **Metafields**
4. Add the custom metafields:   - **consignmentbrand**:
     - Namespace: `custom`
     - Key: `consignmentbrand`
     - Type: `Single line text`
     - Value: `"true"`
   - **consignmentimage**:
     - Namespace: `custom`
     - Key: `consignmentimage`
     - Type: `File`
     - Value: Upload brand image/photo

## Best Practices

### Brand Images
- ✅ Use high-resolution images (at least 1500x1500px)
- ✅ Square images work best for consistent layout
- ✅ Lifestyle or styled product photos are recommended
- ✅ JPG or PNG format for photos
- ✅ Ensure good contrast for text overlay readability
- ❌ Avoid images that are too busy or cluttered
- ❌ Avoid low-resolution images (they'll appear blurry)
- ❌ Avoid images where important details would be covered by text

### Brand Descriptions
- ✅ Keep descriptions concise (1-2 sentences)
- ✅ Highlight what makes the brand unique
- ✅ Use compelling language
- ❌ Don't write lengthy paragraphs
- ❌ Avoid generic descriptions

## Page Access

The brands page is accessible at:
- `https://yourstore.com/brands` (English)
- `https://yourstore.com/{locale}/brands` (Other locales)
- **Navigation**: Accessible from main navigation menu under "Brands" link

## Benefits

- ✅ Easy to add/remove brands via Shopify admin
- ✅ Consistent brand presentation
- ✅ No code changes needed to update brands
- ✅ Mobile-responsive grid layout
- ✅ SEO-friendly with proper meta tags
- ✅ Professional brand showcase experience
