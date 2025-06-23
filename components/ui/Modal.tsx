
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300 ease-in-out">
      <div className="bg-zyberion-light-blue rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow">
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-zyberion-light-gray">{title}</h2>
            <button
              onClick={onClose}
              className="text-zyberion-gray hover:text-zyberion-light-gray transition-colors"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="text-zyberion-gray">{children}</div>
        {footer && <div className="mt-6 pt-4 border-t border-zyberion-dark-gray flex justify-end space-x-3">{footer}</div>}
      </div>
      <style>{`
        @keyframes modalShow {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modalShow {
          animation: modalShow 0.3s forwards;
        }
      `}</style>
    </div>
  );
};
