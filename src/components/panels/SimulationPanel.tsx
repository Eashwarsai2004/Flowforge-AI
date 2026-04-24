import React from "react";
import type { SimulationResult, SimulationStep } from "../../types";
import { NodeType } from "../../types";

interface Props {
  result: SimulationResult;
  onClose: () => void;
}

const nodeTypeIcons: Record<string, string> = {
  [NodeType.Start]: "▶",
  [NodeType.Task]: "✓",
  [NodeType.Approval]: "⊕",
  [NodeType.Automated]: "⚡",
  [NodeType.End]: "■",
};

const statusColors: Record<SimulationStep["status"], string> = {
  completed: "bg-green-100 text-green-700 border-green-200",
  skipped: "bg-yellow-100 text-yellow-700 border-yellow-200",
  error: "bg-red-100 text-red-700 border-red-200",
};

export function SimulationPanel({ result, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Simulation Results</h2>
            <p
              className={`text-xs mt-0.5 font-medium ${result.success ? "text-green-600" : "text-red-600"}`}
            >
              {result.success ? "Workflow ran successfully" : "Simulation failed"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Steps */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="relative">
            {/* Vertical timeline line */}
            {result.steps.length > 1 && (
              <div className="absolute left-4 top-8 bottom-4 w-0.5 bg-gray-200" />
            )}

            <div className="space-y-4">
              {result.steps.map((step, index) => (
                <div key={step.nodeId + index} className="flex gap-4 items-start">
                  {/* Icon */}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border-2 border-white shadow
                      ${step.status === "completed" ? "bg-green-500 text-white" : step.status === "error" ? "bg-red-500 text-white" : "bg-yellow-400 text-white"}`}
                  >
                    {nodeTypeIcons[step.nodeType] || "•"}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-gray-800">
                        {step.nodeTitle}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColors[step.status]}`}
                      >
                        {step.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{step.message}</p>
                    <p className="text-xs text-gray-300 mt-0.5">
                      {new Date(step.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <p className="text-sm text-gray-600">{result.summary}</p>
          <button
            onClick={onClose}
            className="mt-3 w-full py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
