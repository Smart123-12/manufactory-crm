import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Settings, 
  SlidersHorizontal, 
  User, 
  Factory,
  CheckCircle,
  AlertTriangle,
  Flame,
  Wrench
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  sidebarOpen, 
  activeIndustry, 
  setActiveIndustry,
  notifications,
  markNotificationRead
}) {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Operations Dashboard';
      case 'crm': return 'CRM Pipeline & Funnel';
      case 'customers': return 'Customers & Dealer Ledgers';
      case 'quotations': return 'Quotation Generator (B2B)';
      case 'orders': return 'Production Order Queue';
      case 'inventory': return 'Inventory & Raw Material Stock';
      case 'production': return 'Live Shop Floor Production';
      case 'machines': return 'Machine Diagnostics & OEE';
      case 'dispatch': return 'Dispatch Logistics';
      case 'billing': return 'GST Billing & Invoices';
      case 'reports': return 'Operational & Financial Reports';
      case 'workers': return 'Worker Shifts & Efficiency';
      case 'settings': return 'Factory Settings & Profile';
      default: return 'Manufactory CRM OS';
    }
  };

  const industries = [
    { id: 'all', name: 'General Manufacturing' },
    { id: 'cnc', name: 'CNC & Metal Fabrication' },
    { id: 'plastic', name: 'Plastic Molding Unit' },
    { id: 'packaging', name: 'Packaging Manufacturers' }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header 
      className={`h-16 border-b border-slate-200/80 bg-white/70 backdrop-blur-md fixed top-0 right-0 z-10 flex items-center justify-between px-6 transition-all duration-300
        ${sidebarOpen ? 'left-64' : 'left-20'}
      `}
    >
      {/* Search and Title */}
      <div className="flex items-center gap-6">
        <h1 className="text-sm font-bold text-slate-800 hidden sm:block uppercase tracking-wider">
          {getPageTitle()}
        </h1>
        
        {/* Mock Search */}
        <div className="relative max-w-xs hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search orders, invoices, stock..." 
            className="w-64 bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-all font-medium"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        
        {/* Industry Sector Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Factory className="w-4 h-4 text-brand-500 hidden lg:block" />
          <select
            value={activeIndustry}
            onChange={(e) => setActiveIndustry(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 py-1.5 px-3 rounded-lg focus:outline-none focus:border-brand-500 transition-all cursor-pointer font-bold"
          >
            {industries.map((ind) => (
              <option key={ind.id} value={ind.id}>{ind.name}</option>
            ))}
          </select>
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifDropdown(!showNotifDropdown);
              setShowProfileDropdown(false);
            }}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifDropdown && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-30">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-150 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">Live Alerts ({unreadCount})</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] text-brand-600 hover:underline cursor-pointer font-bold">Mark all read</span>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">No active alerts. Everything running smoothly!</div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-3 text-xs flex gap-3 cursor-pointer hover:bg-slate-50 transition-colors
                        ${notif.read ? 'opacity-50' : 'bg-brand-50/10'}
                      `}
                      onClick={() => markNotificationRead(notif.id)}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {notif.type === 'danger' && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                        {notif.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                        {notif.type === 'info' && <Wrench className="w-4 h-4 text-sky-500" />}
                        {notif.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-700 leading-tight">{notif.title}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-6 bg-slate-250"></div>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowNotifDropdown(false);
            }}
            className="flex items-center gap-2.5 p-1 px-2 rounded-lg hover:bg-slate-100 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center font-bold text-sm text-brand-600">
              AD
            </div>
            <div className="hidden lg:block text-xs">
              <p className="font-bold text-slate-700 leading-none">Amit Desai</p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Plant Manager</p>
            </div>
          </button>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-30">
              <div className="p-4 bg-slate-50 border-b border-slate-150">
                <p className="text-xs font-bold text-slate-800">Manufactory CRM Corp. (Unit 1)</p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-semibold font-mono">GSTIN: 27AAACK1209D1ZQ</p>
              </div>
              <div className="p-1.5 text-xs text-slate-600">
                <button className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2 font-semibold">
                  <User className="w-4 h-4 text-slate-400" /> Account Settings
                </button>
                <button className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2 font-semibold">
                  <SlidersHorizontal className="w-4 h-4 text-slate-400" /> Shift Configurations
                </button>
                <div className="border-t border-slate-100 my-1"></div>
                <button className="w-full text-left p-2.5 text-rose-600 hover:text-rose-500 rounded-lg hover:bg-rose-50/10 transition-all flex items-center gap-2 font-bold">
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
