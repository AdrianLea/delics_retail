# Homepage Dynamic Sections - Metafields Guide

## Overview
The homepage now uses custom metafields on collections to dynamically control which sections appear and in what order, instead of hardcoding specific collections.

## Required Metafields

### Collection Metafields (namespace: "custom")

#### 1. `showonhomepage`
- **Type**: Boolean (stored as string "true" or "false")
- **Purpose**: Controls whether this collection appears on the homepage
- **Example Value**: `"true"`

#### 2. `homepagesectiontype`
- **Type**: Single line text
- **Purpose**: Determines which type of section to render
- **Valid Values**:
  - `"featured"` - Shows a grid of products (default)
  - `"showcase"` - Shows a large banner with products (CollectionShowcase component)
- **Example Value**: `"featured"`

#### 3. `homepageordernumber`
- **Type**: Integer (stored as string)
- **Purpose**: Controls the display order of sections on the homepage
- **Notes**: 
  - Lower numbers appear first
  - Collections without this field appear after ordered ones, in the order they were returned from Shopify
- **Example Value**: `"1"`, `"2"`, `"3"`, etc.

#### 4. `collectionspageimage` (optional, for showcase type only)
- **Type**: File reference (image)
- **Purpose**: Banner image for showcase-type sections
- **Example**: Upload an image file

#### 5. `homepagetitle` (optional)
- **Type**: Single line text
- **Purpose**: Custom title for the homepage section (overrides the default collection title)
- **Notes**: 
  - If not provided, defaults to collection title in uppercase
  - For showcase sections, " COLLECTION" suffix is added only if using default title
- **Example Value**: `"NEW SEASON ESSENTIALS"`, `"LIMITED EDITION DROPS"`

#### 6. `homepagelink` (optional)
- **Type**: Single line text (URL)
- **Purpose**: Custom URL for the "VIEW ALL" button (overrides the default collection URL)
- **Notes**:
  - Accepts relative URLs (starting with `/`) or absolute URLs
  - URLs are validated and sanitized for security
  - Invalid URLs will fallback to the collection's default URL
  - Supports both internal links (`/pages/sale`) and external links (`https://example.com`)
- **Example Value**: `"/collections/special-offers"`, `"/pages/about"`, `"https://example.com/promo"`

## How It Works

1. **Fetch Collections**: The loader queries all collections with these metafields
2. **Filter**: Only collections with `showonhomepage: "true"` are included
3. **Sort**: Collections are sorted by `homepageordernumber` (missing values go to end)
4. **Render**: Each collection renders as either:
   - **Featured Section**: Grid of products with "VIEW ALL" link
   - **Showcase Section**: Large banner with featured products

## Example Configuration

### Collection: "New Arrivals"
- `showonhomepage`: `"true"`
- `homepagesectiontype`: `"featured"`
- `homepageordernumber`: `"1"`
- `homepagetitle`: `"NEW SEASON ESSENTIALS"` (optional)
- `homepagelink`: `"/collections/new-arrivals"` (optional)

### Collection: "Sleepy Student"  
- `showonhomepage`: `"true"`
- `homepagesectiontype`: `"showcase"`
- `homepageordernumber`: `"2"`
- `collectionspageimage`: [Upload image]
- `homepagetitle`: `"SLEEPY STUDENT"` (optional)
- `homepagelink`: `"/pages/sleepy-student-story"` (optional)

### Collection: "Best Sellers"
- `showonhomepage`: `"true"`
- `homepagesectiontype`: `"featured"`
- `homepageordernumber`: `"3"`
- `homepagetitle`: `"CUSTOMER FAVORITES"` (optional)
- `homepagelink`: `"/collections/best-sellers?sort=best-selling"` (optional)

## Setup in Shopify Admin

1. Go to **Products > Collections**
2. Select a collection
3. Scroll to **Metafields**
4. Add the custom metafields:
   - Click "Add metafield"
   - Namespace: `custom`
   - Key: (use one of the keys above)
   - Value: (set according to the guide above)

## Benefits

- ✅ No code changes needed to add/remove/reorder homepage sections
- ✅ Easy to test different layouts by changing metafield values
- ✅ Non-technical team members can manage homepage via Shopify admin
- ✅ Consistent with slider ordering system

## Migration Notes

The old hardcoded sections for:
- "New Arrivals"
- "Best Sellers"  
- "Sleepy Student"
- "Trophy Wives"
- "LOVESICK"

...have been replaced with this dynamic system. To restore these sections, add the appropriate metafields to each collection in Shopify admin.
