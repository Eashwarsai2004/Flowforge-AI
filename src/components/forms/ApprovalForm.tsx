import React from "react";
import type { ApprovalNodeData } from "../../types";

interface Props {
  data: ApprovalNodeData;
  onChange: (data: Partial<ApprovalNodeData>) => void;
}

export function ApprovalForm({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Title
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          placeholder="Approval step name..."
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Approver Role
        </label>
        <input
          type="text"
          value={data.approverRole}
          onChange={(e) => onChange({ approverRole: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          placeholder="e.g. HR Manager, Team Lead..."
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Auto-Approve Threshold (%)
        </label>
        <input
          type="number"
          min={0}
          max={100}
          value={data.autoApproveThreshold}
          onChange={(e) => onChange({ autoApproveThreshold: Number(e.target.value) })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          placeholder="0 = manual only"
        />
        <p className="text-xs text-gray-400 mt-1">
          Set to 0 to require manual approval. Values above 0 auto-approve when score exceeds threshold.
        </p>
      </div>
    </div>
  );
}
