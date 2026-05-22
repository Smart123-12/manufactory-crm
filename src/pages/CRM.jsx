import React, { useState } from 'react';
import { 
  Plus, Search, Building2, CheckCircle2, ArrowRight, FileText, Send, PhoneCall, 
  Trash2, Landmark, CheckSquare, Sparkles 
} from 'lucide-react';

export default function CRM({ 
  customers, 
  quotations, 
  orders, 
  onAddCustomer, 
  onAddQuotation, 
  onConvertOrder 
}) {
  const [activeSubTab, setActiveSubTab] = useState('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  
  // Quotation form states
  const [selectedCustId, setSelectedCustId] = useState('');
  const [quoteItems, setQuoteItems] = useState([{ desc: '', qty: 1, rate: 0, hsn: '' }]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isInterstate, setIsInterstate] = useState(false);

  // New Customer form states
  const [showCustModal, setShowCustModal] = useState(false);
  const [newCust, setNewCust] = useState({
    name: '', contactPerson: '', phone: '', email: '', city: '', state: 'Maharashtra', gstin: '', type: 'OEM Tier-1', creditDays: 45
  });

  const formatINR = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // 1. Filtering Customers
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // 2. Add Customer submit
  const handleCustSubmit = (e) => {
    e.preventDefault();
    if (!newCust.name || !newCust.gstin) {
      alert('Please fill out Customer Name and GSTIN.');
      return;
    }
    const customerObj = {
      id: `CUST-0${customers.length + 1}`,
      outstanding: 0,
      status: "Active",
      ...newCust
    };
    onAddCustomer(customerObj);
    setNewCust({ name: '', contactPerson: '', phone: '', email: '', city: '', state: 'Maharashtra', gstin: '', type: 'OEM Tier-1', creditDays: 45 });
    setShowCustModal(false);
  };

  // 3. Dynamic Quote item management
  const addQuoteItem = () => {
    setQuoteItems([...quoteItems, { desc: '', qty: 1, rate: 0, hsn: '' }]);
  };
  const removeQuoteItem = (index) => {
    if (quoteItems.length === 1) return;
    const copy = [...quoteItems];
    copy.splice(index, 1);
    setQuoteItems(copy);
  };
  const updateQuoteItem = (index, field, value) => {
    const copy = [...quoteItems];
    copy[index][field] = value;
    setQuoteItems(copy);
  };

  // 4. Quotation Calculations
  const calculateQuoteSubtotal = () => {
    return quoteItems.reduce((sum, item) => sum + (item.qty * item.rate), 0);
  };
  const subtotal = calculateQuoteSubtotal();
  const discAmt = subtotal * (discountPercent / 100);
  const taxableVal = subtotal - discAmt;
  const gstAmt = taxableVal * 0.18; // 18% general GST
  const grandTotal = taxableVal + gstAmt;

  const handleCreateQuotation = (e) => {
    e.preventDefault();
    if (!selectedCustId) {
      alert('Please select a customer.');
      return;
    }
    const custObj = customers.find(c => c.id === selectedCustId);
    const newQuoteObj = {
      id: `QT-2026-0${quotations.length + 42}`,
      customerId: selectedCustId,
      customerName: custObj.name,
      date: new Date().toISOString().split('T')[0],
      items: quoteItems,
      gstRate: 18,
      discountPercent: parseFloat(discountPercent),
      subtotal: taxableVal,
      gstAmount: gstAmt,
      grandTotal: grandTotal,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "Pending Approval"
    };

    onAddQuotation(newQuoteObj);
    // Reset quotation form
    setQuoteItems([{ desc: '', qty: 1, rate: 0, hsn: '' }]);
    setSelectedCustId('');
    setDiscountPercent(0);
    setActiveSubTab('quotations');
    alert(`Quotation ${newQuoteObj.id} created successfully!`);
  };

  return (
    <div className="space-y-6">
      
      {/* CRM Navigation Sub-Tabs */}
      <div className="flex border border-slate-200 bg-white p-1 rounded-lg max-w-lg shadow-sm">
        <button
          onClick={() => setActiveSubTab('customers')}
          className={`flex-1 py-1.5 px-3 rounded text-[11px] font-bold transition-all
            ${activeSubTab === 'customers' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}
          `}
        >
          Customer Ledgers
        </button>
        <button
          onClick={() => setActiveSubTab('pipeline')}
          className={`flex-1 py-1.5 px-3 rounded text-[11px] font-bold transition-all
            ${activeSubTab === 'pipeline' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}
          `}
        >
          RFQ Pipeline
        </button>
        <button
          onClick={() => setActiveSubTab('generate-quote')}
          className={`flex-1 py-1.5 px-3 rounded text-[11px] font-bold transition-all
            ${activeSubTab === 'generate-quote' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}
          `}
        >
          GST Generator
        </button>
        <button
          onClick={() => setActiveSubTab('quotations')}
          className={`flex-1 py-1.5 px-3 rounded text-[11px] font-bold transition-all
            ${activeSubTab === 'quotations' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}
          `}
        >
          Quotations
        </button>
      </div>

      {/* Sub-Tab Content */}

      {/* TABS 1: Customer Ledger Directory */}
      {activeSubTab === 'customers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex w-full sm:w-auto items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search customer, person, city..." 
                  className="w-full sm:w-64 bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-brand-500 font-medium text-slate-700"
                />
              </div>
              {/* Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-bold"
              >
                <option value="All">All Types</option>
                <option value="OEM Tier-1">OEM Tier-1</option>
                <option value="Contractor">Contractor</option>
                <option value="Distributor">Distributor</option>
              </select>
            </div>

            <button 
              onClick={() => setShowCustModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white rounded-lg shadow-md"
            >
              <Plus className="w-4 h-4" /> Add B2B Customer
            </button>
          </div>

          {/* Grid Layout of Customers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map(cust => (
              <div key={cust.id} className="glass-panel p-5 rounded-xl border border-slate-200/60 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-slate-50 rounded-lg text-brand-600">
                      <Building2 className="w-4.5 h-4.5" />
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded bg-brand-50 text-brand-600 border border-brand-100">
                      {cust.type}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm leading-snug">{cust.name}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">GSTIN: {cust.gstin} • {cust.city}, {cust.state}</p>
                  </div>
                </div>

                <div className="bg-slate-50/60 p-3 rounded-lg space-y-1.5 text-xs border border-slate-100">
                  <p className="text-slate-500 flex justify-between">
                    <span>Contact:</span> 
                    <span className="font-bold text-slate-700">{cust.contactPerson}</span>
                  </p>
                  <p className="text-slate-500 flex justify-between">
                    <span>Phone:</span> 
                    <span className="font-bold text-slate-700">{cust.phone}</span>
                  </p>
                  <p className="text-slate-500 flex justify-between">
                    <span>Outstanding:</span> 
                    <span className="font-extrabold text-rose-600">{formatINR(cust.outstanding)}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
                  <span className="font-semibold">Credit Limit: <strong className="text-slate-700 font-mono">{cust.creditDays}d</strong></span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => alert(`Initiating direct WhatsApp call to ${cust.contactPerson}`)}
                      className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                      title="Call Lead"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedCustId(cust.id);
                        setActiveSubTab('generate-quote');
                      }}
                      className="p-1.5 rounded bg-brand-600 hover:bg-brand-500 text-white transition-colors"
                      title="Build Quote"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TABS 2: RFQ & Order Pipeline */}
      {activeSubTab === 'pipeline' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Dealers & OEM Pipeline Stages</h3>
              <p className="text-xs text-slate-400 font-semibold">Click actions to advance stages</p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 rounded">
              Active Funnel
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Stage 1: RFQ Received */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex justify-between items-center">
                <span>1. RFQ Received</span>
                <span className="w-5 h-5 bg-slate-100 text-[10px] text-slate-700 rounded-full flex items-center justify-center font-bold">1</span>
              </h4>
              <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100 text-xs space-y-2">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Hinduja Engineering</span>
                  <span className="text-[10px] bg-brand-50 text-brand-600 px-1.5 py-0.2 rounded border border-brand-100">New RFQ</span>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold">1500 OEM Fuel Valve Castings (Aluminum)</p>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200/60 mt-1">
                  <span className="text-[10px] text-slate-500 font-bold">Est. ₹3.5L</span>
                  <button 
                    onClick={() => {
                      setSelectedCustId('CUST-004'); // Hinduja
                      setQuoteItems([{ desc: 'OEM Fuel Valve Castings (Aluminum)', qty: 1500, rate: 195, hsn: '8409' }]);
                      setActiveSubTab('generate-quote');
                    }}
                    className="p-1 rounded bg-brand-600 hover:bg-brand-500 text-white flex items-center gap-0.5 text-[10px] font-bold"
                  >
                    Draft Quote <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Stage 2: Quote Sent / Review */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex justify-between items-center">
                <span>2. Quote Sent</span>
                <span className="w-5 h-5 bg-slate-100 text-[10px] text-slate-700 rounded-full flex items-center justify-center font-bold">
                  {quotations.filter(q => q.status === 'Pending Approval').length}
                </span>
              </h4>
              
              {quotations.filter(q => q.status === 'Pending Approval').map(q => (
                <div key={q.id} className="bg-slate-50/50 p-3 rounded-lg border border-slate-100 text-xs space-y-2">
                  <div className="font-bold text-slate-700">{q.customerName}</div>
                  <p className="text-[10px] text-slate-400 font-semibold">Ref: {q.id} • Total: {formatINR(q.grandTotal)}</p>
                  <div className="flex justify-between pt-1 border-t border-slate-200/60 mt-1">
                    <span className="text-[10px] text-amber-600 font-bold">Under Review</span>
                    <button 
                      onClick={() => alert(`Sending follow up reminder on WhatsApp to ${q.customerName} for ${q.id}`)}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[9px] font-bold"
                    >
                      Follow Up
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Stage 3: Approved / Converting */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex justify-between items-center">
                <span>3. Approved</span>
                <span className="w-5 h-5 bg-slate-100 text-[10px] text-slate-700 rounded-full flex items-center justify-center font-bold">
                  {quotations.filter(q => q.status === 'Approved').length}
                </span>
              </h4>
              
              {quotations.filter(q => q.status === 'Approved').map(q => (
                <div key={q.id} className="bg-slate-50/50 p-3 rounded-lg border border-slate-100 text-xs space-y-2">
                  <div className="font-bold text-slate-700">{q.customerName}</div>
                  <p className="text-[10px] text-slate-400 font-semibold">Ref: {q.id} • Subtotal: {formatINR(q.subtotal)}</p>
                  <div className="flex justify-between pt-1 border-t border-slate-200/60 mt-1">
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                    <button 
                      onClick={() => onConvertOrder(q)}
                      className="p-1 px-2 rounded bg-brand-600 hover:bg-brand-500 text-white text-[10px] font-bold flex items-center gap-0.5"
                    >
                      Book Order <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Stage 4: Order Converted */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex justify-between items-center">
                <span>4. Converted (Active)</span>
                <span className="w-5 h-5 bg-slate-100 text-[10px] text-slate-700 rounded-full flex items-center justify-center font-bold">
                  {orders.filter(o => o.status === 'Processing').length}
                </span>
              </h4>
              
              {orders.filter(o => o.status === 'Processing').map(o => (
                <div key={o.id} className="bg-slate-50/50 p-3 rounded-lg border border-slate-100 text-xs space-y-2">
                  <div className="font-bold text-slate-700">{o.customerName}</div>
                  <p className="text-[10px] text-slate-400 font-semibold">Job: {o.id} • Delivery: {o.deliveryDueDate}</p>
                  <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-1">
                    <div className="bg-brand-500 h-full" style={{ width: `${o.progress}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold">
                    <span>{o.productionStage}</span>
                    <span className="text-brand-600">{o.progress}%</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* TABS 3: Quotation Generator Form */}
      {activeSubTab === 'generate-quote' && (
        <div className="glass-panel p-6 rounded-xl border border-slate-200 max-w-4xl shadow-sm">
          <div className="border-b border-slate-150 pb-4 mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">GST-Compliant B2B Quotation Builder</h3>
              <p className="text-xs text-slate-400 font-medium">Enter custom line items and tax specifications</p>
            </div>
            <Sparkles className="w-5 h-5 text-brand-500" />
          </div>

          <form onSubmit={handleCreateQuotation} className="space-y-6">
            
            {/* Customer Select & Interstate Switch */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Select B2B Customer</label>
                <select
                  required
                  value={selectedCustId}
                  onChange={(e) => setSelectedCustId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-brand-500 text-slate-700 font-bold"
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Discount Percentage</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Math.max(0, e.target.value))}
                  placeholder="e.g. 5%"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-brand-500 text-slate-700 font-semibold"
                />
              </div>

              <div className="flex flex-col justify-end pb-2">
                <label className="flex items-center gap-2 text-xs text-slate-600 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isInterstate}
                    onChange={(e) => setIsInterstate(e.target.checked)}
                    className="rounded bg-slate-50 border-slate-200 text-brand-600 focus:ring-brand-500 focus:ring-offset-0 focus:ring-0"
                  />
                  <span>Interstate (IGST instead of CGST+SGST)</span>
                </label>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quote Line Items</h4>
                <button
                  type="button"
                  onClick={addQuoteItem}
                  className="flex items-center gap-1 text-[10px] font-bold text-brand-600 hover:text-brand-700"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Row
                </button>
              </div>

              <div className="space-y-2">
                {quoteItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 bg-slate-50/40 p-3 rounded-lg border border-slate-100">
                    <div className="col-span-12 md:col-span-5">
                      <label className="block text-[9px] font-bold text-slate-400 mb-1">Item Description</label>
                      <input
                        type="text"
                        required
                        value={item.desc}
                        onChange={(e) => updateQuoteItem(idx, 'desc', e.target.value)}
                        placeholder="Bolt specifications, molding items..."
                        className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs text-slate-700 focus:outline-none focus:border-brand-500 font-semibold"
                      />
                    </div>
                    
                    <div className="col-span-4 md:col-span-2">
                      <label className="block text-[9px] font-bold text-slate-400 mb-1">HSN Code</label>
                      <input
                        type="text"
                        required
                        value={item.hsn}
                        onChange={(e) => updateQuoteItem(idx, 'hsn', e.target.value)}
                        placeholder="7318"
                        className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs text-slate-700 focus:outline-none focus:border-brand-500 font-mono font-semibold"
                      />
                    </div>

                    <div className="col-span-4 md:col-span-2">
                      <label className="block text-[9px] font-bold text-slate-400 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={item.qty}
                        onChange={(e) => updateQuoteItem(idx, 'qty', parseInt(e.target.value) || 1)}
                        className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs text-slate-700 focus:outline-none focus:border-brand-500 font-mono font-semibold"
                      />
                    </div>

                    <div className="col-span-4 md:col-span-2">
                      <label className="block text-[9px] font-bold text-slate-400 mb-1">Unit Rate (₹)</label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.01"
                        required
                        value={item.rate}
                        onChange={(e) => updateQuoteItem(idx, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs text-slate-700 focus:outline-none focus:border-brand-500 font-mono font-semibold"
                      />
                    </div>

                    <div className="col-span-12 md:col-span-1 flex items-end justify-center pb-1">
                      <button
                        type="button"
                        onClick={() => removeQuoteItem(idx)}
                        disabled={quoteItems.length === 1}
                        className="p-1.5 text-slate-400 hover:text-rose-500 disabled:opacity-30 rounded hover:bg-slate-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations Breakdown Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-150">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
                <h5 className="font-extrabold text-slate-600 uppercase tracking-widest text-[9px] mb-2 flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-brand-500" /> GST Tax Breakdown
                </h5>
                <p className="text-slate-500 flex justify-between font-medium">
                  <span>Gross Value:</span> 
                  <span className="font-mono text-slate-700">{formatINR(subtotal)}</span>
                </p>
                {discAmt > 0 && (
                  <p className="text-rose-600 flex justify-between font-bold">
                    <span>Discount ({discountPercent}%):</span> 
                    <span className="font-mono">-{formatINR(discAmt)}</span>
                  </p>
                )}
                <p className="text-slate-500 flex justify-between font-medium">
                  <span>Taxable Value:</span> 
                  <span className="font-mono text-slate-700">{formatINR(taxableVal)}</span>
                </p>
                
                {isInterstate ? (
                  <p className="text-brand-600 flex justify-between font-bold">
                    <span>IGST (18%):</span> 
                    <span className="font-mono">{formatINR(gstAmt)}</span>
                  </p>
                ) : (
                  <>
                    <p className="text-brand-600 flex justify-between font-semibold">
                      <span>CGST (9%):</span> 
                      <span className="font-mono">{formatINR(gstAmt / 2)}</span>
                    </p>
                    <p className="text-brand-600 flex justify-between font-semibold">
                      <span>SGST (9%):</span> 
                      <span className="font-mono">{formatINR(gstAmt / 2)}</span>
                    </p>
                  </>
                )}
                
                <div className="border-t border-slate-200 pt-2 flex justify-between font-extrabold text-slate-800 text-sm">
                  <span>Grand Total:</span>
                  <span className="font-mono text-emerald-600">{formatINR(grandTotal)}</span>
                </div>
              </div>

              <div className="flex flex-col justify-end space-y-3">
                <div className="text-xs text-slate-400 font-semibold leading-relaxed">
                  <p className="font-bold text-slate-500 mb-1 flex items-center gap-1">
                    <CheckSquare className="w-3.5 h-3.5 text-brand-500" /> Quotation Policy
                  </p>
                  Prices valid for 30 calendar days. Auto-calculates standard GST tax schedules in compliance with modern e-Invoicing directives.
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-500/10 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Finalize & Generate Quotation
                </button>
              </div>
            </div>

          </form>
        </div>
      )}

      {/* TABS 4: Quotation Directory List */}
      {activeSubTab === 'quotations' && (
        <div className="glass-panel p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-150 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 pr-2">Quote ID</th>
                  <th className="pb-3">Customer Name</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Subtotal</th>
                  <th className="pb-3">GST Tax</th>
                  <th className="pb-3">Grand Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                {quotations.map(q => (
                  <tr key={q.id} className="hover:bg-slate-50/50">
                    <td className="py-3 font-bold text-brand-600 font-mono">{q.id}</td>
                    <td className="py-3 font-bold text-slate-700">{q.customerName}</td>
                    <td className="py-3 font-mono">{q.date}</td>
                    <td className="py-3 font-mono">{formatINR(q.subtotal)}</td>
                    <td className="py-3 font-mono">{formatINR(q.gstAmount)}</td>
                    <td className="py-3 font-extrabold font-mono text-emerald-600">{formatINR(q.grandTotal)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded border
                        ${q.status === 'Pending Approval' ? 'bg-amber-50 text-amber-600 border-amber-100' : ''}
                        ${q.status === 'Approved' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : ''}
                        ${q.status === 'Converted to Order' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : ''}
                      `}>
                        {q.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {q.status === 'Approved' ? (
                        <button
                          onClick={() => onConvertOrder(q)}
                          className="px-2 py-1 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded text-[10px]"
                        >
                          Convert to Order
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold">No Action</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. ADD B2B CUSTOMER MODAL */}
      {showCustModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-150 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Register B2B Customer</span>
              <button 
                onClick={() => setShowCustModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCustSubmit} className="p-6 space-y-4 text-xs font-semibold text-slate-600">
              <div className="space-y-1">
                <label className="block text-slate-500">Customer Firm Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Tata Projects Ltd"
                  value={newCust.name}
                  onChange={(e) => setNewCust({ ...newCust, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-850 focus:outline-none focus:border-brand-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-500">GSTIN *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="27AAACT2910P1ZX"
                    value={newCust.gstin}
                    onChange={(e) => setNewCust({ ...newCust, gstin: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-850 focus:outline-none focus:border-brand-500 font-mono font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-500">Customer Segment</label>
                  <select
                    value={newCust.type}
                    onChange={(e) => setNewCust({ ...newCust, type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-850 focus:outline-none focus:border-brand-500 font-semibold"
                  >
                    <option value="OEM Tier-1">OEM Tier-1</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Distributor">Distributor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-500">Contact Person</label>
                  <input 
                    type="text" 
                    placeholder="Amir Khan"
                    value={newCust.contactPerson}
                    onChange={(e) => setNewCust({ ...newCust, contactPerson: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-850 focus:outline-none focus:border-brand-500 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-500">Phone Number</label>
                  <input 
                    type="text" 
                    placeholder="+91 98250 12345"
                    value={newCust.phone}
                    onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-850 focus:outline-none focus:border-brand-500 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-500">City</label>
                  <input 
                    type="text" 
                    placeholder="Pune"
                    value={newCust.city}
                    onChange={(e) => setNewCust({ ...newCust, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-850 focus:outline-none focus:border-brand-500 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-500">State</label>
                  <input 
                    type="text" 
                    placeholder="Maharashtra"
                    value={newCust.state}
                    onChange={(e) => setNewCust({ ...newCust, state: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-850 focus:outline-none focus:border-brand-500 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-500">Credit Limit (Days)</label>
                  <input 
                    type="number" 
                    value={newCust.creditDays}
                    onChange={(e) => setNewCust({ ...newCust, creditDays: parseInt(e.target.value) || 30 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-850 focus:outline-none focus:border-brand-500 font-mono font-semibold"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-150 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCustModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg shadow-md"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
