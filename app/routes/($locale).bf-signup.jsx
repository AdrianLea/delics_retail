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
    'VkmDEs',
  );

  if (resultSubscribe.response) {
    const text = await resultSubscribe.response.text(); // Read the response body as text
    if (text) {
      const res = JSON.parse(text); // Try parsing the text as JSON
      if (!resultSubscribe.success) {
        return {success: false, message: res.errors[0].detail};
      }
    } else {
      return {success: false};
    }
  }

  return {success: true};
}

export default function Redeem() {
  const actionData = useActionData();
  const [number, setNumber] = useState('');
  const [isValid, setIsValid] = useState(false);
  const navigation = useNavigation();
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
                BLACK FRIDAY SALE
              </div>

              <div className="text-white py-2">
                Sign up for early access to our black friday sale event
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
              <p className="text-gray-500 text-sm italic">
                By submitting this form, you consent to receive marketing emails
                (e.g. promos, cart reminders) from Delics Retail at the email
                provided. Consent is not a condition of purchase. Unsubscribe at
                any time by clicking the unsubscribe link (where available).
              </p>
            </div>
            <div
              className={`w-full md:px-[50px] px-[15px] h-fit md:py-[20%] py-10 ${
                actionData?.success ? 'block' : 'hidden'
              }`}
            >
              <div className="text-white font-bold text-2xl w-full text-center">
                Thank you for signing up, remember to check your inbox!
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
