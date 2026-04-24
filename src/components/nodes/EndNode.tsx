import { type NodeProps } from "@xyflow/react";
import type { WorkflowNode } from "../../types";
import { NodeWrapper } from "./NodeWrapper";
import { useWorkflowStore } from "../../store/workflowStore";
import { getInvalidNodeIds } from "../../utils/validation";

export function EndNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  const { validationErrors } = useWorkflowStore();
  const invalidIds = getInvalidNodeIds(validationErrors);
  const d = data as Extract<WorkflowNode["data"], { type: "end" }>;

  return (
    <NodeWrapper
      color="#ef4444"
      icon="■ End"
      selected={selected}
      isInvalid={invalidIds.has(id)}
      showSourceHandle={false}
    >
      <p className="text-sm font-semibold text-gray-800 truncate">
        {d.endMessage || "End"}
      </p>
      {d.summaryFlag && <p className="text-xs text-red-400 mt-0.5">Summary enabled</p>}
    </NodeWrapper>
  );
}
