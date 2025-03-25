import React from 'react'

const AboutSection = () => {
    return (
        <div>
            <section className="py-16 px-6 md:px-24 bg-sky-100 text-center flex flex-col md:flex-row justify-center items-center gap-10">
                <img src="/images/image_15.jpg" alt="Our Eatery" className="rounded-lg shadow-lg size-72" />
                <div>
                    <h2 className="text-3xl font-bold">About Us</h2>
                    <p className="text-lg mt-4 max-w-3xl mx-auto font-semibold">We've been serving the community with delicious homemade meals since 2015. Our goal is to provide a warm and friendly place where everyone can enjoy a great meal.</p>
                </div>
            </section>
        </div>
    )
}

export default AboutSection