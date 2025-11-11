import { useState } from "react";
import { InfoIcon } from "../icons/icons";

export const TooltipDescriptionNode = ({ text }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {text && (
                <div className="cursor-pointer">
                    <InfoIcon color={"text-gray-200"} />
                </div>
            )}

            {showTooltip && (
                <div className="absolute top-6 right-0 z-50 w-48">
                    <div className="bg-gray-800 border border-slate-700 text-gray-100 text-xs rounded-lg px-3 py-2">
                        {text}
                    </div>
                </div>
            )}
        </div>
    );
};
