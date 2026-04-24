import type { Node, Edge } from "@xyflow/react";

export enum NodeType {
  Start = "start",
  Task = "task",
  Approval = "approval",
  Automated = "automated",
  End = "end",
}

export interface MetaField {
  key: string;
  value: string;
}

export interface StartNodeData {
  type: NodeType.Start;
  title: string;
  metadata: MetaField[];
}

export interface TaskNodeData {
  type: NodeType.Task;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: MetaField[];
}

export interface ApprovalNodeData {
  type: NodeType.Approval;
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
}

export interface AutomatedNodeData {
  type: NodeType.Automated;
  title: string;
  actionId: string;
  parameters: Record<string, string>;
}

export interface EndNodeData {
  type: NodeType.End;
  endMessage: string;
  summaryFlag: boolean;
}

export type NodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export type WorkflowNode = Node<NodeData>;
export type WorkflowEdge = Edge;

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationStep {
  nodeId: string;
  nodeTitle: string;
  nodeType: NodeType;
  status: "completed" | "skipped" | "error";
  message: string;
  timestamp: string;
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  summary: string;
}

export interface ValidationError {
  nodeId?: string;
  message: string;
  severity: "error" | "warning";
}
