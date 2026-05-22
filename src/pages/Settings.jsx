import React, { useState } from 'react';
import { 
  Save, Landmark, Sliders, FileText, Bell, Shield, HelpCircle, Building2, Globe, Check 
} from 'lucide-react';

export default function Settings() {
  const [activeSubTab, setActiveSubTab] = useState('factory');
  const [gstin, setGstin] = useState('27AAACK1209D1ZQ');
  const [factoryName, setFactoryName] = useState('Manufactory CRM Industries');
  const [address, setAddress] = useState('Factory Gate 3, MIDC Industrial Area, Pune, Maharashtra');
  const [creditLimit, setCreditLimit] = useState(45);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [autoEway, setAutoEway] = useState(false);
  const [successSaved, setSuccessSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSuccessSaved(true);
    setTimeout(() => setSuccessSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Settings layout split: left menu list, right settings details */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Left Sub tabs menu */}
        <div className="glass-panel p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
          <button
            onClick={() => setActiveSubTab('factory')}
            className={`w-full text-left p-3 rounded-lg font-bold transition-all flex items-center gap-2
              ${activeSubTab === 'factory' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}
            `}
          >
            <Building2 className="w-4 h-4" /> B2B Factory details
          </button>
          
          <button
            onClick={() => setActiveSubTab('dispatch')}
            className={`w-full text-left p-3 rounded-lg font-bold transition-all flex items-center gap-2
              ${activeSubTab === 'dispatch' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}
            `}
          >
            <Sliders className="w-4 h-4" /> Billing & Credit settings
          </button>

          <button
            onClick={() => setActiveSubTab('notifications')}
            className={`w-full text-left p-3 rounded-lg font-bold transition-all flex items-center gap-2
              ${activeSubTab === 'notifications' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}
            `}
          >
            <Bell className="w-4 h-4" /> Shop Alert integrations
          </button>

          <button
            onClick={() => setActiveSubTab('security')}
            className={`w-full text-left p-3 rounded-lg font-bold transition-all flex items-center gap-2
              ${activeSubTab === 'security' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}
            `}
          >
            <Shield className="w-4 h-4" /> Security & Shifts
          </button>
        </div>

        {/* Right Details Panel */}
        <div className="glass-panel p-6 rounded-xl border border-slate-200 md:col-span-3 space-y-6">
          
          {/* TAB 1: Factory details */}
          {activeSubTab === 'factory' && (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="border-b border-slate-200 pb-3">
                <h4 className="text-sm font-bold text-slate-800">Registered Corporate Entity Details</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Pre-populated on B2B Quotations and Tax e-Invoices</p>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-550 font-semibold">Registered Firm Name *</label>
                <input 
                  type="text" 
                  required
                  value={factoryName}
                  onChange={(e) => setFactoryName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-slate-550 font-semibold">GSTIN *</label>
                  <input 
                    type="text" 
                    required
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-550 font-semibold">Corporate PAN *</label>
                  <input 
                    type="text" 
                    required
                    value="AACK1209D"
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded p-2 text-slate-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-550 font-semibold">MIDC Factory Gate Address *</label>
                <input 
                  type="text" 
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-slate-550 font-semibold">City</label>
                  <input type="text" value="Pune" disabled className="w-full bg-slate-100 border border-slate-200 rounded p-2 text-slate-500" />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-550 font-semibold">State of Supply</label>
                  <input type="text" value="Maharashtra (Code 27)" disabled className="w-full bg-slate-100 border border-slate-200 rounded p-2 text-slate-500" />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-550 font-semibold">Remittance Bank</label>
                  <input type="text" value="Bank of Baroda, MIDC Pune" disabled className="w-full bg-slate-100 border border-slate-200 rounded p-2 text-slate-500" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                {successSaved && (
                  <span className="text-emerald-600 flex items-center gap-1 font-bold">
                    <Check className="w-4 h-4" /> Settings updated successfully!
                  </span>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg ml-auto flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save changes
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Billing & credit settings */}
          {activeSubTab === 'dispatch' && (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="border-b border-slate-200 pb-3">
                <h4 className="text-sm font-bold text-slate-800">B2B Commercial Accounts Config</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Control payment rules, grace periods and GST auto calculations</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-slate-550 font-semibold">Standard Buyer Credit Period (Days)</label>
                  <input 
                    type="number" 
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-550 font-semibold">GST Rate Ceiling for Industrial Goods</label>
                  <select className="w-full bg-white border border-slate-200 rounded p-2 text-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option value="18">18% (Standard Manufacturing)</option>
                    <option value="12">12% (Intermediate spares)</option>
                    <option value="28">28% (Automotive heavy engines)</option>
                    <option value="5">5% (Essential inputs)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-650 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoEway}
                    onChange={(e) => setAutoEway(e.target.checked)}
                    className="rounded bg-white border-slate-200 text-brand-500 focus:ring-brand-500 focus:ring-offset-0 focus:ring-0"
                  />
                  <span>Auto-generate e-Way Bills for invoices above ₹50,000 via NIC Portal APIs</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-650 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded bg-white border-slate-200 text-brand-500 focus:ring-brand-500 focus:ring-offset-0 focus:ring-0"
                  />
                  <span>Block deliveries for customers exceeding credit terms by 30+ days</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                {successSaved && (
                  <span className="text-emerald-600 flex items-center gap-1 font-bold">
                    <Check className="w-4 h-4" /> Settings updated successfully!
                  </span>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg ml-auto flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save changes
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: Alert integrations */}
          {activeSubTab === 'notifications' && (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="border-b border-slate-200 pb-3">
                <h4 className="text-sm font-bold text-slate-800">Alert Center & WhatsApp Automation</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Automate messaging to operators, workers, and OEM purchase managers</p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs text-slate-650 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whatsappAlerts}
                    onChange={(e) => setWhatsappAlerts(e.target.checked)}
                    className="rounded bg-white border-slate-200 text-brand-500 focus:ring-brand-500"
                  />
                  <span>Send direct WhatsApp Quotation / Invoice PDF attachments upon validation</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-650 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded bg-white border-slate-200 text-brand-500 focus:ring-brand-500"
                  />
                  <span>Alert Plant Manager (SMS) immediately upon critical Machine Halt / red state</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-650 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded bg-white border-slate-200 text-brand-500 focus:ring-brand-500"
                  />
                  <span>Send auto-procurement triggers to catalog vendor for safety stock low items</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                {successSaved && (
                  <span className="text-emerald-600 flex items-center gap-1 font-bold">
                    <Check className="w-4 h-4" /> Settings updated successfully!
                  </span>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg ml-auto flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save changes
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: Security & shifts */}
          {activeSubTab === 'security' && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-slate-200 pb-3">
                <h4 className="text-sm font-bold text-slate-800">Shift Patterns & Staff Security</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Establish daily operation timelines for industrial zones</p>
              </div>

              <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
                <h5 className="font-bold text-slate-650 text-xs">Default Shifts Configuration:</h5>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white p-2.5 rounded border border-slate-150">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">Shift A</p>
                    <p className="font-extrabold text-slate-800 mt-1">8:00 AM - 4:00 PM</p>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-150">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">Shift B</p>
                    <p className="font-extrabold text-slate-800 mt-1">4:00 PM - 12:00 AM</p>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-150">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">Shift C</p>
                    <p className="font-extrabold text-slate-800 mt-1">12:00 AM - 8:00 AM</p>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 italic">
                Note: Standard shifts are customized in accordance with Factories Act guidelines.
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
