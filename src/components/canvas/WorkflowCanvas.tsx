import React, { useCallback, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type OnNodeClick,
  type OnEdgeClick,
  BackgroundVariant,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useWorkflowStore } from "../../store/workflowStore";
import { NodeType } from "../../types";
import { StartNode } from "../nodes/StartNode";
import { TaskNode } from "../nodes/TaskNode";
import { ApprovalNode } from "../nodes/ApprovalNode";
import { AutomatedNode } from "../nodes/AutomatedNode";
import { EndNode } from "../nodes/EndNode";
import type { WorkflowNode } from "../../types";

// Register custom node types
const nodeTypes = {
  [NodeType.Start]: StartNode,
  [NodeType.Task]: TaskNode,
  [NodeType.Approval]: ApprovalNode,
  [NodeType.Automated]: AutomatedNode,
  [NodeType.End]: EndNode,
};

interface Props {
  onRunSimulation: () => void;
  isSimulating: boolean;
}

export function WorkflowCanvas({ onRunSimulation, isSimulating }: Props) {
  const {
    nodes,
    edges,
    selectedNodeId,
    validationErrors,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectNode,
    deleteEdge,
    validate,
  } = useWorkflowStore();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<any>(null);

  const onNodeClick: OnNodeClick<WorkflowNode> = useCallback(
    (_event, node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onEdgeClick: OnEdgeClick = useCallback(
    (_event, edge) => {
      if (confirm("Delete this connection?")) {
        deleteEdge(edge.id);
      }
    },
    [deleteEdge]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow") as NodeType;
      if (!type || !reactFlowInstance || !reactFlowWrapper.current) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      addNode(type, position);
    },
    [reactFlowInstance, addNode]
  );

  const handleValidate = () => {
    const errors = validate();
    if (errors.length === 0) {
      alert("Workflow is valid!");
    }
  };

  const errorCount = validationErrors.filter((e) => e.severity === "error").length;
  const warnCount = validationErrors.filter((e) => e.severity === "warning").length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-white border-b border-gray-200 flex-shrink-0">
        <span className="text-sm text-gray-500 mr-1">
          {nodes.length} node{nodes.length !== 1 ? "s" : ""} · {edges.length} edge{edges.length !== 1 ? "s" : ""}
        </span>

        {validationErrors.length > 0 && (
          <div className="flex items-center gap-1.5">
            {errorCount > 0 && (
              <span className="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded-full border border-red-200 font-medium">
                {errorCount} error{errorCount !== 1 ? "s" : ""}
              </span>
            )}
            {warnCount > 0 && (
              <span className="text-xs px-2 py-0.5 bg-yellow-50 text-yellow-600 rounded-full border border-yellow-200 font-medium">
                {warnCount} warning{warnCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleValidate}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Validate
          </button>
          <button
            onClick={onRunSimulation}
            disabled={isSimulating}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            {isSimulating ? (
              <>
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Running...
              </>
            ) : (
              "▶ Run Workflow"
            )}
          </button>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200 flex flex-wrap gap-2">
          {validationErrors
            .filter((e) => !e.nodeId)
            .map((error, i) => (
              <span
                key={i}
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  error.severity === "error"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {error.message}
              </span>
            ))}
        </div>
      )}

      {/* Canvas */}
      <div ref={reactFlowWrapper} className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          onInit={setReactFlowInstance}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          deleteKeyCode={["Backspace", "Delete"]}
          className="bg-gray-50"
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#d1d5db" />
          <Controls className="!shadow-md !rounded-xl" />
          <MiniMap
            nodeColor={(node) => {
              const colors: Record<string, string> = {
                start: "#22c55e",
                task: "#6366f1",
                approval: "#f59e0b",
                automated: "#8b5cf6",
                end: "#ef4444",
              };
              return colors[node.type || ""] || "#94a3b8";
            }}
            className="!rounded-xl !shadow-md"
          />
          <Panel position="bottom-center" className="mb-2">
            <p className="text-xs text-gray-400">
              Click node to edit · Click edge to delete · Drag from handles to connect
            </p>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
