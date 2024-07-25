import {React, useState} from 'react';
import {Image} from '@shopify/hydrogen';
import {Form, useActionData, useNavigation} from '@remix-run/react';

import IntlTelInput from '../intl-tel-input-master/react/build/IntlTelInput';
import '../intl-tel-input-master/build/css/intlTelInput.css';
import {createKlaviyoClient} from '../lib/createKlaviyoClient.server';

export async function action({context, request}) {
  const formData = await request.formData();

  const email = formData.get('email');
  const phoneNumber = formData.get('phone_full');

  const klaviyoClient = createKlaviyoClient(context.env.KLAVIYO_API_KEY);

  const resultProfile = await klaviyoClient.createKlaviyoProfile(
    email,
    phoneNumber,
  );
  var profileId = null;
  if (resultProfile.response) {
    const res = await resultProfile.response.json();
    if (resultProfile.success) {
      profileId = res.data.id;
    } else if (res.errors[0]?.meta?.duplicate_profile_id) {
      profileId = res.errors[0].meta.duplicate_profile_id;
    } else {
      return {success: false, message: res.errors[0].detail};
    }
  } else {
    return {sucess: false, message: 'Network error 1, please try again'};
  }

  const resultSubscribe = await klaviyoClient.subscribeKlaviyoProfile(
    {
      id: profileId,
      attributes: {
        email,
        phone_number: phoneNumber,
      },
    },
    'VNXjm7',
  );

  if (resultSubscribe.response) {
    const text = await resultSubscribe.response.text(); // Read the response body as text
    if (text) {
      const res = JSON.parse(text); // Try parsing the text as JSON
      if (!resultSubscribe.success) {
        return {success: false, message: res.errors[0].detail};
      }
    }
  }

  const resultCode = await klaviyoClient.getSubscribedCouponFromProfile({
    id: profileId,
  });

  if (resultCode.response) {
    if (resultCode.success) {
      const couponItem = resultCode.response.data.find(
        (item) =>
          item.id.includes('10PercentCode') &&
          item.attributes.status === 'ASSIGNED_TO_PROFILE',
      );
      const couponCode = couponItem.attributes.unique_code;
      return {
        success: true,
        code: couponCode,
      };
    } else {
      return {success: false, message: resultCode.response.errors[0].detail};
    }
  } else {
    return {sucess: false, message: resultCode.error};
  }
}

export default function Redeem() {
  const actionData = useActionData();
  const [number, setNumber] = useState('');
  const [isValid, setIsValid] = useState(false);
  const navigation = useNavigation();
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      console.error('error clipboard');
    }
  };
  return (
    <section className="flex h-screen">
      <div className="flex md:flex-row flex-col bg-black w-full h-full">
        <div className="md:w-1/2 md:h-full w-full h-[200px] bg-black">
          <Image
            src="https://cdn.shopify.com/s/files/1/0526/0463/3276/files/DESKTOPIMAGE2_b4c00b42-2a59-4393-bfb2-7a532009532d.jpg?v=1717038433"
            className="w-full h-full object-cover"
            loading="lazy"
            sizes="1000px,2000px"
          ></Image>
        </div>
        <div className="md:w-1/2 w-full h-full bg-black flex flex-col">
          <div className="w-full h-full">
            <div
              className={`w-full md:px-[50px] px-[15px] h-fit md:py-[20%] py-2 top-0 ${
                actionData?.success ? 'hidden' : 'block'
              }`}
            >
              <div className="text-white md:text-4xl text-2xl py-4 font-bold">
                UNLOCK 10% OFF
              </div>
              <div className="text-white py-2">
                Don&lsquo;t miss out on our exclusive deals and offers
              </div>
              <div className="text-white py-2">
                Sign up for a 10% discount code off
              </div>
              <Form method="post">
                <div className="text-white pb-1 pt-2">Email:</div>
                <input
                  type="email"
                  name="email"
                  className="w-full h-[41.6px] p-2"
                  placeholder="Enter your email"
                  required
                />
                <div className="text-white pb-1 pt-2">Phone number:</div>
                <IntlTelInput
                  onChangeNumber={setNumber}
                  onChangeValidity={setIsValid}
                  initOptions={{
                    initialCountry: 'my',
                    separateDialCode: false,
                    formatAsYouType: true,
                    formatOnDisplay: true,
                    hiddenInput(telInputName) {
                      return {
                        phone: 'phone_full',
                        country: 'country_code',
                      };
                    },
                    utilsScript:
                      'https://cdn.jsdelivr.net/npm/intl-tel-input@23.6.0/build/js/utils.js',
                  }}
                />
                <button
                  type="submit"
                  className="w-full h-8 bg-white text-center text-xl font-bold my-8"
                >
                  {`${navigation.state == 'idle' ? 'SIGN UP' : 'LOADING...'}`}
                </button>
                {!isValid && number != '' && (
                  <div className="text-red-500">
                    Please enter a valid phone number.
                  </div>
                )}
                <ErrorComponent error={actionData?.message} />
              </Form>
            </div>
            <div
              className={`w-full md:px-[50px] px-[15px] h-fit md:py-[20%] py-10 ${
                actionData?.success ? 'block' : 'hidden'
              }`}
            >
              <div className="text-white font-bold text-2xl">
                Thank you! Use this code to receive 10% off your next purchase
              </div>
              <div className="w-full text-center mt-10 bg-white px-12 text-xl font-bold relative h-fit flex flex-row justify-center">
                <div className="flex-grow h-fit my-auto">
                  {actionData?.code}
                </div>

                <button
                  onClick={() => copyToClipboard(actionData?.code)}
                  className="w-fit h-full bg-white py-3 text-white font-bold font-sans px-1"
                >
                  <svg
                    fill="#000000"
                    height="30px"
                    width="30px"
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 352.804 352.804"
                    xmlSpace="preserve"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {' '}
                      <g>
                        {' '}
                        <path d="M318.54,57.282h-47.652V15c0-8.284-6.716-15-15-15H34.264c-8.284,0-15,6.716-15,15v265.522c0,8.284,6.716,15,15,15h47.651 v42.281c0,8.284,6.716,15,15,15H318.54c8.284,0,15-6.716,15-15V72.282C333.54,63.998,326.824,57.282,318.54,57.282z M49.264,265.522V30h191.623v27.282H96.916c-8.284,0-15,6.716-15,15v193.24H49.264z M303.54,322.804H111.916V87.282H303.54V322.804 z"></path>{' '}
                      </g>{' '}
                    </g>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ErrorComponent({error}) {
  return <div className="w-full my-2 text-red-700">{error}</div>;
}
