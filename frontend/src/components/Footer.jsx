import React from "react";

const Footer = () => {
  return (
    <footer className="bg-textDark text-white text-center py-6 px-5 border-t-1 border-gray-800">
      <p className="text-sm">&copy; 2025 Maeve Zahwa ACZ. All rights reserved.</p>
      <div className="flex justify-center space-x-6 mt-2">
        <a href="https://github.com/maevezhw/multicropper" className="hover:text-gray-300 transition">Github</a>
        <a href="https://www.linkedin.com/in/maeve-zahwa-acz/" className="hover:text-gray-300 transition">LinkedIn</a>
      </div>
    </footer>
  );
};

export default Footer;
