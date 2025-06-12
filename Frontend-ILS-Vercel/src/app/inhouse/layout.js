"use client";
import Footer from "../banglore/sharedComponents/Footer";
import InHouseNavbar from "./InHouseNavbar";

export default function BangloreLayout({ children }) {
  return (
    <>
      <InHouseNavbar />
      {children}
      <Footer />
    </>
  );
}
