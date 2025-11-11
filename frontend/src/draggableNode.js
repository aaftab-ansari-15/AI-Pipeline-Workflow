export const DraggableNode = ({ type, label, nodeColor }) => {
  const onDragStart = (event) => {
    const appData = { nodeType: type };
    event.dataTransfer.setData("application/reactflow", JSON.stringify(appData));
    event.dataTransfer.effectAllowed = "move";
    event.currentTarget.style.cursor = "grabbing";
  };

  const onDragEnd = (event) => {
    event.currentTarget.style.cursor = "grab";
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`cursor-grab select-none min-w-[90px] px-3 py-2 rounded-xl border shadow-sm text-md font-medium text-gray-100 flex items-center justify-center bg-opacity-90 transition-all duration-[500ms] ease-in-out hover:px-10 hover:scale-[1.03] hover:shadow-lg hover:bg-opacity-100 ${nodeColor}`}>
      {label}
    </div>
  );
};
