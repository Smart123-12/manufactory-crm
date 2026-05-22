import React, { useState } from 'react';
import { 
  Plus, Search, AlertTriangle, Printer, ArrowDownToLine, Tag, Filter, CheckCircle2 
} from 'lucide-react';

export default function Inventory({ inventory, onAddStock, onAdjustStock }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All'); // All, Raw Material, Finished Good
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  
  // New stock item fields
  const [newStock, setNewStock] = useState({
    name: '', category: 'Raw Material', stock: 0, unit: 'Pieces', minStock: 10, batch: 'B-NEW-01', location: 'Warehouse A1', barcode: ''
  });

  // Adjust stock fields
  const [purchaseQty, setPurchaseQty] = useState(0);

  // Filters
  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.barcode.includes(searchTerm) ||
                          item.batch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const lowStockCount = inventory.filter(item => item.stock <= item.minStock).length;

  const handleAddNewItem = (e) => {
    e.preventDefault();
    if (!newStock.name) return;
    
    // Generate barcode if empty
    const generatedBarcode = newStock.barcode || `BAR${Math.floor(10000000 + Math.random() * 90000000)}`;
    const fullItem = {
      id: `INV-${newStock.category === 'Raw Material' ? 'RAW' : 'FIN'}-0${inventory.length + 1}`,
      lastUpdated: new Date().toISOString().split('T')[0],
      ...newStock,
      stock: parseFloat(newStock.stock) || 0,
      minStock: parseFloat(newStock.minStock) || 10,
      barcode: generatedBarcode
    };

    onAddStock(fullItem);
    setNewStock({ name: '', category: 'Raw Material', stock: 0, unit: 'Pieces', minStock: 10, batch: 'B-NEW-01', location: 'Warehouse A1', barcode: '' });
    setShowPurchaseModal(false);
    alert(`Added SKU ${fullItem.id} to inventory catalog.`);
  };

  const handleRecordPurchase = (e) => {
    e.preventDefault();
    if (!selectedItemId || purchaseQty <= 0) {
      alert('Please select an item and enter a valid quantity.');
      return;
    }
    onAdjustStock(selectedItemId, parseFloat(purchaseQty));
    setSelectedItemId('');
    setPurchaseQty(0);
    alert('Stock updated successfully!');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. KPI Top Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Inventory SKUs</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{inventory.length}</h3>
          <p className="text-[10px] text-slate-500">Catalog items registered</p>
        </div>
        <div className="glass-panel p-4 rounded-xl">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Raw Material Items</p>
          <h3 className="text-2xl font-bold text-brand-600 mt-1">
            {inventory.filter(i => i.category === 'Raw Material').length}
          </h3>
          <p className="text-[10px] text-slate-500">Main stock input piles</p>
        </div>
        <div className="glass-panel p-4 rounded-xl">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Finished Goods SKUs</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">
            {inventory.filter(i => i.category === 'Finished Good').length}
          </h3>
          <p className="text-[10px] text-slate-500">Ready for dispatch</p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-rose-200 bg-rose-50">
          <p className="text-xs text-rose-600 font-bold uppercase tracking-wider">Critical Low Stock</p>
          <h3 className="text-2xl font-bold text-rose-700 mt-1">{lowStockCount}</h3>
          <p className="text-[10px] text-rose-500 flex items-center gap-1 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Reorder ASAP
          </p>
        </div>
      </div>

      {/* 2. Operations & Filter Hub */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Left Category Toggle */}
        <div className="flex bg-slate-100 border border-slate-200/80 p-1 rounded-lg w-full md:w-auto text-xs">
          {['All', 'Raw Material', 'Finished Good'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded font-bold transition-all
                ${activeCategory === cat ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}
              `}
            >
              {cat}s
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, barcode, batch..." 
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-700 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-medium"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => setShowPurchaseModal(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white rounded-lg shadow-md"
          >
            <Plus className="w-4 h-4" /> Add Catalog SKU
          </button>
        </div>

      </div>

      {/* 3. On-Page Stock Purchase Log Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Table Panel */}
        <div className="glass-panel p-5 rounded-xl lg:col-span-2 space-y-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Stock Register Ledger
          </h4>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="pb-3">SKU / Item</th>
                  <th className="pb-3">Batch & Loc</th>
                  <th className="pb-3">Current Stock</th>
                  <th className="pb-3">Reorder Point</th>
                  <th className="pb-3">Barcode</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {filteredItems.map(item => {
                  const isLow = item.stock <= item.minStock;
                  return (
                    <tr key={item.id} className={`hover:bg-slate-50/50 ${isLow ? 'bg-rose-50/20' : ''}`}>
                      <td className="py-3 pr-2">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800">{item.name}</p>
                          <span className={`px-1.5 py-0.2 text-[8px] font-bold uppercase tracking-widest rounded border
                            ${item.category === 'Raw Material' ? 'bg-brand-50 text-brand-700 border-brand-200' : 'bg-emerald-50 text-emerald-750 border-emerald-200'}
                          `}>
                            {item.category}
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <p className="font-semibold text-slate-700">{item.batch}</p>
                        <p className="text-[10px] text-slate-400">{item.location}</p>
                      </td>
                      <td className="py-3">
                        <span className={`font-extrabold font-mono text-sm block
                          ${isLow ? 'text-rose-600' : 'text-slate-800'}
                        `}>
                          {item.stock} <span className="text-xs font-normal text-slate-500">{item.unit}</span>
                        </span>
                        {isLow && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.2 rounded mt-0.5 border border-rose-200">
                            <AlertTriangle className="w-2.5 h-2.5 text-rose-500" /> Low Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3 font-semibold font-mono text-slate-500">
                        {item.minStock} {item.unit}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <Tag className="w-3 h-3 text-slate-400" />
                          <span className="font-mono text-slate-500">{item.barcode}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => alert(`Printing Barcode sticker for ${item.name} (${item.barcode})`)}
                            className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 rounded"
                            title="Print Barcode Label"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedItemId(item.id);
                              setPurchaseQty(100);
                            }}
                            className="p-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded font-bold text-[10px] flex items-center gap-0.5 shadow-sm"
                          >
                            <ArrowDownToLine className="w-3.5 h-3.5" /> Log PO
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Form Panel: Rapid Stock Purchase Receipt Log */}
        <div className="glass-panel p-5 rounded-xl space-y-4 h-fit">
          <div className="border-b border-slate-150 pb-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <ArrowDownToLine className="w-4 h-4 text-brand-500" /> Stock Purchase Entry
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Increases catalog inventory count instantly</p>
          </div>

          <form onSubmit={handleRecordPurchase} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Select Catalog SKU *</label>
              <select
                required
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded p-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">-- Choose Stock SKU --</option>
                {inventory.map(item => (
                  <option key={item.id} value={item.id}>{item.name} ({item.stock} in stock)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Purchase / Inward Qty *</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="0.1"
                  step="any"
                  value={purchaseQty}
                  onChange={(e) => setPurchaseQty(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded p-2 pr-16 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. 500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                  {selectedItemId ? inventory.find(i => i.id === selectedItemId)?.unit : 'units'}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-150 space-y-1.5">
              <h5 className="font-bold text-slate-600 text-[10px]">Purchase Terms:</h5>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Recording an inward delivery updates stock levels, resets alerts, and registers under the active system audit trace automatically.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg shadow-md flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Add Received Stock
            </button>
          </form>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 4. NEW STOCK CATALOG REGISTRATION MODAL */}
      {showPurchaseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-800">Register New SKU in Catalog</span>
              <button 
                onClick={() => setShowPurchaseModal(false)}
                className="text-slate-400 hover:text-slate-650 font-bold"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddNewItem} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-slate-600 font-semibold">SKU Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Mild Steel Sheet 3mm"
                  value={newStock.name}
                  onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-600 font-semibold">Stock Classification</label>
                  <select
                    value={newStock.category}
                    onChange={(e) => setNewStock({ ...newStock, category: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Raw Material">Raw Material</option>
                    <option value="Finished Good">Finished Good</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-600 font-semibold">Measurement Unit</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Sheets, Bags, Tons, Pieces"
                    value={newStock.unit}
                    onChange={(e) => setNewStock({ ...newStock, unit: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-600 font-semibold">Starting Stock Quantity</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 100"
                    value={newStock.stock}
                    onChange={(e) => setNewStock({ ...newStock, stock: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-600 font-semibold">Minimum Safety Stock Level</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 20"
                    value={newStock.minStock}
                    onChange={(e) => setNewStock({ ...newStock, minStock: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-600 font-semibold">Starting Batch Number</label>
                  <input 
                    type="text" 
                    placeholder="B-MS-101"
                    value={newStock.batch}
                    onChange={(e) => setNewStock({ ...newStock, batch: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-600 font-semibold">Storage Location</label>
                  <input 
                    type="text" 
                    placeholder="Bay 3 Rack B"
                    value={newStock.location}
                    onChange={(e) => setNewStock({ ...newStock, location: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-600 font-semibold">Barcode String (Optional - Autogenerated if blank)</label>
                <input 
                  type="text" 
                  placeholder="e.g. RAW9901"
                  value={newStock.barcode}
                  onChange={(e) => setNewStock({ ...newStock, barcode: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPurchaseModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg shadow-md"
                >
                  Register SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
