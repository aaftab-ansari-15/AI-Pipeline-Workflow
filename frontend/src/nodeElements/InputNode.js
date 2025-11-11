import { useEffect, useRef, useState } from "react";
import { nodeTextInputClasses, nodeTextInputClassesFoucs } from "./themeNode";
import { useStore } from "../store";

export const InputNode = ({ id, category }) => {
    const focusColor = nodeTextInputClassesFoucs[category];
    const registerVariable = useStore((s) => s.registerVariable);
    const unregisterVariable = useStore((s) => s.unregisterVariable);
    const addVariableHandle = useStore((s) => s.addVariableHandle);
    const removeVariableHandle = useStore((s) => s.removeVariableHandle);
    const updateNodeField = useStore((s) => s.updateNodeField);
    const nodes = useStore((s) => s.nodes);

    const [varName, setVarName] = useState(id.replace("customInput-", "input_"));
    const prevRef = useRef("");

    useEffect(() => {
        const node = nodes.find((n) => n.id === id);
        if (node?.data?.variableName) {
            setVarName(node.data.variableName);
        }
    }, [nodes, id]);

    useEffect(() => {
        const prev = prevRef.current;
        const trimmed = varName.trim();

        if (prev && prev !== trimmed) {
            unregisterVariable(id, prev);
            removeVariableHandle(id, "right", prev);
        }

        if (trimmed) {
            registerVariable(id, trimmed);
            addVariableHandle(id, "right", trimmed);
        }

        updateNodeField(id, "variableName", trimmed);

        prevRef.current = trimmed;
    }, [varName, id, registerVariable, unregisterVariable, addVariableHandle, removeVariableHandle, updateNodeField]);

    useEffect(() => {
        return () => {
            const trimmed = varName.trim();
            if (trimmed) {
                unregisterVariable(id, trimmed);
                removeVariableHandle(id, "right", trimmed);
            }
        };
    }, [id, varName, unregisterVariable, removeVariableHandle]);

    const handleInputChange = (e) => {
        setVarName(e.target.value);
    };

    return (
        <div className="pt-1">
            <input
                value={varName}
                onChange={handleInputChange}
                className={`${nodeTextInputClasses} ${focusColor} mt-1 resize-none overflow-hidden w-full`}
            />
        </div>
    );
};
