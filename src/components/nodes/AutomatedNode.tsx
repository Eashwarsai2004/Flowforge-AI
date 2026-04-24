import { type NodeProps } from "@xyflow/react";
import type { WorkflowNode } from "../../types";
import { NodeWrapper } from "./NodeWrapper";
import { useWorkflowStore } from "../../store/workflowStore";
import { getInvalidNodeIds } from "../../utils/validation";

export function AutomatedNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  const { validationErrors } = useWorkflowStore();
  const invalidIds = getInvalidNodeIds(validationErrors);
  const d = data as Extract<WorkflowNode["data"], { type: "automated" }>;

  return (
    <NodeWrapper color="#8b5cf6" icon="⚡ Auto" selected={selected} isInvalid={invalidIds.has(id)}>
      <p className="text-sm font-semibold text-gray-800 truncate">{d.title || "Automated Step"}</p>
      {d.actionId && <p className="text-xs text-gray-500 mt-0.5">Action: {d.actionId}</p>}
    </NodeWrapper>
  );
}
