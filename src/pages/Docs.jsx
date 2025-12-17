// src/pages/Docs.jsx
import React from "react";

export default function Docs() {
  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      {/* Page Title */}
      <header className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-slate-900">Xceed – Product Overview & Client Guide</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          A complete data, dashboard, and automation solution for businesses of any size.
          No technical work required — our team builds, maintains, and supports everything for you.
        </p>
      </header>

      {/* What is Xceed */}
      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-semibold">What is Xceed?</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Xceed is an all-in-one business intelligence and analytics platform designed for companies
          that want professional dashboards, data management, and automated reporting — without hiring
          technical teams or building complex systems internally.
        </p>

        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
          <li>Beautiful dashboards for every department</li>
          <li>Automated reporting & data updates</li>
          <li>Centralised access to analytics, KPIs, and datasets</li>
          <li>Power BI, Excel, PDF, AI tools and interactive content — all embedded in one portal</li>
          <li>Your entire organisation gets a single data platform</li>
        </ul>
      </section>

      {/* Who is this for */}
      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-semibold">Who is Xceed For?</h2>
        <p className="text-sm text-slate-600">Perfect for companies that want:</p>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
          <li>Department-level dashboards (Finance, HR, Sales, Operations, Risk, Strategy...)</li>
          <li>Reliable and clean data without manual work</li>
          <li>Automation of routine reports and KPI updates</li>
          <li>Analytics that guide daily decision-making</li>
        </ul>
      </section>

      {/* Key Features */}
      <section className="card p-6 space-y-6">
        <h2 className="text-xl font-semibold">Key Features</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <div className="p-4 border rounded-lg space-y-2">
            <h3 className="font-semibold">Dashboard Management</h3>
            <p className="text-sm text-slate-600">
              Company dashboards built for your teams. You tell us what you need — we design, develop,
              maintain, and update them for you.
            </p>
          </div>

          <div className="p-4 border rounded-lg space-y-2">
            <h3 className="font-semibold">Data Management</h3>
            <p className="text-sm text-slate-600">
              We clean, structure, and manage your data. No spreadsheets, no manual updates,
              no technical skills required.
            </p>
          </div>

          <div className="p-4 border rounded-lg space-y-2">
            <h3 className="font-semibold">Automation & Reporting</h3>
            <p className="text-sm text-slate-600">
              Automatically deliver KPIs, dashboards, and reports to your teams with zero effort.
            </p>
          </div>

          <div className="p-4 border rounded-lg space-y-2">
            <h3 className="font-semibold">AI & Forecasting Tools</h3>
            <p className="text-sm text-slate-600">
              Optional AI forecasting, insights generation, and predictive models tailored to your business.
            </p>
          </div>

          <div className="p-4 border rounded-lg space-y-2">
            <h3 className="font-semibold">Power BI + Excel + PDF + Web Embedding</h3>
            <p className="text-sm text-slate-600">
              We integrate your existing dashboards, Excel files, Power BI, PDFs, workflows and more.
            </p>
          </div>

          <div className="p-4 border rounded-lg space-y-2">
            <h3 className="font-semibold">Secure Hosted Portal</h3>
            <p className="text-sm text-slate-600">
              Access everything from your secure Xceed portal — from any device, anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="card p-6 space-y-4 bg-gradient-to-r from-emerald-50 to-white">
        <h2 className="text-xl font-semibold">Pricing</h2>
        <p className="text-sm text-slate-600">
          Simple, transparent pricing. One-time payment, lifetime access.
        </p>

        <div className="text-3xl font-bold text-emerald-700">$29.98</div>

        <p className="text-sm text-slate-600">
          Includes dashboard development, data setup, portal configuration, and ongoing support.
        </p>

        <a
          href="mailto:hello-xceed@outlook.com?subject=Buy%20Xceed%20System%20-%20$29.98&body=Hi%2C%0A%0AI%20would%20like%20to%20purchase%20the%20Xceed%Analytics%20System%20for%20%2429.98.%20Please%20send%20me%20the%20next%20steps%20and%20payment%20details.%0A%0AOrganisation%3A%0AContact%20Number%3A%0A%0AThanks%2C"
             
          className="inline-flex items-center px-5 py-3 rounded-md bg-emerald-600 text-white font-semibold shadow hover:opacity-95"
        >
          Buy Now for $29.98
        </a>

        <p className="text-xs text-slate-500">
          *Custom enterprise solutions also available upon request.
        </p>
      </section>

      {/* How It Works */}
      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-semibold">How It Works</h2>
        <ol className="list-decimal pl-5 text-sm text-slate-600 space-y-2">
          <li>You purchase the product.</li>
          <li>We collect your requirements (dashboards, KPIs, data sources).</li>
          <li>Our team develops the full system for you.</li>
          <li>The portal is deployed with your branding and content.</li>
          <li>You get unlimited support — anytime.</li>
        </ol>
      </section>

      {/* Request Analytics or Development */}
      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-semibold">Request Custom Analytics</h2>
        <p className="text-sm text-slate-600">
          Need new dashboards, KPI systems, data pipelines, forecasting models, or automations?
          Our team can build anything your business requires.
        </p>

        <a
          href="mailto:hello-xceed@outlook.com?subject=Analytics%20or%20Dashboard%20Request"
          className="inline-flex items-center px-4 py-2 rounded-md border text-sm font-medium"
        >
          Request Development
        </a>
      </section>

      {/* Contact */}
      <section className="card p-6 text-center space-y-3">
        <h2 className="text-lg font-semibold">Need Help?</h2>
        <p className="text-sm text-slate-600">Our team is available 24/7 for support & onboarding.</p>

        <a
          href="mailto:hello-xceed@outlook.com"
          className="inline-flex items-center px-4 py-2 rounded-md bg-xceed-500 text-white font-medium"
        >
          Contact Support
        </a>
      </section>

    </div>
  );
}
