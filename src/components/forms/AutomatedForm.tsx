import React, { useEffect, useState } from "react";
import type { AutomatedNodeData, AutomationAction } from "../../types";
import { fetchAutomations } from "../../api";

interface Props {
  data: AutomatedNodeData;
  onChange: (data: Partial<AutomatedNodeData>) => void;
}

export function AutomatedForm({ data, onChange }: Props) {
  const [actions, setActions] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAutomations().then((a) => {
      setActions(a);
      setLoading(false);
    });
  }, []);

  const selectedAction = actions.find((a) => a.id === data.actionId);

  const handleActionChange = (actionId: string) => {
    onChange({ actionId, parameters: {} });
  };

  const updateParam = (paramKey: string, value: string) => {
    onChange({ parameters: { ...data.parameters, [paramKey]: value } });
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
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Step title..."
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Action
        </label>
        {loading ? (
          <div className="text-xs text-gray-400 animate-pulse">Loading actions...</div>
        ) : (
          <select
            value={data.actionId}
            onChange={(e) => handleActionChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
          >
            <option value="">Select an action...</option>
            {actions.map((action) => (
              <option key={action.id} value={action.id}>
                {action.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedAction && selectedAction.params.length > 0 && (
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Parameters
          </label>
          {selectedAction.params.map((param) => (
            <div key={param}>
              <label className="block text-xs text-gray-500 mb-1 capitalize">{param}</label>
              <input
                type="text"
                value={data.parameters[param] || ""}
                onChange={(e) => updateParam(param, e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder={`Enter ${param}...`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
