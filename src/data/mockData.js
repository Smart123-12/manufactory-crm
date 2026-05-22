// Realistic Indian B2B Factory Database for Manufactory CRM

export const initialCustomers = [
  {
    id: "CUST-001",
    name: "Maruti OEM Parts Pvt Ltd",
    contactPerson: "Rajesh Yagnik",
    phone: "+91 98250 12345",
    email: "procurement@marutioem.com",
    city: "Gurugram",
    state: "Haryana",
    gstin: "06AACCM4110M1Z2",
    type: "OEM Tier-1",
    creditDays: 45,
    outstanding: 425000,
    status: "Active"
  },
  {
    id: "CUST-002",
    name: "Tata Projects Fabrication Div",
    contactPerson: "Amir Khan",
    phone: "+91 97110 56789",
    email: "akhan@tataprojects.co.in",
    city: "Pune",
    state: "Maharashtra",
    gstin: "27AAACT2910P1ZX",
    type: "Contractor",
    creditDays: 60,
    outstanding: 890000,
    status: "Active"
  },
  {
    id: "CUST-003",
    name: "Bharati PolyPack Ind",
    contactPerson: "Sanjay Patel",
    phone: "+91 94260 98765",
    email: "sanjay@bharatipolypack.com",
    city: "Halol",
    state: "Gujarat",
    gstin: "24AABCB1005Q1ZS",
    type: "Distributor",
    creditDays: 30,
    outstanding: 120000,
    status: "Active"
  },
  {
    id: "CUST-004",
    name: "Hinduja Engineering Ltd",
    contactPerson: "S. Raghavan",
    phone: "+91 80560 43210",
    email: "s.raghavan@hindujaeng.in",
    city: "Chennai",
    state: "Tamil Nadu",
    gstin: "33AAACH4923K2Z8",
    type: "OEM Tier-1",
    creditDays: 45,
    outstanding: 0,
    status: "Active"
  },
  {
    id: "CUST-005",
    name: "Vardhman Text Packagers",
    contactPerson: "Vikas Oswal",
    phone: "+91 98140 11223",
    email: "vikas@vardhmantext.com",
    city: "Ludhiana",
    state: "Punjab",
    gstin: "03AABCV8912E1ZU",
    type: "Distributor",
    creditDays: 30,
    outstanding: 285000,
    status: "Active"
  }
];

export const initialQuotations = [
  {
    id: "QT-2026-041",
    customerId: "CUST-001",
    customerName: "Maruti OEM Parts Pvt Ltd",
    date: "2026-05-18",
    items: [
      { desc: "M20 Structural Carbon Steel Bolts", qty: 5000, rate: 45, hsn: "7318" },
      { desc: "Custom Machined Steel Bush 45mm", qty: 1000, rate: 120, hsn: "8483" }
    ],
    gstRate: 18,
    discountPercent: 2,
    subtotal: 345000,
    gstAmount: 62100,
    grandTotal: 407100,
    validUntil: "2026-06-18",
    status: "Pending Approval"
  },
  {
    id: "QT-2026-042",
    customerId: "CUST-003",
    customerName: "Bharati PolyPack Ind",
    date: "2026-05-15",
    items: [
      { desc: "Heavy Duty Plastic Pallets (Blue)", qty: 300, rate: 850, hsn: "3923" }
    ],
    gstRate: 18,
    discountPercent: 5,
    subtotal: 242250,
    gstAmount: 43605,
    grandTotal: 285855,
    validUntil: "2026-06-15",
    status: "Approved"
  },
  {
    id: "QT-2026-043",
    customerId: "CUST-002",
    customerName: "Tata Projects Fabrication Div",
    date: "2026-05-10",
    items: [
      { desc: "Mild Steel Laser Cut Flanges", qty: 2500, rate: 210, hsn: "7307" }
    ],
    gstRate: 18,
    discountPercent: 0,
    subtotal: 525000,
    gstAmount: 94500,
    grandTotal: 619500,
    validUntil: "2026-06-10",
    status: "Converted to Order"
  }
];

export const initialOrders = [
  {
    id: "ORD-2026-090",
    customerId: "CUST-002",
    customerName: "Tata Projects Fabrication Div",
    quotationId: "QT-2026-043",
    orderDate: "2026-05-11",
    deliveryDueDate: "2026-05-28",
    items: [
      { desc: "Mild Steel Laser Cut Flanges", qty: 2500, rate: 210, hsn: "7307" }
    ],
    totalAmount: 619500,
    productionStage: "CNC Cutting",
    progress: 60,
    status: "Processing"
  },
  {
    id: "ORD-2026-091",
    customerId: "CUST-003",
    customerName: "Bharati PolyPack Ind",
    quotationId: "QT-2026-042",
    orderDate: "2026-05-16",
    deliveryDueDate: "2026-05-24",
    items: [
      { desc: "Heavy Duty Plastic Pallets (Blue)", qty: 300, rate: 850, hsn: "3923" }
    ],
    totalAmount: 285855,
    productionStage: "Packing & Inspection",
    progress: 95,
    status: "Processing"
  },
  {
    id: "ORD-2026-092",
    customerId: "CUST-005",
    customerName: "Vardhman Text Packagers",
    quotationId: "Manual",
    orderDate: "2026-05-02",
    deliveryDueDate: "2026-05-20",
    items: [
      { desc: "Double Wall Corrugated Cartons - Size X", qty: 10000, rate: 18, hsn: "4819" }
    ],
    totalAmount: 212400,
    productionStage: "Dispatched",
    progress: 100,
    status: "Completed"
  },
  {
    id: "ORD-2026-093",
    customerId: "CUST-001",
    customerName: "Maruti OEM Parts Pvt Ltd",
    quotationId: "None",
    orderDate: "2026-05-21",
    deliveryDueDate: "2026-06-10",
    items: [
      { desc: "OEM Fuel Valve Castings (Aluminum)", qty: 1500, rate: 195, hsn: "8409" }
    ],
    totalAmount: 345150,
    productionStage: "Molding Stage",
    progress: 15,
    status: "Pending"
  }
];

export const initialInventory = [
  // Raw Materials
  {
    id: "INV-RAW-001",
    name: "Mild Steel Sheet 2.5mm (Grade C)",
    category: "Raw Material",
    stock: 450,
    unit: "Sheets",
    minStock: 200,
    batch: "B-MS-99",
    location: "Bay 1 Rack A",
    barcode: "RAW88019910",
    lastUpdated: "2026-05-21"
  },
  {
    id: "INV-RAW-002",
    name: "HDPE Granules (Grade A55)",
    category: "Raw Material",
    stock: 120, // Low Stock Alert
    unit: "Bags (25kg)",
    minStock: 300,
    batch: "B-HD-04A",
    location: "Chemical Store Rm-2",
    barcode: "RAW88020412",
    lastUpdated: "2026-05-22"
  },
  {
    id: "INV-RAW-003",
    name: "MS Steel Coils 4.0mm width 1250",
    category: "Raw Material",
    stock: 12.5,
    unit: "Tons",
    minStock: 5.0,
    batch: "B-SC-12",
    location: "Coil Yard Ground",
    barcode: "RAW88031200",
    lastUpdated: "2026-05-20"
  },
  {
    id: "INV-RAW-004",
    name: "Corrugated Liner Paper Roll 150 GSM",
    category: "Raw Material",
    stock: 8,
    unit: "Rolls",
    minStock: 10, // Low Stock Alert
    batch: "B-LP-200",
    location: "Paper Godown",
    barcode: "RAW88042001",
    lastUpdated: "2026-05-19"
  },
  // Finished Goods
  {
    id: "INV-FIN-001",
    name: "M20 Structural Carbon Steel Bolts",
    category: "Finished Good",
    stock: 12000,
    unit: "Pieces",
    minStock: 3000,
    batch: "BF-ST-222",
    location: "FG Warehouse A2",
    barcode: "FIN99012220",
    lastUpdated: "2026-05-22"
  },
  {
    id: "INV-FIN-002",
    name: "Heavy Duty Plastic Pallets (Blue)",
    category: "Finished Good",
    stock: 45,
    unit: "Pieces",
    minStock: 50, // Low Stock Alert
    batch: "BF-PL-301",
    location: "FG Open Yard",
    barcode: "FIN99023011",
    lastUpdated: "2026-05-22"
  },
  {
    id: "INV-FIN-003",
    name: "Double Wall Corrugated Cartons - Size X",
    category: "Finished Good",
    stock: 25000,
    unit: "Pieces",
    minStock: 5000,
    batch: "BF-PA-402",
    location: "FG Paper Warehouse",
    barcode: "FIN99034020",
    lastUpdated: "2026-05-18"
  }
];

export const initialMachines = [
  {
    id: "MACH-01",
    name: "VMC-850 CNC Milling Center",
    type: "CNC Unit",
    operator: "Rajesh Kumar",
    status: "Running", // Running, Idle, Maintenance
    utilization: 88,
    temp: "42°C",
    lastMaintenance: "2026-05-01",
    todayRuntime: "6.8 hrs",
    efficiency: 92
  },
  {
    id: "MACH-02",
    name: "Laser Cutting Machine 4KW",
    type: "Fabrication",
    operator: "Sunil Sharma",
    status: "Running",
    utilization: 75,
    temp: "38°C",
    lastMaintenance: "2026-04-18",
    todayRuntime: "5.5 hrs",
    efficiency: 85
  },
  {
    id: "MACH-03",
    name: "Injection Molding Machine 150T",
    type: "Plastic Molding",
    operator: "Amit Patil",
    status: "Idle", // Idle state
    utilization: 62,
    temp: "190°C",
    lastMaintenance: "2026-05-15",
    todayRuntime: "4.0 hrs",
    efficiency: 78
  },
  {
    id: "MACH-04",
    name: "Corrugation Machine - Line A",
    type: "Packaging",
    operator: "Harpreet Singh",
    status: "Maintenance", // Downtime / Maintenance State
    utilization: 45,
    temp: "70°C",
    lastMaintenance: "2026-05-22",
    todayRuntime: "0.0 hrs",
    efficiency: 0
  }
];

export const initialWorkers = [
  { id: "WRK-001", name: "Rajesh Kumar", role: "CNC Lead Operator", shift: "Shift A (8 AM - 4 PM)", attendance: "Present", activeMachine: "MACH-01", efficiency: 94 },
  { id: "WRK-002", name: "Sunil Sharma", role: "Laser Technician", shift: "Shift A (8 AM - 4 PM)", attendance: "Present", activeMachine: "MACH-02", efficiency: 88 },
  { id: "WRK-003", name: "Amit Patil", role: "Molding Specialist", shift: "Shift A (8 AM - 4 PM)", attendance: "Present", activeMachine: "MACH-03", efficiency: 82 },
  { id: "WRK-004", name: "Harpreet Singh", role: "Packaging Operator", shift: "Shift A (8 AM - 4 PM)", attendance: "Present", activeMachine: "MACH-04", efficiency: 0 },
  { id: "WRK-005", name: "Vikram Rathore", role: "Junior Fabricator", shift: "Shift B (4 PM - 12 AM)", attendance: "Present", activeMachine: "MACH-02", efficiency: 86 },
  { id: "WRK-006", name: "Suresh Gupta", role: "Maintenance Engineer", shift: "General Shift", attendance: "Present", activeMachine: "None", efficiency: 90 }
];

export const initialProductionLogs = [
  {
    id: "PLOG-801",
    date: "2026-05-22",
    machineId: "MACH-01",
    machineName: "VMC-850 CNC Milling Center",
    operator: "Rajesh Kumar",
    outputQty: 85,
    unit: "Bolts",
    wastageQty: 3.2,
    wastagePercent: 3.7,
    downtimeMinutes: 15,
    downtimeReason: "Tool Changeover",
    status: "Verified"
  },
  {
    id: "PLOG-802",
    date: "2026-05-22",
    machineId: "MACH-02",
    machineName: "Laser Cutting Machine 4KW",
    operator: "Sunil Sharma",
    outputQty: 410,
    unit: "Flanges",
    wastageQty: 18.5,
    wastagePercent: 4.5,
    downtimeMinutes: 30,
    downtimeReason: "Nozzle Cleaning",
    status: "Verified"
  },
  {
    id: "PLOG-803",
    date: "2026-05-22",
    machineId: "MACH-03",
    machineName: "Injection Molding Machine 150T",
    operator: "Amit Patil",
    outputQty: 120,
    unit: "Pallets",
    wastageQty: 2.1,
    wastagePercent: 1.7,
    downtimeMinutes: 45,
    downtimeReason: "Material Loading Jam",
    status: "Under Review"
  }
];

export const initialDispatchBilling = [
  {
    id: "INV-2026-701",
    orderId: "ORD-2026-092",
    customerName: "Vardhman Text Packagers",
    date: "2026-05-20",
    subtotal: 180000,
    gstAmount: 32400,
    grandTotal: 212400,
    gstin: "03AABCV8912E1ZU",
    transporter: "TCI Express",
    vehicleNo: "PB-10-DF-4892",
    ewayBillNo: "121489023412",
    dispatchStatus: "Shipped", // Pending, Shipped, Delivered
    paymentStatus: "Paid", // Paid, Partial, Overdue, Unpaid
    paymentDueDate: "2026-06-19"
  },
  {
    id: "INV-2026-702",
    orderId: "ORD-2026-091",
    customerName: "Bharati PolyPack Ind",
    date: "2026-05-22",
    subtotal: 242250,
    gstAmount: 43605,
    grandTotal: 285855,
    gstin: "24AABCB1005Q1ZS",
    transporter: "V-Trans Log",
    vehicleNo: "GJ-17-U-8930",
    ewayBillNo: "121489028830",
    dispatchStatus: "Shipped",
    paymentStatus: "Unpaid",
    paymentDueDate: "2026-06-22"
  },
  {
    id: "INV-2026-703",
    orderId: "ORD-2026-090",
    customerName: "Tata Projects Fabrication Div",
    date: "2026-05-22",
    subtotal: 525000,
    gstAmount: 94500,
    grandTotal: 619500,
    gstin: "27AAACT2910P1ZX",
    transporter: "SafeExpress",
    vehicleNo: "MH-12-QE-1022",
    ewayBillNo: "Pending",
    dispatchStatus: "Pending",
    paymentStatus: "Unpaid",
    paymentDueDate: "2026-07-21"
  }
];

// Operational metrics over current financial year for Indian SME dashboard graphs
export const monthlyRevenue = [
  { name: "Dec 25", Revenue: 2450000, Production: 2100000, Target: 2200000 },
  { name: "Jan 26", Revenue: 2890000, Production: 2400000, Target: 2500000 },
  { name: "Feb 26", Revenue: 3120000, Production: 2850000, Target: 2800000 },
  { name: "Mar 26", Revenue: 4250000, Production: 3900000, Target: 3500000 },
  { name: "Apr 26", Revenue: 3580000, Production: 3100000, Target: 3200000 },
  { name: "May 26", Revenue: 3950000, Production: 3450000, Target: 3400000 }
];

export const productProfitability = [
  { item: "M20 Carbon Steel Bolts", materialCost: 15.5, laborPowerCost: 8.2, wholesalePrice: 45.0, profitMargin: 47.3 },
  { item: "Heavy Duty Plastic Pallets", materialCost: 380.0, laborPowerCost: 120.0, wholesalePrice: 850.0, profitMargin: 41.1 },
  { item: "Laser Cut Flanges (Mild Steel)", materialCost: 78.0, laborPowerCost: 35.0, wholesalePrice: 210.0, profitMargin: 46.2 },
  { item: "Double Wall Corrugated Cartons", materialCost: 7.2, laborPowerCost: 3.4, wholesalePrice: 18.0, profitMargin: 41.1 }
];
