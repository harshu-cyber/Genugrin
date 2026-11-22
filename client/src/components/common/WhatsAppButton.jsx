import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = ({ phoneNumber = '918115440794' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const defaultMessage = encodeURIComponent(
    'Hello GENUGRIN HEALTHCARE, I would like to enquire about your pharmaceutical formulations and products.'
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center group">
      {/* Tooltip bubble on hover */}
      <div
        className={`hidden sm:flex items-center bg-white text-[#17324D] px-4 py-2 rounded-full shadow-lg border border-gray-200 text-xs font-semibold mr-3 transition-all duration-300 pointer-events-none ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <span className="relative flex h-2 w-2 mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>Chat with us on WhatsApp</span>
      </div>

      {/* Main Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact GENUGRIN HEALTHCARE on WhatsApp"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.6)] transform hover:scale-108 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        {/* Soft pulse aura */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none" />

        {/* WhatsApp Official Vector Icon */}
        <svg
          viewBox="0 0 24 24"
          width="32"
          height="32"
          stroke="currentColor"
          strokeWidth="0"
          fill="currentColor"
          className="w-7 h-7 sm:w-8 sm:h-8"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.153.568 4.174 1.56 5.922l-1.656 6.046 6.223-1.633c1.693.931 3.639 1.465 5.714 1.465 6.627 0 12-5.373 12-12s-5.373-12-12-12zm0 21.6c-1.849 0-3.567-.533-5.016-1.455l-.361-.229-3.727.978.995-3.633-.25-.398c-1.026-1.635-1.572-3.535-1.572-5.485 0-5.514 4.486-10 10-10 5.514 0 10 4.486 10 10 0 5.514-4.486 10-10 10z"/>
        </svg>
      </a>
    </div>
  );
};

export default WhatsAppButton;
