import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, ComposedChart, Cell, PieChart, Pie
} from 'recharts';
import { 
  Printer, TrendingUp, Cpu, Award, Zap, AlertTriangle, ShieldCheck, 
  Sparkles, MessageSquare, Bot, ArrowRight, HelpCircle, CheckCircle, 
  Database, Smartphone, Calendar, Check, Copy, ToggleLeft, ToggleRight
} from 'lucide-react';

export default function Reports({ 
  monthlyData, 
  productProfitability, 
  machines, 
  productionLogs,
  customers = [],
  orders = [],
  inventory = [],
  dispatchBilling = []
}) {
  const [activeTab, setActiveTab] = useState('performance'); // performance, ai-insights, whatsapp-flows
  const [activeAIQuestion, setActiveAIQuestion] = useState('delays'); // delays, margins, wastage, revenue
  
  // WhatsApp Preview state
  const [selectedPreviewCustomer, setSelectedPreviewCustomer] = useState(customers[0]?.id || '');
  const [selectedPreviewOrder, setSelectedPreviewOrder] = useState(orders[0]?.id || '');
  const [selectedPreviewItem, setSelectedPreviewItem] = useState(inventory[0]?.id || '');
  const [copiedText, setCopiedText] = useState(null);
  const [testSent, setTestSent] = useState(null);

  // Twilio settings state
  const [twilioSid, setTwilioSid] = useState('AC89a24bb89012cdfe38920199042bbf');
  const [twilioToken, setTwilioToken] = useState('••••••••••••••••••••••••••••••••');
  const [twilioStatus, setTwilioStatus] = useState('Sandbox Mode Connected');

  // Automation toggles
  const [toggles, setToggles] = useState({
    lowStock: true,
    payment: true,
    dispatch: true,
    production: true,
    summary: false
  });

  const formatINR = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedText(key);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSendTest = (key, text) => {
    setTestSent(key);
    // Simulating WhatsApp trigger
    if (window.Notification) {
      new Notification("Manufactory CRM - WhatsApp Trigger Simulated", {
        body: `Triggered message via Twilio API: ${text.slice(0, 80)}...`,
        icon: "/favicon.ico"
      });
    } else {
      alert(`[Twilio Simulation] Message dispatched to WhatsApp API:\n\n${text}`);
    }
    setTimeout(() => setTestSent(null), 3000);
  };

  // --- DYNAMIC AI CALCULATIONS ---

  // 1. Delays / Machine downtime
  const machineDowntimes = machines.map(m => {
    const logs = productionLogs.filter(l => l.machineId === m.id);
    const loggedDowntime = logs.reduce((sum, l) => sum + l.downtimeMinutes, 0);
    // Add additional simulated hours if currently in maintenance
    const currentMaintDowntime = m.status === 'Maintenance' ? 120 : 0;
    return {
      id: m.id,
      name: m.name,
      downtime: loggedDowntime + currentMaintDowntime,
      status: m.status,
      operator: m.operator || 'Unassigned'
    };
  }).sort((a, b) => b.downtime - a.downtime);

  const worstMachine = machineDowntimes[0];

  // 2. Margins
  const sortedMargins = [...productProfitability].sort((a, b) => b.profitMargin - a.profitMargin);
  const highestMarginProduct = sortedMargins[0];

  // 3. Wastage / Scrap
  const materialWastage = productionLogs.map(log => {
    // Find what raw materials this output maps to in inventory
    let matchedMaterial = "Packing Material";
    if (log.unit.includes("Bolt")) matchedMaterial = "Mild Steel Sheet 2.5mm";
    if (log.unit.includes("Flange")) matchedMaterial = "MS Steel Coils 4.0mm";
    if (log.unit.includes("Pallet")) matchedMaterial = "HDPE Granules (Grade A55)";
    return {
      logId: log.id,
      machine: log.machineName,
      material: matchedMaterial,
      scrapPercent: log.wastagePercent,
      scrapQty: log.wastageQty,
      unit: log.unit
    };
  }).sort((a, b) => b.scrapPercent - a.scrapPercent);

  const worstWastageLog = materialWastage[0];

  // 4. Customer Revenue
  const customerRevenueList = customers.map(c => {
    // Sum active orders totalAmount
    const activeOrdersSum = orders.filter(o => o.customerId === c.id).reduce((sum, o) => sum + o.totalAmount, 0);
    // Sum paid invoices
    const paidInvoicesSum = dispatchBilling.filter(i => i.customerName === c.name && i.paymentStatus === 'Paid').reduce((sum, i) => sum + i.grandTotal, 0);
    // Sum unpaid invoices
    const unpaidInvoicesSum = dispatchBilling.filter(i => i.customerName === c.name && i.paymentStatus !== 'Paid').reduce((sum, i) => sum + i.grandTotal, 0);
    
    return {
      id: c.id,
      name: c.name,
      activeOrders: activeOrdersSum,
      completedRevenue: paidInvoicesSum,
      totalLifecycleVal: activeOrdersSum + paidInvoicesSum + unpaidInvoicesSum,
      outstanding: c.outstanding
    };
  }).sort((a, b) => b.totalLifecycleVal - a.totalLifecycleVal);

  const highestRevenueCustomer = customerRevenueList[0];

  // Calculate high-level financial metrics for performance tab
  const totalFinancialRevenue = monthlyData.reduce((sum, item) => sum + item.Revenue, 0);
  const totalProductionValue = monthlyData.reduce((sum, item) => sum + item.Production, 0);
  const totalDowntime = productionLogs.reduce((sum, log) => sum + log.downtimeMinutes, 0);
  const averageOEE = Math.round(machines.reduce((sum, m) => sum + m.efficiency, 0) / machines.length);

  return (
    <div className="space-y-6">
      
      {/* Dynamic Sub-tab Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-1 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Bot className="w-6 h-6 text-brand-600 animate-pulse-subtle" />
            Operations Analytics & AI
          </h2>
          <p className="text-xs text-slate-500">Analyze performance, view AI diagnostic suggestions, and manage automated shop floor notifications.</p>
        </div>
        
        {/* Sub-tab selection pill */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200 shadow-inner">
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'performance' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Performance Dashboard
          </button>
          <button
            onClick={() => setActiveTab('ai-insights')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'ai-insights' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            AI Operations Insights
          </button>
          <button
            onClick={() => setActiveTab('whatsapp-flows')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'whatsapp-flows' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
            WhatsApp Automations
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* SUBTAB 1: PERFORMANCE DASHBOARD            */}
      {/* ========================================== */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* 1. Analytics KPI header cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div className="glass-panel p-4 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Sales Invoiced</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatINR(totalFinancialRevenue)}</h3>
              <p className="text-[10px] text-emerald-650 flex items-center gap-0.5 font-bold">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> +15.5% vs Last Month
              </p>
            </div>

            <div className="glass-panel p-4 rounded-xl">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Shop Floor Output</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatINR(totalProductionValue)}</h3>
              <p className="text-[10px] text-slate-500 font-medium">Value of finished goods processed</p>
            </div>

            <div className="glass-panel p-4 rounded-xl">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Average Shop OEE Index</p>
              <h3 className="text-2xl font-bold text-emerald-650 mt-1">{averageOEE}%</h3>
              <p className="text-[10px] text-slate-500 flex items-center gap-0.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Standard Target Met (80%)
              </p>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-rose-200 bg-rose-50/50">
              <p className="text-xs text-rose-600 font-bold uppercase tracking-wider">Total Idle Downtime</p>
              <h3 className="text-2xl font-bold text-rose-700 mt-1">{totalDowntime} <span className="text-xs font-normal text-slate-500">mins</span></h3>
              <p className="text-[10px] text-rose-500 flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Halts logged today
              </p>
            </div>

          </div>

          {/* 2. Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Production Efficiency & Targets */}
            <div className="glass-panel p-5 rounded-xl space-y-4 bg-white border border-slate-200">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Production Output vs Targets</h4>
                <p className="text-xs text-slate-500">Comparing processed lot values against plant target ceilings</p>
              </div>
              
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${v/100000}L`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px -2px rgba(148,163,184,0.12)' }}
                      formatter={(value) => [formatINR(value), null]}
                    />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="Production" name="Actual Processed Value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
                    <Line type="monotone" dataKey="Target" name="Plant Target Goal" stroke="#94a3b8" strokeWidth={2.5} dot={{ fill: '#94a3b8' }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Machine Downtime Diagnostics Chart */}
            <div className="glass-panel p-5 rounded-xl space-y-4 bg-white border border-slate-200">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Machine Breakdown & Halt Breakdown</h4>
                <p className="text-xs text-slate-500">Analysis of daily downtime in minutes across workcenters</p>
              </div>
              
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productionLogs} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="machineId" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} unit=" m" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px -2px rgba(148,163,184,0.12)' }}
                      formatter={(value) => [`${value} minutes`, 'Halt Time']}
                    />
                    <Bar dataKey="downtimeMinutes" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* 3. Product Profitability Grid */}
          <div className="glass-panel p-5 rounded-xl bg-white border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-800">SKU Profitability & Margins Index</h4>
                <p className="text-xs text-slate-500">Raw material vs assembly overhead against wholesale dealer pricing</p>
              </div>
              <button 
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" /> Print margins summary
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="pb-3">Goods / SKU Item</th>
                    <th className="pb-3">Raw Material Cost</th>
                    <th className="pb-3">Shop Assembly / Labor Cost</th>
                    <th className="pb-3">Total COGS Cost</th>
                    <th className="pb-3">Wholesale Dealer Rate</th>
                    <th className="pb-3">Net Profit Margin (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  {productProfitability.map((prod, idx) => {
                    const totalCost = prod.materialCost + prod.laborPowerCost;
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 font-bold text-slate-850">{prod.item}</td>
                        <td className="py-3 font-mono">₹{prod.materialCost}</td>
                        <td className="py-3 font-mono">₹{prod.laborPowerCost}</td>
                        <td className="py-3 font-bold font-mono text-slate-500">₹{totalCost.toFixed(2)}</td>
                        <td className="py-3 font-bold font-mono text-slate-800">₹{prod.wholesalePrice.toFixed(2)}</td>
                        <td className="py-3">
                          <span className="text-sm font-extrabold text-emerald-600 font-mono">
                            +{prod.profitMargin}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUBTAB 2: AI OPERATIONS INSIGHTS          */}
      {/* ========================================== */}
      {activeTab === 'ai-insights' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left panel: Quick questions menu */}
          <div className="glass-panel p-4 rounded-xl border border-slate-200 bg-white space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Ask Operations AI
              </h3>
              <p className="text-[10px] text-slate-500">Select an operational question below to query the live factory database.</p>
            </div>
            
            <div className="space-y-2 text-xs">
              <button
                onClick={() => setActiveAIQuestion('delays')}
                className={`w-full text-left p-3 rounded-xl transition-all border flex items-center justify-between font-bold
                  ${activeAIQuestion === 'delays' 
                    ? 'bg-brand-50 border-brand-200 text-brand-700 shadow-sm' 
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-650'}`}
              >
                <span className="flex items-center gap-2">
                  <Cpu className={`w-4.5 h-4.5 ${activeAIQuestion === 'delays' ? 'text-brand-600' : 'text-slate-400'}`} />
                  Which machine causes most delays?
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveAIQuestion('margins')}
                className={`w-full text-left p-3 rounded-xl transition-all border flex items-center justify-between font-bold
                  ${activeAIQuestion === 'margins' 
                    ? 'bg-brand-50 border-brand-200 text-brand-700 shadow-sm' 
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-650'}`}
              >
                <span className="flex items-center gap-2">
                  <TrendingUp className={`w-4.5 h-4.5 ${activeAIQuestion === 'margins' ? 'text-brand-600' : 'text-slate-400'}`} />
                  Which product has highest margin?
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveAIQuestion('wastage')}
                className={`w-full text-left p-3 rounded-xl transition-all border flex items-center justify-between font-bold
                  ${activeAIQuestion === 'wastage' 
                    ? 'bg-brand-50 border-brand-200 text-brand-700 shadow-sm' 
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-650'}`}
              >
                <span className="flex items-center gap-2">
                  <AlertTriangle className={`w-4.5 h-4.5 ${activeAIQuestion === 'wastage' ? 'text-brand-600' : 'text-slate-400'}`} />
                  Which raw material gets wasted most?
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveAIQuestion('revenue')}
                className={`w-full text-left p-3 rounded-xl transition-all border flex items-center justify-between font-bold
                  ${activeAIQuestion === 'revenue' 
                    ? 'bg-brand-50 border-brand-200 text-brand-700 shadow-sm' 
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-650'}`}
              >
                <span className="flex items-center gap-2">
                  <Award className={`w-4.5 h-4.5 ${activeAIQuestion === 'revenue' ? 'text-brand-600' : 'text-slate-400'}`} />
                  Which customer gives highest revenue?
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 text-[10px] text-slate-500">
              <span className="font-bold block text-slate-700 mb-1">AI Recommendation Focus</span>
              Our AI insights target <span className="font-bold">reducing operational chaos</span>, replacing manual Excel trackers, and making shop floor production highly visible with less staff dependency.
            </div>
          </div>

          {/* Right panel: Dynamic answer screen */}
          <div className="glass-panel p-6 rounded-xl border border-slate-200 bg-white lg:col-span-2 space-y-6">
            
            {/* 1. DELAYS DIAGNOSTIC */}
            {activeAIQuestion === 'delays' && worstMachine && (
              <div className="space-y-6 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Machine Delay & Bottleneck Analysis</h3>
                    <p className="text-[10px] text-slate-500">Downtime records aggregated from today's active production shifts</p>
                  </div>
                  <span className="px-2.5 py-1 bg-rose-50 text-rose-600 font-extrabold rounded-full border border-rose-100 uppercase tracking-widest text-[9px]">
                    Alert: {worstMachine.name.split(' ')[0]} Offline
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Worst Delay Contributor</p>
                    <div>
                      <h4 className="text-base font-extrabold text-slate-800">{worstMachine.name}</h4>
                      <p className="text-slate-500 text-[11px] mt-0.5">Operator Assignment: <span className="font-bold text-slate-700">{worstMachine.operator}</span></p>
                    </div>
                    <div className="pt-2 flex justify-between items-end border-t border-slate-200">
                      <div>
                        <span className="text-2xl font-black text-rose-600">{worstMachine.downtime}</span>
                        <span className="text-slate-500 font-bold ml-1">mins downtime today</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${worstMachine.status === 'Maintenance' ? 'bg-red-50 text-red-600 border border-red-150' : 'bg-slate-100 text-slate-600'}`}>
                        {worstMachine.status}
                      </span>
                    </div>
                  </div>

                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={machineDowntimes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" fontSize={9} stroke="#94a3b8" tickFormatter={(v) => v.split(' ')[0]} />
                        <YAxis fontSize={9} stroke="#94a3b8" />
                        <Tooltip />
                        <Bar dataKey="downtime" name="Downtime (mins)" radius={[4, 4, 0, 0]}>
                          {machineDowntimes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#94a3b8'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    AI Action Plan to Reduce Chaos
                  </h4>
                  <ul className="space-y-2 text-slate-650 font-medium list-disc list-inside pl-1 text-[11px]">
                    <li><span className="font-bold text-slate-800">Critical Intervention</span>: The <span className="font-bold">{worstMachine.name}</span> has contributed to <span className="font-bold text-rose-600">{Math.round(worstMachine.downtime / (totalDowntime + 120) * 100)}%</span> of total shop delays today. Primary cause: Line Maintenance.</li>
                    <li><span className="font-bold text-slate-850">Replace Excel Guesswork</span>: Instead of manual logs, schedule automated warning alerts to triggers operators immediately when runtime drops below 75% in a given shift.</li>
                    <li><span className="font-bold text-slate-850">Staff Dependency reduction</span>: Assign a backup supervisor for {worstMachine.operator} during tool changeovers to standardise calibration times under 15 minutes.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 2. MARGIN DIAGNOSTIC */}
            {activeAIQuestion === 'margins' && highestMarginProduct && (
              <div className="space-y-6 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">SKU Margin & Profitability Intelligence</h3>
                    <p className="text-[10px] text-slate-500">Evaluates raw material and direct labor costs against wholesale dealer values</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 font-extrabold rounded-full border border-emerald-100 uppercase tracking-widest text-[9px]">
                    Highest yield: {highestMarginProduct.item.split(' ')[0]}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Top Yield SKU</p>
                    <div>
                      <h4 className="text-base font-extrabold text-slate-800">{highestMarginProduct.item}</h4>
                      <p className="text-slate-500 text-[11px] mt-0.5">COGS: <span className="font-bold text-slate-700">₹{(highestMarginProduct.materialCost + highestMarginProduct.laborPowerCost).toFixed(1)}</span> | Dealer Rate: <span className="font-bold text-slate-700">₹{highestMarginProduct.wholesalePrice}</span></p>
                    </div>
                    <div className="pt-2 flex justify-between items-end border-t border-slate-200">
                      <div>
                        <span className="text-2xl font-black text-emerald-600">+{highestMarginProduct.profitMargin}%</span>
                        <span className="text-slate-500 font-bold ml-1">Net Margin</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        High Priority Spares
                      </span>
                    </div>
                  </div>

                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sortedMargins} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                        <XAxis type="number" stroke="#94a3b8" fontSize={9} />
                        <YAxis dataKey="item" type="category" stroke="#94a3b8" fontSize={8} width={90} tickFormatter={(v) => v.split(' ')[0]} />
                        <Tooltip />
                        <Bar dataKey="profitMargin" name="Net Margin (%)" radius={[0, 4, 4, 0]}>
                          {sortedMargins.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#3b82f6'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    AI Commercial Business Strategy
                  </h4>
                  <ul className="space-y-2 text-slate-650 font-medium list-disc list-inside pl-1 text-[11px]">
                    <li><span className="font-bold text-slate-850">Commercial Boost</span>: <span className="font-bold text-slate-800">{highestMarginProduct.item}</span> yields an outstanding margin of <span className="font-bold text-emerald-600">+{highestMarginProduct.profitMargin}%</span>. Selling this product yields double the profitability of lower priority lots.</li>
                    <li><span className="font-bold text-slate-850">Increase Sales Priority</span>: Set automatic triggers inside your B2B Quotations builder to automatically suggest bulk packaging offers on {highestMarginProduct.item} to regular distributors.</li>
                    <li><span className="font-bold text-slate-850">Maximize Production Run Hours</span>: Allocate more operator run-time towards VMC-850 Milling centers to secure continuous stock flow.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 3. WASTAGE DIAGNOSTIC */}
            {activeAIQuestion === 'wastage' && worstWastageLog && (
              <div className="space-y-6 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Scrap Metal & Raw Material Wastage Audit</h3>
                    <p className="text-[10px] text-slate-500">Calculates physical and percentage wastage logged during shop execution</p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-extrabold rounded-full border border-amber-100 uppercase tracking-widest text-[9px]">
                    High Scrap: {worstWastageLog.material.split(' ')[0]}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Most Wasted Material</p>
                    <div>
                      <h4 className="text-base font-extrabold text-slate-800">{worstWastageLog.material}</h4>
                      <p className="text-slate-500 text-[11px] mt-0.5">Machine: <span className="font-bold text-slate-700">{worstWastageLog.machine}</span></p>
                    </div>
                    <div className="pt-2 flex justify-between items-end border-t border-slate-200">
                      <div>
                        <span className="text-2xl font-black text-amber-600">{worstWastageLog.scrapPercent}%</span>
                        <span className="text-slate-500 font-bold ml-1">scrap rate ({worstWastageLog.scrapQty} kg)</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        High Rejection
                      </span>
                    </div>
                  </div>

                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={materialWastage} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="material" fontSize={9} stroke="#94a3b8" tickFormatter={(v) => v.split(' ')[0]} />
                        <YAxis fontSize={9} stroke="#94a3b8" />
                        <Tooltip />
                        <Bar dataKey="scrapPercent" name="Scrap Rate (%)" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                          {materialWastage.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#f59e0b' : '#3b82f6'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    AI Plan for Raw Material Control
                  </h4>
                  <ul className="space-y-2 text-slate-650 font-medium list-disc list-inside pl-1 text-[11px]">
                    <li><span className="font-bold text-slate-850">Scrap Concentration</span>: Laser Cutting processes yield the highest scrap wastage at <span className="font-bold text-amber-700">{worstWastageLog.scrapPercent}%</span>, totaling <span className="font-bold text-slate-800">{worstWastageLog.scrapQty} units</span> in processed sheets.</li>
                    <li><span className="font-bold text-slate-850">Replace Excel sheets logs</span>: Enable real-time inventory ledger deductions linked to actual scrap outputs, keeping real-time raw material stock counts accurate without manual tallies.</li>
                    <li><span className="font-bold text-slate-850">Staff Training</span>: Establish machine nozzle cleanup guidelines twice per Shift rather than once per day to secure clean cuts and reduce sheet corner erosion.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 4. REVENUE DIAGNOSTIC */}
            {activeAIQuestion === 'revenue' && highestRevenueCustomer && (
              <div className="space-y-6 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Top B2B Customer & Revenue Insights</h3>
                    <p className="text-[10px] text-slate-500">Aggregated payments and pending balances across dealer relationships</p>
                  </div>
                  <span className="px-2.5 py-1 bg-brand-50 text-brand-700 font-extrabold rounded-full border border-brand-100 uppercase tracking-widest text-[9px]">
                    Top Account: {highestRevenueCustomer.name.split(' ')[0]}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Top Value Client</p>
                    <div>
                      <h4 className="text-base font-extrabold text-slate-800">{highestRevenueCustomer.name}</h4>
                      <p className="text-slate-500 text-[11px] mt-0.5">Active Order Pipeline: <span className="font-bold text-slate-700">{formatINR(highestRevenueCustomer.activeOrders)}</span></p>
                    </div>
                    <div className="pt-2 flex justify-between items-end border-t border-slate-200">
                      <div>
                        <span className="text-2xl font-black text-brand-600">{formatINR(highestRevenueCustomer.totalLifecycleVal)}</span>
                        <span className="text-slate-500 font-bold ml-1">Lifecycle Value</span>
                      </div>
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                        O/S: {formatINR(highestRevenueCustomer.outstanding)}
                      </span>
                    </div>
                  </div>

                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={customerRevenueList} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                        <XAxis dataKey="name" fontSize={8} stroke="#94a3b8" tickFormatter={(v) => v.split(' ')[0]} />
                        <YAxis fontSize={9} stroke="#94a3b8" tickFormatter={(v) => `₹${v/100000}L`} />
                        <Tooltip formatter={(value) => [formatINR(value), 'Total Lifecycle Value']} />
                        <Bar dataKey="totalLifecycleVal" fill="#2563eb" radius={[4, 4, 0, 0]}>
                          {customerRevenueList.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#2563eb' : '#64748b'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    AI Customer Retention & Outstanding Strategy
                  </h4>
                  <ul className="space-y-2 text-slate-650 font-medium list-disc list-inside pl-1 text-[11px]">
                    <li><span className="font-bold text-slate-850">Revenue Powerhouse</span>: <span className="font-bold text-slate-800">{highestRevenueCustomer.name}</span> represents your highest value commercial relationship with a combined value of <span className="font-bold text-brand-600">{formatINR(highestRevenueCustomer.totalLifecycleVal)}</span>.</li>
                    <li><span className="font-bold text-slate-850">Automatic Reminders</span>: While high-value, they hold an outstanding balance of <span className="font-bold text-rose-600">{formatINR(highestRevenueCustomer.outstanding)}</span>. Enable WhatsApp collection workflows to gently nudge their accounts team 5 days before invoice limits.</li>
                    <li><span className="font-bold text-slate-850">Priority Service SLA</span>: Ensure all pending dispatches for {highestRevenueCustomer.name} are prioritized on transporter vehicles to maximize supplier ratings.</li>
                  </ul>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUBTAB 3: WHATSAPP AUTOMATIONS             */}
      {/* ========================================== */}
      {activeTab === 'whatsapp-flows' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column: Flow List & Toggles */}
          <div className="glass-panel p-5 rounded-xl border border-slate-200 bg-white space-y-5 lg:col-span-1">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-5 h-5 text-emerald-500" />
                Active WhatsApp Workflows
              </h3>
              <p className="text-[10px] text-slate-500">Enable or disable automatic B2B SME notifications built via Twilio API.</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all">
                <div>
                  <span className="font-bold block text-slate-700">Low Stock Alerts</span>
                  <span className="text-[9px] text-slate-550 block">Triggers when raw materials fall below safety levels</span>
                </div>
                <button 
                  onClick={() => setToggles({...toggles, lowStock: !toggles.lowStock})}
                  className="text-slate-400 hover:text-slate-650 transition-colors"
                >
                  {toggles.lowStock ? <ToggleRight className="w-9 h-9 text-emerald-500" /> : <ToggleLeft className="w-9 h-9 text-slate-400" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all">
                <div>
                  <span className="font-bold block text-slate-700">Payment Reminders</span>
                  <span className="text-[9px] text-slate-550 block">Outstanding invoice warnings to accounts teams</span>
                </div>
                <button 
                  onClick={() => setToggles({...toggles, payment: !toggles.payment})}
                  className="text-slate-400 hover:text-slate-650 transition-colors"
                >
                  {toggles.payment ? <ToggleRight className="w-9 h-9 text-emerald-500" /> : <ToggleLeft className="w-9 h-9 text-slate-400" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all">
                <div>
                  <span className="font-bold block text-slate-700">Dispatch Completed</span>
                  <span className="text-[9px] text-slate-550 block">Sends transporter vehicle number and e-Way bills link</span>
                </div>
                <button 
                  onClick={() => setToggles({...toggles, dispatch: !toggles.dispatch})}
                  className="text-slate-400 hover:text-slate-650 transition-colors"
                >
                  {toggles.dispatch ? <ToggleRight className="w-9 h-9 text-emerald-500" /> : <ToggleLeft className="w-9 h-9 text-slate-400" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all">
                <div>
                  <span className="font-bold block text-slate-700">Production Completed</span>
                  <span className="text-[9px] text-slate-550 block">Alerts plant owner and supervisor with shift OEE</span>
                </div>
                <button 
                  onClick={() => setToggles({...toggles, production: !toggles.production})}
                  className="text-slate-400 hover:text-slate-650 transition-colors"
                >
                  {toggles.production ? <ToggleRight className="w-9 h-9 text-emerald-500" /> : <ToggleLeft className="w-9 h-9 text-slate-400" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all">
                <div>
                  <span className="font-bold block text-slate-700">Daily Summary Reports</span>
                  <span className="text-[9px] text-slate-550 block">Consolidated factory output PDF to owner WhatsApp</span>
                </div>
                <button 
                  onClick={() => setToggles({...toggles, summary: !toggles.summary})}
                  className="text-slate-400 hover:text-slate-650 transition-colors"
                >
                  {toggles.summary ? <ToggleRight className="w-9 h-9 text-emerald-500" /> : <ToggleLeft className="w-9 h-9 text-slate-400" />}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: API integration settings & Previewer */}
          <div className="glass-panel p-5 rounded-xl border border-slate-200 bg-white lg:col-span-2 space-y-6">
            
            {/* Twilio Credentials Section */}
            <div className="space-y-4 text-xs pb-5 border-b border-slate-150">
              <div>
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                  <Database className="w-4 h-4 text-slate-500" />
                  Twilio API Gateway configuration
                </h4>
                <p className="text-[10px] text-slate-500">Secure link credentials to channel standard business communications.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-slate-550 font-bold">Twilio Account SID</label>
                  <input
                    type="text"
                    value={twilioSid}
                    onChange={(e) => setTwilioSid(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded p-2 text-slate-700 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-550 font-bold">Auth Token</label>
                  <input
                    type="password"
                    value={twilioToken}
                    onChange={(e) => setTwilioToken(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded p-2 text-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1 text-[10px] text-emerald-650 font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {twilioStatus}
                </div>
                <button
                  onClick={() => {
                    setTwilioStatus("Credentials saved!");
                    setTimeout(() => setTwilioStatus("Sandbox Mode Connected"), 3000);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-[10px]"
                >
                  Verify Link
                </button>
              </div>
            </div>

            {/* Template previewers */}
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                  <Smartphone className="w-4 h-4 text-brand-600" />
                  Live Message template previewer
                </h4>
                <p className="text-[10px] text-slate-500">Pick live factory database items to see dynamic localized templates.</p>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                {/* 1. Payment Reminder Template */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700">1. B2B Outstandings/Payment reminder:</span>
                    <select 
                      value={selectedPreviewCustomer} 
                      onChange={(e) => setSelectedPreviewCustomer(e.target.value)}
                      className="bg-white border border-slate-200 rounded px-2 py-0.5 text-[10px] text-slate-700 font-medium"
                    >
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  {(() => {
                    const cust = customers.find(c => c.id === selectedPreviewCustomer) || customers[0];
                    const out = cust ? cust.outstanding : 425000;
                    const phone = cust ? cust.phone : '+91 98250 12345';
                    const msgText = `*Manufactory CRM Alert*\n\nDear Accounts Team, *${cust?.name || 'Client'}*\n\nThis is a gentle payment reminder for outstanding balance *₹${out.toLocaleString('en-IN')}* under terms of credit days (${cust?.creditDays || 45} days). Kindly process the clearance at your earliest. Ignore if already processed.\n\n_System generated notification from Manufactory CRM Industries._`;
                    
                    return (
                      <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-3.5 space-y-2.5 relative">
                        <div className="text-[10px] text-slate-500 flex justify-between">
                          <span>Recipient: <span className="font-bold text-slate-700">{phone}</span></span>
                          <span className="font-bold text-emerald-700 uppercase tracking-widest text-[8px]">WhatsApp Live</span>
                        </div>
                        <pre className="text-[11px] text-slate-700 font-sans whitespace-pre-wrap leading-relaxed">{msgText}</pre>
                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-150">
                          <button
                            onClick={() => handleCopy(msgText, 'payment')}
                            className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold rounded flex items-center gap-1 text-[10px]"
                          >
                            {copiedText === 'payment' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            Copy Text
                          </button>
                          <button
                            onClick={() => handleSendTest('payment', msgText)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded flex items-center gap-1 text-[10px]"
                          >
                            {testSent === 'payment' ? 'Simulated!' : 'Test Send'}
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* 2. Low Stock Alerts */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700">2. Low Stock Raw Material notification:</span>
                    <select 
                      value={selectedPreviewItem} 
                      onChange={(e) => setSelectedPreviewItem(e.target.value)}
                      className="bg-white border border-slate-200 rounded px-2 py-0.5 text-[10px] text-slate-700 font-medium"
                    >
                      {inventory.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                    </select>
                  </div>
                  {(() => {
                    const item = inventory.find(i => i.id === selectedPreviewItem) || inventory[0];
                    const msgText = `*Manufactory CRM Inventory System*\n\n⚠️ *Low Stock warning*:\nItem: *${item?.name || 'Raw Material'}*\nCurrent Stock: *${item?.stock || 0} ${item?.unit || 'Units'}*\nReorder Level: *${item?.minStock || 0} ${item?.unit || 'Units'}*\n\n_Auto-triggered notification generated for Store Manager to raise quick purchase order._`;
                    
                    return (
                      <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-3.5 space-y-2.5 relative">
                        <div className="text-[10px] text-slate-500 flex justify-between">
                          <span>Recipient: <span className="font-bold text-slate-700">+91 94260 98765 (Store Manager)</span></span>
                          <span className="font-bold text-emerald-700 uppercase tracking-widest text-[8px]">WhatsApp Live</span>
                        </div>
                        <pre className="text-[11px] text-slate-700 font-sans whitespace-pre-wrap leading-relaxed">{msgText}</pre>
                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-150">
                          <button
                            onClick={() => handleCopy(msgText, 'stock')}
                            className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold rounded flex items-center gap-1 text-[10px]"
                          >
                            {copiedText === 'stock' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            Copy Text
                          </button>
                          <button
                            onClick={() => handleSendTest('stock', msgText)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded flex items-center gap-1 text-[10px]"
                          >
                            {testSent === 'stock' ? 'Simulated!' : 'Test Send'}
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* 3. Dispatch & Cargo Alerts */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700">3. Cargo Dispatch notification:</span>
                    <select 
                      value={selectedPreviewOrder} 
                      onChange={(e) => setSelectedPreviewOrder(e.target.value)}
                      className="bg-white border border-slate-200 rounded px-2 py-0.5 text-[10px] text-slate-700 font-medium"
                    >
                      {orders.map(o => <option key={o.id} value={o.id}>{o.id} ({o.customerName.split(' ')[0]})</option>)}
                    </select>
                  </div>
                  {(() => {
                    const ord = orders.find(o => o.id === selectedPreviewOrder) || orders[0];
                    const activeCust = customers.find(c => c.id === ord?.customerId) || customers[0];
                    const msgText = `*Manufactory CRM Logistics Center*\n\nHi *${ord?.customerName || 'Customer'}*,\n\nYour Order *${ord?.id || 'ORD-001'}* has been successfully packed and loaded! 🚚\n\nTransporter: *SafeExpress Logistics*\nVehicle Number: *MH-12-QE-1022*\ne-Way Bill reference: *121489028830*\n\nTrack your live delivery here: https://smart123-12.github.io/manufactory-crm/\n\n_Thank you for choosing Manufactory CRM Industries._`;
                    
                    return (
                      <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-3.5 space-y-2.5 relative">
                        <div className="text-[10px] text-slate-500 flex justify-between">
                          <span>Recipient: <span className="font-bold text-slate-700">{activeCust?.phone || '+91 97110 56789'}</span></span>
                          <span className="font-bold text-emerald-700 uppercase tracking-widest text-[8px]">WhatsApp Live</span>
                        </div>
                        <pre className="text-[11px] text-slate-700 font-sans whitespace-pre-wrap leading-relaxed">{msgText}</pre>
                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-150">
                          <button
                            onClick={() => handleCopy(msgText, 'cargo')}
                            className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold rounded flex items-center gap-1 text-[10px]"
                          >
                            {copiedText === 'cargo' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            Copy Text
                          </button>
                          <button
                            onClick={() => handleSendTest('cargo', msgText)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded flex items-center gap-1 text-[10px]"
                          >
                            {testSent === 'cargo' ? 'Simulated!' : 'Test Send'}
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
