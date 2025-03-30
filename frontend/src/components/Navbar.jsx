import React from "react";

const Navbar = () => {
    const navItems = [
        { label: "Try Yourself", href: "upload" }, 
        { label: "How to Use", href: "#" }
    ]

    return (
        <nav className="z-50 fixed bg-white w-full px-8 py-2 flex justify-center items-center h-16 shadow-md">
            <div className="container mx-auto flex justify-center items-center">
                <a href="/" className="text-accentBlue font-bold text-2xl">MultiCropper</a>

                {/* <ul className="flex space-x-10">
                    {navItems.map((item, index) => (
                        <li key={index} className="text-textDark font-medium hover:bg-accentBlue hover:text-bgWhite hover:rounded-full px-3 py-1 ">
                            <a href={item.href}>{item.label}</a>
                        </li>
                    ))}
                </ul> */}
            </div>
        </nav>
    );
}

export default Navbar;