"use client"
import { useState } from "react";
import { FaShippingFast, FaPhoneAlt, FaQuestionCircle, FaRegCreditCard, FaUndo, FaPlus, FaMinus } from "react-icons/fa";

const faqs = [
  { question: "How do I place an order?", answer: "You can place an order by selecting a product and proceeding to checkout." },
  { question: "What payment methods do you accept?", answer: "We accept credit/debit cards, PayPal, and mobile payments." },
  { question: "How can I track my order?", answer: "Once your order is shipped, you'll receive a tracking link via email." },
  { question: "How do I return an item?", answer: "You can return an item within 14 days of delivery. Check our return policy for more details." },
  { question: "How can I contact support?", answer: "Reach out via email at support@yourstore.com or call +254 700 123 456." }
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mx-auto md:p-6 p-3 space-y-6 text-black">
      <h1 className="text-3xl font-bold text-center">Help & Support</h1>
      
      {/* FAQ Section */}
      <section className="bg-gray-100 p-6 rounded-lg shadow-md text-black">
        <h2 className="text-xl font-semibold flex items-center gap-2"><FaQuestionCircle /> FAQs</h2>
        <div className="mt-3 space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <button
                className="flex justify-between w-full text-left font-semibold text-lg"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                {openIndex === index ? <FaMinus /> : <FaPlus />}
              </button>
              {openIndex === index && <p className="mt-2 text-gray-700">{faq.answer}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Order & Shipping Help */}
      <section className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 text-black">
        <h2 className="text-xl font-semibold flex items-center gap-2"><FaShippingFast /> Order & Shipping</h2>
        <p className="mt-2">Track your order, estimate delivery times, and learn about shipping policies.</p>
      </section>

      {/* Payments & Refunds */}
      <section className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
        <h2 className="text-xl font-semibold flex items-center gap-2"><FaRegCreditCard /> Payments & Refunds</h2>
        <p className="mt-2">We accept multiple payment methods. Refunds are processed within 5-7 business days.</p>
      </section>

      {/* Returns & Exchanges */}
      <section className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
        <h2 className="text-xl font-semibold flex items-center gap-2"><FaUndo /> Returns & Exchanges</h2>
        <p className="mt-2">Easy returns within 14 days. Check our return policy for more details.</p>
      </section>

      {/* Contact Support */}
      <section className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold flex items-center gap-2"><FaPhoneAlt /> Contact Support</h2>
        <p className="mt-2">Need help? Reach us via:</p>
        <ul className="mt-2">
          <li>Email: <span className="font-semibold">support@macboy.com</span></li>
          <li>Phone: <span className="font-semibold">+254 790 450 348</span></li>
        </ul>
      </section>
    </div>
  );
}
