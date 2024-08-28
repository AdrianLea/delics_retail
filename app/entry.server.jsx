import {RemixServer} from '@remix-run/react';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';
export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
  context,
) {
  // Create the Content Security Policy

  const {header, NonceProvider, nonce} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    styleSrc: ["'self'", 'https://cdn.shopify.com', '*.klaviyo.com'],

    defaultSrc: [
      "'self'",
      'https://cdn.shopify.com',
      '*.klaviyo.com',
      'cdn.jsdelivr.net',
      '*.cloudfront.com',
      '*.cloudfront.net',
      'https://cdnjs.cloudflare.com',
    ],
    connectSrc: ['*.klaviyo.com', 'wss://flying-secondly-eft.ngrok-free.app:*'],
  });

  const body = await renderToReadableStream(
    // Wrap the entire app in the nonce provider
    <NonceProvider nonce={nonce}>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      // Pass the nonce to react
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  // Add the CSP header
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
