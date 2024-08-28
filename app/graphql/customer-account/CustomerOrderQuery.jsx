export const CUSTOMER_ORDER_QUERY = `#graphql

  fragment Money on MoneyV2 {
    amount
    currencyCode
  }
  fragment AddressFull on CustomerAddress {
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
  
  
  fragment Fulfillment on Fulfillment{
    createdAt
    estimatedDeliveryAt
    id
    isPickedUp
    latestShipmentStatus
    requiresShipping
    status
    updatedAt
    events(first : 100) {
			edges {
				node {
					happenedAt
					id
					status
				}
			}
    }
    fulfillmentLineItems(first : 100) {
			edges {
				node {
					id
					lineItem {
						price {
							...Money
						}
						title
					}
					quantity
				}
			}
    }
  }
  
  

  query CustomerOrder($orderId: ID!) {
     
    order(id: $orderId) {
      ... on Order {
        fulfillments(first : 100) {
          edges {
						node {
							...Fulfillment
						}
        }
        }
        billingAddress {
          ...AddressFull
        }
        cancelReason
        cancelledAt
        confirmationNumber
        createdAt
        currencyCode
        financialStatus
        locationName
        name
        note
        number
        paymentInformation {
					totalPaidAmount {
						...Money
					}
        }
        poNumber
        processedAt
        refunds {
					createdAt
					id
					returnName
					totalRefunded {
							...Money
					}
					updatedAt
        }
        requiresShipping
        shippingAddress {
					...AddressFull
        }
        shippingDiscountAllocations {
					allocatedAmount {
							...Money
					}
            
					discountApplication {
						allocationMethod
						targetSelection
						targetType
						value {
							...Money
						}
					}
        }
        shippingLine {
					handle
					originalPrice {
						...Money
					}
					title
        }
        statusPageUrl
        subtotal {
          ...Money
        }
        totalDuties {
          ...Money
        }
        totalPrice {
          ...Money
        }
        totalRefunded {
          ...Money
        }
        totalShipping {
          ...Money
        }
        totalTax {
          ...Money
        }
        totalTip {
          ...Money
        }
			}    
    }
	}

`;
