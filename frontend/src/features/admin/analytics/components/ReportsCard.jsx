import React from "react";
import { FileText, Download, Printer, Share2 } from "lucide-react";

export default function ReportsCard({
  onExportCSV,
  onExportPDF,
  onPrint,
  onShare,
}) {
  const reports = [
    {
      label: "Download CSV Report",
      icon: Download,
      onClick: onExportCSV,
      desc: "Raw data for Excel/Sheets",
    },
    {
      label: "Download PDF Report",
      icon: FileText,
      onClick: onExportPDF,
      desc: "Formatted summary report",
    },
    {
      label: "Print Dashboard",
      icon: Printer,
      onClick: onPrint,
      desc: "Print friendly layout",
    },
    {
      label: "Share Dashboard",
      icon: Share2,
      onClick: onShare,
      desc: "Generate shareable link",
    },
  ];

  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-sm dark:shadow-lg h-full flex flex-col">

      <div className="mb-4">
        <h3 className="text-lg font-bold text-foreground">Reports & Export</h3>
        <p className="text-sm text-muted-foreground">Generate analytics reports</p>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-3">
        {reports.map((report, idx) => (
          <button
            key={idx}
            onClick={report.onClick}
            className="flex items-center gap-4 w-full p-3 bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-border rounded-xl transition-colors text-left group"

          >
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <report.icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {report.label}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">{report.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

