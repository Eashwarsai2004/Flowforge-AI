import React from "react";
import type { StartNodeData, MetaField } from "../../types";

interface Props {
  data: StartNodeData;
  onChange: (data: Partial<StartNodeData>) => void;
}

export function StartForm({ data, onChange }: Props) {
  const addMeta = () => {
    onChange({ metadata: [...(data.metadata || []), { key: "", value: "" }] });
  };

  const updateMeta = (index: number, field: keyof MetaField, value: string) => {
    const updated = data.metadata.map((m, i) =>
      i === index ? { ...m, [field]: value } : m
    );
    onChange({ metadata: updated });
  };

  const removeMeta = (index: number) => {
    onChange({ metadata: data.metadata.filter((_, i) => i !== index) });
  };

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
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Workflow title..."
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Metadata
          </label>
          <button
            onClick={addMeta}
            className="text-xs text-green-600 hover:text-green-700 font-medium"
          >
            + Add field
          </button>
        </div>
        <div className="space-y-2">
          {data.metadata?.map((meta, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                value={meta.key}
                onChange={(e) => updateMeta(i, "key", e.target.value)}
                className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
                placeholder="Key"
              />
              <input
                type="text"
                value={meta.value}
                onChange={(e) => updateMeta(i, "value", e.target.value)}
                className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
                placeholder="Value"
              />
              <button
                onClick={() => removeMeta(i)}
                className="text-gray-400 hover:text-red-500 text-sm"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
