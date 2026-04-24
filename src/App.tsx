import React, { useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { Sidebar } from "./components/sidebar/Sidebar";
import { WorkflowCanvas } from "./components/canvas/WorkflowCanvas";
import { NodeConfigPanel } from "./components/panels/NodeConfigPanel";
import { SimulationPanel } from "./components/panels/SimulationPanel";
import { useWorkflowStore } from "./store/workflowStore";
import { simulateWorkflow } from "./api";
import type { SimulationResult } from "./types";

function AppContent() {
  const {
    nodes,
    edges,
    selectedNodeId,
    simulationResult,
    isSimulating,
    setSimulationResult,
    setIsSimulating,
    validate,
  } = useWorkflowStore();

  const handleRunSimulation = async () => {
    const errors = validate();
    const hasErrors = errors.some((e) => e.severity === "error");

    if (hasErrors) {
      alert(
        "Please fix workflow errors before running:\n\n" +
          errors
            .filter((e) => e.severity === "error")
            .map((e) => `• ${e.message}`)
            .join("\n")
      );
      return;
    }

    setIsSimulating(true);
    try {
      const result = await simulateWorkflow(nodes, edges);
      setSimulationResult(result);
    } catch (err) {
      setSimulationResult({
        success: false,
        steps: [],
        summary: "An unexpected error occurred during simulation.",
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex flex-1 overflow-hidden">
        <WorkflowCanvas
          onRunSimulation={handleRunSimulation}
          isSimulating={isSimulating}
        />
        {selectedNodeId && <NodeConfigPanel />}
      </div>

      {simulationResult && (
        <SimulationPanel
          result={simulationResult}
          onClose={() => setSimulationResult(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <AppContent />
    </ReactFlowProvider>
  );
}
