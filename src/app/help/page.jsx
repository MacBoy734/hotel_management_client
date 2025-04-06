'use client'

export default function HelpPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 text-center text-green-700">How to Use Our Website</h1>

      <div className="space-y-10 text-gray-700 leading-relaxed">
        {/* Ordering Food */}
        <section>
          <h2 className="text-2xl font-semibold text-green-600 mb-2">🍽️ How to Order</h2>
          <p>
            Visit our <a href="/menu" className="text-green-500 underline">Menu</a> page, browse your favorite dishes,
            and click <span className="font-medium">“Add to Basket</span> for what you want. When done, head to the cart and proceed to checkout.
          </p>
        </section>

        {/* Cart & Checkout */}
        <section>
          <h2 className="text-2xl font-semibold text-green-600 mb-2">🛒 Cart & Checkout</h2>
          <p>
            You can edit items in your basket / cart at any time. At checkout, enter your contact info, choose pickup or delivery,
            then confirm the order.
          </p>
        </section>

        {/* Payment */}
        <section>
          <h2 className="text-2xl font-semibold text-green-600 mb-2">💳 Payments</h2>
          <p>
            We currently support <span className="font-medium">Mpesa</span> and <span className="font-medium">cash on delivery</span>.
            Your transactions are safe and secure. After placing your order, you'll get a confirmation via SMS or email.
          </p>
        </section>

        {/* Delivery */}
        <section>
          <h2 className="text-2xl font-semibold text-green-600 mb-2">🚚 Delivery & Pickup</h2>
          <p>
            We Deliver Food to your working area. it takes around 15 to 20minutes after Ordering.
          </p>
        </section>

        {/* Account Info */}
        <section>
          <h2 className="text-2xl font-semibold text-green-600 mb-2">🔐 Account & Security</h2>
          <p>
            Security is paramount in Our website. incase you forget your password you can simply Reset it by going to the login and entering a wrong password. Then click on reset password and input your email. A reset Link will be sent to your email with the instructions.
          </p>
        </section>

        {/* Still Need Help */}
        <section>
          <h2 className="text-2xl font-semibold text-green-600 mb-2">❓ Still Need Help?</h2>
          <p>
            Check out our <a href="help/FAQS" className="text-green-500 underline">FAQs</a> or
            <a href="/help/contact-support" className="text-green-500 underline ml-1">Contact Support</a> page.
            We’re always happy to assist you!
          </p>
        </section>
      </div>
    </main>
  )
}
