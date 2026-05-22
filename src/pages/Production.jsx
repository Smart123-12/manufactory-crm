import React, { useState } from 'react';
import { 
  Play, Pause, Flame, Settings, Users, Activity, ToggleLeft, ToggleRight, PlusCircle, Wrench, 
  Trash2, AlertOctagon, CheckCircle2 
} from 'lucide-react';

export default function Production({ 
  machines, 
  workers, 
  productionLogs, 
  onLogProduction, 
  onUpdateMachineStatus,
  onUpdateWorkerMachine,
  userRole = 'Owner'
}) {
  const isEditable = userRole === 'Owner' || userRole === 'Admin' || userRole === 'Production Supervisor';
  const [activeSubTab, setActiveSubTab] = useState('floor'); // floor, logger, logs, allocations

  // Checklist modal states
  const [showChecklistMachineId, setShowChecklistMachineId] = useState(null);
  const [checklistItems, setChecklistItems] = useState({
    calibration: false,
    fluids: false,
    gates: false,
    debris: false
  });
  
  // Log form states
  const [selectedMachineId, setSelectedMachineId] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [outputQty, setOutputQty] = useState(0);
  const [wastageQty, setWastageQty] = useState(0);
  const [downtimeMins, setDowntimeMins] = useState(0);
  const [downtimeReason, setDowntimeReason] = useState('');

  // Worker machine re-assignment states
  const [reassignWorkerId, setReassignWorkerId] = useState('');
  const [reassignMachineId, setReassignMachineId] = useState('');

  const handleRunClick = (machineId) => {
    if (!isEditable) return;
    setChecklistItems({
      calibration: false,
      fluids: false,
      gates: false,
      debris: false
    });
    setShowChecklistMachineId(machineId);
  };

  const handleCompleteChecklist = () => {
    if (!showChecklistMachineId) return;
    onUpdateMachineStatus(showChecklistMachineId, 'Running');
    setShowChecklistMachineId(null);
  };

  const handleCreateLog = (e) => {
    e.preventDefault();
    if (!isEditable) {
      alert('Role Unauthorized: You do not have permissions to write shop floor logs.');
      return;
    }
    if (!selectedMachineId || !selectedOperator || outputQty <= 0) {
      alert('Please fill out Machine, Operator, and a valid Output Quantity.');
      return;
    }
    const machineObj = machines.find(m => m.id === selectedMachineId);
    
    // Wastage Calculations
    const outNum = parseFloat(outputQty);
    const wasteNum = parseFloat(wastageQty) || 0;
    const wastePct = outNum > 0 ? parseFloat(((wasteNum / (outNum + wasteNum)) * 100).toFixed(1)) : 0;

    const newLog = {
      id: `PLOG-80${productionLogs.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      machineId: selectedMachineId,
      machineName: machineObj.name,
      operator: selectedOperator,
      outputQty: outNum,
      unit: machineObj.type === 'CNC Unit' ? 'Bolts' : machineObj.type === 'Plastic Molding' ? 'Pallets' : 'Units',
      wastageQty: wasteNum,
      wastagePercent: wastePct,
      downtimeMinutes: parseInt(downtimeMins) || 0,
      downtimeReason: downtimeReason || 'None',
      status: "Under Review"
    };

    onLogProduction(newLog);
    // Reset Form
    setSelectedMachineId('');
    setSelectedOperator('');
    setOutputQty(0);
    setWastageQty(0);
    setDowntimeMins(0);
    setDowntimeReason('');
    setActiveSubTab('logs');
    alert(`Production Run ${newLog.id} logged for review!`);
  };

  const handleWorkerAssignmentSubmit = (e) => {
    e.preventDefault();
    if (!isEditable) {
      alert('Role Unauthorized: You do not have permissions to change worker allocations.');
      return;
    }
    if (!reassignWorkerId) return;
    onUpdateWorkerMachine(reassignWorkerId, reassignMachineId);
    setReassignWorkerId('');
    setReassignMachineId('');
    alert('Worker allocation updated on shop floor.');
  };

  return (
    <div className="space-y-6">
      
      {/* Sub tabs */}
      <div className="flex border border-slate-200 bg-slate-100 p-1 rounded-lg max-w-md">
        <button
          onClick={() => setActiveSubTab('floor')}
          className={`flex-1 py-2 px-3 rounded text-xs font-bold transition-all
            ${activeSubTab === 'floor' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}
          `}
        >
          Live Machine Grid
        </button>
        <button
          onClick={() => setActiveSubTab('logger')}
          className={`flex-1 py-2 px-3 rounded text-xs font-bold transition-all
            ${activeSubTab === 'logger' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}
          `}
        >
          Log Output
        </button>
        <button
          onClick={() => setActiveSubTab('logs')}
          className={`flex-1 py-2 px-3 rounded text-xs font-bold transition-all
            ${activeSubTab === 'logs' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}
          `}
        >
          Production Logs
        </button>
        <button
          onClick={() => setActiveSubTab('allocations')}
          className={`flex-1 py-2 px-3 rounded text-xs font-bold transition-all
            ${activeSubTab === 'allocations' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}
          `}
        >
          Worker Duty Matrix
        </button>
      </div>

      {/* 1. TAB: Live Machine Grid */}
      {activeSubTab === 'floor' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-850">Shop Floor Machine Terminal</h3>
              <p className="text-xs text-slate-500">Live telemetry, current operator, and quick state toggles</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1 font-semibold text-slate-600"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span> Running</span>
              <span className="flex items-center gap-1 font-semibold text-slate-600"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span> Idle</span>
              <span className="flex items-center gap-1 font-semibold text-slate-600"><span className="w-2.5 h-2.5 bg-rose-500 rounded-full inline-block"></span> Maintenance</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {machines.map(mach => (
              <div 
                key={mach.id} 
                className={`glass-panel p-5 rounded-xl border flex flex-col justify-between space-y-5 relative overflow-hidden
                  ${mach.status === 'Running' ? 'border-emerald-200 shadow-lg shadow-emerald-50/10' : ''}
                  ${mach.status === 'Idle' ? 'border-amber-200 shadow-lg shadow-amber-50/10' : ''}
                  ${mach.status === 'Maintenance' ? 'border-rose-200 shadow-lg shadow-rose-50/10' : ''}
                `}
              >
                {/* Visual state background bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 
                  ${mach.status === 'Running' ? 'bg-emerald-500' : ''}
                  ${mach.status === 'Idle' ? 'bg-amber-500' : ''}
                  ${mach.status === 'Maintenance' ? 'bg-rose-500' : ''}
                `}></div>

                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider">{mach.id} • {mach.type}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider
                      ${mach.status === 'Running' ? 'bg-emerald-50 text-emerald-700 border border-emerald-250' : ''}
                      ${mach.status === 'Idle' ? 'bg-amber-50 text-amber-700 border border-amber-250' : ''}
                      ${mach.status === 'Maintenance' ? 'bg-rose-50 text-rose-700 border border-rose-250' : ''}
                    `}>
                      {mach.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">{mach.name}</h4>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> Active Operator: <strong className="text-slate-600 font-bold">{mach.operator || 'None'}</strong>
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg grid grid-cols-2 gap-3 text-center border border-slate-150 text-xs">
                  <div>
                    <p className="text-[10px] text-slate-500">Utilization</p>
                    <p className="font-bold text-slate-805 mt-0.5">{mach.utilization}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">OEE Index</p>
                    <p className="font-bold text-emerald-650 mt-0.5">{mach.efficiency}%</p>
                  </div>
                  <div className="col-span-2 border-t border-slate-200 pt-2 grid grid-cols-2">
                    <div>
                      <p className="text-[9px] text-slate-500 font-medium">Today Run</p>
                      <p className="font-semibold text-[11px] text-slate-650 mt-0.5">{mach.todayRuntime}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 font-medium">Temp Index</p>
                      <p className="font-semibold text-[11px] text-slate-650 mt-0.5">{mach.temp}</p>
                    </div>
                  </div>
                </div>

                {/* State Toggles Action Menu */}
                <div className="border-t border-slate-200 pt-3.5 flex items-center justify-between text-xs">
                  <span className="text-slate-550 font-semibold uppercase tracking-wider text-[9px]">Toggle Status:</span>
                  {!isEditable ? (
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      🔒 Read-Only
                    </span>
                  ) : (
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => handleRunClick(mach.id)}
                        disabled={mach.status === 'Running'}
                        className="p-1 rounded bg-white hover:bg-emerald-50 text-emerald-600 disabled:opacity-20 border border-emerald-250 transition-all text-[10px] font-bold shadow-sm"
                      >
                        Run
                      </button>
                      <button 
                        onClick={() => onUpdateMachineStatus(mach.id, 'Idle')}
                        disabled={mach.status === 'Idle'}
                        className="p-1 rounded bg-white hover:bg-amber-50 text-amber-600 disabled:opacity-20 border border-amber-250 transition-all text-[10px] font-bold shadow-sm"
                      >
                        Idle
                      </button>
                      <button 
                        onClick={() => onUpdateMachineStatus(mach.id, 'Maintenance')}
                        disabled={mach.status === 'Maintenance'}
                        className="p-1 rounded bg-white hover:bg-rose-50 text-rose-600 disabled:opacity-20 border border-rose-250 transition-all text-[10px] font-bold shadow-sm"
                      >
                        Stop
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. TAB: Log Output Form */}
      {activeSubTab === 'logger' && (
        <div className="glass-panel p-6 rounded-xl max-w-2xl bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4 mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-850">Daily Production Inward Logger</h3>
              <p className="text-xs text-slate-500">Record actual outputs, scrap, and downtime minutes</p>
            </div>
            <Activity className="w-5 h-5 text-brand-500" />
          </div>

          {!isEditable && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 flex items-center gap-3">
              <AlertOctagon className="w-5 h-5 text-amber-600 flex-shrink-0 animate-pulse" />
              <div>
                <p className="font-bold">View-Only Mode Enabled</p>
                <p className="text-[10px] text-amber-700 font-medium">Daily Production Inward logging is restricted strictly to Production Supervisor, Admin, or Owner roles.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleCreateLog} className="space-y-5 text-xs">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">Machine Unit *</label>
                <select
                  required
                  disabled={!isEditable}
                  value={selectedMachineId}
                  onChange={(e) => setSelectedMachineId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="">-- Choose Machine --</option>
                  {machines.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">Assigned Operator *</label>
                <select
                  required
                  disabled={!isEditable}
                  value={selectedOperator}
                  onChange={(e) => setSelectedOperator(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="">-- Select Worker --</option>
                  {workers.map(w => (
                    <option key={w.id} value={w.name}>{w.name} ({w.role})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">Good Output Quantity *</label>
                <input 
                  type="number"
                  required
                  disabled={!isEditable}
                  min="1"
                  placeholder="e.g. 1500"
                  value={outputQty}
                  onChange={(e) => setOutputQty(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-850 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">Wastage / Scrap Quantity</label>
                <input 
                  type="number"
                  min="0"
                  disabled={!isEditable}
                  placeholder="e.g. 15"
                  value={wastageQty}
                  onChange={(e) => setWastageQty(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-850 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">Downtime Duration (Minutes)</label>
                <input 
                  type="number"
                  min="0"
                  disabled={!isEditable}
                  placeholder="e.g. 30 mins"
                  value={downtimeMins}
                  onChange={(e) => setDowntimeMins(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-850 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">Downtime / Halt Reason</label>
                <select
                  disabled={!isEditable}
                  value={downtimeReason}
                  onChange={(e) => setDowntimeReason(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="">-- Select Reason (If halted) --</option>
                  <option value="Tool Changeover">Tool Changeover</option>
                  <option value="Nozzle Cleaning">Nozzle Cleaning</option>
                  <option value="Material Loading Jam">Material Loading Jam</option>
                  <option value="Power Fluctuations">Power Fluctuations</option>
                  <option value="Scheduled Maintenance">Scheduled Maintenance</option>
                  <option value="Operator Switchover">Operator Switchover</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isEditable}
              className={`w-full py-3 font-bold rounded-lg shadow-lg flex items-center justify-center gap-1.5 transition-all
                ${isEditable 
                  ? 'bg-brand-600 hover:bg-brand-500 text-white cursor-pointer shadow-brand-100' 
                  : 'bg-slate-150 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                }
              `}
            >
              {isEditable ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Save Shop Floor Production Entry
                </>
              ) : (
                <>
                  🔒 Entry Form Locked (Read-Only)
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* 3. TAB: Production Logs */}
      {activeSubTab === 'logs' && (
        <div className="glass-panel p-5 rounded-xl">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Shop Floor Logs Database</h4>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="pb-3">Log ID</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Machine & Operator</th>
                  <th className="pb-3">Good Output</th>
                  <th className="pb-3">Scrap Wastage</th>
                  <th className="pb-3">Halt Downtime</th>
                  <th className="pb-3">Audit State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {productionLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="py-3 font-bold text-brand-650">{log.id}</td>
                    <td className="py-3 font-mono">{log.date}</td>
                    <td className="py-3">
                      <p className="font-bold text-slate-800">{log.machineName}</p>
                      <p className="text-[10px] text-slate-400">OP: {log.operator}</p>
                    </td>
                    <td className="py-3 font-extrabold font-mono text-slate-800">
                      {log.outputQty} <span className="text-[10px] font-normal text-slate-500">{log.unit}</span>
                    </td>
                    <td className="py-3">
                      <p className="font-semibold text-rose-600 font-mono">{log.wastageQty} {log.unit}</p>
                      <p className="text-[10px] text-rose-500 font-semibold font-mono">({log.wastagePercent}%)</p>
                    </td>
                    <td className="py-3">
                      {log.downtimeMinutes > 0 ? (
                        <>
                          <p className="font-semibold text-amber-700 font-mono">{log.downtimeMinutes} mins</p>
                          <p className="text-[10px] text-slate-500 font-medium">({log.downtimeReason})</p>
                        </>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-bold">0 Halt</span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded border
                        ${log.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}
                      `}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. TAB: Worker Shift allocations */}
      {activeSubTab === 'allocations' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Worker allocations ledger */}
          <div className="glass-panel p-5 rounded-xl lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Worker Shift Directory
            </h4>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="pb-3">Worker ID</th>
                    <th className="pb-3">Full Name</th>
                    <th className="pb-3">Role & Skill</th>
                    <th className="pb-3">Shift Plan</th>
                    <th className="pb-3">Assigned Machine</th>
                    <th className="pb-3">Efficiency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {workers.map(w => (
                    <tr key={w.id} className="hover:bg-slate-50/50">
                      <td className="py-3 font-bold text-slate-400 font-mono">{w.id}</td>
                      <td className="py-3 font-bold text-slate-800">{w.name}</td>
                      <td className="py-3 text-slate-700 font-semibold">{w.role}</td>
                      <td className="py-3 font-mono">{w.shift}</td>
                      <td className="py-3 font-bold text-brand-600">
                        {w.activeMachine !== 'None' ? (
                          machines.find(m => m.id === w.activeMachine)?.name || w.activeMachine
                        ) : (
                          <span className="text-slate-450 font-normal">Off duty / Buffer</span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`font-bold font-mono text-sm
                          ${w.efficiency >= 90 ? 'text-emerald-600 font-extrabold' : ''}
                          ${w.efficiency < 90 && w.efficiency > 0 ? 'text-amber-600 font-extrabold' : ''}
                          ${w.efficiency === 0 ? 'text-slate-450' : ''}
                        `}>
                          {w.efficiency > 0 ? `${w.efficiency}%` : 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rapid re-assignment form */}
          <div className="glass-panel p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4 h-fit">
            <div className="border-b border-slate-200 pb-3">
              <h4 className="text-xs font-bold text-slate-805 uppercase tracking-widest flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-brand-500" /> Allocate Machine duty
              </h4>
              <p className="text-[10px] text-slate-500">Quickly delegate operators to custom assets</p>
            </div>

            {!isEditable && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[10px] leading-relaxed">
                🔒 <strong>View-Only</strong>: Delegate re-assignment is restricted to Supervisors and Admins.
              </div>
            )}

            <form onSubmit={handleWorkerAssignmentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Select Operator *</label>
                <select
                  required
                  disabled={!isEditable}
                  value={reassignWorkerId}
                  onChange={(e) => setReassignWorkerId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="">-- Choose Operator --</option>
                  {workers.map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Assign Machine *</label>
                <select
                  required
                  disabled={!isEditable}
                  value={reassignMachineId}
                  onChange={(e) => setReassignMachineId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="">-- Select Machine --</option>
                  <option value="None">None (Unassigned / Buffer)</option>
                  {machines.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={!isEditable}
                className={`w-full py-2.5 font-bold rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-all
                  ${isEditable 
                    ? 'bg-brand-600 hover:bg-brand-500 text-white cursor-pointer shadow-brand-100' 
                    : 'bg-slate-150 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                  }
                `}
              >
                {isEditable ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Save Assignment
                  </>
                ) : (
                  <>
                    🔒 Duty Form Locked
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      )}

      {/* Pre-Run Calibration & Safety Checklist Modal */}
      {showChecklistMachineId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-brand-600 animate-spin-slow" />
                Pre-Run Safety & Calibration Checklist
              </span>
              <button 
                onClick={() => setShowChecklistMachineId(null)}
                className="text-slate-400 hover:text-slate-650 font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider">Target Machine ID: {showChecklistMachineId}</span>
                <h4 className="font-extrabold text-slate-800 text-sm mt-0.5">
                  {machines.find(m => m.id === showChecklistMachineId)?.name}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Operator: {machines.find(m => m.id === showChecklistMachineId)?.operator || 'None'}</p>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-150 hover:bg-slate-50/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={checklistItems.calibration}
                    onChange={(e) => setChecklistItems({ ...checklistItems, calibration: e.target.checked })}
                    className="mt-0.5 rounded bg-white border-slate-350 text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <p className="font-bold text-slate-700">Pre-operation Calibration Verified</p>
                    <p className="text-[10px] text-slate-500">Ensure the unit dial controls, switches, and baseline feeds are fully aligned.</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-150 hover:bg-slate-50/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={checklistItems.fluids}
                    onChange={(e) => setChecklistItems({ ...checklistItems, fluids: e.target.checked })}
                    className="mt-0.5 rounded bg-white border-slate-350 text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <p className="font-bold text-slate-700">Hydraulic Fluids & Pressure Nominal</p>
                    <p className="text-[10px] text-slate-500">Confirm pump pressure, cooling lines, and lubricating agents are at target levels.</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-150 hover:bg-slate-50/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={checklistItems.gates}
                    onChange={(e) => setChecklistItems({ ...checklistItems, gates: e.target.checked })}
                    className="mt-0.5 rounded bg-white border-slate-350 text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <p className="font-bold text-slate-700">Safety Gates & Sensors Engaged</p>
                    <p className="text-[10px] text-slate-500">Check optoelectronic guards, barriers, and manual emergency shut-offs.</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-150 hover:bg-slate-50/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={checklistItems.debris}
                    onChange={(e) => setChecklistItems({ ...checklistItems, debris: e.target.checked })}
                    className="mt-0.5 rounded bg-white border-slate-350 text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <p className="font-bold text-slate-700">Scrap & Tooling Debris Cleared</p>
                    <p className="text-[10px] text-slate-500">Verify nozzle orifice, die chambers, or blades are free of residual metal/plastic scrap.</p>
                  </div>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowChecklistMachineId(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCompleteChecklist}
                  disabled={!(checklistItems.calibration && checklistItems.fluids && checklistItems.gates && checklistItems.debris)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-extrabold rounded-lg shadow-md transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Start Machine Run
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
