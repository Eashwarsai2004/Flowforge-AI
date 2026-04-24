import { type NodeProps } from "@xyflow/react";
import type { WorkflowNode } from "../../types";
import { NodeWrapper } from "./NodeWrapper";
import { useWorkflowStore } from "../../store/workflowStore";
import { getInvalidNodeIds } from "../../utils/validation";

export function ApprovalNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  const { validationErrors } = useWorkflowStore();
  const invalidIds = getInvalidNodeIds(validationErrors);
  const d = data as Extract<WorkflowNode["data"], { type: "approval" }>;

  return (
    <NodeWrapper color="#f59e0b" icon="⊕ Approval" selected={selected} isInvalid={invalidIds.has(id)}>
      <p className="text-sm font-semibold text-gray-800 truncate">{d.title || "Approval"}</p>
      {d.approverRole && <p className="text-xs text-gray-500 mt-0.5">Role: {d.approverRole}</p>}
      {d.autoApproveThreshold > 0 && (
        <p className="text-xs text-gray-400 mt-0.5">Auto ≥{d.autoApproveThreshold}%</p>
      )}
    </NodeWrapper>
  );
}
