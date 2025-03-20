import React from "react";

const Navbar = () => {
    const navItems = [
        { label: "Try Yourself", href: "upload" }, 
        { label: "Features", href: "#" }, 
        { label: "How to Use", href: "#" }
    ]

    return (
        <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-full px-8 py-4 flex justify-center items-center w-screen max-w-6xl">
            <div className="container mx-auto flex justify-between items-center">
                <a href="/" className="text-textDark font-bold text-2xl">MultiCropper</a>

                <ul className="flex space-x-10">
                    {navItems.map((item, index) => (
                        <li key={index} className="text-textDark font-medium hover:bg-accentBlue hover:text-bgWhite hover:rounded-full px-3 py-1">
                            <a href={item.href}>{item.label}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;