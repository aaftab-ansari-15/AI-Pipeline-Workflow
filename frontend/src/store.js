import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

const makeHandleId = (nodeId, side, key, varName) => `handle-${nodeId}-${side}-${key}-${varName}`;

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},
  variables: {},
  nodeHandles: {},
  setUpdateNodeInternals: (fn) => set({ updateNodeInternalsFn: fn }),
  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },
  addNode: (node) => {
    set({
      nodes: [...get().nodes, node]
    });
  },
  deleteNode: (id) => {
    const newNodes = get().nodes.filter((node) => node.id !== id);
    const newEdges = get().edges.filter((edge) => edge.source !== id && edge.target !== id);

    const newVars = { ...get().variables };
    Object.keys(newVars).forEach((k) => {
      if (newVars[k] === id) delete newVars[k];
    });

    set({
      nodes: newNodes,
      edges: newEdges,
      variables: newVars,
    });
  },
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge({
        ...connection,
        type: 'smoothstep',
        animated: true,
        markerEnd: { type: MarkerType.Arrow, height: '20px', width: '20px' },
      }, get().edges),
    });
  },

  registerVariable: (nodeId, varName) => {
    if (!varName || !nodeId) return;
    const vars = { ...get().variables };
    vars[varName] = nodeId;
    set({ variables: vars });
  },
  renameVariable: (nodeId, oldName, newName) => {
    const vars = { ...get().variables };
    if (oldName && vars[oldName] === nodeId) delete vars[oldName];
    if (newName) vars[newName] = nodeId;
    set({ variables: vars });
  },

  getVariablesList: () => {
    return Object.entries(get().variables).map(([name, nodeId]) => ({ name, nodeId }));
  },
  unregisterVariable: (nodeId, varName) => {
    const vars = { ...get().variables };
    if (varName) {
      if (vars[varName] === nodeId) delete vars[varName];
    } else if (nodeId) {
      Object.keys(vars).forEach((k) => {
        if (vars[k] === nodeId) delete vars[k];
      });
    }
    set({ variables: vars });
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, [fieldName]: fieldValue };
        }
        return node;
      }),
    });
  },

  addAutoEdge: (sourceId, targetId, textId, varName) => {
    const { edges } = get();

    if (!sourceId || !targetId || !varName) {
      console.warn("[addAutoEdge] ❌ Missing arguments", { sourceId, targetId, textId, varName });
      return;
    }

    const edgeId = `auto-${sourceId}-${targetId}-${textId}-${varName}`;
    const sourceHandleId = makeHandleId(sourceId, "right", textId, varName);
    const targetHandleId = makeHandleId(targetId, "left", textId, varName);

    console.groupCollapsed(`🔗 [addAutoEdge] Creating edge for variable: ${varName}`);
    console.log("%cEdge ID:", "color:#facc15", edgeId);
    console.log("%cSource Node:", "color:#60a5fa", sourceId);
    console.log("%cTarget Node:", "color:#60a5fa", targetId);
    console.log("%cText Field ID:", "color:#a78bfa", textId);
    console.log("%cSource Handle ID:", "color:#22c55e", sourceHandleId);
    console.log("%cTarget Handle ID:", "color:#22c55e", targetHandleId);

    const exists = edges.find((e) => {
      console.log(e, e.id === edgeId);

      return e.id === edgeId
    });
    if (exists) {
      console.log("%c⚠️ Edge already exists — skipping creation", "color:#f97316");
      console.groupEnd();
      return;
    }

    const newEdge = {
      id: edgeId,
      source: sourceId,
      target: targetId,
      sourceHandle: sourceHandleId,
      targetHandle: targetHandleId,
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.Arrow, height: 20, width: 20 },
      data: { textId, varName },
    };

    set({ edges: [...edges, newEdge] });
    console.log("%c✅ Edge added successfully!", "color:#22c55e", newEdge);
    console.groupEnd();
  },

  removeAutoEdge: (sourceId, targetId, textId, varName) => {
    if (!sourceId || !targetId || !textId || !varName) {
      console.warn("[removeAutoEdge] missing args", { sourceId, targetId, textId, varName });
      return;
    }

    const expectedId = `auto-${sourceId}-${targetId}-${textId}-${varName}`;
    console.log(`[removeAutoEdge] 🗑 Trying to remove`, expectedId);

    set((state) => {
      const edges = state.edges || [];
      const filtered = edges.filter((e) => e.id !== expectedId);
      if (filtered.length === edges.length) {
        console.warn(`[removeAutoEdge] ⚠️ No matching edge found`, { expectedId, edges });
      } else {
        console.log(`[removeAutoEdge] ✅ Removed ${expectedId}`);
      }
      return { edges: filtered };
    });
  },

  syncEdgesForField: (targetId, fieldValue, textId) => {
    const {
      variables,
      edges,
      removeAutoEdge,
      addVariableHandle,
      removeVariableHandle,
      addAutoEdge,
    } = get();

    if (!targetId) {
      console.warn("[syncEdgesForField] ❌ Missing targetId — exiting");
      return;
    }

    console.groupCollapsed(
      `%c[Store] 🔄 syncEdgesForField (textarea scoped)`,
      "color:#3b82f6;font-weight:bold;"
    );
    console.log("%cTarget Node:", "color:#60a5fa", targetId);
    console.log("%cText Field ID:", "color:#a78bfa", textId);
    console.log("%cRaw Text Value:", "color:#9ca3af", fieldValue);

    const regex = /\{\{(.*?)\}\}/g;
    const matches = fieldValue.match(regex) || [];
    const varNames = matches.map((m) => m.replace("{{", "").replace("}}", "").trim());
    console.log("%cExtracted Variables:", "color:#22c55e", varNames);

    const prefix = "auto-";
    const currentEdges = edges.filter(
      (e) => e.id.startsWith(prefix) &&
        e.target === targetId &&
        e.data?.textId === textId
    );

    console.log("%cExisting Edges →", "color:#facc15", currentEdges);

    currentEdges.forEach((edge) => {
      const { varName } = edge.data || {};
      if (!varNames.includes(varName)) {
        console.log(`🗑 Removing edge & handles for var: ${varName} (${textId})`);
        removeAutoEdge(edge.source, edge.target, textId, varName);
        removeVariableHandle(targetId, "left", `${textId}:${varName}`);
        removeVariableHandle(edge.source, "right", `${textId}:${varName}`);
      }
    });

    varNames.forEach((name) => {
      const sourceId = variables[name];
      if (!sourceId || sourceId === targetId) return;

      console.log(`✅ Creating handles for ${name}`);
      addVariableHandle(targetId, "left", `${textId}:${name}`);

      setTimeout(() => {
        console.log(`⚡ Creating edge now for ${name} (textId=${textId})`);
        addAutoEdge(sourceId, targetId, textId, name);
      }, 500);
    });

    console.groupEnd();
  },


  addVariableHandle: (nodeId, side, varName) => {
    const current = { ...get().nodeHandles };
    if (!current[nodeId]) current[nodeId] = { left: [], right: [] };

    console.groupCollapsed(
      `%c[Store] ➕ addVariableHandle`,
      "color:#4ade80;font-weight:bold;"
    );
    console.log("%cNode ID:", "color:#60a5fa", nodeId);
    console.log("%cSide:", "color:#facc15", side);
    console.log("%cVariable Name:", "color:#f87171", varName);
    console.log("%cCurrent handles before:", "color:#9ca3af", { ...current });

    if (!current[nodeId][side].includes(varName)) {
      current[nodeId][side] = [...current[nodeId][side], varName];
      set({ nodeHandles: current });
      console.log("%c✅ Handle added successfully!", "color:#22c55e;font-weight:bold;");
    } else {
      console.log("%c⚠️ Handle already exists — skipping.", "color:#f97316");
    }

    console.log("%cUpdated nodeHandles:", "color:#9ca3af", get().nodeHandles);
    console.groupEnd();
  },


  removeVariableHandle: (nodeId, side, varName) => {
    const current = { ...get().nodeHandles };
    if (!current[nodeId]) return;
    current[nodeId][side] = current[nodeId][side].filter((v) => v !== varName);
    set({ nodeHandles: current });
  },

  clearHandlesForNode: (nodeId) => {
    const current = { ...get().nodeHandles };
    delete current[nodeId];
    set({ nodeHandles: current });
  },
}));
