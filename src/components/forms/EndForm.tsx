import React from "react";
import type { EndNodeData } from "../../types";

interface Props {
  data: EndNodeData;
  onChange: (data: Partial<EndNodeData>) => void;
}

export function EndForm({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          End Message
        </label>
        <textarea
          value={data.endMessage}
          onChange={(e) => onChange({ endMessage: e.target.value })}
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
          placeholder="Workflow completion message..."
        />
      </div>
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={data.summaryFlag}
              onChange={(e) => onChange({ summaryFlag: e.target.checked })}
              className="sr-only"
            />
            <div
              className={`w-9 h-5 rounded-full transition-colors ${data.summaryFlag ? "bg-red-500" : "bg-gray-200"}`}
            />
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${data.summaryFlag ? "translate-x-4" : ""}`}
            />
          </div>
          <span className="text-sm text-gray-700">Generate workflow summary report</span>
        </label>
        <p className="text-xs text-gray-400 mt-1 ml-12">
          When enabled, a summary report is generated upon workflow completion.
        </p>
      </div>
    </div>
  );
}
