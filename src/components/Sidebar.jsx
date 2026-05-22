import React from 'react';
import { 
  LayoutDashboard, 
  Target, 
  Users, 
  FileText, 
  ShoppingBag, 
  Boxes, 
  Factory, 
  Cpu, 
  Truck, 
  Receipt, 
  BarChart3, 
  UserCheck, 
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, alertsCount }) {
  
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'crm', name: 'CRM Pipeline', icon: Target },
    { id: 'customers', name: 'Customers Ledger', icon: Users },
    { id: 'quotations', name: 'Quotations (GST)', icon: FileText },
    { id: 'orders', name: 'Active Orders', icon: ShoppingBag },
    { id: 'inventory', name: 'Inventory Stock', icon: Boxes, badge: 'lowStock' },
    { id: 'production', name: 'Live Production', icon: Factory },
    { id: 'machines', name: 'Machine Matrix', icon: Cpu },
    { id: 'dispatch', name: 'Dispatch Logs', icon: Truck },
    { id: 'billing', name: 'GST Billing', icon: Receipt },
    { id: 'reports', name: 'Analytics & OEE', icon: BarChart3 },
    { id: 'workers', name: 'Worker Shift Hub', icon: UserCheck },
    { id: 'settings', name: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 z-20 h-full bg-white border-r border-slate-200/80 text-slate-600 transition-all duration-300 flex flex-col justify-between shadow-sm
        ${sidebarOpen ? 'w-64' : 'w-20'}
      `}
    >
      <div>
        {/* Logo/Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="p-2 bg-brand-50 rounded-lg text-brand-600 flex-shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse-subtle" />
            </div>
            {sidebarOpen && (
              <span className="font-extrabold text-slate-800 tracking-wider text-base">
                Manufactory <span className="text-brand-600 font-semibold">CRM</span>
              </span>
            )}
          </div>
          
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors hidden md:block"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold transition-all group relative
                  ${isActive 
                    ? 'bg-brand-50 text-brand-600 border border-brand-100 shadow-sm' 
                    : 'hover:bg-slate-50 text-slate-500 hover:text-slate-800'
                  }
                `}
                title={!sidebarOpen ? item.name : ''}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4.5 h-4.5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105
                    ${isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}
                  `} />
                  {sidebarOpen && <span className="truncate">{item.name}</span>}
                </div>

                {/* Badge Indicator */}
                {item.badge === 'lowStock' && alertsCount > 0 && (
                  <span className={`flex items-center justify-center rounded-full font-extrabold leading-none
                    ${sidebarOpen 
                      ? 'px-1.5 py-0.5 text-[9px] bg-rose-50 text-rose-600 border border-rose-100' 
                      : 'absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full'
                    }
                  `}>
                    {sidebarOpen ? `${alertsCount}` : ''}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      {sidebarOpen && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 text-center">
          <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Manufactory CRM v1.2</p>
          <div className="mt-1 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[10px] text-slate-400 font-bold">Cloud Synced</span>
          </div>
        </div>
      )}
    </aside>
  );
}
