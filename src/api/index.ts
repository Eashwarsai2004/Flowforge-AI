import type {
  AutomationAction,
  SimulationResult,
  SimulationStep,
  WorkflowNode,
  WorkflowEdge,
  NodeType,
} from "../types";

// Simulated network delay
const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// GET /automations
export async function fetchAutomations(): Promise<AutomationAction[]> {
  await delay(300);
  return [
    { id: "send_email", label: "Send Email", params: ["to", "subject"] },
    {
      id: "generate_doc",
      label: "Generate Document",
      params: ["template", "recipient"],
    },
    {
      id: "send_slack",
      label: "Send Slack Message",
      params: ["channel", "message"],
    },
    {
      id: "create_ticket",
      label: "Create JIRA Ticket",
      params: ["project", "summary"],
    },
    {
      id: "schedule_meeting",
      label: "Schedule Meeting",
      params: ["attendees", "duration"],
    },
  ];
}

function getNodeTitle(node: WorkflowNode): string {
  const data = node.data;
  if ("title" in data) return data.title || node.type || "Unnamed";
  if ("endMessage" in data) return data.endMessage || "End";
  return "Unknown";
}

// POST /simulate
export async function simulateWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): Promise<SimulationResult> {
  await delay(1200);

  // Topological sort via BFS from start node
  const startNode = nodes.find((n) => n.type === "start");
  if (!startNode) {
    return {
      success: false,
      steps: [],
      summary: "No start node found in workflow.",
    };
  }

  const adjacency: Record<string, string[]> = {};
  for (const node of nodes) {
    adjacency[node.id] = [];
  }
  for (const edge of edges) {
    adjacency[edge.source]?.push(edge.target);
  }

  const visited = new Set<string>();
  const order: string[] = [];
  const queue: string[] = [startNode.id];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    order.push(current);
    const nexts = adjacency[current] || [];
    queue.push(...nexts);
  }

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const steps: SimulationStep[] = order.map((nodeId, index) => {
    const node = nodeMap.get(nodeId);
    if (!node) {
      return {
        nodeId,
        nodeTitle: "Unknown",
        nodeType: "start" as NodeType,
        status: "error" as const,
        message: "Node not found",
        timestamp: new Date(Date.now() + index * 1500).toISOString(),
      };
    }

    const title = getNodeTitle(node);

    const messages: Record<string, string> = {
      start: `Workflow initiated: "${title}"`,
      task: `Task assigned: "${title}" — waiting for completion`,
      approval: `Approval requested from role. Evaluating auto-approve threshold.`,
      automated: `Executing automation action for "${title}"`,
      end: `Workflow complete: "${title}"`,
    };

    return {
      nodeId: node.id,
      nodeTitle: title,
      nodeType: node.type as NodeType,
      status: "completed" as const,
      message: messages[node.type || ""] || `Processing node "${title}"`,
      timestamp: new Date(Date.now() + index * 1500).toISOString(),
    };
  });

  return {
    success: true,
    steps,
    summary: `Workflow executed successfully through ${steps.length} step(s).`,
  };
}
