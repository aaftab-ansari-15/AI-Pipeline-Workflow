import { Handle, Position } from "reactflow";
import { nodeHandleColors } from "./themeNode";

export const HandleNode = ({
    id,
    type = "source",
    position = Position.Right,
    category,
    style
}) => {
    const nodeHandleColor = nodeHandleColors[category] || "white";
    return (
        <Handle
            id={id}
            type={type}
            position={position}
            className={`!w-2.5 !h-2.5 rounded-full border border-slate-700`}
            style={{ top: style.top, background: nodeHandleColor }}
        />
    );
};
