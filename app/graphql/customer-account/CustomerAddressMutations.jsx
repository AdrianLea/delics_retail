export const CUSTOMER_ADDRESS_DELETE = `#graphql
    mutation customerAddressDelete($addressId: ID!) {
    customerAddressDelete(addressId: $addressId) {
        deletedAddressId
        userErrors {
        field
        message
        }
    }
 }
`;

export const CUSTOMER_ADDRESS_UPDATE = `#graphql
mutation customerAddressUpdate($addressId: ID!, $address: CustomerAddressInput!, $defaultAddress: Boolean ) {
  customerAddressUpdate(address: $address, addressId: $addressId, defaultAddress: $defaultAddress) {
    customerAddress {
      address1
      address2
      city
      firstName
      lastName
      phoneNumber
      territoryCode
      zip
      zoneCode
    }
    userErrors {
      code
      field
      message
    }
  }
}
`;

export const CUSTOMER_ADDRESS_CREATE = `#graphql
  mutation customerAddressCreate($address: CustomerAddressInput!, $defaultAddress: Boolean) {
    customerAddressCreate(address: $address, defaultAddress: $defaultAddress) {
      customerAddress {
        address1
        address2
        city
        company
        country
        firstName
        formatted
        formattedArea
        id
        lastName
        name
        phoneNumber
        province
        territoryCode
        zip
        zoneCode
      }
      userErrors {
        field
        message
      }
    }
  }
`;
