import { useEffect, useMemo, useRef, useState } from "react";
import { nodeTextInputClasses, nodeTextInputClassesFoucs } from "./themeNode";
import { useUpdateNodeInternals } from "reactflow";
import { useStore } from "../store";


export const TextNode = ({ id, textId, label, placeholder, category }) => {

    const minWidth = 200;
    const maxWidth = 300;
    const baseHeight = 40;
    const focusColor = nodeTextInputClassesFoucs[category];

    const inputRef = useRef(null);
    const mirrorRef = useRef(null);
    const [size, setSize] = useState({ width: minWidth, height: baseHeight });
    const suggestionsRef = useRef(null);

    const updateNodeInternals = useUpdateNodeInternals();
    const updateNodeField = useStore((s) => s.updateNodeField);
    const nodes = useStore((s) => s.nodes);
    const syncEdgesForField = useStore((s) => s.syncEdgesForField);
    const variables = useStore((s) => s.variables);

    const [value, setValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        useStore.getState().setUpdateNodeInternals(updateNodeInternals);
    }, [updateNodeInternals]);

    useEffect(() => {
        const node = nodes.find((n) => n.id === id);
        if (node?.data?.[textId]) setValue(node.data[textId]);
    }, [nodes, id, textId]);

    const suggestions = useMemo(() => {
        const list = Object.entries(variables || {}).map(([name, nodeId]) => ({
            name,
            nodeId,
        }));
        if (!filter) return list;
        return list.filter((s) =>
            s.name.toLowerCase().includes(filter.toLowerCase())
        );
    }, [variables, filter]);

    const getCurrentToken = (text, caretPos) => {
        const leftIdx = text.lastIndexOf("{{", caretPos);
        if (leftIdx === -1) return null;
        const rightIdx = text.indexOf("}}", leftIdx);
        if (rightIdx !== -1 && rightIdx < caretPos) return null;
        const tokenText = text.substring(leftIdx + 2, caretPos);
        return { tokenText, start: leftIdx, end: caretPos };
    };

    const onChange = (e) => {
        const newVal = e.target.value;
        setValue(newVal);
        updateNodeField(id, textId, newVal);
        syncEdgesForField(id, newVal, textId);

        setTimeout(() => updateNodeInternals(id), 50);

        const caret = e.target.selectionStart;
        const token = getCurrentToken(newVal, caret);
        if (token) {
            setFilter(token.tokenText);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
            setFilter("");
        }
    };

    const onPick = (name) => {
        const inputEl = inputRef.current;
        const caret = inputEl.selectionStart;
        const token = getCurrentToken(value, caret);
        if (!token) return;

        const before = value.substring(0, token.start);
        const after = value.substring(token.end);
        const inserted = `{{${name}}}`;
        const newValue = before + inserted + after;

        setValue(newValue);
        updateNodeField(id, textId, newValue);
        syncEdgesForField(id, newValue, textId);
        updateNodeInternals(id);

        setShowSuggestions(false);
        setFilter("");

        setTimeout(() => {
            const pos = before.length + inserted.length;
            inputEl.focus();
            inputEl.setSelectionRange(pos, pos);
        }, 0);
    };

    useEffect(() => {
        const onDocClick = (ev) => {
            if (
                suggestionsRef.current?.contains(ev.target) ||
                inputRef.current?.contains(ev.target)
            )
                return;
            setShowSuggestions(false);
        };
        document.addEventListener("click", onDocClick);
        return () => document.removeEventListener("click", onDocClick);
    }, []);

    useEffect(() => {
        const el = inputRef.current;
        const mirror = mirrorRef.current;
        if (!el || !mirror) return;

        const style = window.getComputedStyle(el);
        const keysToCopy = [
            "font",
            "fontSize",
            "fontFamily",
            "fontWeight",
            "lineHeight",
            "letterSpacing",
            "padding",
            "border",
            "boxSizing",
        ];
        keysToCopy.forEach((key) => {
            mirror.style[key] = style[key];
        });

        mirror.value = value || " ";

        mirror.style.whiteSpace = "pre";
        mirror.style.wordWrap = "normal";
        mirror.style.width = "auto";
        mirror.style.height = "auto";
        const textWidth = mirror.scrollWidth + 10;
        const width = Math.min(Math.max(minWidth, textWidth), maxWidth);

        mirror.style.whiteSpace = "pre-wrap";
        mirror.style.wordWrap = "break-word";
        mirror.style.width = `${width}px`;
        mirror.style.height = "auto";
        const textHeight = mirror.scrollHeight + 10;

        setSize({
            width,
            height: Math.max(baseHeight, textHeight),
        });
    }, [value]);


    return (
        <div className="flex pt-1">
            <label className="text-gray-100 text-sm font-semibold">
                {label && <div>{label}</div>}
                {/* Hidden mirror element */}
                <textarea
                    ref={mirrorRef}
                    className="absolute opacity-0 pointer-events-none -z-10 resize-none overflow-hidden"
                    tabIndex={-1}
                    aria-hidden="true"
                    readOnly
                />

                {/* Actual visible textarea */}

                <textarea
                    id={textId}
                    ref={inputRef}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`${nodeTextInputClasses} ${focusColor} mt-2
                        resize-none overflow-hidden whitespace-pre-wrap 
                        break-words transition-all duration-150 ease-in-out`}
                    style={{
                        width: `${size.width}px`,
                        height: `${size.height}px`,
                    }}
                />

            </label>

            {showSuggestions && suggestions.length > 0 && (
                <div
                    ref={suggestionsRef}
                    className="absolute z-50 mt-1 bg-white rounded shadow max-h-48 overflow-auto w-64"
                >
                    {suggestions.map((s) => (
                        <div
                            key={`${s.name}-${s.nodeId}`}
                            onClick={() => onPick(s.name)}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                        >
                            <span>{s.name}</span>
                            <small className="text-xs text-gray-500">
                                from {s.nodeId}
                            </small>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
