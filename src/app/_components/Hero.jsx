import React from 'react'
import Link from 'next/link'
const Hero = () => {
  const styles = {
    backgroundImage: '/images/image_2.jpg',
    backgroundColor: 'rgb(25, 42, 92)'
  }
  return (
    <section className="relative md:h-screen h-[50vh] bg-cover bg-center bg-fixed bg-blend-multiply flex items-center justify-center text-white text-center px-6 md:px-12 bg-[url('/images/image_8.jpg')]" style={styles}>
      <div className="absolute"></div>
      <div className="relative max-w-2xl">
        <h1 className="text-3xl md:text-5xl font-bold">Your Favourite Food Served Hot and Fresh!</h1>
        <p className="text-lg md:text-2xl mb-10 mt-4 opacity-80">Delicious homemade meals made with love.</p>
        <Link href="/menu" className=" bg-yellow-500 text-black px-6 py-3 text-lg font-semibold rounded-full shadow-lg hover:bg-yellow-600 transition duration-300">
          View Menu
        </Link>
      </div>
    </section>
  )
}

export default Hero