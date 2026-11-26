import React, { useState } from 'react';
import type { DispatchItem } from '../types/dashboard';
import { mockDispatches } from '../data/mockData';
import { FilePreviewModal } from './FilePreviewModal';

interface DispatchesTableProps {
  items?: DispatchItem[];
  onStatusChange?: (id: string, status: DispatchItem['status']) => void;
}

interface PreviewModalState {
  isOpen: boolean;
  fileName: string;
  itemTitle: string;
  type: 'report' | 'newsletter';
  recipientEmail?: string;
}

export const DispatchesTable: React.FC<DispatchesTableProps> = ({
  items: externalItems,
  onStatusChange,
}) => {
  const [internalItems, setInternalItems] = useState<DispatchItem[]>(mockDispatches);
  const items = externalItems ?? internalItems;

  const [searchQuery, setSearchQuery] = useState('');
  const [previewModal, setPreviewModal] = useState<PreviewModalState>({
    isOpen: false,
    fileName: '',
    itemTitle: '',
    type: 'report',
  });

  const handleStatusChange = (id: string, newStatus: DispatchItem['status']) => {
    if (onStatusChange) {
      onStatusChange(id, newStatus);
    } else {
      setInternalItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
    }
  };

  const openPreview = (
    fileName: string,
    itemTitle: string,
    type: 'report' | 'newsletter',
    recipientEmail?: string
  ) => {
    setPreviewModal({
      isOpen: true,
      fileName,
      itemTitle,
      type,
      recipientEmail,
    });
  };

  const closePreview = () => {
    setPreviewModal((prev) => ({ ...prev, isOpen: false }));
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Header Section */}
        <div className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-900">
              Store Dispatches &amp; Newsletter Reviews
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review performance briefs and manage outgoing newsletter approvals
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, author, email..."
              className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6 font-semibold">NAME / TITLE</th>
                <th className="py-3.5 px-6 font-semibold">EMAIL (RECIPIENT)</th>
                <th className="py-3.5 px-6 font-semibold">PERFORMANCE REPORT</th>
                <th className="py-3.5 px-6 font-semibold">NEWSLETTER DRAFT</th>
                <th className="py-3.5 px-6 font-semibold">STATUS</th>
                <th className="py-3.5 px-6 font-semibold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredItems.map((item) => {
                const isDecided = item.status !== 'Pending Review';

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Name / Title */}
                    <td className="py-4 px-6 align-middle">
                      <div className="font-semibold text-slate-900 text-sm">{item.title}</div>
                      <div className="text-slate-400 text-xs mt-0.5">
                        {item.author} · {item.price}
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-6 align-middle font-mono text-xs text-slate-600">
                      {item.recipientEmail}
                    </td>

                    {/* Performance Report Link / Popup */}
                    <td className="py-4 px-6 align-middle">
                      <button
                        type="button"
                        onClick={() =>
                          openPreview(
                            item.performanceReport,
                            item.title,
                            'report',
                            item.recipientEmail
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EFF6FF] text-[#3B82F6] hover:bg-blue-100 text-xs font-medium border border-blue-100 transition-colors cursor-pointer"
                      >
                        {/* Bar Chart Icon */}
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="3" y="12" width="4" height="8" rx="1" />
                          <rect x="10" y="8" width="4" height="12" rx="1" />
                          <rect x="17" y="4" width="4" height="16" rx="1" />
                        </svg>
                        <span>{item.performanceReport}</span>
                        <span className="text-[11px] leading-none">↗</span>
                      </button>
                    </td>

                    {/* Newsletter Draft Link / Popup */}
                    <td className="py-4 px-6 align-middle">
                      <button
                        type="button"
                        onClick={() =>
                          openPreview(
                            item.newsletterDraft,
                            item.title,
                            'newsletter',
                            item.recipientEmail
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF5FF] text-[#9333EA] hover:bg-purple-100 text-xs font-medium border border-purple-100 transition-colors cursor-pointer"
                      >
                        {/* Mail Icon */}
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <span>{item.newsletterDraft}</span>
                        <span className="text-[11px] leading-none">↗</span>
                      </button>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6 align-middle">
                      {item.status === 'Pending Review' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF9C3]/70 text-[#B45309] text-xs font-medium border border-[#FDE047]/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                          Pending Review
                        </span>
                      ) : item.status === 'Accepted' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          Accepted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                          Rejected
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 align-middle text-right">
                      <div className="inline-flex items-center justify-end gap-3">
                        <button
                          type="button"
                          disabled={isDecided}
                          onClick={() => handleStatusChange(item.id, 'Rejected')}
                          className={`text-xs font-medium px-2 py-1 transition-colors ${
                            isDecided
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-[#E11D48] hover:text-[#BE123C] cursor-pointer'
                          }`}
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          disabled={isDecided}
                          onClick={() => handleStatusChange(item.id, 'Accepted')}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md shadow-xs transition-colors ${
                            isDecided
                              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                              : 'bg-[#059669] hover:bg-[#047857] text-white cursor-pointer'
                          }`}
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Accept
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

      {/* Popup Preview Modal */}
      <FilePreviewModal
        isOpen={previewModal.isOpen}
        onClose={closePreview}
        fileName={previewModal.fileName}
        itemTitle={previewModal.itemTitle}
        type={previewModal.type}
        recipientEmail={previewModal.recipientEmail}
      />
    </>
  );
};
