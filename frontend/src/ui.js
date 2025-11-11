import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { nodesData } from './nodeData/nodesData';
import { MainBaseNode } from './nodeElements/MainBaseNode';
import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = Object.fromEntries(
  nodesData.map((data) => [
    data.modalType,
    (nodeProps) => (
      <MainBaseNode
        {...nodeProps}
        nodeId={data.nodeId}
        title={data.title}
        icon={data.icon}
        modalType={data.modalType}
        category={data.category}
        variableInputFields={data.variableInputFields}
        normalInputFields={data.normalInputFields}
        type={data.type}
        tooltipDescription={data.tooltipDescription}
        outputs={data.outputs}
        inputs={data.inputs}
      />
    ),
  ])
);

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  deleteNode: state.deleteNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    deleteNode,
    onNodesChange,
    onEdgesChange,
    onConnect
  } = useStore(selector, shallow);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;

        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        // const getInitNodeData = (newNodeID, type) => {

        //   const nodeData = {
        //     deleteNode: deleteNode,
        //     id: newNodeID,
        //     nodeType: type,
        //   };
        //   return nodeData;
        // }
        const newNodeID = getNodeID(type);
        const newNode = {
          id: newNodeID,
          type,
          position,
          data: {
            deleteNode,
            id: newNodeID,
            nodeType: type,
          },
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, addNode, getNodeID]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <>
      <div ref={reactFlowWrapper} className="w-screen h-[75vh] bg-[#0e0526]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          proOptions={proOptions}
          snapGrid={[gridSize, gridSize]}
          connectionLineType='smoothstep'
        >
          <Background color="#706584" gap={gridSize} />
          <Controls />
          <MiniMap nodeColor={"#430a89"} />
        </ReactFlow>
      </div>
    </>
  )
}
