import { DraggableNode } from "./draggableNode";
import { nodesData } from "./nodeData/nodesData";
import { nodeColors } from "./nodeElements/themeNode";

export const PipelineToolbar = () => {
    return (
        <div className="p-4 bg-gradient-to-br from-[#1e0d4b] to-[#2a117a] text-white">
            <h1 className="text-2xl font-bold mb-3 text-white tracking-wide drop-shadow-lg">
                Build Pipeline
            </h1>
            <div className="flex flex-wrap gap-3">
                {nodesData.map((data) => (
                    <DraggableNode
                        key={data.modalType}
                        type={data.modalType}
                        label={data.label}
                        category={data.category}
                        nodeColor={nodeColors[data.category] || nodeColors.process}
                    />
                ))}
            </div>
        </div>
    );
};
