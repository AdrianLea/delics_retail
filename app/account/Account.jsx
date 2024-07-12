import React from 'react';

export async function generateCodeVerifier() {
  const rando = generateRandomCode();
  return base64UrlEncode(rando);
}

export async function generateCodeChallenge(codeVerifier) {
  const digestOp = await crypto.subtle.digest(
    {name: 'SHA-256'},
    new TextEncoder().encode(codeVerifier),
  );
  const hash = convertBufferToString(digestOp);
  return base64UrlEncode(hash);
}

function generateRandomCode() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return String.fromCharCode.apply(null, Array.from(array));
}

function base64UrlEncode(str) {
  const base64 = btoa(str);
  // This is to ensure that the encoding does not have +, /, or = characters in it.
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function convertBufferToString(hash) {
  const uintArray = new Uint8Array(hash);
  const numberArray = Array.from(uintArray);
  return String.fromCharCode(...numberArray);
}

export async function generateNonce(length) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nonce = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    nonce += characters.charAt(randomIndex);
  }

  return nonce;
}

export async function getNonce(token) {
  return decodeJwt(token).payload.nonce;
}

export function decodeJwt(token) {
  const [header, payload, signature] = token.split('.');

  const decodedHeader = JSON.parse(atob(header));
  const decodedPayload = JSON.parse(atob(payload));

  return {
    header: decodedHeader,
    payload: decodedPayload,
    signature,
  };
}

const clientId = process.env.CLIENT_ID;
const authorizationRequestUrl = new URL(
  `https://shopify.com/<shop_id>/auth/oauth/authorize`,
);

authorizationRequestUrl.searchParams.append(
  'scope',
  'openid email https://api.customers.com/auth/customer.graphql',
);
authorizationRequestUrl.searchParams.append('client_id', clientId);
authorizationRequestUrl.searchParams.append('response_type', 'code');
authorizationRequestUrl.searchParams.append('redirect_uri', `<redirect_uri>`);
authorizationRequestUrl.searchParams.append('state', '<state>');
authorizationRequestUrl.searchParams.append('nonce', '<nonce>');

// Public client
const verifier = await generateCodeVerifier();
const challenge = await generateCodeChallenge(verifier);
localStorage.setItem('code-verifier', verifier);

authorizationRequestUrl.searchParams.append('code_challenge', challenge);
authorizationRequestUrl.searchParams.append('code_challenge_method', 'S256');

window.location.href = authorizationRequestUrl.toString();

function Account() {
  return <div>Account</div>;
}

export default Account;
