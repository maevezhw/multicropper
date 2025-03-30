import React, { useState, useEffect } from "react";

const LoadingModal = ({ isOpen }) => {
    const [dots, setDots] = useState("");

    useEffect(() => {
        if (!isOpen) return;

        const interval = setInterval(() => {
            setDots(prev => (prev.length < 3 ? prev + "." : ""));
        }, 500);

        return () => clearInterval(interval);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="flex justify-center items-center text-xl bg-white p-6 rounded-lg shadow-lg text-center w-50 h-30 font-medium text-accentBlue">
                <p>Processing{dots}</p>
            </div>
        </div>
    );
};

export default LoadingModal;
