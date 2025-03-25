import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactSupport() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 text-black">
      <h1 className="text-3xl font-bold text-center">Contact Support</h1>
      
      <section className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold flex items-center gap-2"><FaPhoneAlt /> Phone Support</h2>
        <p className="mt-2">Need immediate assistance? Call us:</p>
        <p className="font-semibold">+254 790 450 348</p>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
        <h2 className="text-xl font-semibold flex items-center gap-2"><FaEnvelope /> Email Support</h2>
        <p className="mt-2">For non-urgent queries, email us at:</p>
        <p className="font-semibold">support@macboy.com</p>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
        <h2 className="text-xl font-semibold flex items-center gap-2"><FaMapMarkerAlt /> Our Office</h2>
        <p className="mt-2">Visit our office at:</p>
        <p className="font-semibold">123 E-commerce St, Nairobi, Kenya</p>
      </section>

      <section className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">Business Hours</h2>
        <p className="mt-2">Monday - Friday: 9:00 AM - 6:00 PM</p>
        <p>Saturday: 10:00 AM - 4:00 PM</p>
        <p>Sunday: Closed</p>
      </section>
    </div>
  );
}
