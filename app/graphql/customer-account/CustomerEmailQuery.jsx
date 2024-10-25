export const CUSTOMER_EMAIL_QUERY = `#graphql
  query customerEmail {
    customer {
      emailAddress {
        emailAddress
        marketingState
      }
    }
  }
`;
