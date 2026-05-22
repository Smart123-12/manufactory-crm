import React, { useState } from 'react';
import { 
  Sparkles, MessageSquare, ArrowRight, ShieldCheck, CheckCircle2, 
  BarChart3, Boxes, Target, Truck, Users, Settings, Lock, HelpCircle 
} from 'lucide-react';

export default function LandingPage({ onLogin }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Owner');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const rolesList = [
    { name: 'Owner', desc: 'Full strategic access to financial ledgers, live production outputs and outstanding reports.' },
    { name: 'Admin', desc: 'Operational permissions to modify settings, shift models and manage plant operators.' },
    { name: 'Sales Team', desc: 'Access constrained strictly to CRM pipelines, RFQ registers, and GST quotation builders.' },
    { name: 'Store Manager', desc: 'Direct access to raw materials registries, safety thresholds, and vendor purchase logs.' },
    { name: 'Production Supervisor', desc: 'Confined to live shop floor machine telemetry, operator duty matrices and downtime loggers.' },
    { name: 'Accountant', desc: 'Access to GST tax invoices, billing registers, transporter details and payment accounts.' },
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactMsg('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-brand-500 selection:text-white">
      
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
            <Sparkles className="w-5 h-5 animate-pulse-subtle" />
          </div>
          <span className="font-extrabold text-slate-800 tracking-wider text-base">
            Manufactory <span className="text-brand-600 font-semibold">CRM</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-500">
          <a href="#features" className="hover:text-slate-800 transition-colors">Features</a>
          <a href="#why-us" className="hover:text-slate-800 transition-colors">Why Manufactory</a>
          <a href="#testimonials" className="hover:text-slate-800 transition-colors">Testimonials</a>
          <a href="#pricing" className="hover:text-slate-800 transition-colors">Pricing</a>
          <a href="#contact" className="hover:text-slate-800 transition-colors">Contact</a>
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setSelectedRole('Owner');
              onLogin('Owner');
            }}
            className="hidden sm:inline-block px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold rounded-lg text-xs"
          >
            Quick Guest Tour
          </button>
          <button 
            onClick={() => setShowLoginModal(true)}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg text-xs shadow-md shadow-brand-100 flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" /> Sign In
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-20 pb-16 px-6 max-w-7xl mx-auto text-center space-y-6">
        <span className="px-3 py-1 bg-brand-50 text-brand-700 font-extrabold text-[10px] uppercase tracking-widest rounded-full border border-brand-100">
          🇮🇳 Built specifically for Indian SME Factories
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Simple Factory Management Software for Indian SMEs
        </h1>
        <p className="text-base sm:text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
          Manage sales, inventory, production, and dispatch from one dashboard. Replace chaotic Excel trackers and scattered WhatsApp groups.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <button
            onClick={() => setShowLoginModal(true)}
            className="w-full sm:w-auto px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-200/50"
          >
            Start Operations Tour
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="https://wa.me/919825012345"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-200/40"
          >
            <MessageSquare className="w-4 h-4" />
            Book Free Demo (WhatsApp)
          </a>
        </div>

        {/* Floating Feature Badges */}
        <div className="pt-10 grid grid-cols-2 md:grid-cols-6 gap-3 max-w-5xl mx-auto text-xs font-bold text-slate-650">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 justify-center">
            <Target className="w-4 h-4 text-brand-600" /> CRM & RFQ
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 justify-center">
            <Boxes className="w-4 h-4 text-brand-600" /> Stock Control
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 justify-center">
            <BarChart3 className="w-4 h-4 text-brand-600" /> Production OEE
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 justify-center">
            <Truck className="w-4 h-4 text-brand-600" /> Faster Dispatch
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 justify-center">
            <Users className="w-4 h-4 text-brand-600" /> Worker Shifts
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 justify-center">
            <ShieldCheck className="w-4 h-4 text-brand-600" /> GST Billing
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE DASHBOARD PREVIEW */}
      <section className="px-6 py-6 max-w-6xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-slate-900/0 transition-all duration-300 z-10 flex items-center justify-center">
            <button
              onClick={() => {
                setSelectedRole('Owner');
                onLogin('Owner');
              }}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-2xl scale-100 group-hover:scale-105 transition-all z-20"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Enter Live CRM Dashboard Tour
            </button>
          </div>
          
          {/* Static dashboard preview mockup */}
          <div className="opacity-40 select-none blur-[1px] pointer-events-none space-y-6 text-xs">
            <div className="flex justify-between items-center border-b pb-3">
              <span className="font-extrabold text-slate-800 text-sm">Dashboard Overview</span>
              <div className="flex gap-2">
                <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                <span className="w-3 h-3 bg-green-400 rounded-full"></span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Today Production</p>
                <p className="text-xl font-bold text-slate-800 mt-1">680 Units</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Low Stock Alerts</p>
                <p className="text-xl font-bold text-rose-600 mt-1">3 SKUs</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Pending Orders</p>
                <p className="text-xl font-bold text-slate-800 mt-1">12 Orders</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Payments Due</p>
                <p className="text-xl font-bold text-slate-800 mt-1">₹17.2L</p>
              </div>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border text-center font-bold text-slate-400">
              [ Live Production telemetries and Recharts graphs are active inside the platform ]
            </div>
          </div>
        </div>
      </section>

      {/* 4. LANDING PAGE FEATURES SECTION */}
      <section id="features" className="bg-white border-y border-slate-200 py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Designed to Eliminate Industrial Chaos
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-bold max-w-xl mx-auto">
              SMEs need speed and usability, not bloated SAP modules. That's why Manufactory CRM keeps workflows ultra-focused.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 font-bold">
                01
              </div>
              <h3 className="font-extrabold text-slate-800 text-sm">Reduce Operational Chaos</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Ditch the handwritten registers and sticky notes. Align your sales, inventory, and packaging departments on a unified live workspace.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 font-bold">
                02
              </div>
              <h3 className="font-extrabold text-slate-800 text-sm">Replace Scattered Excel Sheets</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Keep stock counts, tax bills, and client outstanding lists synced in real time. Avoid double entries or out-of-date records.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 font-bold">
                03
              </div>
              <h3 className="font-extrabold text-slate-800 text-sm">100% Production Visibility</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Track CNC and molding machine status, log daily worker outputs, calculate scrap percentages, and reduce idle downtime immediately.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 font-bold">
                04
              </div>
              <h3 className="font-extrabold text-slate-800 text-sm">Better Stock Control</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Trigger warning notifications the moment raw materials hit safety reorder marks. Avoid plant shutdowns due to material shortages.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 font-bold">
                05
              </div>
              <h3 className="font-extrabold text-slate-800 text-sm">Faster Transporter Dispatch</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Generate GST compliance invoices and e-Way bills in seconds. Automatically coordinate shipping details with truck dispatch logs.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 font-bold">
                06
              </div>
              <h3 className="font-extrabold text-slate-800 text-sm">Less Staff Dependency</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Standardize shift patterns, operator duties, and invoice tracking templates so the factory operates efficiently even when supervisors are off-site.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY FACTORIES NEED THIS SECTION (TABLE COMPARISON) */}
      <section id="why-us" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Excel + WhatsApp vs Manufactory CRM
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-bold max-w-xl mx-auto">
              How Manufactory CRM compares to the standard manual tools used in Indian SME units.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl text-xs font-medium">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold">
                  <th className="p-4 sm:p-5">Feature Module</th>
                  <th className="p-4 sm:p-5 text-red-650 bg-red-50/30">Excel + WhatsApp</th>
                  <th className="p-4 sm:p-5 text-brand-700 bg-brand-50/30">Manufactory CRM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-800">RFQ & B2B Quotes</td>
                  <td className="p-4 sm:p-5 text-red-600">Scattered PDFs, missed dealer follow-ups.</td>
                  <td className="p-4 sm:p-5 text-emerald-650 font-bold">Auto GST breakdown, 1-click order conversion.</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-800">Inventory Registry</td>
                  <td className="p-4 sm:p-5 text-red-650">Manual stock counting, critical shortage stops.</td>
                  <td className="p-4 sm:p-5 text-emerald-650 font-bold">Automatic safety reorder alerts, barcode-ready.</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-800">Shop Floor Visibility</td>
                  <td className="p-4 sm:p-5 text-red-650">Operator phone calls, unknown wastage levels.</td>
                  <td className="p-4 sm:p-5 text-emerald-650 font-bold">Live machine efficiency dashboards and scrap logs.</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-800">Transporter Cargo</td>
                  <td className="p-4 sm:p-5 text-red-650">e-Way billing delays, manual truck logs.</td>
                  <td className="p-4 sm:p-5 text-emerald-650 font-bold">GST tax e-invoice integration with auto vehicle codes.</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-800">Outstanding Payments</td>
                  <td className="p-4 sm:p-5 text-red-650">Owner manually checking Bank / Tally ledger.</td>
                  <td className="p-4 sm:p-5 text-emerald-650 font-bold">Dynamic buyer credit tracking and WhatsApp reminders.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section id="testimonials" className="bg-slate-100 py-20 px-6 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Trusted by B2B SME Factory Owners
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-bold">
              Real feedback from sheet metal, molding, and packing suppliers across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex text-amber-400 gap-0.5">★ ★ ★ ★ ★</div>
              <p className="text-slate-500 italic leading-relaxed font-medium">
                "We operate 8 CNC units in Pune MIDC. Keeping track of raw metal coils and operator downtime was a nightmare in Excel. Manufactory CRM has streamlined our shifts and given us live wastage visibility."
              </p>
              <div>
                <span className="font-extrabold text-slate-800 block">Amit Deshmukh</span>
                <span className="text-[10px] text-slate-400 block font-bold">Deshmukh CNC Components, Pune</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex text-amber-400 gap-0.5">★ ★ ★ ★ ★</div>
              <p className="text-slate-500 italic leading-relaxed font-medium">
                "Our injection molding lines process wholesale packaging orders. Auto safety stock reorder warnings have ensured our polymer bags are always in stock. Outstanding credit collection is much faster now."
              </p>
              <div>
                <span className="font-extrabold text-slate-800 block">Sanjay Patel</span>
                <span className="text-[10px] text-slate-400 block font-bold">Patel PolyPack Industries, Halol</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex text-amber-400 gap-0.5">★ ★ ★ ★ ★</div>
              <p className="text-slate-500 italic leading-relaxed font-medium">
                "Replacing Excel was our top goal. Our supervisor and store manager learned this dashboard within 15 minutes. Sign-off dispatch challans and invoice PDFs generate instantly."
              </p>
              <div>
                <span className="font-extrabold text-slate-800 block">Vikas Oswal</span>
                <span className="text-[10px] text-slate-400 block font-bold">Oswal Paper Box Packaging, Ludhiana</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRICING PLACEHOLDER SECTION */}
      <section id="pricing" className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Simple, Transparent Pricing for Indian Factories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-bold">
            No heavy setup costs or complex implementation fees. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          
          {/* Plan 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Starter Plan</span>
              <h4 className="text-lg font-extrabold text-slate-800 mt-1">₹4,999<span className="text-xs font-normal text-slate-400">/month</span></h4>
              <p className="text-[10px] text-slate-400 mt-1">Best for small workshop units</p>
            </div>
            <ul className="space-y-2 border-t pt-4 text-slate-500 leading-relaxed font-medium">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand-600" /> Up to 3 user logins</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand-600" /> CRM & B2B Quotations</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand-600" /> Raw Materials Inventory</li>
              <li className="flex items-center gap-1.5 text-slate-300"><CheckCircle2 className="w-3.5 h-3.5" /> Twilio WhatsApp alerts</li>
            </ul>
            <button onClick={() => setShowLoginModal(true)} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg mt-4">
              Get Started
            </button>
          </div>

          {/* Plan 2 */}
          <div className="bg-white p-6 rounded-2xl border-2 border-brand-500 shadow-md space-y-4 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-brand-500 text-white font-extrabold text-[9px] uppercase tracking-widest rounded-full">
              Most Popular
            </span>
            <div>
              <span className="text-[10px] uppercase font-bold text-brand-600 tracking-wider">Professional Plan</span>
              <h4 className="text-lg font-extrabold text-slate-800 mt-1">₹9,999<span className="text-xs font-normal text-slate-400">/month</span></h4>
              <p className="text-[10px] text-slate-400 mt-1">Best for medium MIDC units</p>
            </div>
            <ul className="space-y-2 border-t pt-4 text-slate-550 leading-relaxed font-medium">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand-600" /> Up to 10 user roles</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand-600" /> Full CRM + Active Orders</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand-600" /> Machine status & operator runs</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand-600" /> WhatsApp alerts (Twilio API)</li>
            </ul>
            <button onClick={() => setShowLoginModal(true)} className="w-full py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg mt-4 shadow-md shadow-brand-100">
              Start Operational Tour
            </button>
          </div>

          {/* Plan 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Enterprise Plan</span>
              <h4 className="text-lg font-extrabold text-slate-800 mt-1">Custom<span className="text-xs font-normal text-slate-400"> Pricing</span></h4>
              <p className="text-[10px] text-slate-400 mt-1">For multi-facility enterprises</p>
            </div>
            <ul className="space-y-2 border-t pt-4 text-slate-500 leading-relaxed font-medium">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand-600" /> Unlimited logins & multi-factory</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand-600" /> Dedicated database hosting</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand-600" /> API ERP accounting integrations</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand-600" /> 24/7 dedicated support representative</li>
            </ul>
            <a href="mailto:support@manufactorycrm.com" className="block text-center w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg mt-4">
              Contact Sales
            </a>
          </div>

        </div>
      </section>

      {/* 8. CONTACT FORM & WHATSAPP CTA SECTION */}
      <section id="contact" className="bg-white border-t border-slate-200 py-20 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          
          <div className="space-y-5 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Get in touch</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">Request a Call Back</h3>
              <p className="text-slate-500 mt-1 font-medium">Have questions about setting up raw materials, shift profiles or dispatch templates? Drop your details below.</p>
            </div>
            
            <div className="space-y-3 font-semibold text-slate-650">
              <p className="flex items-center gap-2">📞 +91 98250 12345</p>
              <p className="flex items-center gap-2">📧 support@manufactorycrm.com</p>
              <p className="flex items-center gap-2">📍 Factory Gate 3, MIDC Industrial Area, Pune</p>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/919825012345"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md"
              >
                <MessageSquare className="w-4.5 h-4.5" />
                Chat with an Expert on WhatsApp
              </a>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner">
            <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block text-slate-550 font-bold">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500" 
                  placeholder="Rajesh Kumar"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-550 font-bold">Factory / Business Email</label>
                <input 
                  type="email" 
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500" 
                  placeholder="rajesh@firm.com"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-550 font-bold">Message / Inquiry Details</label>
                <textarea 
                  required
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  rows="3"
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500" 
                  placeholder="Spares CNC machine components batch tracking inquiry..."
                ></textarea>
              </div>

              {formSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-250 p-2.5 rounded text-emerald-700 font-bold text-center">
                  Inquiry sent! We will reach out within 2 hours.
                </div>
              ) : (
                <button 
                  type="submit"
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg"
                >
                  Send Inquiry
                </button>
              )}
            </form>
          </div>

        </div>
      </section>

      {/* 9. FOOTER SECTION */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-6 border-t border-slate-800 text-xs font-medium text-center space-y-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-800 rounded text-slate-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-slate-200 tracking-wider text-xs">
              Manufactory <span className="text-brand-400 font-semibold">CRM</span>
            </span>
          </div>
          
          <p className="text-slate-500">© 2026 Manufactory CRM Industries. All rights reserved.</p>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* ROLE SELECTION LOGIN MODAL                                */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-brand-600" />
                SME Role Selection Portal
              </span>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="text-slate-400 hover:text-slate-650 font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-xs">
              <div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  Manufactory CRM supports strict role-based access. Select an operational role below to experience the system dynamically filtered for that job scope:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {rolesList.map((role) => (
                  <button
                    key={role.name}
                    onClick={() => setSelectedRole(role.name)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-0.5
                      ${selectedRole === role.name 
                        ? 'bg-brand-50 border-brand-200 text-brand-800 ring-2 ring-brand-500/10' 
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                  >
                    <span className="font-bold text-xs">{role.name}</span>
                    <span className="text-[9px] text-slate-450 leading-normal line-clamp-2">{role.desc}</span>
                  </button>
                ))}
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[10px] text-slate-500">
                <span className="font-bold block text-slate-700 mb-0.5">Selected: {selectedRole} Account</span>
                {rolesList.find(r => r.name === selectedRole)?.desc}
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onLogin(selectedRole);
                    setShowLoginModal(false);
                  }}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg shadow-md shadow-brand-100"
                >
                  Enter Product Tour as {selectedRole}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
