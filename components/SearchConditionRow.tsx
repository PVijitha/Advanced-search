
import React from 'react';
import { Trash2 } from 'lucide-react';
import { SearchCondition, SearchOperator, LogicalOperator } from '../types';

interface Props {
  condition: SearchCondition;
  index: number;
  total: number;
  onUpdate: (id: string, updates: Partial<SearchCondition>) => void;
  onRemove: (id: string) => void;
}

const SearchConditionRow: React.FC<Props> = ({ condition, index, total, onUpdate, onRemove }) => {
  return (
    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
      {index > 0 && (
        <div className="flex justify-start px-2">
          <select
            value={condition.logicalNext || LogicalOperator.AND}
            onChange={(e) => onUpdate(condition.id, { logicalNext: e.target.value as LogicalOperator })}
            className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value={LogicalOperator.AND}>AND</option>
            <option value={LogicalOperator.OR}>OR</option>
          </select>
        </div>
      )}
      
      <div className="flex items-center gap-3">
        <select
          value={condition.operator}
          onChange={(e) => onUpdate(condition.id, { operator: e.target.value as SearchOperator })}
          className="w-40 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        >
          {Object.values(SearchOperator).map(op => (
            <option key={op} value={op}>{op}</option>
          ))}
        </select>

        <input
          type="text"
          value={condition.value}
          onChange={(e) => onUpdate(condition.id, { value: e.target.value })}
          placeholder="Enter search term..."
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />

        {total > 1 && (
          <button
            onClick={() => onRemove(condition.id)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Remove condition"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchConditionRow;
