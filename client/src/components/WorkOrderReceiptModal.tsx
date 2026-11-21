import React from 'react';
import { Report } from '../types';
import { ShieldCheck, Printer, CheckCircle2, Download, Building2, MapPin, Calendar, FileText } from 'lucide-react';

interface Props {
  report: Report;
  onClose: () => void;
}

export const WorkOrderReceiptModal: React.FC<Props> = ({ report, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const workOrderNum = report.resolution?.workOrderNumber || `WO-${report.id.replace('CP-', '')}-2026`;
  const resolvedDate = report.resolution?.resolvedAt
    ? new Date(report.resolution.resolvedAt).toLocaleString()
    : new Date().toLocaleString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        {/* Top Modal Controls */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Official Municipal Resolution Certificate</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center text-xs font-bold transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Certificate Body (Printable) */}
        <div className="p-6 sm:p-8 space-y-6 bg-white dark:bg-slate-900" id="printable-certificate">
          {/* Header Banner */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-xs">
                  CP
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                    MUNICIPAL CORPORATION OF BENGALURU
                  </h2>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">
                    Department of Urban Infrastructure & Public Grievances
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-500/40">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                VERIFIED CLOSURE
              </span>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1">Ref: {workOrderNum}</p>
            </div>
          </div>

          {/* Incident & Dispatch Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">Report ID</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">#{report.id}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">Category</span>
              <span className="font-bold text-orange-600 dark:text-orange-400 text-xs truncate block">{report.category}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">Assigned Dept</span>
              <span className="font-bold text-slate-900 dark:text-white text-xs truncate block">{report.departmentName}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">Remediated Date</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-[11px] truncate block">
                {resolvedDate.split(',')[0]}
              </span>
            </div>
          </div>

          {/* Description & Location */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <span>Location: {report.location.address}</span>
            </div>
            <p className="text-slate-800 dark:text-slate-300 font-medium">"{report.title}"</p>
          </div>

          {/* Before & After Proof Thumbnails */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Photographic Inspection Evidence
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black relative">
                <img
                  src={report.images[0]}
                  alt="Before"
                  className="w-full h-36 object-cover opacity-90"
                />
                <span className="absolute top-2 left-2 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  BEFORE DEFECT
                </span>
              </div>

              <div className="rounded-2xl overflow-hidden border border-emerald-500/40 bg-black relative ring-1 ring-emerald-500/30">
                <img
                  src={report.resolution?.evidenceImages[0] || report.images[0]}
                  alt="After"
                  className="w-full h-36 object-cover"
                />
                <span className="absolute top-2 left-2 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  AFTER REMEDIATION
                </span>
              </div>
            </div>
          </div>

          {/* Officer Resolution Notes */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
              Field Engineer Resolution Attestation:
            </span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-[11px]">
              "{report.resolution?.resolutionNotes || 'Remediation completed to technical municipal standard. Tested and inspected.'}"
            </p>
          </div>

          {/* Signatures & QR Code Stamp */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white border border-slate-200 p-1 rounded-xl flex items-center justify-center shrink-0 shadow-2xs">
                {/* SVG QR Code Simulation */}
                <svg className="w-full h-full text-slate-950" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4 0h2v2h-2v-2zm2 4h4v2h-4v-2zm2-2h2v2h-2v-2z" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                  DIGITALLY STAMPED & SIGNED
                </span>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">
                  Officer: {report.resolution?.resolvedBy || report.assignedOfficerName || 'Ward Civil Engineer'}
                </p>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">
                  Hash: SHA256-CP99824X-BLR
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="w-32 border-b border-slate-300 dark:border-slate-700 pb-1 mb-1 font-mono text-[11px] text-slate-800 dark:text-slate-300 font-bold">
                {report.resolution?.resolvedBy?.split(' ')[0] || 'R. Kumar'}
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase block">Authorized Officer Signature</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
