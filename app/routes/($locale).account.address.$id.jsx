import {json, redirect} from '@shopify/remix-oxygen';
import {
  Form,
  useActionData,
  useOutletContext,
  useParams,
  useNavigation,
} from '@remix-run/react';
import {flattenConnection} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import {useEffect, useState} from 'react';
import {Country, State} from 'country-state-city';

import {
  CUSTOMER_ADDRESS_CREATE,
  CUSTOMER_ADDRESS_UPDATE,
  CUSTOMER_ADDRESS_DELETE,
} from '../graphql/customer-account/CustomerAddressMutations';

import {Button, Text} from '~/components';
import {assertApiErrors, getInputStyleClasses} from '~/lib/utils';

const badRequest = (data) => json(data, {status: 400});

export const handle = {
  renderInModal: true,
};

export const action = async ({request, context, params}) => {
  const formData = await request.formData();

  const addressId = formData.get('addressId');

  if (request.method === 'DELETE') {
    try {
      const data = await context.customerAccount.mutate(
        CUSTOMER_ADDRESS_DELETE,
        {
          variables: {addressId},
        },
      );

      assertApiErrors(data.customerAddressDelete);

      return redirect(params.locale ? `${params.locale}/account` : '/account');
    } catch (error) {
      return badRequest({formError: error.message});
    }
  }

  const address = {};

  const keys = [
    'lastName',
    'firstName',
    'address1',
    'address2',
    'city',
    'zip',
    'phoneNumber',
    'company',
    'zoneCode',
    'territoryCode',
  ];

  for (const key of keys) {
    const value = formData.get(key);
    if (typeof value === 'string') {
      address[key] = value;
    }
  }

  const defaultAddress = formData.get('defaultAddress') ? true : null;

  if (addressId === 'add') {
    try {
      const data = await context.customerAccount.mutate(
        CUSTOMER_ADDRESS_CREATE,
        {
          variables: {address, defaultAddress},
        },
      );
      assertApiErrors(data.data.customerAddressCreate);
      const newId = data.data?.customerAddressCreate?.customerAddress?.id;
      invariant(newId, 'Expected customer address to be created');

      return redirect(params.locale ? `${params.locale}/account` : '/account');
    } catch (error) {
      return badRequest({formError: error.message});
    }
  } else {
    try {
      const data = await context.customerAccount.mutate(
        CUSTOMER_ADDRESS_UPDATE,
        {
          variables: {
            address,
            addressId,
            defaultAddress,
          },
        },
      );

      assertApiErrors(data.data.customerAddressUpdate);

      return redirect(params.locale ? `${params.locale}/account` : '/account');
    } catch (error) {
      return badRequest({formError: error.message});
    }
  }
};

export default function EditAddress() {
  const {id: addressId} = useParams();
  const isNewAddress = addressId === 'add';
  const actionData = useActionData();
  const {state} = useNavigation();
  const {customer} = useOutletContext();
  const addresses = flattenConnection(customer.addresses);
  const defaultAddress = customer.defaultAddress;
  /**
   * When a refresh happens (or a user visits this link directly), the URL
   * is actually stale because it contains a special token. This means the data
   * loaded by the parent and passed to the outlet contains a newer, fresher token,
   * and we don't find a match. We update the `find` logic to just perform a match
   * on the first (permanent) part of the ID.
   */
  const normalizedAddress = decodeURIComponent(addressId ?? '').split('?')[0];
  const address = addresses.find((address) =>
    address.id.startsWith(normalizedAddress),
  );

  const countryList = Country.getAllCountries();
  const [stateList, setStateList] = useState([]);
  const [countryCode, setCountryCode] = useState(
    address?.territoryCode ? address.territoryCode : countryList[0].isoCode,
  );
  const [stateCode, setStateCode] = useState(
    address?.zoneCode
      ? address.zoneCode
      : State.getStatesOfCountry(countryCode)[0],
  );

  useEffect(() => {
    const stateList = State.getStatesOfCountry(countryCode);
    setStateList(stateList);
  }, [countryCode]);

  return (
    <>
      <Text className="mt-4 mb-6" as="h3" size="lead">
        {isNewAddress ? 'Add address' : 'Edit address'}
      </Text>
      <div className="max-w-lg">
        <Form method="post" id="address-form">
          <input
            type="hidden"
            name="addressId"
            value={address?.id ?? addressId}
          />
          {actionData?.formError && (
            <div className="flex items-center justify-center mb-6 bg-red-100 rounded">
              <p className="m-4 text-sm text-red-900">{actionData.formError}</p>
            </div>
          )}
          <div className="mt-3">
            <input
              className={getInputStyleClasses()}
              id="firstName"
              name="firstName"
              required
              type="text"
              autoComplete="given-name"
              placeholder="First name"
              aria-label="First name"
              defaultValue={address?.firstName ?? ''}
            />
          </div>
          <div className="mt-3">
            <input
              className={getInputStyleClasses()}
              id="lastName"
              name="lastName"
              required
              type="text"
              autoComplete="family-name"
              placeholder="Last name"
              aria-label="Last name"
              defaultValue={address?.lastName ?? ''}
            />
          </div>
          <div>
            <p>Country</p>
            <select
              className="w-full"
              onChange={(e) => setCountryCode(e.target.value)}
              defaultValue={countryCode}
              form="address-form"
              name="territoryCode"
            >
              {countryList.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          {stateList.length != 0 && (
            <div>
              <p>State/Province/Region</p>
              <select
                className="w-full"
                onChange={(e) => setStateCode(e.target.value)}
                defaultValue={stateCode}
                form="address-form"
                name="zoneCode"
              >
                {stateList.map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mt-3">
            <input
              className={getInputStyleClasses()}
              id="address1"
              name="address1"
              type="text"
              autoComplete="address-line1"
              placeholder="Address line 1*"
              required
              aria-label="Address line 1"
              defaultValue={address?.address1 ?? ''}
            />
          </div>
          <div className="mt-3">
            <input
              className={getInputStyleClasses()}
              id="address2"
              name="address2"
              type="text"
              autoComplete="address-line2"
              placeholder="Address line 2"
              aria-label="Address line 2"
              defaultValue={address?.address2 ?? ''}
            />
          </div>
          <div className="mt-3">
            <input
              className={getInputStyleClasses()}
              id="city"
              name="city"
              type="text"
              required
              autoComplete="address-level2"
              placeholder="City"
              aria-label="City"
              defaultValue={address?.city ?? ''}
            />
          </div>

          <div className="mt-3">
            <input
              className={getInputStyleClasses()}
              id="zip"
              name="zip"
              type="text"
              autoComplete="postal-code"
              placeholder="Zip / Postal Code"
              required
              aria-label="Zip"
              defaultValue={address?.zip ?? ''}
            />
          </div>

          <div className="mt-3">
            <input
              className={getInputStyleClasses()}
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              autoComplete="tel"
              placeholder="Phone"
              aria-label="Phone"
              defaultValue={address?.phoneNumber ?? ''}
            />
          </div>

          <div className="mt-4">
            <input
              type="checkbox"
              name="defaultAddress"
              id="defaultAddress"
              defaultChecked={defaultAddress?.id === address?.id}
              className="border-gray-500 rounded-sm cursor-pointer border-1"
            />
            <label
              className="inline-block ml-2 text-sm cursor-pointer"
              htmlFor="defaultAddress"
            >
              Set as default address
            </label>
          </div>
          <div className="mt-8">
            <Button
              className="w-full rounded focus:shadow-outline"
              type="submit"
              variant="primary"
              disabled={state !== 'idle'}
            >
              {state !== 'idle' ? 'Saving' : 'Save'}
            </Button>
          </div>
          <div>
            <Button
              to=".."
              className="w-full mt-2 rounded focus:shadow-outline"
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}
