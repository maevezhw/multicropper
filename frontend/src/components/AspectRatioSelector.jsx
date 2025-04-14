import React, { useState } from "react";

const AspectRatioSelector = ({ setAspectRatio }) => {
    const [selectedAspectRatio, setSelectedAspectRatio] = useState("FreeForm");
    const [customWidth, setCustomWidth] = useState("");
    const [customHeight, setCustomHeight] = useState("");

    const handleAspectRatioChange = (e) => {
        const value = e.target.value;
        setSelectedAspectRatio(value);

        if (value === "Custom") {
            setAspectRatio(null); 
        } else if (value === "FreeForm") {
            setAspectRatio(null); 
        }  else {
            const ratios = {
                "1:1": 1,
                "16:9": 16 / 9,
                "4:3": 4 / 3
            };
            setAspectRatio(ratios[value]);
        }
    };

    return (
        <div className="mt-4">
            <label className="text-gray-600 text-lg font-normal mb-2 block">
                Aspect Ratio
            </label>
            <select 
                value={selectedAspectRatio} 
                onChange={handleAspectRatioChange} 
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="FreeForm">FreeForm</option>
                <option value="1:1">1:1</option>
                <option value="16:9">16:9</option>
                <option value="4:3">4:3</option>
                <option value="Custom">Custom</option>
            </select>

            {selectedAspectRatio === "Custom" && (
                <div className="mt-3 flex gap-2 justify-center items-center">
                    <input 
                        placeholder="Width Ratio"
                        value={customWidth}
                        onChange={(e) => {
                            const newWidth = e.target.value
                            setCustomWidth(newWidth)
                            setAspectRatio(Number(newWidth) / Number(customHeight))
                        }}
                        className="border border-gray-300 rounded-md px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-600 text-lg font-medium">:</span>
                    <input 
                        placeholder="Height Ratio"
                        value={customHeight}
                        onChange={(e) => {
                            const newHeight = e.target.value
                            setCustomHeight(newHeight)
                            setAspectRatio(Number(customWidth) / Number(newHeight))
                        }}
                        className="border border-gray-300 rounded-md px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            )}
        </div>
    );
};

export default AspectRatioSelector;
