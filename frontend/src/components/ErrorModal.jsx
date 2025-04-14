import React, { useState, useEffect } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";


const ErrorModal = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.8)] flex items-center justify-center z-50">
            <div className="flex flex-col justify-center items-center text-xl bg-white p-6 rounded-lg shadow-lg text-center w-full sm:w-96 md:w-80 lg:w-1/3 xl:w-1/4 h-auto max-w-full">
                <ExclamationCircleIcon className="w-16 h-16 text-bgRed500 mx-auto" />
                <h2 className="text-3xl font-semibold text-red-600 mt-2">ERROR</h2>
                <p className="text-gray-700 mt-3 text-lg">{message}</p>
                <button
                    onClick={onClose}
                    className="mt-10 bg-bgRed500 text-white px-4 py-2 rounded hover:bg-bgRed600 transition dark:bg-bgRed500 dark:hover:bg-bgRed600"
                >
                    Close
                </button>
            </div>
        </div>

    );
};

export default ErrorModal;
