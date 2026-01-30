
import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, RefreshCw, X, Info, Eye, MousePointer2, 
  BookOpen, FilterX, LayoutGrid, List, Calendar, User, 
  ShieldCheck, ArrowRight, ExternalLink, Filter
} from 'lucide-react';
import { 
  Tab, 
  SearchCondition, 
  SearchOperator, 
  LogicalOperator, 
  PreFilters, 
  PostFilters
} from './types';
import { generateProcedures, CATEGORIES, MANAGERS, ExtendedProcedure } from './services/mockData';
import Dropdown from './components/Dropdown';
import SearchConditionRow from './components/SearchConditionRow';

const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<Tab>(Tab.PROCEDURES);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  // Search Conditions State
  const [conditions, setConditions] = useState<SearchCondition[]>([
    { id: 'initial-1', operator: SearchOperator.CONTAINS, value: '' }
  ]);

  // Pre-Filters State
  const [preFilters, setPreFilters] = useState<PreFilters>({
    procedureTitle: true,
    procedureText: false,
    includeInvisible: false,
    includeHiddenAccounts: false,
    category: 'All',
    sortBy: 'Relevance'
  });

  // Results State
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<ExtendedProcedure[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Post-Filters State (re-used for both Table Columns and Card Dropdown)
  const [postFilters, setPostFilters] = useState<PostFilters>({
    cid: '',
    sid: '',
    pid: '',
    accountName: '',
    relationshipManager: ''
  });
  const [titleFilter, setTitleFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // UI States
  const [selectedProcedure, setSelectedProcedure] = useState<ExtendedProcedure | null>(null);

  // Handlers
  const addCondition = () => {
    if (conditions.length < 3) {
      setConditions([...conditions, { 
        id: Math.random().toString(36).substr(2, 9), 
        operator: SearchOperator.CONTAINS, 
        value: '',
        logicalNext: LogicalOperator.AND
      }]);
    }
  };

  const updateCondition = (id: string, updates: Partial<SearchCondition>) => {
    setConditions(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const removeCondition = (id: string) => {
    setConditions(prev => prev.filter(c => c.id !== id));
  };

  const handleSearch = () => {
    const isValid = conditions.every(c => c.value.trim() !== '');
    if (!isValid) {
      alert("Please enter a search term for all conditions.");
      return;
    }

    setIsSearching(true);
    setSelectedProcedure(null);
    
    setTimeout(() => {
      const mockData = generateProcedures(80);
      setResults(mockData);
      setHasSearched(true);
      setIsSearching(false);
    }, 800);
  };

  const clearSearch = () => {
    setConditions([{ id: 'initial-1', operator: SearchOperator.CONTAINS, value: '' }]);
    setResults([]);
    setHasSearched(false);
    setSelectedProcedure(null);
    resetPostFilters();
  };

  const resetPostFilters = () => {
    setPostFilters({ cid: '', sid: '', pid: '', accountName: '', relationshipManager: '' });
    setTitleFilter('');
    setCategoryFilter('');
  };

  const hasActivePostFilters = useMemo(() => {
    return !!(titleFilter || categoryFilter || postFilters.cid || postFilters.sid || postFilters.pid || postFilters.accountName || postFilters.relationshipManager);
  }, [titleFilter, categoryFilter, postFilters]);

  // Memoized filtered results
  const filteredResults = useMemo(() => {
    return results.filter(proc => {
      return (
        (!titleFilter || proc.title.toLowerCase().includes(titleFilter.toLowerCase())) &&
        (!postFilters.cid || proc.cid.toLowerCase().includes(postFilters.cid.toLowerCase())) &&
        (!postFilters.sid || proc.sid.toLowerCase().includes(postFilters.sid.toLowerCase())) &&
        (!postFilters.pid || proc.pid.toLowerCase().includes(postFilters.pid.toLowerCase())) &&
        (!postFilters.accountName || proc.accountName.toLowerCase().includes(postFilters.accountName.toLowerCase())) &&
        (!categoryFilter || proc.category === categoryFilter) &&
        (!postFilters.relationshipManager || proc.relationshipManager === postFilters.relationshipManager)
      );
    });
  }, [results, postFilters, titleFilter, categoryFilter]);

  const TableHeader = ({ label, value, onChange, placeholder, isSelect = false, options = [] }: any) => (
    <th className="px-4 py-3 border-b border-gray-200 bg-gray-50 text-left align-top">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
        {isSelect ? (
          <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-indigo-500 outline-none w-full font-medium"
          >
            <option value="">All</option>
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={e => onChange(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-indigo-500 outline-none w-full font-medium"
          />
        )}
      </div>
    </th>
  );

  const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      'Active': 'bg-emerald-50 text-emerald-700 border-emerald-100',
      'In Review': 'bg-amber-50 text-amber-700 border-amber-100',
      'Draft': 'bg-blue-50 text-blue-700 border-blue-100',
      'Archived': 'bg-gray-100 text-gray-600 border-gray-200'
    };
    return (
      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-tight ${styles[status] || styles['Draft']}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-[1400px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[92vh]">
        
        {/* Header Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50/50">
          {Object.values(Tab).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-semibold transition-all relative ${
                activeTab === tab 
                ? 'text-indigo-600 bg-white' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600" />
              )}
            </button>
          ))}
          <div className="flex-1" />
          <button className="p-4 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-100">
            {/* 1. Search Conditions Section */}
            <div className="p-6 border-b border-gray-100 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">Advanced Search</h2>
                <div className="flex items-center gap-4">
                   <button
                    onClick={addCondition}
                    disabled={conditions.length >= 3}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-all ${
                      conditions.length >= 3 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-indigo-600 hover:text-indigo-700'
                    }`}
                  >
                    <Plus size={14} /> Add condition
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-w-4xl">
                {conditions.map((cond, idx) => (
                  <SearchConditionRow
                    key={cond.id}
                    condition={cond}
                    index={idx}
                    total={conditions.length}
                    onUpdate={updateCondition}
                    onRemove={removeCondition}
                  />
                ))}
              </div>
            </div>

            {/* 2. Controls & View Toggle */}
            <div className="p-4 px-6 bg-white border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Dropdown label="Pre-Filters" variant="outline">
                  <div className="space-y-5 w-64">
                    {/* Checkbox Filters Section */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Visibility & Scope</p>
                      <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-indigo-600 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={preFilters.procedureTitle} 
                          onChange={e => setPreFilters({...preFilters, procedureTitle: e.target.checked})} 
                          className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4" 
                        /> 
                        Procedure Title
                      </label>
                      <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-indigo-600 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={preFilters.procedureText} 
                          onChange={e => setPreFilters({...preFilters, procedureText: e.target.checked})} 
                          className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4" 
                        /> 
                        Procedure Text
                      </label>
                      <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-indigo-600 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={preFilters.includeInvisible} 
                          onChange={e => setPreFilters({...preFilters, includeInvisible: e.target.checked})} 
                          className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4" 
                        /> 
                        Include Invisible
                      </label>
                      <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-indigo-600 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={preFilters.includeHiddenAccounts} 
                          onChange={e => setPreFilters({...preFilters, includeHiddenAccounts: e.target.checked})} 
                          className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4" 
                        /> 
                        Include Hidden Accounts
                      </label>
                    </div>

                    {/* Dropdown Filters Section */}
                    <div className="space-y-3 pt-3 border-t border-gray-100">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Procedure Category</p>
                        <select 
                          value={preFilters.category}
                          onChange={e => setPreFilters({...preFilters, category: e.target.value})}
                          className="w-full text-xs border border-gray-200 rounded-md p-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
                        >
                          <option value="All">All Categories</option>
                          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sort By</p>
                        <select 
                          value={preFilters.sortBy}
                          onChange={e => setPreFilters({...preFilters, sortBy: e.target.value})}
                          className="w-full text-xs border border-gray-200 rounded-md p-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
                        >
                          <option value="Relevance">Relevance</option>
                          <option value="Title">Title</option>
                          <option value="Category">Category</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </Dropdown>

                <button
                  onClick={handleSearch}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-semibold text-sm transition-all shadow-md active:scale-95"
                >
                  {isSearching ? <RefreshCw className="animate-spin" size={18} /> : <Search size={18} />}
                  Execute Search
                </button>

                {hasSearched && (
                  <button
                    onClick={clearSearch}
                    className="text-gray-500 hover:text-gray-700 text-xs font-bold flex items-center gap-1"
                  >
                    <RefreshCw size={14} /> Reset Full Search
                  </button>
                )}
              </div>

              <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <List size={14} /> Table
                </button>
                <button 
                  onClick={() => setViewMode('cards')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'cards' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <LayoutGrid size={14} /> Cards
                </button>
              </div>
            </div>

            {/* 3. Results Container */}
            <div className="flex-1 overflow-hidden flex flex-col bg-gray-50/30">
              {hasSearched ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="px-6 py-3 flex items-center justify-between border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-6">
                      <span className="text-sm font-bold text-gray-500">
                        Showing <span className="text-gray-900">{filteredResults.length}</span> of <span className="text-gray-900">{results.length}</span> procedures
                      </span>
                      
                      {/* Post-Filters Dropdown (Primarily for Card View, but functional for both) */}
                      {viewMode === 'cards' && (
                        <Dropdown 
                          label="Post-Filters" 
                          variant="ghost" 
                          className={hasActivePostFilters ? 'ring-2 ring-indigo-200 rounded-md' : ''}
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                <h3 className="text-xs font-bold text-gray-800 uppercase">Refine Results</h3>
                                <button onClick={resetPostFilters} className="text-[10px] font-bold text-indigo-600 hover:underline">Clear All</button>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Account Name</label>
                                <input 
                                  type="text" 
                                  placeholder="Filter accounts..." 
                                  value={postFilters.accountName}
                                  onChange={e => setPostFilters({...postFilters, accountName: e.target.value})}
                                  className="w-full text-xs border border-gray-300 rounded p-2 outline-none focus:ring-2 focus:ring-indigo-500" 
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase">CID</label>
                                  <input 
                                    type="text" 
                                    placeholder="ID..." 
                                    value={postFilters.cid}
                                    onChange={e => setPostFilters({...postFilters, cid: e.target.value})}
                                    className="w-full text-xs border border-gray-300 rounded p-2 outline-none" 
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase">SID</label>
                                  <input 
                                    type="text" 
                                    placeholder="ID..." 
                                    value={postFilters.sid}
                                    onChange={e => setPostFilters({...postFilters, sid: e.target.value})}
                                    className="w-full text-xs border border-gray-300 rounded p-2 outline-none" 
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">PID</label>
                                <input 
                                  type="text" 
                                  placeholder="Filter PID..." 
                                  value={postFilters.pid}
                                  onChange={e => setPostFilters({...postFilters, pid: e.target.value})}
                                  className="w-full text-xs border border-gray-300 rounded p-2 outline-none" 
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Manager</label>
                                <select 
                                  value={postFilters.relationshipManager}
                                  onChange={e => setPostFilters({...postFilters, relationshipManager: e.target.value})}
                                  className="w-full text-xs border border-gray-300 rounded p-2 outline-none bg-white"
                                >
                                  <option value="">Any Manager</option>
                                  {MANAGERS.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                              </div>
                            </div>
                          </div>
                        </Dropdown>
                      )}
                    </div>
                    
                    {hasActivePostFilters && (
                      <button onClick={resetPostFilters} className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1 uppercase tracking-wider">
                        <FilterX size={12} /> Clear Filter Overrides
                      </button>
                    )}
                  </div>
                  
                  {viewMode === 'table' ? (
                    <div className="flex-1 overflow-auto bg-white">
                      <table className="w-full table-fixed border-collapse">
                        <thead className="sticky top-0 z-20 shadow-sm">
                          <tr>
                            <TableHeader label="Procedure Title" value={titleFilter} onChange={setTitleFilter} placeholder="Filter..." />
                            <TableHeader label="Account Name" value={postFilters.accountName} onChange={(v:any) => setPostFilters({...postFilters, accountName: v})} placeholder="Filter..." />
                            <TableHeader label="Category" value={categoryFilter} onChange={setCategoryFilter} isSelect options={CATEGORIES} />
                            <TableHeader label="Manager" value={postFilters.relationshipManager} onChange={(v:any) => setPostFilters({...postFilters, relationshipManager: v})} isSelect options={MANAGERS} />
                            <th className="px-4 py-3 border-b border-gray-200 bg-gray-50 text-left w-24">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredResults.map(proc => (
                            <tr
                              key={proc.id}
                              onClick={() => setSelectedProcedure(proc)}
                              className={`group cursor-pointer transition-colors ${selectedProcedure?.id === proc.id ? 'bg-indigo-50/60' : 'hover:bg-gray-50'}`}
                            >
                              <td className="px-4 py-3 text-xs font-bold text-indigo-600 truncate">{proc.title}</td>
                              <td className="px-4 py-3 text-xs text-gray-800 truncate font-medium">{proc.accountName}</td>
                              <td className="px-4 py-3">
                                <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-500 font-bold">{proc.category}</span>
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-600 truncate">{proc.relationshipManager}</td>
                              <td className="px-4 py-3"><StatusBadge status={proc.status} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredResults.length > 0 ? (
                        filteredResults.map(proc => (
                          <div 
                            key={proc.id}
                            onClick={() => setSelectedProcedure(proc)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer group flex flex-col ${
                              selectedProcedure?.id === proc.id 
                              ? 'bg-white border-indigo-400 shadow-lg ring-1 ring-indigo-400' 
                              : 'bg-white border-gray-200 hover:border-indigo-200 hover:shadow-md'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <StatusBadge status={proc.status} />
                              <span className="text-[10px] text-gray-400 font-mono">{proc.cid}</span>
                            </div>
                            <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1 truncate">{proc.title}</h4>
                            <p className="text-xs text-gray-500 mb-4">{proc.accountName}</p>
                            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-indigo-100 text-[10px] flex items-center justify-center font-bold text-indigo-700">
                                  {proc.relationshipManager.charAt(0)}
                                </div>
                                <span className="text-[10px] font-bold text-gray-600">{proc.relationshipManager}</span>
                              </div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase">{proc.lastUpdated}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
                          <Filter className="opacity-10 mb-2" size={48} />
                          <p className="text-sm font-medium">No results match your post-filters.</p>
                          <button onClick={resetPostFilters} className="text-indigo-600 text-xs font-bold mt-2 hover:underline">Reset refinement filters</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
                    <Search size={48} className="opacity-10 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">No Active Query</h3>
                  <p className="text-xs text-gray-400">Execute a search to view and preview account procedures.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Preview Side Panel (The "Card View" Detail) */}
          <div className="w-[380px] bg-gray-50/30 flex flex-col flex-shrink-0 border-l border-gray-100">
            <div className="p-6 border-b border-gray-100 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-600">
                  <BookOpen size={18} />
                  <h3 className="font-bold text-xs uppercase tracking-widest">Detail Intel</h3>
                </div>
                {selectedProcedure && (
                  <button onClick={() => setSelectedProcedure(null)} className="text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
              {selectedProcedure ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  {/* Summary Card */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink size={14} className="text-indigo-400 cursor-pointer" />
                    </div>
                    <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mb-1 block">Procedure Overview</span>
                    <h4 className="text-lg font-extrabold text-gray-900 leading-tight mb-3">{selectedProcedure.title}</h4>
                    <p className="text-xs leading-relaxed text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                      "{selectedProcedure.snippet}"
                    </p>
                    <div className="flex items-center justify-between pt-2">
                       <StatusBadge status={selectedProcedure.status} />
                       <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                         <Calendar size={12} />
                         <span>Updated {selectedProcedure.lastUpdated}</span>
                       </div>
                    </div>
                  </div>

                  {/* Operational Intel Card */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                    <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-emerald-500" /> Operational Data
                    </h5>
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase">Account Context</p>
                          <p className="text-sm font-bold text-gray-800">{selectedProcedure.accountName}</p>
                        </div>
                        <span className="text-[10px] px-2 py-1 bg-indigo-50 text-indigo-600 rounded font-bold">{selectedProcedure.category}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-center">
                          <p className="text-[8px] font-bold text-gray-400 uppercase">CID</p>
                          <p className="text-[10px] font-mono font-bold text-gray-700">{selectedProcedure.cid}</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-center">
                          <p className="text-[8px] font-bold text-gray-400 uppercase">PID</p>
                          <p className="text-[10px] font-mono font-bold text-gray-700">{selectedProcedure.pid}</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-center">
                          <p className="text-[8px] font-bold text-gray-400 uppercase">SID</p>
                          <p className="text-[10px] font-mono font-bold text-gray-700">{selectedProcedure.sid}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ownership Card */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                    <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                      <User size={14} className="text-blue-500" /> Procedure Owner
                    </h5>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                        {selectedProcedure.relationshipManager.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">{selectedProcedure.relationshipManager}</p>
                        <p className="text-[10px] font-bold text-gray-400">Senior Relationship Manager</p>
                      </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold">
                       <span className="text-gray-400 uppercase">Review Progress</span>
                       <span className="text-indigo-600">{selectedProcedure.completion}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                       <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${selectedProcedure.completion}%` }} />
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-4">
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95 flex items-center justify-center gap-2">
                      Open Full Document <ArrowRight size={14} />
                    </button>
                    <button className="w-full bg-white border border-gray-200 text-gray-600 p-3 rounded-xl text-xs font-bold mt-2 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                      Generate PDF Report
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center px-8 space-y-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl border border-gray-50">
                    <MousePointer2 size={32} className="text-gray-200" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-gray-700 mb-1">Select for Insight</h5>
                    <p className="text-xs text-gray-400 leading-relaxed italic">
                      "Choose a row or card to explore the full lifecycle and operational DNA of this procedure."
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
