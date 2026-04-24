import React from "react";
import { useWorkflowStore } from "../../store/workflowStore";
import { NodeType } from "../../types";
import { StartForm } from "../forms/StartForm";
import { TaskForm } from "../forms/TaskForm";
import { ApprovalForm } from "../forms/ApprovalForm";
import { AutomatedForm } from "../forms/AutomatedForm";
import { EndForm } from "../forms/EndForm";
import type {
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
  WorkflowNode,
} from "../../types";

const typeLabels: Record<NodeType, string> = {
  [NodeType.Start]: "Start Node",
  [NodeType.Task]: "Task Node",
  [NodeType.Approval]: "Approval Node",
  [NodeType.Automated]: "Automated Node",
  [NodeType.End]: "End Node",
};

const typeColors: Record<NodeType, string> = {
  [NodeType.Start]: "#22c55e",
  [NodeType.Task]: "#6366f1",
  [NodeType.Approval]: "#f59e0b",
  [NodeType.Automated]: "#8b5cf6",
  [NodeType.End]: "#ef4444",
};

export function NodeConfigPanel() {
  const { selectedNodeId, nodes, updateNodeData, deleteNode, selectNode } =
    useWorkflowStore();

  const node = nodes.find((n) => n.id === selectedNodeId);
  if (!node) return null;

  const nodeType = node.type as NodeType;
  const color = typeColors[nodeType];

  const handleChange = (partial: Partial<WorkflowNode["data"]>) => {
    updateNodeData(node.id, partial);
  };

  return (
    <div className="w-80 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between border-b border-gray-200"
        style={{ borderTop: `3px solid ${color}` }}
      >
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">{typeLabels[nodeType]}</h3>
          <p className="text-xs text-gray-400 font-mono mt-0.5">{node.id}</p>
        </div>
        <button
          onClick={() => selectNode(null)}
          className="text-gray-400 hover:text-gray-600 text-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4">
        {nodeType === NodeType.Start && (
          <StartForm
            data={node.data as StartNodeData}
            onChange={handleChange}
          />
        )}
        {nodeType === NodeType.Task && (
          <TaskForm data={node.data as TaskNodeData} onChange={handleChange} />
        )}
        {nodeType === NodeType.Approval && (
          <ApprovalForm
            data={node.data as ApprovalNodeData}
            onChange={handleChange}
          />
        )}
        {nodeType === NodeType.Automated && (
          <AutomatedForm
            data={node.data as AutomatedNodeData}
            onChange={handleChange}
          />
        )}
        {nodeType === NodeType.End && (
          <EndForm data={node.data as EndNodeData} onChange={handleChange} />
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200">
        <button
          onClick={() => deleteNode(node.id)}
          className="w-full py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          Delete Node
        </button>
      </div>
    </div>
  );
}
