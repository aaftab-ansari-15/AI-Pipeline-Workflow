import { useState } from "react";
import { nodeSelectClasses, nodeTextInputClassesFoucs } from "./themeNode";

export const InputTypeNode = ({ type, category }) => {
    const [inputType, setInputType] = useState(type || "Text");
    const focusColor = nodeTextInputClassesFoucs[category];

    return (
        <div>
            <div>
                <label className="text-gray-300 text-sm font-medium">Type</label>
            </div>

            <select
                value={inputType}
                onChange={(e) => setInputType(e.target.value)}
                className={`${nodeSelectClasses} ${focusColor} mt-2 w-[50%] transition-all duration-300 ease-in-out`}
            >
                <option value="Text">Text</option>
                <option value="File">File</option>
            </select>
        </div>
    );
};
