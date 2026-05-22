import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CRM from './pages/CRM';
import Inventory from './pages/Inventory';
import Production from './pages/Production';
import DispatchBilling from './pages/DispatchBilling';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';

import { 
  initialCustomers, 
  initialQuotations, 
  initialOrders, 
  initialInventory, 
  initialMachines, 
  initialWorkers, 
  initialProductionLogs, 
  initialDispatchBilling,
  monthlyRevenue,
  productProfitability
} from './data/mockData';

export default function App() {
  // Global View Mode & Dynamic Roles State
  const [viewMode, setViewMode] = useState('landing');
  const [userRole, setUserRole] = useState('Owner');

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeIndustry, setActiveIndustry] = useState('all'); // all, cnc, plastic, packaging

  const rolePermissions = {
    'Owner': ['dashboard', 'crm', 'customers', 'quotations', 'orders', 'inventory', 'production', 'machines', 'dispatch', 'billing', 'reports', 'workers', 'settings'],
    'Admin': ['dashboard', 'crm', 'customers', 'quotations', 'orders', 'inventory', 'production', 'machines', 'dispatch', 'billing', 'reports', 'workers', 'settings'],
    'Sales Team': ['crm', 'customers', 'quotations', 'orders', 'settings'],
    'Store Manager': ['inventory', 'settings'],
    'Production Supervisor': ['production', 'machines', 'workers', 'settings'],
    'Accountant': ['dispatch', 'billing', 'reports', 'settings']
  };

  const handleLogin = (role) => {
    setUserRole(role);
    setViewMode('app');
    const permittedTabs = rolePermissions[role] || [];
    if (permittedTabs.length > 0) {
      if (permittedTabs.includes('dashboard')) {
        setActiveTab('dashboard');
      } else {
        setActiveTab(permittedTabs[0]);
      }
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setViewMode('landing');
    setUserRole('Owner');
    setActiveTab('dashboard');
  };

  // Global Mock States (mutatable during local testing!)
  const [customers, setCustomers] = useState(initialCustomers);
  const [quotations, setQuotations] = useState(initialQuotations);
  const [orders, setOrders] = useState(initialOrders);
  const [inventory, setInventory] = useState(initialInventory);
  const [machines, setMachines] = useState(initialMachines);
  const [workers, setWorkers] = useState(initialWorkers);
  const [productionLogs, setProductionLogs] = useState(initialProductionLogs);
  const [dispatchBilling, setDispatchBilling] = useState(initialDispatchBilling);

  // Live Notification Alerts State
  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'Low Stock Alert: HDPE Granules is below reorder safety level.', type: 'warning', time: '15 mins ago', read: false },
    { id: 'n2', title: 'Machine Down: Corrugation Machine halt logged under line maintenance.', type: 'danger', time: '1 hr ago', read: false },
    { id: 'n3', title: 'Invoice Paid: Vardhman Text Packagers cleared INV-2026-701.', type: 'success', time: '4 hrs ago', read: false }
  ]);

  // Quick Action Modal states (managed at root for simple triggers)
  const [quickModalType, setQuickModalType] = useState(null); // customer, quote, production, dispatch, purchase
  const [quickModalData, setQuickModalData] = useState({});

  // ==========================================
  // STATE MANIPULATORS & EVENT HANDLERS
  // ==========================================

  const handleAddCustomer = (newCust) => {
    setCustomers([newCust, ...customers]);
    addNotification(`B2B Customer registered: ${newCust.name} in ${newCust.city}.`, 'success');
  };

  const handleAddQuotation = (newQuote) => {
    setQuotations([newQuote, ...quotations]);
    addNotification(`GST Quotation ${newQuote.id} generated for ${newQuote.customerName}.`, 'info');
  };

  const handleConvertOrder = (quote) => {
    // 1. Mark Quote converted
    setQuotations(quotations.map(q => q.id === quote.id ? { ...q, status: 'Converted to Order' } : q));
    
    // 2. Add as Order
    const newOrder = {
      id: `ORD-2026-0${orders.length + 90}`,
      customerId: quote.customerId,
      customerName: quote.customerName,
      quotationId: quote.id,
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: quote.items,
      totalAmount: quote.grandTotal,
      productionStage: "Molding / Tooling",
      progress: 5,
      status: "Processing"
    };
    setOrders([newOrder, ...orders]);
    
    // 3. Trigger Notification
    addNotification(`Order booked: ${newOrder.id} for ${quote.customerName} (₹${quote.grandTotal.toFixed(0)}).`, 'success');
    
    // 4. Navigate
    setActiveTab('orders');
  };

  const handleAddStock = (newSKU) => {
    setInventory([newSKU, ...inventory]);
    addNotification(`New SKU Catalog code ${newSKU.barcode} added to tracking.`, 'success');
  };

  const handleAdjustStock = (itemId, addQty) => {
    setInventory(inventory.map(item => {
      if (item.id === itemId) {
        const nextStock = item.stock + addQty;
        return {
          ...item,
          stock: nextStock,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));
    const pItem = inventory.find(i => i.id === itemId);
    addNotification(`Stock received: +${addQty} ${pItem?.unit || ''} for ${pItem?.name || ''}.`, 'success');
  };

  const handleLogProduction = (newLog) => {
    setProductionLogs([newLog, ...productionLogs]);
    
    // Auto-update machine stats based on log output
    setMachines(machines.map(m => {
      if (m.id === newLog.machineId) {
        return {
          ...m,
          todayRuntime: `${parseFloat(m.todayRuntime) + 1.2} hrs`,
          efficiency: Math.min(98, m.efficiency + 1)
        };
      }
      return m;
    }));

    addNotification(`Daily run ${newLog.id} logged. Scrap wastage evaluated at ${newLog.wastagePercent}%.`, 'info');
  };

  const handleUpdateMachineStatus = (machineId, nextStatus) => {
    setMachines(machines.map(m => {
      if (m.id === machineId) {
        let util = m.utilization;
        if (nextStatus === 'Running') util = Math.min(95, util + 10);
        if (nextStatus === 'Idle') util = Math.max(20, util - 20);
        if (nextStatus === 'Maintenance') util = 0;
        return {
          ...m,
          status: nextStatus,
          utilization: util
        };
      }
      return m;
    }));

    const machineName = machines.find(m => m.id === machineId)?.name;
    if (nextStatus === 'Maintenance') {
      addNotification(`Machine Alert: ${machineName} offline for maintenance.`, 'danger');
    } else if (nextStatus === 'Running') {
      addNotification(`Shop Floor: ${machineName} is running operational runs.`, 'success');
    } else {
      addNotification(`Shop Floor: ${machineName} set to Idle status.`, 'warning');
    }
  };

  const handleUpdateWorkerMachine = (workerId, machineId) => {
    setWorkers(workers.map(w => {
      if (w.id === workerId) {
        return {
          ...w,
          activeMachine: machineId,
          efficiency: machineId !== 'None' ? Math.round(80 + Math.random() * 15) : 0
        };
      }
      return w;
    }));
    
    // Also update machine operator name!
    if (machineId !== 'None') {
      const wName = workers.find(w => w.id === workerId)?.name;
      setMachines(machines.map(m => m.id === machineId ? { ...m, operator: wName } : m));
    }
  };

  const handleUpdateInvoiceStatus = (invId, nextPaymentStatus) => {
    setDispatchBilling(dispatchBilling.map(inv => {
      if (inv.id === invId) {
        return {
          ...inv,
          paymentStatus: nextPaymentStatus
        };
      }
      return inv;
    }));
    
    // Adjust customer outstanding accordingly!
    const invoice = dispatchBilling.find(i => i.id === invId);
    if (nextPaymentStatus === 'Paid') {
      setCustomers(customers.map(c => {
        if (c.name === invoice.customerName) {
          return {
            ...c,
            outstanding: Math.max(0, c.outstanding - invoice.grandTotal)
          };
        }
        return c;
      }));
      addNotification(`Outstanding balance of ${invoice.customerName} reduced by ${formatINR(invoice.grandTotal)}.`, 'success');
    }
  };

  const handleLogDispatch = (newDispatch) => {
    setDispatchBilling([newDispatch, ...dispatchBilling]);
    
    // Mark associated order status as Completed and progress as 100%!
    setOrders(orders.map(o => o.id === newDispatch.orderId ? { ...o, status: 'Completed', progress: 100 } : o));
    
    // Increment customer outstanding ledger
    setCustomers(customers.map(c => {
      if (c.name === newDispatch.customerName) {
        return {
          ...c,
          outstanding: c.outstanding + newDispatch.grandTotal
        };
      }
      return c;
    }));

    addNotification(`GST Invoice ${newDispatch.id} issued. Cargo shipped on truck ${newDispatch.vehicleNo}.`, 'success');
  };

  // Helper helpers
  const addNotification = (title, type) => {
    const newNotif = {
      id: `n${Date.now()}`,
      title,
      type,
      time: 'Just now',
      read: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  const markNotificationRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const formatINR = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // ==========================================
  // DYNAMIC INDUSTRY FILTERS
  // ==========================================
  
  const getFilteredInventory = () => {
    if (activeIndustry === 'all') return inventory;
    if (activeIndustry === 'cnc') {
      return inventory.filter(i => i.name.toLowerCase().includes('steel') || i.name.toLowerCase().includes('bolt') || i.name.toLowerCase().includes('flange'));
    }
    if (activeIndustry === 'plastic') {
      return inventory.filter(i => i.name.toLowerCase().includes('hdpe') || i.name.toLowerCase().includes('pallet') || i.name.toLowerCase().includes('plastic'));
    }
    if (activeIndustry === 'packaging') {
      return inventory.filter(i => i.name.toLowerCase().includes('carton') || i.name.toLowerCase().includes('paper') || i.name.toLowerCase().includes('liner'));
    }
    return inventory;
  };

  const getFilteredMachines = () => {
    if (activeIndustry === 'all') return machines;
    if (activeIndustry === 'cnc') return machines.filter(m => m.type.includes('CNC') || m.type.includes('Fabrication'));
    if (activeIndustry === 'plastic') return machines.filter(m => m.type.includes('Plastic'));
    if (activeIndustry === 'packaging') return machines.filter(m => m.type.includes('Packaging'));
    return machines;
  };

  const filteredInventory = getFilteredInventory();
  const filteredMachines = getFilteredMachines();

  // ==========================================
  // STATS & CALCULATIONS FOR KPI DASHBOARD
  // ==========================================
  
  const todayProductionSum = filteredMachines.reduce((sum, m) => {
    const rawVal = parseFloat(m.todayRuntime) || 0;
    return sum + Math.round(rawVal * (m.type === 'CNC Unit' ? 12.5 : m.type === 'Plastic Molding' ? 30 : 25));
  }, 0);

  const pendingOrdersCount = orders.filter(o => o.status === 'Processing' || o.status === 'Pending').length;
  const lowStockCount = filteredInventory.filter(i => i.stock <= i.minStock).length;
  const dispatchPendingCount = dispatchBilling.filter(d => d.dispatchStatus === 'Pending').length;
  const totalOutstandingDue = customers.reduce((sum, c) => sum + c.outstanding, 0);

  const stats = {
    todayProduction: todayProductionSum || 615,
    pendingOrders: pendingOrdersCount,
    lowStockAlerts: lowStockCount,
    dispatchPending: dispatchPendingCount,
    paymentsDue: totalOutstandingDue
  };

  // Open Quick Modals
  const handleOpenQuickModal = (type, data = {}) => {
    if (type === 'customer') {
      setActiveTab('crm');
    } else if (type === 'quote') {
      setActiveTab('crm');
    } else if (type === 'production') {
      setActiveTab('production');
    } else if (type === 'dispatch') {
      setActiveTab('dispatch');
    } else if (type === 'purchase') {
      setQuickModalType('purchase');
      setQuickModalData(data);
    }
  };

  // Render Sub-Views
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            stats={stats}
            monthlyData={monthlyRevenue}
            topCustomers={customers}
            machines={filteredMachines}
            lowStockItems={filteredInventory.filter(i => i.stock <= i.minStock)}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenQuickModal={handleOpenQuickModal}
          />
        );
      
      case 'crm':
      case 'customers':
      case 'quotations':
        return (
          <CRM 
            customers={customers}
            quotations={quotations}
            orders={orders}
            onAddCustomer={handleAddCustomer}
            onAddQuotation={handleAddQuotation}
            onConvertOrder={handleConvertOrder}
          />
        );

      case 'orders':
        return (
          <CRM 
            customers={customers}
            quotations={quotations}
            orders={orders}
            onAddCustomer={handleAddCustomer}
            onAddQuotation={handleAddQuotation}
            onConvertOrder={handleConvertOrder}
          />
        );

      case 'inventory':
        return (
          <Inventory 
            inventory={filteredInventory}
            onAddStock={handleAddStock}
            onAdjustStock={handleAdjustStock}
          />
        );

      case 'production':
      case 'machines':
        return (
          <Production 
            machines={filteredMachines}
            workers={workers}
            productionLogs={productionLogs}
            onLogProduction={handleLogProduction}
            onUpdateMachineStatus={handleUpdateMachineStatus}
            onUpdateWorkerMachine={handleUpdateWorkerMachine}
          />
        );

      case 'dispatch':
      case 'billing':
        return (
          <DispatchBilling 
            dispatchBilling={dispatchBilling}
            orders={orders}
            onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
            onLogDispatch={handleLogDispatch}
          />
        );

      case 'reports':
        return (
          <Reports 
            monthlyData={monthlyRevenue}
            productProfitability={productProfitability}
            machines={filteredMachines}
            productionLogs={productionLogs}
            customers={customers}
            orders={orders}
            inventory={inventory}
            dispatchBilling={dispatchBilling}
          />
        );

      case 'workers':
        return (
          <Production 
            machines={filteredMachines}
            workers={workers}
            productionLogs={productionLogs}
            onLogProduction={handleLogProduction}
            onUpdateMachineStatus={handleUpdateMachineStatus}
            onUpdateWorkerMachine={handleUpdateWorkerMachine}
          />
        );

      case 'settings':
        return <Settings />;

      default:
        return <div className="p-10 text-center text-slate-500">Feature Screen coming soon!</div>;
    }
  };

  if (viewMode === 'landing') {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      
      {/* 1. Left Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        alertsCount={lowStockCount}
        userRole={userRole}
        onLogout={handleLogout}
      />

      {/* 2. Main Content Wrapper */}
      <div 
        className={`flex-1 min-h-screen flex flex-col pt-16 transition-all duration-300
          ${sidebarOpen ? 'pl-64' : 'pl-20'}
        `}
      >
        {/* Top Navbar */}
        <Navbar 
          activeTab={activeTab}
          sidebarOpen={sidebarOpen}
          activeIndustry={activeIndustry}
          setActiveIndustry={setActiveIndustry}
          notifications={notifications}
          markNotificationRead={markNotificationRead}
          userRole={userRole}
          onLogout={handleLogout}
        />

        {/* Dynamic page container */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto pb-12">
          {renderActiveView()}
        </main>
      </div>

      {/* ======================================================== */}
      {/* SAFETY STOCK PURCHASE RAPID PO DIALOG */}
      {quickModalType === 'purchase' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
              <span className="text-sm font-bold text-slate-800">Raise Purchase Order (PO)</span>
              <button 
                onClick={() => setQuickModalType(null)}
                className="text-slate-400 hover:text-slate-650 font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 font-mono">SKU: {quickModalData.itemId}</span>
                <h4 className="font-bold text-slate-800 text-sm mt-0.5">{quickModalData.itemName}</h4>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-600 font-semibold">Select Vendor Partner</label>
                <select className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option>Reliance Poly Chemicals Pvt Ltd</option>
                  <option>Tata Steel Alloys Hub</option>
                  <option>Ludhiana Spares & Co</option>
                  <option>Bhiwandi Packaging Yards</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-600 font-semibold">PO Order Quantity</label>
                <input 
                  type="number" 
                  defaultValue="200"
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  onClick={() => setQuickModalType(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleAdjustStock(quickModalData.itemId, 200);
                    setQuickModalType(null);
                  }}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg shadow-md"
                >
                  Approve & Inward Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
