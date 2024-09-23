"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import "@/stylesheets/navbar.scss";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // When clicking the hamburger menu
  const toggleNav = () => {
    setIsOpen(!isOpen);
    document.documentElement.dataset.navState = !isOpen ? "open" : "closed";
  };

  // When clicking a menu item link or logo, close the nav menu when redirecting
  const closeNav = () => {
    if (isOpen) {
      setIsOpen(false);
      document.documentElement.dataset.navState = "closed";
    }
  };

  // Close the navbar when you leave the page (when the url pathname changes)
  useEffect(() => {
    setIsOpen(false);
    document.documentElement.dataset.navState = "closed";
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <nav className="nav">
      <Link className="nav-logo" href="/" onClick={closeNav}>
        <img src="/static/images/logo.png" alt="Who is Halal" />
      </Link>
      <button
        className="nav-toggle"
        title="Toggle Menu"
        aria-label="Toggle navigation menu"
        onClick={toggleNav}
      >
        <div></div>
        <div></div>
        <div></div>
      </button>
      <ul className="nav-list">
        <div>
          <li style={{ "--transition-delay": "200ms" }}>
            <Link href="/" onClick={closeNav}>
              Home
            </Link>
          </li>
          {/* <li style={{ "--transition-delay": "300ms" }}>
            <Link href="#" onClick={closeNav}>
              About
            </Link>
          </li> */}
          <li style={{ "--transition-delay": "300ms" }}>
            <Link href="/contact" onClick={closeNav}>
              Contact
            </Link>
          </li>
        </div>
      </ul>
    </nav>
  );
}
