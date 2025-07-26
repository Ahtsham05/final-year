import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="flex flex-col lg:flex-row lg:justify-between container mx-auto p-3">
        <p className="text-center lg:text-left">Alright Reserved &copy; BlinkeyIt 2025 Developed By Ahtsham Ali</p>
        <div className="flex items-center justify-center gap-5 text-xl">
          <Link to={"/"}>
            <FaFacebook className="hover:text-primary200 cursor-pointer" />
          </Link>
          <Link to={"/"}>
            <FaLinkedin className="hover:text-primary200 cursor-pointer" />
          </Link>
          <Link to={"/"}>
            <FaInstagramSquare className="hover:text-primary200 cursor-pointer" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
