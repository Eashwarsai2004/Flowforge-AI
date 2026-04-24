import { type NodeProps } from "@xyflow/react";
import type { WorkflowNode } from "../../types";
import { NodeWrapper } from "./NodeWrapper";
import { useWorkflowStore } from "../../store/workflowStore";
import { getInvalidNodeIds } from "../../utils/validation";

export function TaskNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  const { validationErrors } = useWorkflowStore();
  const invalidIds = getInvalidNodeIds(validationErrors);
  const d = data as Extract<WorkflowNode["data"], { type: "task" }>;

  return (
    <NodeWrapper color="#6366f1" icon="✓ Task" selected={selected} isInvalid={invalidIds.has(id)}>
      <p className="text-sm font-semibold text-gray-800 truncate">{d.title || "Task"}</p>
      {d.assignee && <p className="text-xs text-gray-500 mt-0.5">@{d.assignee}</p>}
      {d.dueDate && <p className="text-xs text-gray-400 mt-0.5">Due: {d.dueDate}</p>}
    </NodeWrapper>
  );
}
