const ContactSection = () => {
    return (
      <section className="bg-gray-100 py-16 px-6 md:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Contact & Location</h2>
          <p className="text-gray-600 mt-2">Get in touch with us for orders, reservations, or inquiries!</p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
          {/* Contact Details */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">📞 Contact Us</h3>
            <p className="text-gray-600 mb-2"><strong>📍 Address:</strong> 123 Main Street, Nairobi, Kenya</p>
            <p className="text-gray-600 mb-2"><strong>☎ Phone:</strong> +254 790 450 348</p>
            <p className="text-gray-600 mb-2"><strong>📧 Email:</strong> support@eaterystore.com</p>
            <p className="text-gray-600"><strong>⏰ Opening Hours:</strong> Mon - Sun, 8 AM - 10 PM</p>
            
            {/* Social Media Links */}
            <div className="mt-4 flex gap-4">
              <a href="https://facebook.com" className="text-blue-600 text-2xl hover:scale-110 transition"><i className="fa-brands fa-facebook"></i></a>
              <a href="https://instagram.com" className="text-pink-500 text-2xl hover:scale-110 transition"><i className="fa-brands fa-instagram"></i></a>
              <a href="https://twitter.com" className="text-blue-400 text-2xl hover:scale-110 transition"><i className="fa-brands fa-twitter"></i></a>
            </div>
          </div>
  
          {/* Google Maps (Embed) */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <iframe
              className="w-full h-64 md:h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.017509058862!2d36.8219!3d-1.286389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17336c3a4b5d%3A0xf1b7e7f83d3a3b07!2sNairobi!5e0!3m2!1sen!2ske!4v1649829497583!5m2!1sen!2ske"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    );
  };
  
  export default ContactSection;
  