import React from "react";
import type { TaskNodeData, MetaField } from "../../types";

interface Props {
  data: TaskNodeData;
  onChange: (data: Partial<TaskNodeData>) => void;
}

export function TaskForm({ data, onChange }: Props) {
  const addCustomField = () => {
    onChange({ customFields: [...(data.customFields || []), { key: "", value: "" }] });
  };

  const updateField = (index: number, field: keyof MetaField, value: string) => {
    const updated = data.customFields.map((f, i) =>
      i === index ? { ...f, [field]: value } : f
    );
    onChange({ customFields: updated });
  };

  const removeField = (index: number) => {
    onChange({ customFields: data.customFields.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Task title..."
          required
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Description
        </label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          placeholder="Task description..."
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Assignee
        </label>
        <input
          type="text"
          value={data.assignee}
          onChange={(e) => onChange({ assignee: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Username or email..."
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Due Date
        </label>
        <input
          type="date"
          value={data.dueDate}
          onChange={(e) => onChange({ dueDate: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Custom Fields
          </label>
          <button
            onClick={addCustomField}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
          >
            + Add field
          </button>
        </div>
        <div className="space-y-2">
          {data.customFields?.map((field, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                value={field.key}
                onChange={(e) => updateField(i, "key", e.target.value)}
                className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
                placeholder="Key"
              />
              <input
                type="text"
                value={field.value}
                onChange={(e) => updateField(i, "value", e.target.value)}
                className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
                placeholder="Value"
              />
              <button
                onClick={() => removeField(i)}
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
