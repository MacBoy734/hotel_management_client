import Hero from "./_components/Hero"
import MenuSection from "./_components/MenuSection"
import AboutSection from "./_components/AboutSection"
import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-gray-100 text-gray-900">
      <Hero />      
      <MenuSection />
      <AboutSection />
      {/* Menu Preview */}
      <section className="py-16 px-6 md:px-12 bg-gray-200 text-center">
        <h2 className="text-4xl font-bold">Popular Dishes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          {['/images/image_3.jpg', '/images/image_4.jpg', '/images/image_5.jpg'].map((img, idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg shadow-lg">
              <img src={`${img}`} alt="Dish" className="w-full h-56 object-cover rounded-lg" />
              <h3 className="text-xl font-semibold mt-4">Dish Name</h3>
              <p className="text-gray-600 mt-2">Short description of the dish.</p>
            </div>
          ))}
        </div>
        <Link className="mt-6 bg-yellow-500 text-black px-6 py-3 text-lg font-semibold rounded-full shadow-lg hover:bg-yellow-600 transition duration-300" href="/menu">
          See Full Menu
        </Link>
      </section>
      
      {/* Customer Reviews */}
      <section className="py-16 px-6 md:px-12 bg-white text-center">
        <h2 className="text-4xl font-bold">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {['Great food!', 'Best place in town!', 'Amazing service!'].map((review, idx) => (
            <div key={idx} className="bg-gray-100 p-6 rounded-lg shadow-md">
              <p className="text-lg italic">"{review}"</p>
              <p className="text-yellow-500 mt-2">★★★★★</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
