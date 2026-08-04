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
<<<<<<< HEAD
    <div className="bg-black dark:bg-black rounded-2xl border border-slate-200 dark:border-slate-900 p-5 shadow-lg h-full flex flex-col">
=======
    <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm dark:shadow-lg h-[350px] flex flex-col">
>>>>>>> e9bb4d3fc0ed5658293b72b9fb68775ffae8e7f0
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reports & Export</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Generate analytics reports</p>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-3">
        {reports.map((report, idx) => (
          <button
            key={idx}
            onClick={report.onClick}
<<<<<<< HEAD
            className="flex items-center gap-4 w-full p-3 bg-slate-900/40 hover:bg-slate-800/80 border border-slate-200 dark:border-slate-900 rounded-xl transition-colors text-left group"
=======
            className="flex items-center gap-4 w-full p-3 bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800/80 rounded-xl transition-colors text-left group"
>>>>>>> e9bb4d3fc0ed5658293b72b9fb68775ffae8e7f0
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <report.icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {report.label}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{report.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

