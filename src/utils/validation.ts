import type { WorkflowNode, WorkflowEdge, ValidationError } from "../types";

export function validateWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Rule 1: Only one Start node
  const startNodes = nodes.filter((n) => n.type === "start");
  if (startNodes.length === 0) {
    errors.push({ message: "Workflow must have exactly one Start node.", severity: "error" });
  } else if (startNodes.length > 1) {
    errors.push({ message: "Workflow can only have one Start node.", severity: "error" });
    startNodes.forEach((n) =>
      errors.push({ nodeId: n.id, message: "Duplicate Start node.", severity: "error" })
    );
  }

  // Rule 2: Only one End node
  const endNodes = nodes.filter((n) => n.type === "end");
  if (endNodes.length === 0) {
    errors.push({ message: "Workflow must have at least one End node.", severity: "warning" });
  }

  // Rule 3: No disconnected nodes (each non-start node must have at least one incoming edge,
  //          each non-end node must have at least one outgoing edge)
  if (nodes.length > 1) {
    for (const node of nodes) {
      const hasIncoming = edges.some((e) => e.target === node.id);
      const hasOutgoing = edges.some((e) => e.source === node.id);

      if (node.type !== "start" && !hasIncoming) {
        errors.push({
          nodeId: node.id,
          message: `Node has no incoming connections.`,
          severity: "error",
        });
      }

      if (node.type !== "end" && !hasOutgoing) {
        errors.push({
          nodeId: node.id,
          message: `Node has no outgoing connections.`,
          severity: "warning",
        });
      }
    }
  }

  return errors;
}

export function getInvalidNodeIds(errors: ValidationError[]): Set<string> {
  return new Set(
    errors
      .filter((e) => e.nodeId && e.severity === "error")
      .map((e) => e.nodeId!)
  );
}
