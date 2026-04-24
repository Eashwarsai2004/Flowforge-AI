import { type NodeProps } from "@xyflow/react";
import type { WorkflowNode } from "../../types";
import { NodeWrapper } from "./NodeWrapper";
import { useWorkflowStore } from "../../store/workflowStore";
import { getInvalidNodeIds } from "../../utils/validation";

export function StartNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  const { validationErrors } = useWorkflowStore();
  const invalidIds = getInvalidNodeIds(validationErrors);
  const d = data as Extract<WorkflowNode["data"], { type: "start" }>;

  return (
    <NodeWrapper
      color="#22c55e"
      icon="▶ Start"
      selected={selected}
      isInvalid={invalidIds.has(id)}
      showTargetHandle={false}
    >
      <p className="text-sm font-semibold text-gray-800 truncate">{d.title || "Start"}</p>
      {d.metadata?.length > 0 && (
        <p className="text-xs text-gray-400 mt-0.5">{d.metadata.length} metadata field(s)</p>
      )}
    </NodeWrapper>
  );
}
