export const storefrontCustomerAccessTokenCreate = `#graphql
    mutation storefrontCustomerAccessTokenCreate {
    storefrontCustomerAccessTokenCreate {
        customerAccessToken
        userErrors {
        field
        message
        }
    }
    }
`;
