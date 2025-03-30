import React, { useState, useEffect } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";


const ErrorModal = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="flex flex-col justify-center items-center  text-xl bg-white p-6 rounded-lg shadow-lg text-center w-100 h-100">
                <ExclamationCircleIcon className="w-25 h-25 text-red-500 mx-auto" />
                <h2 className="text-3xl font-semibold text-red-600 mt-2">ERROR</h2>
                <p className="text-gray-700 mt-3 text-lg">{message}</p>
                <button
                    onClick={onClose}
                    className="mt-10 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ErrorModal;
