import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import EnquiryModal from '../components/common/EnquiryModal';
import WhatsAppButton from '../components/common/WhatsAppButton';

const PublicLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8F6] text-[#252D35] selection:bg-primary-soft selection:text-primary-dark">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <EnquiryModal />
      <WhatsAppButton phoneNumber="918115440794" />
    </div>
  );
};

export default PublicLayout;
