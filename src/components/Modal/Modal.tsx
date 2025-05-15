import React, { useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';

export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to call when the modal should close */
  onClose: () => void;
  /** The title of the modal */
  title: string;
  /** The content of the modal */
  children: React.ReactNode;
  /** Optional className for additional styling */
  className?: string;
  /** Optional size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Optional footer content */
  footer?: React.ReactNode;
  /** Whether to show the close button */
  showCloseButton?: boolean;
  /** Whether to close the modal when clicking outside */
  closeOnOutsideClick?: boolean;
  /** Whether to close the modal when pressing escape */
  closeOnEscape?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  size = 'md',
  footer,
  showCloseButton = true,
  closeOnOutsideClick = true,
  closeOnEscape = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnEscape]);

  // Handle outside click
  const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOutsideClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={handleOutsideClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative z-[10000] w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden rounded-lg bg-white shadow-xl transition-all ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 id="modal-title" className="text-lg font-medium text-gray-900">
            {title}
          </h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Close modal"
            >
              <FiX className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-gray-200 px-6 py-4">{footer}</div>
        )}
      </div>
    </div>
  );
};

export default Modal;
