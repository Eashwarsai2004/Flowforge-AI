import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from "@xyflow/react";
import type {
  WorkflowNode,
  WorkflowEdge,
  ValidationError,
  SimulationResult,
} from "../types";
import { NodeType } from "../types";
import { validateWorkflow } from "../utils/validation";

interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  validationErrors: ValidationError[];
  simulationResult: SimulationResult | null;
  isSimulating: boolean;

  // Actions
  onNodesChange: (changes: NodeChange<WorkflowNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  selectNode: (id: string | null) => void;
  updateNodeData: (id: string, data: Partial<WorkflowNode["data"]>) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
  validate: () => ValidationError[];
  setSimulationResult: (result: SimulationResult | null) => void;
  setIsSimulating: (v: boolean) => void;
}

function createDefaultData(type: NodeType): WorkflowNode["data"] {
  switch (type) {
    case NodeType.Start:
      return { type: NodeType.Start, title: "Start", metadata: [] };
    case NodeType.Task:
      return {
        type: NodeType.Task,
        title: "New Task",
        description: "",
        assignee: "",
        dueDate: "",
        customFields: [],
      };
    case NodeType.Approval:
      return {
        type: NodeType.Approval,
        title: "Approval",
        approverRole: "",
        autoApproveThreshold: 0,
      };
    case NodeType.Automated:
      return {
        type: NodeType.Automated,
        title: "Automated Step",
        actionId: "",
        parameters: {},
      };
    case NodeType.End:
      return { type: NodeType.End, endMessage: "Workflow complete.", summaryFlag: false };
  }
}

let nodeIdCounter = 10;

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [
    {
      id: "start-1",
      type: NodeType.Start,
      position: { x: 250, y: 80 },
      data: { type: NodeType.Start, title: "Start", metadata: [] },
    },
  ],
  edges: [],
  selectedNodeId: null,
  validationErrors: [],
  simulationResult: null,
  isSimulating: false,

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as WorkflowNode[],
    }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  },

  onConnect: (connection) => {
    set((state) => ({
      edges: addEdge(
        { ...connection, animated: true, style: { stroke: "#6366f1", strokeWidth: 2 } },
        state.edges
      ),
    }));
  },

  addNode: (type, position) => {
    const id = `${type}-${++nodeIdCounter}`;
    const newNode: WorkflowNode = {
      id,
      type,
      position,
      data: createDefaultData(type),
    };
    set((state) => ({ nodes: [...state.nodes, newNode] }));
  },

  selectNode: (id) => {
    set({ selectedNodeId: id });
  },

  updateNodeData: (id, data) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, ...data } as WorkflowNode["data"] }
          : node
      ),
    }));
  },

  deleteNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    }));
  },

  deleteEdge: (id) => {
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== id),
    }));
  },

  validate: () => {
    const { nodes, edges } = get();
    const errors = validateWorkflow(nodes, edges);
    set({ validationErrors: errors });
    return errors;
  },

  setSimulationResult: (result) => set({ simulationResult: result }),
  setIsSimulating: (v) => set({ isSimulating: v }),
}));
