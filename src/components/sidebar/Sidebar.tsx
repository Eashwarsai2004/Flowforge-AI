import React from "react";
import { NodeType } from "../../types";

interface NodeTypeInfo {
  type: NodeType;
  label: string;
  description: string;
  color: string;
  icon: string;
}

const nodeTypes: NodeTypeInfo[] = [
  {
    type: NodeType.Start,
    label: "Start",
    description: "Beginning of the workflow",
    color: "#22c55e",
    icon: "▶",
  },
  {
    type: NodeType.Task,
    label: "Task",
    description: "Assign work to a person",
    color: "#6366f1",
    icon: "✓",
  },
  {
    type: NodeType.Approval,
    label: "Approval",
    description: "Request approval from a role",
    color: "#f59e0b",
    icon: "⊕",
  },
  {
    type: NodeType.Automated,
    label: "Automated Step",
    description: "Run an automation action",
    color: "#8b5cf6",
    icon: "⚡",
  },
  {
    type: NodeType.End,
    label: "End",
    description: "Finish the workflow",
    color: "#ef4444",
    icon: "■",
  },
];

export function Sidebar() {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: NodeType
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">FF</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 leading-tight">FlowForge AI</h1>
            <p className="text-xs text-gray-400">HR Workflow Designer</p>
          </div>
        </div>
      </div>

      {/* Node palette */}
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">
          Drag to add
        </p>
        <div className="space-y-2">
          {nodeTypes.map((nodeType) => (
            <div
              key={nodeType.type}
              draggable
              onDragStart={(e) => onDragStart(e, nodeType.type)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-all select-none group"
              style={{ borderLeftColor: nodeType.color, borderLeftWidth: 3 }}
            >
              <span
                className="text-xs font-bold w-6 h-6 rounded flex items-center justify-center text-white flex-shrink-0"
                style={{ background: nodeType.color }}
              >
                {nodeType.icon}
              </span>
              <div>
                <p className="text-xs font-semibold text-gray-700 group-hover:text-gray-900">
                  {nodeType.label}
                </p>
                <p className="text-xs text-gray-400 leading-tight">{nodeType.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer hint */}
      <div className="px-4 py-3 border-t border-gray-200 text-xs text-gray-400">
        Drag nodes onto the canvas to build your workflow.
      </div>
    </aside>
  );
}
