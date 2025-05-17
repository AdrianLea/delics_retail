/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

type Media_ExternalVideo_Fragment = {__typename: 'ExternalVideo'} & Pick<
  StorefrontAPI.ExternalVideo,
  'id' | 'embedUrl' | 'host' | 'mediaContentType' | 'alt'
> & {previewImage?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>};

type Media_MediaImage_Fragment = {__typename: 'MediaImage'} & Pick<
  StorefrontAPI.MediaImage,
  'id' | 'mediaContentType' | 'alt'
> & {
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'width' | 'height'>
    >;
    previewImage?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
  };

type Media_Model3d_Fragment = {__typename: 'Model3d'} & Pick<
  StorefrontAPI.Model3d,
  'id' | 'mediaContentType' | 'alt'
> & {
    sources: Array<Pick<StorefrontAPI.Model3dSource, 'mimeType' | 'url'>>;
    previewImage?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
  };

type Media_Video_Fragment = {__typename: 'Video'} & Pick<
  StorefrontAPI.Video,
  'id' | 'mediaContentType' | 'alt'
> & {
    sources: Array<Pick<StorefrontAPI.VideoSource, 'mimeType' | 'url'>>;
    previewImage?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
  };

export type MediaFragment =
  | Media_ExternalVideo_Fragment
  | Media_MediaImage_Fragment
  | Media_Model3d_Fragment
  | Media_Video_Fragment;

export type ProductCardFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'publishedAt' | 'handle' | 'vendor' | 'availableForSale'
> & {
  variants: {
    nodes: Array<
      Pick<
        StorefrontAPI.ProductVariant,
        'id' | 'availableForSale' | 'currentlyNotInStock'
      > & {
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
      }
    >;
  };
  metafields: Array<
    StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Metafield, 'id'> & {
        reference?: StorefrontAPI.Maybe<
          | (Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
              image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
            })
          | (Pick<StorefrontAPI.Video, 'id' | 'mediaContentType'> & {
              sources: Array<
                Pick<StorefrontAPI.VideoSource, 'url' | 'format' | 'mimeType'>
              >;
            })
        >;
      }
    >
  >;
};

export type FeaturedCollectionDetailsFragment = Pick<
  StorefrontAPI.Collection,
  'id' | 'title' | 'handle'
> & {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'altText' | 'width' | 'height' | 'url'>
  >;
};

export type LayoutQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  headerMenuHandle: StorefrontAPI.Scalars['String']['input'];
  footerMenuHandle: StorefrontAPI.Scalars['String']['input'];
}>;

export type LayoutQuery = {
  shop: Pick<StorefrontAPI.Shop, 'id' | 'name' | 'description'> & {
    primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
    brand?: StorefrontAPI.Maybe<{
      logo?: StorefrontAPI.Maybe<{
        image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
      }>;
    }>;
  };
  headerMenu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            >
          >;
        }
      >;
    }
  >;
  footerMenu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            >
          >;
        }
      >;
    }
  >;
};

export type ShopFragment = Pick<
  StorefrontAPI.Shop,
  'id' | 'name' | 'description'
> & {
  primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
  brand?: StorefrontAPI.Maybe<{
    logo?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
    }>;
  }>;
};

export type MenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type ChildMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type ParentMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    >
  >;
};

export type MenuFragment = Pick<StorefrontAPI.Menu, 'id'> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    > & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        >
      >;
    }
  >;
};

export type GetShopPrimaryDomainQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type GetShopPrimaryDomainQuery = {
  shop: {primaryDomain: Pick<StorefrontAPI.Domain, 'url'>};
};

export type HeroimagesqueryQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type HeroimagesqueryQuery = {
  collections: {
    nodes: Array<
      Pick<
        StorefrontAPI.Collection,
        'handle' | 'title' | 'onlineStoreUrl' | 'id'
      > & {
        metafields: Array<
          StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'> & {
              reference?: StorefrontAPI.Maybe<{
                image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
              }>;
            }
          >
        >;
      }
    >;
  };
};

export type CollectionShowcaseImageQueryQueryVariables = StorefrontAPI.Exact<{
  collectionName: StorefrontAPI.Scalars['String']['input'];
}>;

export type CollectionShowcaseImageQueryQuery = {
  collections: {
    nodes: Array<
      Pick<
        StorefrontAPI.Collection,
        'handle' | 'title' | 'onlineStoreUrl' | 'id'
      > & {
        metafields: Array<
          StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'> & {
              reference?: StorefrontAPI.Maybe<{
                image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
              }>;
            }
          >
        >;
      }
    >;
  };
};

export type SeoCollectionContentQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type SeoCollectionContentQuery = {
  shop: Pick<StorefrontAPI.Shop, 'name' | 'description'>;
};

export type HomepageFeaturedProductsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type HomepageFeaturedProductsQuery = {
  collections: {
    nodes: Array<{
      products: {
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            | 'id'
            | 'title'
            | 'publishedAt'
            | 'handle'
            | 'vendor'
            | 'availableForSale'
          > & {
            variants: {
              nodes: Array<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'id' | 'availableForSale' | 'currentlyNotInStock'
                > & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
                }
              >;
            };
            metafields: Array<
              StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'id'> & {
                  reference?: StorefrontAPI.Maybe<
                    | (Pick<
                        StorefrontAPI.MediaImage,
                        'id' | 'mediaContentType'
                      > & {
                        image?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.Image, 'url'>
                        >;
                      })
                    | (Pick<StorefrontAPI.Video, 'id' | 'mediaContentType'> & {
                        sources: Array<
                          Pick<
                            StorefrontAPI.VideoSource,
                            'url' | 'format' | 'mimeType'
                          >
                        >;
                      })
                  >;
                }
              >
            >;
          }
        >;
      };
    }>;
  };
};

export type HomepageBestSellingQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type HomepageBestSellingQuery = {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        | 'id'
        | 'title'
        | 'publishedAt'
        | 'handle'
        | 'vendor'
        | 'availableForSale'
      > & {
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'availableForSale' | 'currentlyNotInStock'
            > & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
            }
          >;
        };
        metafields: Array<
          StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'id'> & {
              reference?: StorefrontAPI.Maybe<
                | (Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                    image?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Image, 'url'>
                    >;
                  })
                | (Pick<StorefrontAPI.Video, 'id' | 'mediaContentType'> & {
                    sources: Array<
                      Pick<
                        StorefrontAPI.VideoSource,
                        'url' | 'format' | 'mimeType'
                      >
                    >;
                  })
              >;
            }
          >
        >;
      }
    >;
  };
};

export type CollectionShowcaseQueryQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  collectionName: StorefrontAPI.Scalars['String']['input'];
}>;

export type CollectionShowcaseQueryQuery = {
  collections: {
    nodes: Array<
      Pick<StorefrontAPI.Collection, 'onlineStoreUrl' | 'title'> & {
        products: {
          nodes: Array<
            Pick<
              StorefrontAPI.Product,
              | 'id'
              | 'title'
              | 'publishedAt'
              | 'handle'
              | 'vendor'
              | 'availableForSale'
            > & {
              variants: {
                nodes: Array<
                  Pick<
                    StorefrontAPI.ProductVariant,
                    'id' | 'availableForSale' | 'currentlyNotInStock'
                  > & {
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                    price: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    compareAtPrice?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                    >;
                    selectedOptions: Array<
                      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                    >;
                    product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
                  }
                >;
              };
              metafields: Array<
                StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Metafield, 'id'> & {
                    reference?: StorefrontAPI.Maybe<
                      | (Pick<
                          StorefrontAPI.MediaImage,
                          'id' | 'mediaContentType'
                        > & {
                          image?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.Image, 'url'>
                          >;
                        })
                      | (Pick<
                          StorefrontAPI.Video,
                          'id' | 'mediaContentType'
                        > & {
                          sources: Array<
                            Pick<
                              StorefrontAPI.VideoSource,
                              'url' | 'format' | 'mimeType'
                            >
                          >;
                        })
                    >;
                  }
                >
              >;
            }
          >;
        };
      }
    >;
  };
};

export type CustomerRecoverMutationVariables = StorefrontAPI.Exact<{
  email: StorefrontAPI.Scalars['String']['input'];
}>;

export type CustomerRecoverMutation = {
  customerRecover?: StorefrontAPI.Maybe<{
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'code' | 'field' | 'message'>
    >;
  }>;
};

export type ApiAllProductsQueryVariables = StorefrontAPI.Exact<{
  query?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']['input']>;
  count?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  reverse?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Boolean']['input']>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  sortKey?: StorefrontAPI.InputMaybe<StorefrontAPI.ProductSortKeys>;
}>;

export type ApiAllProductsQuery = {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        | 'id'
        | 'title'
        | 'publishedAt'
        | 'handle'
        | 'vendor'
        | 'availableForSale'
      > & {
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'availableForSale' | 'currentlyNotInStock'
            > & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
            }
          >;
        };
        metafields: Array<
          StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'id'> & {
              reference?: StorefrontAPI.Maybe<
                | (Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                    image?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Image, 'url'>
                    >;
                  })
                | (Pick<StorefrontAPI.Video, 'id' | 'mediaContentType'> & {
                    sources: Array<
                      Pick<
                        StorefrontAPI.VideoSource,
                        'url' | 'format' | 'mimeType'
                      >
                    >;
                  })
              >;
            }
          >
        >;
      }
    >;
  };
};

export type CollectionDetailsQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  filters?: StorefrontAPI.InputMaybe<
    Array<StorefrontAPI.ProductFilter> | StorefrontAPI.ProductFilter
  >;
  sortKey: StorefrontAPI.ProductCollectionSortKeys;
  reverse?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Boolean']['input']>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type CollectionDetailsQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Collection,
      'id' | 'handle' | 'title' | 'description'
    > & {
      seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'url' | 'width' | 'height' | 'altText'>
      >;
      products: {
        filters: Array<
          Pick<StorefrontAPI.Filter, 'id' | 'label' | 'type'> & {
            values: Array<
              Pick<
                StorefrontAPI.FilterValue,
                'id' | 'label' | 'count' | 'input'
              >
            >;
          }
        >;
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            | 'id'
            | 'title'
            | 'publishedAt'
            | 'handle'
            | 'vendor'
            | 'availableForSale'
          > & {
            variants: {
              nodes: Array<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'id' | 'availableForSale' | 'currentlyNotInStock'
                > & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
                }
              >;
            };
            metafields: Array<
              StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'id'> & {
                  reference?: StorefrontAPI.Maybe<
                    | (Pick<
                        StorefrontAPI.MediaImage,
                        'id' | 'mediaContentType'
                      > & {
                        image?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.Image, 'url'>
                        >;
                      })
                    | (Pick<StorefrontAPI.Video, 'id' | 'mediaContentType'> & {
                        sources: Array<
                          Pick<
                            StorefrontAPI.VideoSource,
                            'url' | 'format' | 'mimeType'
                          >
                        >;
                      })
                  >;
                }
              >
            >;
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
        >;
      };
      metafields: Array<
        StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MediaImage, 'id'> & {
              image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
            }
          >;
        }>
      >;
    }
  >;
  collections: {
    edges: Array<{node: Pick<StorefrontAPI.Collection, 'title' | 'handle'>}>;
  };
};

export type CollectionsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type CollectionsQuery = {
  collections: {
    nodes: Array<
      Pick<
        StorefrontAPI.Collection,
        'id' | 'title' | 'description' | 'handle'
      > & {
        seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'width' | 'height' | 'altText'
          >
        >;
      }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasPreviousPage' | 'hasNextPage' | 'startCursor' | 'endCursor'
    >;
  };
};

export type FeaturedItemsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  pageBy?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
}>;

export type FeaturedItemsQuery = {
  featuredCollections: {
    nodes: Array<
      Pick<StorefrontAPI.Collection, 'id' | 'title' | 'handle'> & {
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'altText' | 'width' | 'height' | 'url'>
        >;
      }
    >;
  };
  featuredProducts: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        | 'id'
        | 'title'
        | 'publishedAt'
        | 'handle'
        | 'vendor'
        | 'availableForSale'
      > & {
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'availableForSale' | 'currentlyNotInStock'
            > & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
            }
          >;
        };
        metafields: Array<
          StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'id'> & {
              reference?: StorefrontAPI.Maybe<
                | (Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                    image?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Image, 'url'>
                    >;
                  })
                | (Pick<StorefrontAPI.Video, 'id' | 'mediaContentType'> & {
                    sources: Array<
                      Pick<
                        StorefrontAPI.VideoSource,
                        'url' | 'format' | 'mimeType'
                      >
                    >;
                  })
              >;
            }
          >
        >;
      }
    >;
  };
};

export type ImageFeaturedProductsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ImageFeaturedProductsQuery = {
  collections: {
    nodes: Array<{
      products: {
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            | 'id'
            | 'title'
            | 'publishedAt'
            | 'handle'
            | 'vendor'
            | 'availableForSale'
          > & {
            variants: {
              nodes: Array<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'id' | 'availableForSale' | 'currentlyNotInStock'
                > & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
                }
              >;
            };
            metafields: Array<
              StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'id'> & {
                  reference?: StorefrontAPI.Maybe<
                    | (Pick<
                        StorefrontAPI.MediaImage,
                        'id' | 'mediaContentType'
                      > & {
                        image?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.Image, 'url'>
                        >;
                      })
                    | (Pick<StorefrontAPI.Video, 'id' | 'mediaContentType'> & {
                        sources: Array<
                          Pick<
                            StorefrontAPI.VideoSource,
                            'url' | 'format' | 'mimeType'
                          >
                        >;
                      })
                  >;
                }
              >
            >;
          }
        >;
      };
    }>;
  };
};

export type CartBuyerIdentityUpdateMutationVariables = StorefrontAPI.Exact<{
  cartId: StorefrontAPI.Scalars['ID']['input'];
  buyerIdentity: StorefrontAPI.CartBuyerIdentityInput;
}>;

export type CartBuyerIdentityUpdateMutation = {
  cartBuyerIdentityUpdate?: StorefrontAPI.Maybe<{
    cart?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Cart, 'id'>>;
  }>;
};

export type PageDetailsQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type PageDetailsQuery = {
  page?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Page, 'id' | 'title' | 'body'> & {
      seo?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Seo, 'description' | 'title'>
      >;
    }
  >;
};

export type ProductVariantFragmentFragment = Pick<
  StorefrontAPI.ProductVariant,
  'id' | 'availableForSale' | 'currentlyNotInStock' | 'sku' | 'title'
> & {
  selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  compareAtPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  unitPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
};

export type ProductQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
  selectedOptions:
    | Array<StorefrontAPI.SelectedOptionInput>
    | StorefrontAPI.SelectedOptionInput;
}>;

export type ProductQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      'id' | 'title' | 'vendor' | 'handle' | 'descriptionHtml' | 'description'
    > & {
      collections: {nodes: Array<Pick<StorefrontAPI.Collection, 'title'>>};
      options: Array<
        Pick<StorefrontAPI.ProductOption, 'name'> & {
          optionValues: Array<
            Pick<StorefrontAPI.ProductOptionValue, 'name' | 'id'>
          >;
        }
      >;
      selectedVariant?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.ProductVariant,
          'id' | 'availableForSale' | 'currentlyNotInStock' | 'sku' | 'title'
        > & {
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          unitPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
        }
      >;
      media: {
        nodes: Array<
          | ({__typename: 'ExternalVideo'} & Pick<
              StorefrontAPI.ExternalVideo,
              'id' | 'embedUrl' | 'host' | 'mediaContentType' | 'alt'
            > & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Image, 'url'>
                >;
              })
          | ({__typename: 'MediaImage'} & Pick<
              StorefrontAPI.MediaImage,
              'id' | 'mediaContentType' | 'alt'
            > & {
                image?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Image, 'id' | 'url' | 'width' | 'height'>
                >;
                previewImage?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Image, 'url'>
                >;
              })
          | ({__typename: 'Model3d'} & Pick<
              StorefrontAPI.Model3d,
              'id' | 'mediaContentType' | 'alt'
            > & {
                sources: Array<
                  Pick<StorefrontAPI.Model3dSource, 'mimeType' | 'url'>
                >;
                previewImage?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Image, 'url'>
                >;
              })
          | ({__typename: 'Video'} & Pick<
              StorefrontAPI.Video,
              'id' | 'mediaContentType' | 'alt'
            > & {
                sources: Array<
                  Pick<StorefrontAPI.VideoSource, 'mimeType' | 'url'>
                >;
                previewImage?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Image, 'url'>
                >;
              })
        >;
      };
      variants: {
        nodes: Array<
          Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'currentlyNotInStock' | 'sku' | 'title'
          > & {
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            unitPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
          }
        >;
      };
      seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
    }
  >;
  shop: Pick<StorefrontAPI.Shop, 'name'> & {
    primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle'>
    >;
  };
};

export type VariantsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type VariantsQuery = {
  product?: StorefrontAPI.Maybe<{
    variants: {
      nodes: Array<
        Pick<
          StorefrontAPI.ProductVariant,
          'id' | 'availableForSale' | 'currentlyNotInStock' | 'sku' | 'title'
        > & {
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          unitPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
        }
      >;
    };
  }>;
};

export type ProductRecommendationsQueryVariables = StorefrontAPI.Exact<{
  productId: StorefrontAPI.Scalars['ID']['input'];
  count?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ProductRecommendationsQuery = {
  recommended?: StorefrontAPI.Maybe<
    Array<
      Pick<
        StorefrontAPI.Product,
        | 'id'
        | 'title'
        | 'publishedAt'
        | 'handle'
        | 'vendor'
        | 'availableForSale'
      > & {
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'availableForSale' | 'currentlyNotInStock'
            > & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
            }
          >;
        };
        metafields: Array<
          StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'id'> & {
              reference?: StorefrontAPI.Maybe<
                | (Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                    image?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Image, 'url'>
                    >;
                  })
                | (Pick<StorefrontAPI.Video, 'id' | 'mediaContentType'> & {
                    sources: Array<
                      Pick<
                        StorefrontAPI.VideoSource,
                        'url' | 'format' | 'mimeType'
                      >
                    >;
                  })
              >;
            }
          >
        >;
      }
    >
  >;
  additional: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        | 'id'
        | 'title'
        | 'publishedAt'
        | 'handle'
        | 'vendor'
        | 'availableForSale'
      > & {
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'availableForSale' | 'currentlyNotInStock'
            > & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
            }
          >;
        };
        metafields: Array<
          StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'id'> & {
              reference?: StorefrontAPI.Maybe<
                | (Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                    image?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Image, 'url'>
                    >;
                  })
                | (Pick<StorefrontAPI.Video, 'id' | 'mediaContentType'> & {
                    sources: Array<
                      Pick<
                        StorefrontAPI.VideoSource,
                        'url' | 'format' | 'mimeType'
                      >
                    >;
                  })
              >;
            }
          >
        >;
      }
    >;
  };
};

export type AllProductsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type AllProductsQuery = {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        | 'id'
        | 'title'
        | 'publishedAt'
        | 'handle'
        | 'vendor'
        | 'availableForSale'
      > & {
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'availableForSale' | 'currentlyNotInStock'
            > & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
            }
          >;
        };
        metafields: Array<
          StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'id'> & {
              reference?: StorefrontAPI.Maybe<
                | (Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                    image?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Image, 'url'>
                    >;
                  })
                | (Pick<StorefrontAPI.Video, 'id' | 'mediaContentType'> & {
                    sources: Array<
                      Pick<
                        StorefrontAPI.VideoSource,
                        'url' | 'format' | 'mimeType'
                      >
                    >;
                  })
              >;
            }
          >
        >;
      }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasPreviousPage' | 'hasNextPage' | 'startCursor' | 'endCursor'
    >;
  };
};

export type PaginatedProductsSearchQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  searchTerm?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type PaginatedProductsSearchQuery = {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        | 'id'
        | 'title'
        | 'publishedAt'
        | 'handle'
        | 'vendor'
        | 'availableForSale'
      > & {
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'availableForSale' | 'currentlyNotInStock'
            > & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
            }
          >;
        };
        metafields: Array<
          StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'id'> & {
              reference?: StorefrontAPI.Maybe<
                | (Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                    image?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Image, 'url'>
                    >;
                  })
                | (Pick<StorefrontAPI.Video, 'id' | 'mediaContentType'> & {
                    sources: Array<
                      Pick<
                        StorefrontAPI.VideoSource,
                        'url' | 'format' | 'mimeType'
                      >
                    >;
                  })
              >;
            }
          >
        >;
      }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasPreviousPage' | 'hasNextPage' | 'startCursor' | 'endCursor'
    >;
  };
};

export type SitemapsQueryVariables = StorefrontAPI.Exact<{
  urlLimits?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type SitemapsQuery = {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'updatedAt' | 'handle' | 'onlineStoreUrl' | 'title'
      > & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
      }
    >;
  };
  collections: {
    nodes: Array<
      Pick<StorefrontAPI.Collection, 'updatedAt' | 'handle' | 'onlineStoreUrl'>
    >;
  };
  pages: {
    nodes: Array<
      Pick<StorefrontAPI.Page, 'updatedAt' | 'handle' | 'onlineStoreUrl'>
    >;
  };
};

interface GeneratedQueryTypes {
  '#graphql\n  query layout(\n    $language: LanguageCode\n    $headerMenuHandle: String!\n    $footerMenuHandle: String!\n  ) @inContext(language: $language) {\n    shop {\n      ...Shop\n    }\n    headerMenu: menu(handle: $headerMenuHandle) {\n      ...Menu\n    }\n    footerMenu: menu(handle: $footerMenuHandle) {\n      ...Menu\n    }\n  }\n  fragment Shop on Shop {\n    id\n    name\n    description\n    primaryDomain {\n      url\n    }\n    brand {\n      logo {\n        image {\n          url\n        }\n      }\n    }\n  }\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n  }\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n': {
    return: LayoutQuery;
    variables: LayoutQueryVariables;
  };
  '#graphql\n      query getShopPrimaryDomain { shop { primaryDomain { url } } }\n    ': {
    return: GetShopPrimaryDomainQuery;
    variables: GetShopPrimaryDomainQueryVariables;
  };
  '#graphql\nquery heroimagesquery {\n  collections(\n    first: 30\n  ) {\n    nodes {\n      metafields(\n        identifiers: [{namespace: "custom", key: "herodesktop"}, {namespace: "custom", key: "heromobile"}, {namespace: "custom", key: "herodescriptiontext"}, {namespace: "custom", key: "herobuttontext"}]\n      ) {\n        reference {\n          ... on MediaImage {\n            image {\n              url\n            }\n          }\n        }\n        value\n      }\n      handle\n      title\n      onlineStoreUrl\n      id\n    }\n  }\n}': {
    return: HeroimagesqueryQuery;
    variables: HeroimagesqueryQueryVariables;
  };
  '#graphql\nquery collectionShowcaseImageQuery($collectionName: String!) {\n  collections(\n    first:1\n    query:$collectionName\n  ) {\n    nodes {\n      metafields(\n        identifiers: [{namespace: "custom", key: "collectionspageimage"}]\n      ) {\n        reference {\n          ... on MediaImage {\n            image {\n              url\n            }\n          }\n        }\n        value\n      }\n      handle\n      title\n      onlineStoreUrl\n      id\n    }\n  }\n}': {
    return: CollectionShowcaseImageQueryQuery;
    variables: CollectionShowcaseImageQueryQueryVariables;
  };
  '#graphql\n  query seoCollectionContent($country: CountryCode, $language: LanguageCode)\n  @inContext(country: $country, language: $language) {\n    shop {\n      name\n      description\n    }\n  }\n': {
    return: SeoCollectionContentQuery;
    variables: SeoCollectionContentQueryVariables;
  };
  '#graphql\n  query homepageFeaturedProducts($country: CountryCode, $language: LanguageCode)\n  @inContext(country: $country, language: $language) {\n    collections(first: 1, query:"title:New Arrivals", reverse: true) {\n      nodes {\n        products(first: 20, sortKey: CREATED, reverse: true) {\n          nodes {\n            id\n            ...ProductCard\n          }\n        }\n      }\n    }\n  }\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    publishedAt\n    handle\n    vendor\n    availableForSale\n    variants(first: 100) {\n      nodes {\n        id\n        availableForSale\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        selectedOptions {\n          name\n          value\n        }\n        product {\n          handle\n          title\n        }\n        currentlyNotInStock\n      }\n    }\n    metafields(identifiers: [{namespace: "custom", key: "backmedia"}]) {\n      id\n      reference {\n        ... on MediaImage {\n          id\n          image {\n            url\n          }\n          mediaContentType\n        }\n        ... on Video {\n          id\n          sources {\n            url\n            format\n            mimeType\n          }\n          mediaContentType\n        }\n      }\n    }\n  }\n\n': {
    return: HomepageFeaturedProductsQuery;
    variables: HomepageFeaturedProductsQueryVariables;
  };
  '#graphql\n  query homepageBestSelling($country: CountryCode, $language: LanguageCode)\n  @inContext(country: $country, language: $language) {\n    products(first: 20, sortKey: BEST_SELLING) {\n      nodes {\n        id\n        ...ProductCard\n      }\n    }\n  }\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    publishedAt\n    handle\n    vendor\n    availableForSale\n    variants(first: 100) {\n      nodes {\n        id\n        availableForSale\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        selectedOptions {\n          name\n          value\n        }\n        product {\n          handle\n          title\n        }\n        currentlyNotInStock\n      }\n    }\n    metafields(identifiers: [{namespace: "custom", key: "backmedia"}]) {\n      id\n      reference {\n        ... on MediaImage {\n          id\n          image {\n            url\n          }\n          mediaContentType\n        }\n        ... on Video {\n          id\n          sources {\n            url\n            format\n            mimeType\n          }\n          mediaContentType\n        }\n      }\n    }\n  }\n\n': {
    return: HomepageBestSellingQuery;
    variables: HomepageBestSellingQueryVariables;
  };
  '#graphql\n      query collectionShowcaseQuery($country: CountryCode, $language: LanguageCode, $collectionName: String!)\n      @inContext(country: $country, language: $language) {\n        collections(first: 1, query:$collectionName , reverse: false) {\n          nodes {\n            products(first: 20, sortKey: BEST_SELLING) {\n              nodes {\n                id\n                ...ProductCard\n              }\n            }\n            onlineStoreUrl\n            title\n          }\n        }\n      }\n      #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    publishedAt\n    handle\n    vendor\n    availableForSale\n    variants(first: 100) {\n      nodes {\n        id\n        availableForSale\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        selectedOptions {\n          name\n          value\n        }\n        product {\n          handle\n          title\n        }\n        currentlyNotInStock\n      }\n    }\n    metafields(identifiers: [{namespace: "custom", key: "backmedia"}]) {\n      id\n      reference {\n        ... on MediaImage {\n          id\n          image {\n            url\n          }\n          mediaContentType\n        }\n        ... on Video {\n          id\n          sources {\n            url\n            format\n            mimeType\n          }\n          mediaContentType\n        }\n      }\n    }\n  }\n\n    ': {
    return: CollectionShowcaseQueryQuery;
    variables: CollectionShowcaseQueryQueryVariables;
  };
  '#graphql\n  query ApiAllProducts(\n    $query: String\n    $count: Int\n    $reverse: Boolean\n    $country: CountryCode\n    $language: LanguageCode\n    $sortKey: ProductSortKeys\n  ) @inContext(country: $country, language: $language) {\n    products(first: $count, sortKey: $sortKey, reverse: $reverse, query: $query) {\n      nodes {\n        ...ProductCard\n      }\n    }\n  }\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    publishedAt\n    handle\n    vendor\n    availableForSale\n    variants(first: 100) {\n      nodes {\n        id\n        availableForSale\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        selectedOptions {\n          name\n          value\n        }\n        product {\n          handle\n          title\n        }\n        currentlyNotInStock\n      }\n    }\n    metafields(identifiers: [{namespace: "custom", key: "backmedia"}]) {\n      id\n      reference {\n        ... on MediaImage {\n          id\n          image {\n            url\n          }\n          mediaContentType\n        }\n        ... on Video {\n          id\n          sources {\n            url\n            format\n            mimeType\n          }\n          mediaContentType\n        }\n      }\n    }\n  }\n\n': {
    return: ApiAllProductsQuery;
    variables: ApiAllProductsQueryVariables;
  };
  '#graphql\n  query CollectionDetails($handle: String!, $country: CountryCode, $language: LanguageCode, $filters: [ProductFilter!], $sortKey: ProductCollectionSortKeys!, $reverse: Boolean, $first: Int, $last: Int, $startCursor: String, $endCursor: String) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      description\n      seo {\n        description\n        title\n      }\n      image {\n        id\n        url\n        width\n        height\n        altText\n      }\n      products(\n        first: $first\n        last: $last\n        before: $startCursor\n        after: $endCursor\n        filters: $filters\n        sortKey: $sortKey\n        reverse: $reverse\n      ) {\n        filters {\n          id\n          label\n          type\n          values {\n            id\n            label\n            count\n            input\n          }\n        }\n        nodes {\n          ...ProductCard\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          hasNextPage\n          endCursor\n          startCursor\n        }\n      }\n      metafields(identifiers: {key: "collectionspageimage", namespace: "custom"}) {\n        reference {\n          ... on MediaImage {\n            id\n            image {\n              url\n            }\n          }\n        }\n      }\n    }\n    collections(first: 15) {\n      edges {\n        node {\n          title\n          handle\n        }\n      }\n    }\n  }\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    publishedAt\n    handle\n    vendor\n    availableForSale\n    variants(first: 100) {\n      nodes {\n        id\n        availableForSale\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        selectedOptions {\n          name\n          value\n        }\n        product {\n          handle\n          title\n        }\n        currentlyNotInStock\n      }\n    }\n    metafields(identifiers: [{namespace: "custom", key: "backmedia"}]) {\n      id\n      reference {\n        ... on MediaImage {\n          id\n          image {\n            url\n          }\n          mediaContentType\n        }\n        ... on Video {\n          id\n          sources {\n            url\n            format\n            mimeType\n          }\n          mediaContentType\n        }\n      }\n    }\n  }\n\n': {
    return: CollectionDetailsQuery;
    variables: CollectionDetailsQueryVariables;
  };
  '#graphql\n  query Collections(\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(country: $country, language: $language) {\n    collections(first: $first, last: $last, before: $startCursor, after: $endCursor) {\n      nodes {\n        id\n        title\n        description\n        handle\n        seo {\n          description\n          title\n        }\n        image {\n          id\n          url\n          width\n          height\n          altText\n        }\n      }\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        hasNextPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n': {
    return: CollectionsQuery;
    variables: CollectionsQueryVariables;
  };
  '#graphql\n  query FeaturedItems(\n    $country: CountryCode\n    $language: LanguageCode\n    $pageBy: Int = 12\n  ) @inContext(country: $country, language: $language) {\n    featuredCollections: collections(first: 3, sortKey: UPDATED_AT) {\n      nodes {\n        ...FeaturedCollectionDetails\n      }\n    }\n    featuredProducts: products(first: $pageBy) {\n      nodes {\n        ...ProductCard\n      }\n    }\n  }\n\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    publishedAt\n    handle\n    vendor\n    availableForSale\n    variants(first: 100) {\n      nodes {\n        id\n        availableForSale\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        selectedOptions {\n          name\n          value\n        }\n        product {\n          handle\n          title\n        }\n        currentlyNotInStock\n      }\n    }\n    metafields(identifiers: [{namespace: "custom", key: "backmedia"}]) {\n      id\n      reference {\n        ... on MediaImage {\n          id\n          image {\n            url\n          }\n          mediaContentType\n        }\n        ... on Video {\n          id\n          sources {\n            url\n            format\n            mimeType\n          }\n          mediaContentType\n        }\n      }\n    }\n  }\n\n  #graphql\n  fragment FeaturedCollectionDetails on Collection {\n    id\n    title\n    handle\n    image {\n      altText\n      width\n      height\n      url\n    }\n  }\n\n': {
    return: FeaturedItemsQuery;
    variables: FeaturedItemsQueryVariables;
  };
  '#graphql\n  query imageFeaturedProducts($country: CountryCode, $language: LanguageCode)\n  @inContext(country: $country, language: $language) {\n    collections(first: 1, query:"title:Sleepy Student", reverse: false) {\n      nodes {\n        products(first: 20, sortKey: CREATED) {\n          nodes {\n            id\n            ...ProductCard\n          }\n        }\n      }\n    }\n  }\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    publishedAt\n    handle\n    vendor\n    availableForSale\n    variants(first: 100) {\n      nodes {\n        id\n        availableForSale\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        selectedOptions {\n          name\n          value\n        }\n        product {\n          handle\n          title\n        }\n        currentlyNotInStock\n      }\n    }\n    metafields(identifiers: [{namespace: "custom", key: "backmedia"}]) {\n      id\n      reference {\n        ... on MediaImage {\n          id\n          image {\n            url\n          }\n          mediaContentType\n        }\n        ... on Video {\n          id\n          sources {\n            url\n            format\n            mimeType\n          }\n          mediaContentType\n        }\n      }\n    }\n  }\n\n': {
    return: ImageFeaturedProductsQuery;
    variables: ImageFeaturedProductsQueryVariables;
  };
  '#graphql\n  query PageDetails($language: LanguageCode, $handle: String!)\n  @inContext(language: $language) {\n    page(handle: $handle) {\n      id\n      title\n      body\n      seo {\n        description\n        title\n      }\n    }\n  }\n': {
    return: PageDetailsQuery;
    variables: PageDetailsQueryVariables;
  };
  '#graphql\n  query Product(\n    $country: CountryCode\n    $language: LanguageCode\n    $handle: String!\n    $selectedOptions: [SelectedOptionInput!]!\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      id\n      title\n      vendor\n      handle\n      descriptionHtml\n      description\n      collections(first: 1) {\n        nodes {\n          title\n        }\n      }\n      options {\n        name\n        optionValues {\n          name\n          id\n        }\n      }\n      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {\n        ...ProductVariantFragment\n      }\n      media(first: 7) {\n        nodes {\n          ...Media\n        }\n      }\n      variants(first: 100) {\n        nodes {\n          ...ProductVariantFragment\n        }\n      }\n      seo {\n        description\n        title\n      }\n    }\n    shop {\n      name\n      primaryDomain {\n        url\n      }\n      shippingPolicy {\n        body\n        handle\n      }\n      refundPolicy {\n        body\n        handle\n      }\n    }\n  }\n  #graphql\n  fragment Media on Media {\n    __typename\n    mediaContentType\n    alt\n    previewImage {\n      url\n    }\n    ... on MediaImage {\n      id\n      image {\n        id\n        url\n        width\n        height\n      }\n    }\n    ... on Video {\n      id\n      sources {\n        mimeType\n        url\n      }\n    }\n    ... on Model3d {\n      id\n      sources {\n        mimeType\n        url\n      }\n    }\n    ... on ExternalVideo {\n      id\n      embedUrl\n      host\n    }\n  }\n\n  #graphql\n  fragment ProductVariantFragment on ProductVariant {\n    id\n    availableForSale\n    currentlyNotInStock\n    selectedOptions {\n      name\n      value\n    }\n    image {\n      id\n      url\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    sku\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      handle\n    }\n  }\n\n': {
    return: ProductQuery;
    variables: ProductQueryVariables;
  };
  '#graphql\n  query variants(\n    $country: CountryCode\n    $language: LanguageCode\n    $handle: String!\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      variants(first: 250) {\n        nodes {\n          ...ProductVariantFragment\n        }\n      }\n    }\n  }\n  #graphql\n  fragment ProductVariantFragment on ProductVariant {\n    id\n    availableForSale\n    currentlyNotInStock\n    selectedOptions {\n      name\n      value\n    }\n    image {\n      id\n      url\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    sku\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      handle\n    }\n  }\n\n': {
    return: VariantsQuery;
    variables: VariantsQueryVariables;
  };
  '#graphql\n  query productRecommendations(\n    $productId: ID!\n    $count: Int\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    recommended: productRecommendations(productId: $productId) {\n      ...ProductCard\n    }\n    additional: products(first: $count, sortKey: BEST_SELLING) {\n      nodes {\n        ...ProductCard\n      }\n    }\n  }\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    publishedAt\n    handle\n    vendor\n    availableForSale\n    variants(first: 100) {\n      nodes {\n        id\n        availableForSale\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        selectedOptions {\n          name\n          value\n        }\n        product {\n          handle\n          title\n        }\n        currentlyNotInStock\n      }\n    }\n    metafields(identifiers: [{namespace: "custom", key: "backmedia"}]) {\n      id\n      reference {\n        ... on MediaImage {\n          id\n          image {\n            url\n          }\n          mediaContentType\n        }\n        ... on Video {\n          id\n          sources {\n            url\n            format\n            mimeType\n          }\n          mediaContentType\n        }\n      }\n    }\n  }\n\n': {
    return: ProductRecommendationsQuery;
    variables: ProductRecommendationsQueryVariables;
  };
  '#graphql\n  query AllProducts(\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(country: $country, language: $language) {\n    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {\n      nodes {\n        ...ProductCard\n      }\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        hasNextPage\n        startCursor\n        endCursor\n\n      }\n    }\n  }\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    publishedAt\n    handle\n    vendor\n    availableForSale\n    variants(first: 100) {\n      nodes {\n        id\n        availableForSale\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        selectedOptions {\n          name\n          value\n        }\n        product {\n          handle\n          title\n        }\n        currentlyNotInStock\n      }\n    }\n    metafields(identifiers: [{namespace: "custom", key: "backmedia"}]) {\n      id\n      reference {\n        ... on MediaImage {\n          id\n          image {\n            url\n          }\n          mediaContentType\n        }\n        ... on Video {\n          id\n          sources {\n            url\n            format\n            mimeType\n          }\n          mediaContentType\n        }\n      }\n    }\n  }\n\n': {
    return: AllProductsQuery;
    variables: AllProductsQueryVariables;
  };
  '#graphql\n  query PaginatedProductsSearch(\n    $country: CountryCode\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $searchTerm: String\n    $startCursor: String\n  ) @inContext(country: $country, language: $language) {\n    products(\n      first: $first,\n      last: $last,\n      before: $startCursor,\n      after: $endCursor,\n      sortKey: RELEVANCE,\n      query: $searchTerm\n    ) {\n      nodes {\n        ...ProductCard\n      }\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        hasNextPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    publishedAt\n    handle\n    vendor\n    availableForSale\n    variants(first: 100) {\n      nodes {\n        id\n        availableForSale\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        selectedOptions {\n          name\n          value\n        }\n        product {\n          handle\n          title\n        }\n        currentlyNotInStock\n      }\n    }\n    metafields(identifiers: [{namespace: "custom", key: "backmedia"}]) {\n      id\n      reference {\n        ... on MediaImage {\n          id\n          image {\n            url\n          }\n          mediaContentType\n        }\n        ... on Video {\n          id\n          sources {\n            url\n            format\n            mimeType\n          }\n          mediaContentType\n        }\n      }\n    }\n  }\n\n': {
    return: PaginatedProductsSearchQuery;
    variables: PaginatedProductsSearchQueryVariables;
  };
  '#graphql\n  query sitemaps($urlLimits: Int, $language: LanguageCode)\n  @inContext(language: $language) {\n    products(\n      first: $urlLimits\n      query: "published_status:\'online_store:visible\'"\n    ) {\n      nodes {\n        updatedAt\n        handle\n        onlineStoreUrl\n        title\n        featuredImage {\n          url\n          altText\n        }\n      }\n    }\n    collections(\n      first: $urlLimits\n      query: "published_status:\'online_store:visible\'"\n    ) {\n      nodes {\n        updatedAt\n        handle\n        onlineStoreUrl\n      }\n    }\n    pages(first: $urlLimits, query: "published_status:\'published\'") {\n      nodes {\n        updatedAt\n        handle\n        onlineStoreUrl\n      }\n    }\n  }\n': {
    return: SitemapsQuery;
    variables: SitemapsQueryVariables;
  };
}

interface GeneratedMutationTypes {
  '#graphql\n  mutation customerRecover($email: String!) {\n    customerRecover(email: $email) {\n      customerUserErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerRecoverMutation;
    variables: CustomerRecoverMutationVariables;
  };
  '#graphql\n  mutation CartBuyerIdentityUpdate(\n    $cartId: ID!\n    $buyerIdentity: CartBuyerIdentityInput!\n  ) {\n    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {\n      cart {\n        id\n      }\n    }\n  }\n': {
    return: CartBuyerIdentityUpdateMutation;
    variables: CartBuyerIdentityUpdateMutationVariables;
  };
}

declare module '@shopify/hydrogen' {
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
