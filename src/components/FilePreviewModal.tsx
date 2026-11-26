import React, { useEffect } from 'react';

export interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  itemTitle: string;
  type: 'report' | 'newsletter';
  recipientEmail?: string;
  fileUrl?: string;
}

const emptyMessageHtml = `<!DOCTYPE html><html><body style="font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;height:80vh;color:#94a3b8;margin:0;"><div style="text-align:center;"><p style="font-size:16px;font-weight:600;color:#64748b;">No document preview available</p><p style="font-size:13px;">No file URL was provided for this item.</p></div></body></html>`;

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  isOpen,
  onClose,
  fileName,
  itemTitle,
  type,
  fileUrl,
}) => {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Resolve target URL: explicit S3 link > base API relative link
  const apiBase = import.meta.env.VITE_API_BASE_URL;
  const targetUrl = fileUrl || (apiBase ? `${apiBase}/files/${fileName}` : undefined);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <span
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
                type === 'report'
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-purple-50 text-purple-600'
              }`}
            >
              {type === 'report' ? '📊' : '✉️'}
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {itemTitle}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{fileName}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body / Iframe View */}
        <div className="flex-1 w-full bg-slate-50 relative">
          <iframe
            title={fileName}
            src={targetUrl}
            srcDoc={!targetUrl ? emptyMessageHtml : undefined}
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
};
