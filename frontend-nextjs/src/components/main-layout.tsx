"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header/Header";
import { GrMail } from "react-icons/gr";
import Footer from "@/components/footer/Footer";
import ButtonGoToTop from "@/components/custom/ButtonGoToTop";
import NavContact from "@/components/custom/NavContact";

export default function MainLayout({
  children,
  authPage = false,
  coursePage = false,
}: Readonly<{
  children: React.ReactNode;
  authPage?: boolean;
  coursePage?: boolean;
}>) {
  const [showButton, setShowButton] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = document.documentElement.scrollTop;

      if (scrolled > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll,);
    };
  }, []);

  return (
    <div className={`w-screen max-w-full `}>
      {!authPage && !coursePage && (
        <div className="">
          <NavContact
            contentLeft={
              <span className="flex gap-1 items-center">
                <GrMail />
                openlab.user@gmail.com
              </span>
            }
          />
        </div>
      )}

      {!authPage && (
        <header
          className={`transition-all ease-in delay-200 h-fit ${
            showButton ? "fixed z-20 inset-0" : ""
          }`}
        >
          <Header />
        </header>
      )}

      {children}

      <ButtonGoToTop />

      {!authPage && !coursePage && <Footer />}
    </div>
  );
}
