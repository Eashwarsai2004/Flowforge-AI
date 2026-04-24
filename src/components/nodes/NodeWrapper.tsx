import React from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { WorkflowNode } from "../../types";

interface NodeWrapperProps {
  children: React.ReactNode;
  color: string;
  icon: string;
  selected?: boolean;
  isInvalid?: boolean;
  showTargetHandle?: boolean;
  showSourceHandle?: boolean;
}

export function NodeWrapper({
  children,
  color,
  icon,
  selected,
  isInvalid,
  showTargetHandle = true,
  showSourceHandle = true,
}: NodeWrapperProps) {
  return (
    <div
      className={`
        min-w-[180px] rounded-xl border-2 shadow-md transition-all duration-150 bg-white
        ${isInvalid ? "border-red-500 shadow-red-200" : selected ? `border-[${color}] shadow-lg` : "border-gray-200"}
      `}
      style={{
        borderColor: isInvalid ? "#ef4444" : selected ? color : "#e5e7eb",
        boxShadow: isInvalid
          ? "0 0 0 3px rgba(239,68,68,0.15)"
          : selected
          ? `0 0 0 3px ${color}33`
          : undefined,
      }}
    >
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !border-2 !border-white"
          style={{ background: color }}
        />
      )}
      <div
        className="px-1 py-1 rounded-t-[10px] flex items-center gap-2"
        style={{ background: color + "1A" }}
      >
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
          style={{ background: color }}
        >
          {icon}
        </span>
      </div>
      <div className="px-3 pb-3 pt-2">{children}</div>
      {showSourceHandle && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !border-2 !border-white"
          style={{ background: color }}
        />
      )}
    </div>
  );
}
