"use client"
import "./globals.css";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import { Provider } from "react-redux";
import { ToastContainer } from 'react-toastify'
import { store } from '../store/store'



export default function RootLayout({ children }) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body
         className={`flex flex-col min-h-screen font-[roboto]`}
        >
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <ToastContainer />
        </body>
      </html>
    </Provider>
  );
}
