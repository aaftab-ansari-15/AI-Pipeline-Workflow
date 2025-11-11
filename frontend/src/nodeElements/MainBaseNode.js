import { memo, useEffect } from "react";
import { HandleNode } from "./HandleNode";
import { Position, useUpdateNodeInternals } from "reactflow";
import { TextNode } from "./TextNode";
import { TooltipDescriptionNode } from "./TooltipDescriptionNode";
import { InputTypeNode } from "./InputTypeNode";
import { baseNodeClasses, nodeColors, nodeHeaderColors } from "./themeNode";
import { InputNode } from "./InputNode";
import { useStore } from "../store";

export const MainBaseNode = memo(
    ({
        data,
        id,
        nodeId,
        category,
        title,
        icon,
        variableInputFields,
        tooltipDescription,
        normalInputFields = [],
        inputs = [],
        outputs = [],
    }) => {

        const nodeColorClass = nodeColors[category] || nodeColors.process;
        const IconComponent = icon;

        const nodeHandles = useStore((s) => s.nodeHandles);
        const handles = nodeHandles[id] || { left: [], right: [] };
        const updateNodeInternals = useUpdateNodeInternals();

        useEffect(() => {
            console.log(`🔄 useUpdateNodeInternals(${id}) triggered`);
            updateNodeInternals(id);
        }, [updateNodeInternals, handles.left.length, handles.right.length, id]);
        return (
            <div
                id={`${nodeId}_${id}`}
                className={`relative w-fit h-fit min-w-[200px] min-h-[200px] pb-12 
                    ${baseNodeClasses}
                    ${nodeColorClass}
                    hover:brightness-150 transition-all duration-300 ease-in-out`}>
                <div className="flex justify-between items-center mb-2">
                    <div className={`flex items-center font-bold ${nodeHeaderColors[category] || "text-gray-100"}`}>
                        <span className="mr-2 flex items-center">
                            <IconComponent color={nodeHeaderColors[category]} />
                        </span>
                        {title}
                    </div>
                    {tooltipDescription && <TooltipDescriptionNode text={tooltipDescription} />}
                </div>

                {inputs.map((input, index) => (
                    <HandleNode
                        key={`static-${id}-${input.id}-${index}`}
                        id={`handle-${id}-left-${input.id}`}
                        type="target"
                        position={Position.Left}
                        category={category}
                        style={input.style}
                    />
                ))}
                {handles.left.map((varKey, i) => (
                    <HandleNode
                        key={`dyn-left-${varKey}-${i}`}
                        id={`handle-${id}-left-${varKey}`}
                        type="target"
                        position={Position.Left}
                        category={category}
                        style={{ top: `${70 + i * 15}px` }}
                    />
                ))}

                {variableInputFields?.hasField &&
                    <div className="space-y-2 mt-3">
                        <InputNode
                            id={id}
                            key={`${id + nodeId}-variableInputFields`}
                            category={category} />
                    </div>
                }
                <div className="space-y-2 mt-2">
                    {variableInputFields?.hasType && (
                        <div className="mt-3">
                            <InputTypeNode typeName={"Text"} category={category} />
                        </div>)}
                </div>
                <div className="space-y-2 mt-3">
                    {normalInputFields.map((field, index) => (
                        <TextNode
                            key={`${field?.id}-normalInputFields-${index}`}
                            id={id}
                            textId={`${field?.id}-normalInputFields-${index}`}
                            label={field?.label}
                            placeholder={field?.placeholder}
                            category={category}
                        />
                    ))}
                </div>
                {
                    outputs.map((output, index) => (
                        <HandleNode
                            key={`static-${id}-output-${output.id}-${index}`}
                            id={`handle-${id}-right-${output.id}`}
                            type="source"
                            position={Position.Right}
                            category={category}
                            style={output.style}
                        />
                    ))
                }
                {handles.right.map((varKey, i) => (
                    <HandleNode
                        key={`dyn-right-${varKey}-${i}`}
                        id={`handle-${id}-right-${varKey}`}
                        type="source"
                        position={Position.Right}
                        category={category}
                        style={{ top: `${70 + i * 15}px` }}
                    />
                ))}
                <button
                    onClick={() => data.deleteNode(id)}
                    className="absolute bottom-2 right-2 
                    text-gray-400 hover:text-red-500 
                    hover:bg-red-100 px-2 py-1 
                    rounded text-xs transition-colors duration-150"
                >
                    Delete
                </button>
            </div >
        );
    }
);
