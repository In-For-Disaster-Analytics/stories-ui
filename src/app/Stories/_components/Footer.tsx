import React from 'react';
import { BsCheckCircle } from 'react-icons/bs';

interface FooterProps {
  onPreview?: () => void;
  onSave?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onPreview, onSave }) => {
  return (
    <footer className="bg-white border-t border-gray-100 py-5 mt-10 fixed bottom-0 left-0 right-0 z-[1002]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <BsCheckCircle className="w-3.5 h-3.5" />
            All changes saved
          </div>
          <div className="flex gap-4">
            <button
              onClick={onPreview}
              className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100"
            >
              Preview
            </button>
            <button
              onClick={onSave}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
