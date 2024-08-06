import {React, useState, useRef, forwardRef} from 'react';
import {gsap} from 'gsap';
import {useGSAP} from '@gsap/react';
export default function Faq() {
  return (
    <>
      <h1 className="px-[5%] md:px-[10%] text-4xl font-bold py-5">
        {' '}
        Popular FAQs
      </h1>
      <h2 className="text-2xl font-bold py-5 px-[5%] md:px-[10%]">
        1. Shipping
      </h2>
      {shippingQNA.data.map((item, index) => (
        <QuestionSection
          key={index}
          question={item.question}
          answer={item.answer}
        />
      ))}
      <h2 className="text-2xl font-bold py-5 px-[5%] md:px-[10%]">
        2. Online Orders & Payments
      </h2>
      {onlineOrderandPayments.data.map((item, index) => (
        <QuestionSection
          key={index}
          question={item.question}
          answer={item.answer}
        />
      ))}
      <h2 className="text-2xl font-bold py-5 px-[5%] md:px-[10%]">
        3. Exchange and Return Policy
      </h2>
      {exchangePolicy.data.map((item, index) => (
        <QuestionSection
          key={index}
          question={item.question}
          answer={item.answer}
        />
      ))}
      <div className="py-10"></div>
    </>
  );
}

function QuestionBar({onDropdownClick, isOpen, question}) {
  return (
    <div className="w-full min-h-10 h-auto py-2 md:min-h-12 bg-white flex flex-row shadow-lg">
      <div className="flex flex-grow h-auto text-black font-bold my-auto px-4">
        {question}
      </div>
      <button
        className="w-auto h-auto bg-inherit my-auto px-3"
        onClick={() => onDropdownClick()}
      >
        <svg
          className={`transition-transform duration-300 ${
            isOpen ? 'rotate-45' : ''
          }`}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="10" y="4" width="4" height="16" fill="black" />
          <rect x="4" y="10" width="16" height="4" fill="black" />
        </svg>
      </button>
    </div>
  );
}

const AnswerBar = forwardRef(({answer}, ref) => {
  return (
    <div className="h-0 opacity-0 w-full overflow-hidden px-4" ref={ref}>
      <div className="py-2" dangerouslySetInnerHTML={{__html: answer}}></div>
    </div>
  );
});

function QuestionSection({question, answer}) {
  const [isOpen, setOpen] = useState(false);
  const answerBarRef = useRef();
  const parentRef = useRef();
  const {contextSafe} = useGSAP();
  const onDropdownClick = contextSafe(() => {
    if (isOpen) {
      gsap.to(answerBarRef.current, {
        height: 0,
        opacity: 0,
      });
    } else {
      gsap.to(answerBarRef.current, {
        height: 'auto',
        opacity: 1,
      });
    }
    setOpen(!isOpen);
  });

  return (
    <div
      className="w-full px-[5%] md:px-[10%] border-b border-b-white"
      ref={parentRef}
    >
      <QuestionBar
        onDropdownClick={onDropdownClick}
        isOpen={isOpen}
        question={question}
      />
      <AnswerBar ref={answerBarRef} answer={answer} />
    </div>
  );
}

const shippingQNA = {
  data: [
    {
      question: 'How long does shipping usually take?',
      answer:
        '<p className="font-bold underline">Malaysian Orders:</p><p>&bull; Orders will be shipped out within 2-3 business days and take an additional 1-7 business days to arrive.</p><p className="font-bold underline">International Orders:</p><p>&bull; Orders will be shipped out within 3-5 business days and take an additional 7-14 business days to arrive.</p>',
    },
    {
      question: 'How do I track my package?',
      answer:
        '<p>&bull; Once your order is shipped, you will receive a tracking number via email. You can use this number to track your order on our website or the carrier’s website.</p><p>&bull; Contact the Delics World Team <a style="color: blue;" href="mailto:contact@delicsworld.com">contact@delicsworld.com</a> if you have yet to receive a tracking number within 7 business days after your purchase.</p>',
    },
    {
      question: 'What if I have not yet received my tracking number?',
      answer:
        '<p>&bull; If you receive the wrong product, please contact our customer service team immediately at <a style="color: blue;" href="mailto:contact@delicsworld.com">contact@delicsworld.com</a>. Provide your order number and a description of the issue. We will assist you in returning the incorrect item and ensure that the correct product is shipped to you as quickly as possible.</p>',
    },
    {
      question:
        'What should I do if I have been charged incorrectly for my order?',
      answer:
        '<p>&bull; If you believe you have been charged incorrectly for your order, please contact our customer service team at <a style="color: blue;" href="mailto:contact@delicsworld.com">contact@delicsworld.com</a> as soon as possible.</p><p>&bull; Provide your order number and details of the incorrect charge. We will investigate the issue and work to resolve it promptly, including issuing any necessary refunds.</p>',
    },
    {
      question: 'Can I pick up my order in Store?',
      answer:
        '<p>&bull; Yes. For customers in Malaysia, you have the option to pick up your order in-store at checkout. Orders picked up in-store will incur no additional charges (RM0).</p>',
    },
    {
      question: 'Do you ship internationally?',
      answer:
        '<p>&bull; Yes, we ship worldwide. Shipping costs and delivery times vary depending on the destination</p>',
    },
    {
      question:
        'Are customs, duties, and taxes included in international Order?',
      answer:
        '<p>&bull; Customs, duties, and taxes are not included in the item price or shipping cost. We ship all international orders delivery duties unpaid (DDU), which means any fees are charged once the parcel reaches its destination and must be paid by the recipient.</p><p>&bull; Unfortunately, these fees are beyond our control, and we are unable to cover them for our customers.</p>',
    },
    {
      question: 'How do I contact Delics World customer service?',
      answer:
        '<p>&bull; You can reach our customer service team via email at <a style="color: blue;" href="mailto:contact@delicsworld.com">contact@delicsworld.com</a> We strive to respond to all inquiries within 24 hours.</p>',
    },
  ],
};

const onlineOrderandPayments = {
  data: [
    {
      question: 'How do I place an order?',
      answer:
        '<p>&bull; To place an order, browse our website, select the items you wish to purchase, choose your size and color, and add them to your cart. Once you’re ready, proceed to checkout, enter your shipping and payment information, and confirm your order.</p>',
    },
    {
      question: 'How do I determine my size?',
      answer:
        '<p>&bull; We have a size guide available on our website. Please refer to it to find the best fit for you. If you need further assistance, feel free to browse our Instagram <a style="color: blue;" href="https://www.instagram.com/delicsworld" target="_blank">@delicsworld</a> or contact our customer service team at <a style="color: blue;" href="mailto:contact@delicsworld.com">contact@delicsworld.com</a>.</p>',
    },
    {
      question: 'What if my order is damaged or defective?',
      answer:
        '<p>&bull; If you receive a damaged or defective item, please contact us immediately at <a style="color: blue;" href="mailto:contact@delicsworld.com">contact@delicsworld.com</a>. We will arrange for a replacement item to be sent to you at no additional cost.</p>',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        '<p>&bull; We accept major credit cards (Visa, MasterCard, American Express), PayPal, and other secure payment methods as listed at checkout.</p>',
    },
  ],
};

const exchangePolicy = {
  data: [
    {
      question: 'What is your return policy?',
      answer: `
        <p>At Delics World, we want you to be completely satisfied with your purchase. If you are not satisfied for any reason, we offer a straightforward return policy to make your shopping experience enjoyable and hassle-free.</p>
        <br></br>
        <p><strong style="font-size: 1.2em;">Eligibility for Returns:</strong></p>
        <p>&bull; Items must be unworn, unwashed, and in their original condition with tags attached.</p>
        <p>&bull; Returns must be initiated within 30 days of the original purchase date.</p>
        <p>&bull; Final sale items, including clearance and promotional items, are not eligible for returns.</p>
        <br></br>
        <p><strong style="font-size: 1.2em;">Initiating a Return:</strong></p>
        <p>&bull; To initiate a return, contact our customer service team at <a style="color: blue;" href="mailto:contact@delicsworld.com">contact@delicsworld.com</a> with your order number, the item(s) you wish to return, and the reason for the return.</p>
        <p>&bull; Our customer service team will provide you with instructions on how to proceed with your return.</p>
        <br></br>
        <p><strong style="font-size: 1.2em;">Returning the Item:</strong></p>
        <p>&bull; You will be responsible for the shipping costs associated with returning the item.</p>
        <p>&bull; We recommend using a trackable shipping method to ensure your item is returned safely. We are not responsible for lost or damaged returns.</p>
        <br></br>
        <p><strong style="font-size: 1.2em;">Processing the Refund:</strong></p>
        <p>&bull; Once we receive your returned item, we will inspect it to ensure it meets our return criteria.</p>
        <p>&bull; If the item is eligible for a return, we will process a refund for the purchase price (excluding any shipping costs) using the original payment method.</p>
        <p>&bull; You will receive a confirmation email once the refund is processed.</p>
        <p>&bull; Please allow up to 5-7 business days for the refund to reflect on your account, depending on your financial institution.</p>
        <br></br>
        <p><strong style="font-size: 1.2em;">Exchanges:</strong></p>
        <p>&bull; If you wish to exchange an item, please refer to our Exchange Policy for further instructions.</p>
        <br></br>
        <p><strong style="font-size: 1.2em;">Damaged or Defective Items:</strong></p>
        <p>&bull; If you receive a damaged or defective item, please contact us immediately at <a style="color: blue;" href="mailto:contact@delicsworld.com">contact@delicsworld.com</a>. We will arrange for a replacement item to be sent to you at no additional cost, or if preferred, issue a full refund for the damaged or defective item.</p>
        <br></br>
        <p><strong style="font-size: 1.2em;">International Returns:</strong></p>
        <p>&bull; For international returns, customers are responsible for all shipping costs, customs duties, and taxes associated with the return process.</p>
        <p>&bull; We recommend contacting our customer service team for specific instructions on international returns.</p>
        <br></br>
        <p><strong style="font-size: 1.2em;">Contact Us:</strong></p>
        <p>&bull; For any questions or concerns regarding our return policy, please contact our customer service team at <a style="color: blue;" href="mailto:contact@delicsworld.com">contact@delicsworld.com</a>. We are here to assist you and ensure your shopping experience with us is enjoyable.</p>
      `,
    },
    {
      question: 'What is your exchange policy?',
      answer: `
        <p>At Delics World, we want you to be completely satisfied with your purchase. If you are not satisfied for any reason, we offer a straightforward exchange policy to make your shopping experience enjoyable and hassle-free.</p>
        <br></br>
        <p><strong style="font-size: 1.2em;">Eligibility for Exchanges:</strong></p>
        <p>&bull; Items must be unworn, unwashed, and in their original condition with tags attached.</p>
        <p>&bull; Exchanges must be initiated within 30 days of the original purchase date.</p>
        <p>&bull; Final sale items, including clearance and promotional items, are not eligible for exchanges.</p>
        <br></br>
        <p><strong style="font-size: 1.2em;">Initiating an Exchange:</strong></p>
        <p>&bull; To initiate an exchange, contact our customer service team at <a style="color: blue;" href="mailto:contact@delicsworld.com">contact@delicsworld.com</a> with your order number, the item(s) you wish to exchange, and the reason for the exchange.</p>
        <p>&bull; Our customer service team will provide you with instructions on how to proceed with your exchange.</p>
        <br></br>
        <p><strong style="font-size: 1.2em;">Returning the Item for Exchange:</strong></p>
        <p>&bull; You will be responsible for the shipping costs associated with returning the item for exchange.</p>
        <p>&bull; We recommend using a trackable shipping method to ensure your item is returned safely. We are not responsible for lost or damaged returns.</p>
        <br></br>
        <p><strong style="font-size: 1.2em;">Processing the Exchange:</strong></p>
        <p>&bull; Once we receive your returned item, we will inspect it to ensure it meets our exchange criteria.</p>
        <p>&bull; If the item is eligible for an exchange, we will process the exchange and send you the new item.</p>
        <p>&bull; You will receive a confirmation email once the exchange is processed.</p>
        <br></br>
        <p><strong style="font-size: 1.2em;">Damaged or Defective Items:</strong></p>
        <p>&bull; If you receive a damaged or defective item, please contact us immediately at <a style="color: blue;" href="mailto:contact@delicsworld.com">contact@delicsworld.com</a>. We will arrange for a replacement item to be sent to you at no additional cost, or if preferred, issue a full refund for the damaged or defective item.</p>
        <br></br>
        <p><strong style="font-size: 1.2em;">International Exchanges:</strong></p>
        <p>&bull; For international exchanges, customers are responsible for all shipping costs, customs duties, and taxes associated with the exchange process.</p>
        <p>&bull; We recommend contacting our customer service team for specific instructions on international exchanges.</p>
        <br></br>
        <p><strong style="font-size: 1.2em;">Contact Us:</strong></p>
        <p>&bull; For any questions or concerns regarding our exchange policy, please contact our customer service team at <a style="color: blue;" href="mailto:contact@delicsworld.com">contact@delicsworld.com</a>. We are here to assist you and ensure your shopping experience with us is enjoyable.</p>
      `,
    },
  ],
};
