// src/data/products.js
const products = [
  {
    id: "xceed-analytics",
    name: "Xceed Analytics",
    short: "Dashboards & Data Management",
    tagline: "Empowering organisations with data, automation and AI.",
    description:
      "A ready-to-deploy analytics portal that includes dashboards, data manager, and automation connectors. We handle setup, dashboard build and onboarding — you manage decisions.",
    portalUrl: "/departments", // existing portal
    buyUrl:
      "mailto:hello-xceed@outlook.com?subject=Buy%20Xceed%20Analytics%20-%20$29.98&body=I%20want%20to%20purchase%20Xceed%20Analytics.",
    price: "$29.98",
    features: [
      "Pre-built dashboards (Power BI)",
      "Data manager (dataset explorer & manifest)",
      "Embedding & access management",
      "Initial onboarding & support"
    ]
  },

  {
    id: "xceed-insights",
    name: "Xceed Insights",
    short: "Advanced Reporting & Alerts",
    tagline: "Automated reporting, scheduled alerts and KPI monitoring.",
    description:
      "Xceed Insights provides advanced scheduled reporting, automated alerts and email distribution. Great for leadership and operational teams who need timely summaries.",
    portalUrl: "/products/xceed-insights", // future portal / placeholder route
    buyUrl:
      "mailto:hello-xceed@outlook.com?subject=Buy%20Xceed%20Insights&body=I%20want%20to%20purchase%20Xceed%20Insights.",
    price: "Custom",
    features: [
      "Scheduled PDF/Excel reports",
      "Email & Slack alerts",
      "KPI thresholds & anomaly detection"
    ]
  },

  {
    id: "xceed-automate",
    name: "Xceed Automate",
    short: "Workflow Automation",
    tagline: "Connect systems, automate manual tasks and save time.",
    description:
      "Xceed Automate helps you automate repetitive processes: ETL flows, approvals, notifications and integrations with cloud services.",
    portalUrl: "/products/xceed-automate",
    buyUrl:
      "mailto:hello-xceed@outlook.com?subject=Buy%20Xceed%20Automate&body=I%20want%20to%20purchase%20Xceed%20Automate.",
    price: "Custom",
    features: [
      "Pre-built connectors (OneDrive, SQL, APIs)",
      "Low-code workflow editor",
      "Monitoring & retry logic"
    ]
  }
];

export default products;
