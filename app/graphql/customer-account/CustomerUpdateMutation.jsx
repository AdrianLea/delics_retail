export const CUSTOMER_UPDATE_MUTATION = `#graphql
  mutation customerUpdate($input: CustomerUpdateInput!) {
    customerUpdate(input: $input) {
      userErrors {
        field
        message
      }
      customer {
        firstName
        lastName
        phoneNumber {
          phoneNumber
        }
        emailAddress {
          emailAddress
        }
      }
    }
  }
`;
