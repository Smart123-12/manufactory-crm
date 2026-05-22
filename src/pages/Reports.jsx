import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, ComposedChart
} from 'recharts';
import { Printer, TrendingUp, Cpu, Award, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Reports({ monthlyData, productProfitability, machines, productionLogs }) {
  
  const formatINR = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate high-level metrics
  const totalFinancialRevenue = monthlyData.reduce((sum, item) => sum + item.Revenue, 0);
  const totalProductionValue = monthlyData.reduce((sum, item) => sum + item.Production, 0);
  
  // Total downtime sum
  const totalDowntime = productionLogs.reduce((sum, log) => sum + log.downtimeMinutes, 0);
  
  // Average OEE Machine utilization
  const averageOEE = Math.round(machines.reduce((sum, m) => sum + m.efficiency, 0) / machines.length);

  return (
    <div className="space-y-6">
      
      {/* 1. Analytics KPI header cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="glass-panel p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Sales Invoiced</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatINR(totalFinancialRevenue)}</h3>
          <p className="text-[10px] text-emerald-650 flex items-center gap-0.5 font-bold">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> +15.5% vs Last Year
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

        <div className="glass-panel p-4 rounded-xl border border-rose-200 bg-rose-50">
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
        <div className="glass-panel p-5 rounded-xl space-y-4">
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
                <Bar dataKey="Production" name="Actual Processed Value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
                <Line type="monotone" dataKey="Target" name="Plant Target Goal" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Machine Downtime Diagnostics Chart */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
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
      <div className="glass-panel p-5 rounded-xl">
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
  );
}
