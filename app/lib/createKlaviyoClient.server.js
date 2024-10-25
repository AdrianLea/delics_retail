export function createKlaviyoClient(Klaviyo_api_key) {
  // tdlr: need to add extra fields
  async function createKlaviyoProfile(profileEmail, profilePhoneNumber) {
    const url = 'https://a.klaviyo.com/api/profiles/';
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        revision: '2024-07-15',
        'content-type': 'application/json',
        Authorization: `Klaviyo-API-Key ${Klaviyo_api_key}`,
      },
      body: JSON.stringify({
        data: {
          type: 'profile',
          attributes: {
            email: profileEmail,
            phone_number: profilePhoneNumber,
          },
        },
      }),
    };
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        return {success: false, response};
      }

      return {success: true, response};
    } catch (error) {
      return {success: false, error};
    }
  }

  async function subscribeKlaviyoProfile(profileObject, listId) {
    const url =
      'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/';
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        revision: '2024-07-15',
        'content-type': 'application/json',
        Authorization: `Klaviyo-API-Key ${Klaviyo_api_key}`,
      },
      body: JSON.stringify({
        data: {
          type: 'profile-subscription-bulk-create-job',
          attributes: {
            custom_source: 'E-mail subscription page',
            profiles: {
              data: [
                {
                  type: 'profile',
                  attributes: {
                    email: profileObject.attributes.email,
                    phone_number: profileObject.attributes.phone_number,

                    id: profileObject.id,
                  },
                },
              ],
            },
          },
          relationships: {
            list: {
              data: {
                type: 'list',
                id: listId,
              },
            },
          },
        },
      }),
    };
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        return {success: false, response};
      }

      return {success: true, response};
    } catch (error) {
      return {success: false, error};
    }
  }

  async function createBackInStockSubscription(email, itemId) {
    const url = 'https://a.klaviyo.com/api/back-in-stock-subscriptions';
    const options = {
      method: 'POST',
      headers: {
        accept: ' application/vnd.api+json',
        revision: '2024-10-15',
        'content-type': 'application/vnd.api+json',
        Authorization: `Klaviyo-API-Key ${Klaviyo_api_key}`,
      },
      body: JSON.stringify({
        data: {
          type: 'back-in-stock-subscription',
          attributes: {
            profile: {
              data: {
                type: 'profile',
                attributes: {
                  email,
                },
              },
            },
            channels: ['EMAIL'],
          },
          relationships: {
            variant: {
              data: {
                type: 'catalog-variant',
                id: `$shopify:::$default:::${itemId}`,
              },
            },
          },
        },
      }),
    };
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        console.log(JSON.stringify(response));
        return {success: false, response};
      }

      return {success: true, response};
    } catch (error) {
      console.log('here');
      return {success: false, error};
    }
  }

  async function getSubscribedCouponFromProfile(
    profile,
    retries = 20,
    delay = 200,
  ) {
    const url = `https://a.klaviyo.com/api/coupon-codes/?filter=equals(profile.id,"${profile.id}")`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        revision: '2024-07-15',
        Authorization: `Klaviyo-API-Key ${Klaviyo_api_key}`,
      },
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Response not OK');
      }
      const data = await response.json();
      if (
        data &&
        data.data.find(
          (item) =>
            item.id.includes('10PercentCode') &&
            item.attributes.status === 'ASSIGNED_TO_PROFILE',
        )
      ) {
        return {success: true, response: data};
      } else {
        throw new Error('Coupon code not received');
      }
    } catch (error) {
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return getSubscribedCouponFromProfile(profile, retries - 1, delay);
      } else {
        return {
          success: false,
          error:
            'Failed to receive coupon code after multiple attempts, please try again',
        };
      }
    }
  }

  return {
    createKlaviyoProfile,
    subscribeKlaviyoProfile,
    getSubscribedCouponFromProfile,
    createBackInStockSubscription,
  };
}
