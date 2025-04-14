import React from "react";

const Navbar = () => {

    return (
        <nav className="z-50 fixed bg-white w-full px-8 py-2 flex justify-center items-center h-16 shadow-md">
            <div className="container mx-auto flex justify-center items-center">
                <a href="/" className="text-accentBlue font-bold text-2xl">MultiCropper</a>
            </div>
        </nav>
    );
}

export default Navbar;