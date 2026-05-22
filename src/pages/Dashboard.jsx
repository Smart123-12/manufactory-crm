import React from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { 
  Flame, 
  ShoppingBag, 
  AlertTriangle, 
  Truck, 
  DollarSign, 
  Cpu, 
  TrendingUp, 
  Users, 
  Zap,
  Plus,
  Play
} from 'lucide-react';

export default function Dashboard({ 
  stats, 
  monthlyData, 
  topCustomers, 
  machines,
  lowStockItems,
  onNavigate,
  onOpenQuickModal
}) {

  // Formatter for Indian Rupees (INR)
  const formatINR = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. KPI Top Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* KPI: Today's Production */}
        <div className="glass-panel glass-panel-hover p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Today Production</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.todayProduction} <span className="text-xs font-normal text-slate-400">units</span></h3>
            <p className="text-[10px] text-emerald-600 flex items-center gap-0.5 font-bold">
              <TrendingUp className="w-3 h-3" /> +12% vs yesterday
            </p>
          </div>
          <div className="p-3 bg-brand-50 text-brand-600 rounded-lg">
            <Flame className="w-5 h-5 animate-pulse-subtle" />
          </div>
        </div>

        {/* KPI: Pending Orders */}
        <div 
          onClick={() => onNavigate('orders')}
          className="glass-panel glass-panel-hover p-4 rounded-xl flex items-center justify-between cursor-pointer"
        >
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending Orders</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.pendingOrders} <span className="text-xs font-normal text-slate-400">jobs</span></h3>
            <p className="text-[10px] text-indigo-600 font-bold">4 due this week</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        {/* KPI: Low Stock Alerts */}
        <div 
          onClick={() => onNavigate('inventory')}
          className="glass-panel glass-panel-hover p-4 rounded-xl flex items-center justify-between cursor-pointer"
        >
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Low Stock Alerts</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.lowStockAlerts} <span className="text-xs font-normal text-slate-400">items</span></h3>
            <p className="text-[10px] text-rose-600 font-bold">PO trigger suggested</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* KPI: Dispatch Pending */}
        <div 
          onClick={() => onNavigate('dispatch')}
          className="glass-panel glass-panel-hover p-4 rounded-xl flex items-center justify-between cursor-pointer"
        >
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dispatch Pending</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.dispatchPending} <span className="text-xs font-normal text-slate-400">orders</span></h3>
            <p className="text-[10px] text-amber-600 font-bold">Requires e-Way bills</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        {/* KPI: Payments Due */}
        <div 
          onClick={() => onNavigate('billing')}
          className="glass-panel glass-panel-hover p-4 rounded-xl flex items-center justify-between cursor-pointer"
        >
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Outstanding Due</p>
            <h3 className="text-lg font-black text-rose-600">{formatINR(stats.paymentsDue)}</h3>
            <p className="text-[10px] text-rose-500 font-bold">3 over 45d limit</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 2. Main Analytics Section & Machine Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Middle: Monthly Revenue & Production Output Area Chart */}
        <div className="glass-panel p-5 rounded-xl lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Revenue & Output Trends</h4>
              <p className="text-xs text-slate-400 font-medium">Comparing total billing vs shop floor output values</p>
            </div>
            <div className="flex gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-brand-600">
                <span className="w-2.5 h-2.5 bg-brand-500 rounded-sm inline-block"></span> Revenue
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm inline-block"></span> Output
              </span>
            </div>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v/100000}L`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  labelStyle={{ color: '#64748b', fontSize: '11px', fontWeight: 'bold' }}
                  itemStyle={{ fontSize: '12px', color: '#334155' }}
                  formatter={(value) => [formatINR(value), null]}
                />
                <Area type="monotone" dataKey="Revenue" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="Production" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProd)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Machine Live Status & Utilization */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Machine Utilization</h4>
              <p className="text-xs text-slate-400 font-medium">Live operational states</p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-50 text-brand-600 rounded border border-brand-100 flex items-center gap-1">
              <Zap className="w-3 h-3 text-brand-500" /> OEE: 82%
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {machines.map((mach) => (
              <div key={mach.id} className="bg-slate-50/60 p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full 
                      ${mach.status === 'Running' ? 'bg-emerald-500 animate-ping' : ''}
                      ${mach.status === 'Idle' ? 'bg-amber-500' : ''}
                      ${mach.status === 'Maintenance' ? 'bg-rose-500' : ''}
                    `}></span>
                    <span className="text-xs font-bold text-slate-700">{mach.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold">Operator: {mach.operator}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-600">{mach.utilization}%</span>
                  <div className="w-20 bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full 
                        ${mach.status === 'Running' ? 'bg-emerald-500' : ''}
                        ${mach.status === 'Idle' ? 'bg-amber-500' : ''}
                        ${mach.status === 'Maintenance' ? 'bg-rose-500' : ''}
                      `} 
                      style={{ width: `${mach.utilization}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Bottom Grid: Top Customers, Low Stock, Wastage Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Customers Outstanding Ledger */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Top B2B Customers</h4>
              <p className="text-xs text-slate-400 font-medium">Key OEM and distributor balances</p>
            </div>
            <Users className="w-4 h-4 text-slate-400" />
          </div>

          <div className="divide-y divide-slate-100">
            {topCustomers.slice(0, 4).map((cust) => (
              <div key={cust.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-700">{cust.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{cust.city}, {cust.state} • {cust.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold font-mono text-slate-700">{formatINR(cust.outstanding)}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{cust.creditDays} Days Credit</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Tracker */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Low Stock Reorders</h4>
              <p className="text-xs text-slate-400 font-medium">Critical raw materials required</p>
            </div>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>

          <div className="space-y-3">
            {lowStockItems.slice(0, 3).map((item) => (
              <div key={item.id} className="bg-slate-50/60 p-3 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-700">{item.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Loc: {item.location} • Batch: {item.batch}</p>
                </div>
                <div className="text-right">
                  <span className="px-1.5 py-0.5 text-[9px] bg-rose-50 text-rose-600 font-bold border border-rose-100 rounded">
                    {item.stock} / {item.minStock} {item.unit}
                  </span>
                  <button 
                    onClick={() => onOpenQuickModal('purchase', { itemName: item.name, itemId: item.id })}
                    className="block text-[10px] text-brand-600 hover:text-brand-700 font-bold hover:underline mt-1.5 ml-auto"
                  >
                    Raise PO
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wastage Line Chart Widget */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Wastage & Scrap %</h4>
              <p className="text-xs text-slate-400 font-medium">Average weekly material loss</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { name: 'Wk 1', scrap: 4.8 },
                { name: 'Wk 2', scrap: 4.2 },
                { name: 'Wk 3', scrap: 3.5 },
                { name: 'Wk 4', scrap: 2.1 },
                { name: 'Wk 5', scrap: 2.9 },
                { name: 'Wk 6', scrap: 2.4 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={9} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }} />
                <Line type="monotone" dataKey="scrap" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: '#ef4444' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400 text-center font-semibold">Industry standard scrap target: <span className="font-bold text-emerald-600">&lt; 3.0%</span></p>
        </div>

      </div>

      {/* 4. Quick Actions Hub */}
      <div className="glass-panel p-4 rounded-xl border border-brand-100 bg-slate-50/20">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Shop Floor Quick Action Hub</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button 
            onClick={() => onOpenQuickModal('customer')}
            className="flex items-center justify-center gap-2 p-2.5 bg-white hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 border border-slate-200 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-brand-500" /> Add B2B Customer
          </button>
          
          <button 
            onClick={() => onOpenQuickModal('quote')}
            className="flex items-center justify-center gap-2 p-2.5 bg-white hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 border border-slate-200 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-brand-500" /> Build GST Quote
          </button>
          
          <button 
            onClick={() => onOpenQuickModal('production')}
            className="flex items-center justify-center gap-2 p-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-brand-500/10"
          >
            <Play className="w-3.5 h-3.5" /> Log Production Run
          </button>
          
          <button 
            onClick={() => onOpenQuickModal('dispatch')}
            className="flex items-center justify-center gap-2 p-2.5 bg-white hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 border border-slate-200 transition-all shadow-sm"
          >
            <Truck className="w-3.5 h-3.5 text-brand-500" /> Dispatch Delivery
          </button>
        </div>
      </div>

    </div>
  );
}
