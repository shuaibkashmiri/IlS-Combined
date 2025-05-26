"use client";
import Navbar from "./sharedComponents/Navbar";
import Footer from "./sharedComponents/Footer";

export default function BangloreLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
