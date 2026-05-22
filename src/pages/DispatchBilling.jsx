import React, { useState } from 'react';
import { 
  Printer, Truck, Receipt, CheckCircle, Clock, AlertCircle, Share2, Clipboard, ArrowLeft, 
  Send, Landmark, User, FileText, CheckCircle2 
} from 'lucide-react';

export default function DispatchBilling({ 
  dispatchBilling, 
  orders,
  onUpdateInvoiceStatus, 
  onLogDispatch,
  userRole = 'Owner',
  customers = []
}) {
  const isEditable = userRole === 'Owner' || userRole === 'Admin' || userRole === 'Accountant';
  const [activeSubTab, setActiveSubTab] = useState('invoices'); // invoices, dispatch, collections
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // New Dispatch Form States
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [transporter, setTransporter] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [ewayBillNo, setEwayBillNo] = useState('');
  const [inputGstin, setInputGstin] = useState('27AAACK1209D1ZQ');
  const [nicEwayChecked, setNicEwayChecked] = useState(false);

  const selectedOrderObj = orders.find(o => o.id === selectedOrderId);
  const isEwayMandated = selectedOrderObj && selectedOrderObj.totalAmount > 50000;
  const isGstinValid = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(inputGstin);

  const handleOrderSelect = (orderId) => {
    setSelectedOrderId(orderId);
    const orderObj = orders.find(o => o.id === orderId);
    if (orderObj) {
      const custObj = customers.find(c => c.id === orderObj.customerId || c.name === orderObj.customerName);
      if (custObj && custObj.gstin) {
        setInputGstin(custObj.gstin);
      } else {
        setInputGstin('27AAACK1209D1ZQ');
      }
    } else {
      setInputGstin('27AAACK1209D1ZQ');
    }
  };

  const formatINR = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleCreateDispatch = (e) => {
    e.preventDefault();
    if (!isEditable) {
      alert('Access Constrained: Your role does not have permission to log dispatch cargo.');
      return;
    }
    if (!selectedOrderId || !transporter || !vehicleNo) {
      alert('Please fill out Order, Transporter and Vehicle Number.');
      return;
    }
    if (!isGstinValid) {
      alert('Invalid GSTIN format. Please provide a valid 15-digit GSTIN.');
      return;
    }
    if (isEwayMandated) {
      if (!ewayBillNo || ewayBillNo.trim() === '') {
        alert('e-Way Bill is legally mandated for consignments exceeding ₹50,000. Please enter e-Way Bill Code.');
        return;
      }
      if (!nicEwayChecked) {
        alert('Please acknowledge automated NIC API e-Way Bill Generation before proceeding.');
        return;
      }
    }

    const orderObj = orders.find(o => o.id === selectedOrderId);
    const invoiceId = `INV-2026-70${dispatchBilling.length + 1}`;

    const newDispatchObj = {
      id: invoiceId,
      orderId: selectedOrderId,
      customerName: orderObj.customerName,
      date: new Date().toISOString().split('T')[0],
      subtotal: orderObj.totalAmount / 1.18, // assume 18% inclusive for order amount
      gstAmount: (orderObj.totalAmount / 1.18) * 0.18,
      grandTotal: orderObj.totalAmount,
      gstin: inputGstin || "27AAACK1209D1ZQ",
      transporter: transporter,
      vehicleNo: vehicleNo.toUpperCase(),
      ewayBillNo: ewayBillNo || `EWAY${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      dispatchStatus: "Shipped",
      paymentStatus: "Unpaid",
      paymentDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    onLogDispatch(newDispatchObj);
    setSelectedOrderId('');
    setTransporter('');
    setVehicleNo('');
    setEwayBillNo('');
    setActiveSubTab('dispatch');
    alert(`GST Invoice & Dispatch registered for ${orderObj.customerName}!`);
  };

  const copyWhatsAppReminder = (inv) => {
    const text = `Dear ${inv.customerName} team, this is a friendly reminder from Manufactory CRM Industries. Tax Invoice ${inv.id} dated ${inv.date} for amount ${formatINR(inv.grandTotal)} is due for payment on ${inv.paymentDueDate}. Vehicle No: ${inv.vehicleNo}. Kindly process the payment at your earliest convenience. Thank you.`;
    navigator.clipboard.writeText(text);
    alert('WhatsApp reminder message copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      
      {/* If invoice modal view is active, render full page Invoice page instead! */}
      {selectedInvoice ? (
        <div className="glass-panel p-6 rounded-2xl space-y-6 max-w-4xl mx-auto" id="invoice-print-area">
          <div className="flex justify-between items-center no-print border-b border-slate-200 pb-4 mb-4">
            <button 
              onClick={() => setSelectedInvoice(null)}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Invoices
            </button>
            <div className="flex gap-2">
              <button 
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg text-xs flex items-center gap-1"
              >
                <Printer className="w-4.5 h-4.5" /> Print Tax Invoice
              </button>
            </div>
          </div>

          {/* Actual Standard Indian GST Tax Invoice */}
          <div className="bg-white text-slate-900 p-8 rounded-xl border border-slate-200 shadow-2xl space-y-8 text-xs font-sans leading-normal text-slate-800">
            
            {/* Header */}
            <div className="flex justify-between border-b border-slate-300 pb-6">
              <div>
                <h2 className="text-xl font-extrabold tracking-wider text-slate-800">TAX INVOICE</h2>
                <p className="text-[10px] text-slate-500 mt-1">ORIGINAL FOR BUYER</p>
              </div>
              <div className="text-right">
                <h3 className="font-extrabold text-slate-850 text-base">Manufactory CRM Industries</h3>
                <p className="text-slate-600 font-medium">Factory Gate 3, MIDC Industrial Area</p>
                <p className="text-slate-600">Pune, Maharashtra, 411018</p>
                <p className="font-semibold text-slate-800 mt-1">GSTIN: 27AAACK1209D1ZQ</p>
              </div>
            </div>

            {/* Invoice Info Grid */}
            <div className="grid grid-cols-2 gap-8 border-b border-slate-200 pb-6">
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Billed To (Buyer):</h4>
                <p className="font-bold text-slate-805 text-sm">{selectedInvoice.customerName}</p>
                <p className="text-slate-650 font-medium">B2B Manufacturing Partner</p>
                <p className="font-bold text-slate-700">GSTIN: {selectedInvoice.gstin || '27AAACT2910P1ZX'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Invoice No:</p>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedInvoice.id}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Invoice Date:</p>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedInvoice.date}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">State of Supply:</p>
                  <p className="font-bold text-slate-800 mt-0.5">Maharashtra (Code 27)</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Due Date:</p>
                  <p className="font-bold text-rose-600 mt-0.5">{selectedInvoice.paymentDueDate}</p>
                </div>
              </div>
            </div>

            {/* Transport Logistics Section */}
            <div className="bg-slate-50 p-4 rounded border border-slate-200 grid grid-cols-4 gap-4 text-[10px]">
              <div>
                <span className="text-slate-500 font-semibold uppercase tracking-wider">Transporter:</span>
                <p className="font-bold text-slate-805 mt-0.5">{selectedInvoice.transporter}</p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold uppercase tracking-wider">Vehicle Number:</span>
                <p className="font-bold text-slate-805 mt-0.5">{selectedInvoice.vehicleNo}</p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold uppercase tracking-wider">e-Way Bill No:</span>
                <p className="font-bold text-slate-855 mt-0.5">{selectedInvoice.ewayBillNo}</p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold uppercase tracking-wider">Dispatch Status:</span>
                <p className="font-bold text-emerald-600 mt-0.5">Dispatched / Shipped</p>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 text-[10px]">
                  <th className="p-2.5">S.No</th>
                  <th className="p-2.5">Description of Industrial Goods</th>
                  <th className="p-2.5">HSN Code</th>
                  <th className="p-2.5">Quantity</th>
                  <th className="p-2.5 text-right">Taxable Value (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="font-medium">
                  <td className="p-2.5">1</td>
                  <td className="p-2.5 font-bold">Industrial Consumables supply / Production contract items</td>
                  <td className="p-2.5 font-mono">7307 / 3923</td>
                  <td className="p-2.5">Bulk Lot</td>
                  <td className="p-2.5 text-right font-mono">{formatINR(selectedInvoice.subtotal)}</td>
                </tr>
              </tbody>
            </table>

            {/* Calculations Breakdown */}
            <div className="grid grid-cols-2 gap-8 border-t border-slate-200 pt-6">
              <div className="space-y-2 border-r border-slate-200 pr-6 text-[10px] text-slate-500">
                <h5 className="font-bold text-slate-700 uppercase tracking-widest text-[9px] flex items-center gap-1">
                  <Landmark className="w-3.5 h-3.5 text-brand-500" /> Bank Remittance Info:
                </h5>
                <p>Beneficiary Name: <strong className="text-slate-805">Manufactory CRM Industries Ltd</strong></p>
                <p>Bank: Bank of Baroda, MIDC Pune</p>
                <p>Account Number: 981200109923412 • IFSC: BARB0MIDCPU</p>
              </div>

              <div className="space-y-2 text-xs font-semibold text-slate-700">
                <p className="flex justify-between">
                  <span>Taxable Value:</span> 
                  <span className="font-mono text-slate-800">{formatINR(selectedInvoice.subtotal)}</span>
                </p>
                
                {/* Standard CGST / SGST breakdown */}
                <p className="flex justify-between">
                  <span>CGST (9%):</span> 
                  <span className="font-mono text-slate-800">{formatINR(selectedInvoice.gstAmount / 2)}</span>
                </p>
                <p className="flex justify-between">
                  <span>SGST (9%):</span> 
                  <span className="font-mono text-slate-800">{formatINR(selectedInvoice.gstAmount / 2)}</span>
                </p>
                
                <div className="border-t border-slate-200 pt-2 flex justify-between font-extrabold text-slate-900 text-sm">
                  <span>Total Invoice Amount (INR):</span>
                  <span className="font-mono text-slate-900">{formatINR(selectedInvoice.grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Invoice Sign-off */}
            <div className="flex justify-between items-end pt-12 text-[10px]">
              <div>
                <p className="italic text-slate-500">Declaration: Goods once shipped cannot be returned.</p>
              </div>
              <div className="text-center w-56 border-t border-slate-400 pt-2">
                <p className="font-bold text-slate-800">For Manufactory CRM Industries</p>
                <p className="text-slate-500 mt-6">Authorized Signatory</p>
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Dispatch Sub tabs */}
          <div className="flex border border-slate-200 bg-slate-100 p-1 rounded-lg max-w-md">
            <button
              onClick={() => setActiveSubTab('invoices')}
              className={`flex-1 py-2 px-3 rounded text-xs font-bold transition-all
                ${activeSubTab === 'invoices' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-550 hover:text-slate-800'}
              `}
            >
              GST Tax Invoices
            </button>
            <button
              onClick={() => setActiveSubTab('dispatch')}
              className={`flex-1 py-2 px-3 rounded text-xs font-bold transition-all
                ${activeSubTab === 'dispatch' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-550 hover:text-slate-800'}
              `}
            >
              Dispatch Log (e-Way)
            </button>
            <button
              onClick={() => setActiveSubTab('collections')}
              className={`flex-1 py-2 px-3 rounded text-xs font-bold transition-all
                ${activeSubTab === 'collections' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-550 hover:text-slate-800'}
              `}
            >
              Collections (WhatsApp)
            </button>
          </div>

          {/* TAB 1: GST Tax Invoices */}
          {activeSubTab === 'invoices' && (
            <div className="glass-panel p-5 rounded-xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-brand-500" /> Active Tax Invoices
                </h4>
                <p className="text-[10px] text-slate-500">Click Row to view full GST printable invoice</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="pb-3">Invoice No</th>
                      <th className="pb-3">Buyer Name</th>
                      <th className="pb-3">Taxable Subtotal</th>
                      <th className="pb-3">Total GST (18%)</th>
                      <th className="pb-3">Grand Total</th>
                      <th className="pb-3">Payment Due Date</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {dispatchBilling.map(inv => (
                      <tr 
                        key={inv.id} 
                        onClick={() => setSelectedInvoice(inv)}
                        className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                      >
                        <td className="py-3 font-bold text-brand-600 font-mono">{inv.id}</td>
                        <td className="py-3 font-semibold text-slate-800">{inv.customerName}</td>
                        <td className="py-3 font-mono">{formatINR(inv.subtotal)}</td>
                        <td className="py-3 font-mono text-slate-500">{formatINR(inv.gstAmount)}</td>
                        <td className="py-3 font-bold font-mono text-emerald-700">{formatINR(inv.grandTotal)}</td>
                        <td className="py-3 font-mono">{inv.paymentDueDate}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded border
                            ${inv.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                            ${inv.paymentStatus === 'Unpaid' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                            ${inv.paymentStatus === 'Overdue' ? 'bg-rose-50 text-rose-700 border-rose-200' : ''}
                          `}>
                            {inv.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Dispatch Logistics & e-Way Logger */}
          {activeSubTab === 'dispatch' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Dispatch Register Ledger */}
              <div className="glass-panel p-5 rounded-xl lg:col-span-2 space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" /> Dispatch Cargo Tracking Register
                </h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                        <th className="pb-3">Invoice / Ref</th>
                        <th className="pb-3">Buyer Name</th>
                        <th className="pb-3">Transporter</th>
                        <th className="pb-3">Vehicle Number</th>
                        <th className="pb-3">e-Way Bill</th>
                        <th className="pb-3">Cargo Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {dispatchBilling.map(inv => (
                        <tr key={inv.id} className="hover:bg-slate-50/50">
                          <td className="py-3 font-bold text-brand-600 font-mono">{inv.id}</td>
                          <td className="py-3 font-bold text-slate-800">{inv.customerName}</td>
                          <td className="py-3 text-slate-700 font-semibold">{inv.transporter}</td>
                          <td className="py-3 font-mono font-bold text-slate-800">{inv.vehicleNo}</td>
                          <td className="py-3 font-mono font-bold text-slate-500">{inv.ewayBillNo}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded border
                              ${inv.dispatchStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                              ${inv.dispatchStatus === 'Shipped' ? 'bg-indigo-50 text-indigo-750 border-indigo-200 animate-pulse' : ''}
                              ${inv.dispatchStatus === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                            `}>
                              {inv.dispatchStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dispatch form panel */}
              <div className="glass-panel p-5 rounded-xl space-y-4 h-fit bg-white border border-slate-200">
                <div className="border-b border-slate-200 pb-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-brand-500" /> Log Dispatch & e-Invoice
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Prepares dispatch bill and logs cargo with NIC e-Way</p>
                </div>

                {!isEditable && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] p-3 rounded-lg flex items-start gap-2 mb-2 font-medium">
                    <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Access Constrained</span>: Your role ({userRole}) does not have permission to log cargo dispatch or raise new tax invoices. Please contact an Owner, Admin, or Accountant.
                    </div>
                  </div>
                )}

                <form onSubmit={handleCreateDispatch} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Select Completed Order *</label>
                    <select
                      required
                      disabled={!isEditable}
                      value={selectedOrderId}
                      onChange={(e) => handleOrderSelect(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded p-2 text-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-50 disabled:text-slate-400"
                    >
                      <option value="">-- Select Order --</option>
                      {orders.filter(o => o.status !== 'Completed').map(o => (
                        <option key={o.id} value={o.id}>{o.customerName} ({o.id} • {o.productionStage} • {formatINR(o.totalAmount)})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Buyer GSTIN *</label>
                    <input
                      type="text"
                      required
                      disabled={!isEditable}
                      placeholder="e.g. 27AAACT2910P1ZX"
                      value={inputGstin}
                      onChange={(e) => setInputGstin(e.target.value.toUpperCase())}
                      className="w-full bg-white border border-slate-200 rounded p-2 text-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500 uppercase font-mono font-bold disabled:bg-slate-50 disabled:text-slate-400"
                    />
                    {inputGstin && (
                      <div className="mt-1 flex items-center gap-1.5">
                        {isGstinValid ? (
                          <span className="text-[10px] text-emerald-650 font-bold flex items-center gap-0.5">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> ✓ Valid GSTIN Format
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> ✗ Invalid GSTIN format
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Transporter / Logistics Agency *</label>
                    <input
                      type="text"
                      required
                      disabled={!isEditable}
                      placeholder="e.g. V-Trans, SafeExpress"
                      value={transporter}
                      onChange={(e) => setTransporter(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded p-2 text-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block font-semibold text-slate-600">Vehicle Number *</label>
                      <input
                        type="text"
                        required
                        disabled={!isEditable}
                        placeholder="MH-12-QE-1022"
                        value={vehicleNo}
                        onChange={(e) => setVehicleNo(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded p-2 text-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-50 disabled:text-slate-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-semibold text-slate-600">e-Way Bill No {isEwayMandated && '*'}</label>
                      <input
                        type="text"
                        required={isEwayMandated}
                        disabled={!isEditable}
                        placeholder={isEwayMandated ? "Mandatory for > ₹50K" : "e.g. 121489028"}
                        value={ewayBillNo}
                        onChange={(e) => setEwayBillNo(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded p-2 text-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-50 disabled:text-slate-400"
                      />
                    </div>
                  </div>

                  {isEwayMandated && (
                    <div className="space-y-2">
                      <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg text-[11px] font-semibold space-y-1">
                        <div className="flex items-center gap-1.5 text-rose-700">
                          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                          <span>⚠️ Compliance Alert: Cargo value ({formatINR(selectedOrderObj.totalAmount)}) exceeds ₹50,000.</span>
                        </div>
                        <p className="text-slate-500 font-medium ml-5">Under GST CGST Rule 138, generating an e-Way Bill is legally mandated before dispatching this cargo.</p>
                      </div>

                      <label className="flex items-start gap-2 text-xs text-slate-650 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          disabled={!isEditable}
                          checked={nicEwayChecked}
                          onChange={(e) => setNicEwayChecked(e.target.checked)}
                          className="rounded mt-0.5 bg-white border-slate-200 text-brand-500 focus:ring-brand-500"
                        />
                        <span className="font-semibold text-[11px] text-slate-650 leading-tight">I acknowledge and authorize automated NIC API e-Way Bill generation for this consignment.</span>
                      </label>
                    </div>
                  )}

                  {(() => {
                    const isSubmitDisabled = !isEditable || !selectedOrderId || !transporter || !vehicleNo || !isGstinValid || (isEwayMandated && (!ewayBillNo || ewayBillNo.trim() === '' || !nicEwayChecked));
                    return (
                      <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className={`w-full py-2.5 font-bold rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-all
                          ${isSubmitDisabled 
                            ? 'bg-slate-200 border border-slate-300 text-slate-400 cursor-not-allowed' 
                            : 'bg-brand-600 hover:bg-brand-500 text-white cursor-pointer'
                          }
                        `}
                      >
                        {!isEditable ? (
                          <>
                            <AlertCircle className="w-4 h-4" /> Operations Locked
                          </>
                        ) : isEwayMandated && (!ewayBillNo || ewayBillNo.trim() === '' || !nicEwayChecked) ? (
                          <>
                            <AlertCircle className="w-4 h-4" /> e-Way Verification Required
                          </>
                        ) : !isGstinValid ? (
                          <>
                            <AlertCircle className="w-4 h-4" /> Fix GSTIN Format
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" /> Save Dispatch Cargo & Bill
                          </>
                        )}
                      </button>
                    );
                  })()}
                </form>
              </div>

            </div>
          )}

          {/* TAB 3: Outstanding Collections Tracker */}
          {activeSubTab === 'collections' && (
            <div className="glass-panel p-5 rounded-xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-brand-500" /> Payment & Collection Follow-ups
                </h4>
                <p className="text-[10px] text-slate-500">Speed up collections via pre-drafted WhatsApp reminder messages</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="pb-3">Invoice No</th>
                      <th className="pb-3">Customer (Buyer)</th>
                      <th className="pb-3">Invoice Total</th>
                      <th className="pb-3">Due Date</th>
                      <th className="pb-3">Payment Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {dispatchBilling.map(inv => {
                      const isOutstanding = inv.paymentStatus !== 'Paid';
                      return (
                        <tr key={inv.id} className="hover:bg-slate-50/50">
                          <td className="py-3 font-bold text-brand-600 font-mono">{inv.id}</td>
                          <td className="py-3 font-semibold text-slate-805">{inv.customerName}</td>
                          <td className="py-3 font-bold font-mono text-slate-805">{formatINR(inv.grandTotal)}</td>
                          <td className="py-3 font-mono">{inv.paymentDueDate}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded border
                              ${inv.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                              ${inv.paymentStatus === 'Unpaid' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                              ${inv.paymentStatus === 'Overdue' ? 'bg-rose-50 text-rose-700 border-rose-200' : ''}
                            `}>
                              {inv.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            {isOutstanding ? (
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => copyWhatsAppReminder(inv)}
                                  className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold rounded flex items-center gap-1 text-[10px] shadow-sm"
                                >
                                  <Share2 className="w-3 h-3" /> WhatsApp Template
                                </button>
                                <button
                                  disabled={!isEditable}
                                  onClick={() => onUpdateInvoiceStatus(inv.id, 'Paid')}
                                  className={`px-2.5 py-1 font-bold rounded text-[10px] shadow-sm transition-all
                                    ${!isEditable 
                                      ? 'bg-slate-150 text-slate-400 border border-slate-200 cursor-not-allowed' 
                                      : 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                                    }
                                  `}
                                >
                                  {!isEditable ? '🔒 Locked' : 'Mark Paid'}
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-emerald-600 font-bold flex justify-end items-center gap-0.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Fully Collected
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
