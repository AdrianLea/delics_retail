import {React} from 'react';

export default function Shipping() {
  return (
    <div className="px-5 md:px-20">
      <h1 className="text-4xl font-bold py-5">Shipping</h1>
      <h2 className="w-full font-bold text-xl py-5">Free Shipping</h2>
      <p>
        Check the table below for the minimum order amount to qualify for free
        shipping according to your region
      </p>
      <ShippingTable />
      <p className="py-2">
        <strong>
          <u>NOTE:</u>
        </strong>
        This is only a rough estimation of your shipping cost. The exact amount
        will be shown during checkout.
      </p>
      <h2 className="w-full font-bold text-xl py-5">
        How long does shipping usually take?
      </h2>
      <p className="pb-5">
        <strong>Malaysian orders:</strong>
        <br></br>
        Orders will be shipped out within 2-3 business days and take an
        additional 1-7 business days to arrive.
        <br></br>
        <strong>International orders:</strong>
        <br></br>
        Orders will be shipped out within 3-5 business days and take an
        additional 7-14 business days to arrive.
      </p>
    </div>
  );
}

function ShippingTable() {
  return (
    <div className="w-full mx-auto pt-2">
      <div className="w-full bg-black flex flex-row text-white py-1">
        <div className="w-[25%] h-auto m-auto text-center">Country</div>
        <div className="w-[25%] h-auto m-auto text-center">Shipping Cost</div>
        <div className="w-[25%] h-auto m-auto text-center">
          Order Amount (USD)
        </div>
        <div className="w-[25%] h-auto m-auto text-center">
          Order Amount (RM)
        </div>
      </div>
      {shippingData.data.map((item, index) => (
        <TableElement key={index} content={item} />
      ))}
    </div>
  );
}

function TableElement({content}) {
  return (
    <div className="w-full h-auto border-b flex flex-row box-border">
      <div className="w-[25%] h-auto flex flex-col justify-center text-center border-l box-border py-1">
        {content.Country}
      </div>
      <div className="w-[25%] h-auto flex flex-col justify-center text-center border-l box-border py-1">
        {content['Shipping Cost']}
      </div>
      <div className="w-[25%] h-auto flex flex-col justify-center  text-center border-l box-border py-1">
        {content['Order Amount (USD)']}
      </div>
      <div className="w-[25%] h-auto flex flex-col justify-center text-center border-l border-r box-border py-1">
        {content['Order Amount (RM)']}
      </div>
    </div>
  );
}

const shippingData = {
  data: [
    {
      Country: 'Malaysia',
      'Shipping Cost': 'MYR 15.00',
      'Order Amount (USD)': '$63.83',
      'Order Amount (RM)': 'MYR 300.00',
    },
    {
      Country: 'Singapore',
      'Shipping Cost': 'MYR 74.00',
      'Order Amount (USD)': '$220.00',
      'Order Amount (RM)': 'MYR 1,000.00',
    },
    {
      Country: 'Thailand',
      'Shipping Cost': 'MYR 76.00',
      'Order Amount (USD)': '$220.00',
      'Order Amount (RM)': 'MYR 1,000.00',
    },
    {
      Country: 'Vietnam',
      'Shipping Cost': 'MYR 78.00',
      'Order Amount (USD)': '$220.00',
      'Order Amount (RM)': 'MYR 1,000.00',
    },
    {
      Country: 'UK',
      'Shipping Cost': 'MYR 150.00',
      'Order Amount (USD)': '$220.00',
      'Order Amount (RM)': 'MYR 1,000.00',
    },
    {
      Country: 'Australia',
      'Shipping Cost': 'MYR 150.00',
      'Order Amount (USD)': '$220.00',
      'Order Amount (RM)': 'MYR 1,000.00',
    },
    {
      Country: 'US',
      'Shipping Cost': 'MYR 150.00',
      'Order Amount (USD)': '$220.00',
      'Order Amount (RM)': 'MYR 1,000.00',
    },
  ],
};
