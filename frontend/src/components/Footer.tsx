'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: false, amount: 0.2 });

  const staggerChildren = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <footer 
      ref={footerRef}
      className="relative bg-gradient-to-b from-[#0a0b17] to-black text-white overflow-hidden pt-24 pb-12"
    >
  {/* Shield background above hover to disable effect in footer */}
  <div className="absolute inset-0 z-[12] bg-gradient-to-b from-[#0a0b17] to-black pointer-events-none" />
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="absolute top-0 left-1/4 w-24 h-24 rounded-full bg-blue-500/10 blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-32 h-32 rounded-full bg-purple-500/10 blur-3xl"></div>
      <div className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full bg-pink-500/5 blur-3xl"></div>
      
  <div className="container mx-auto px-4 relative z-[20]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">LinkedAI</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Next-generation LinkedIn automation and content creation platform powered by AI.
            </p>
            <div className="flex space-x-4">
              {['twitter', 'facebook', 'linkedin', 'instagram'].map((platform, i) => (
                <Link 
                  href="#" 
                  key={platform}
                  className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300"
                >
                  <span className="sr-only">{platform}</span>
                  <div className="w-5 h-5 rounded-full bg-gray-600"></div>
                </Link>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
          >
            <h3 className="text-lg font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">Products</h3>
            <ul className="space-y-4">
              {['Content Creator', 'Growth Engine', 'Analytics Dashboard', 'Engagement Tools', 'API Access'].map(item => (
                <motion.li key={item} variants={fadeIn}>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 opacity-70"></span>
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
          >
            <h3 className="text-lg font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">Resources</h3>
            <ul className="space-y-4">
              {['Documentation', 'Blog', 'Case Studies', 'Community', 'Help Center'].map(item => (
                <motion.li key={item} variants={fadeIn}>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2 opacity-70"></span>
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="bg-gradient-to-br from-[#1a1c31] to-[#0a0b17] p-6 rounded-2xl border border-gray-800/50"
          >
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <p className="text-gray-400 text-sm mb-5">Subscribe to get the latest updates and offers.</p>
            
            <div className="relative mb-4 group">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-black/30 text-white rounded-lg py-3 pl-4 pr-12 border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-500 text-sm transition-all duration-300"
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-md text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-blue-500/30 pointer-events-none transition-all duration-300"></div>
            </div>
            
            <div className="flex items-center text-xs text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4 mr-2 text-green-500">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>We respect your privacy. Unsubscribe anytime.</span>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="pt-8 mt-16 border-t border-gray-800/50 grid grid-cols-1 md:grid-cols-2 gap-4 items-center"
        >
          <div className="text-gray-500 text-sm">
            © 2023 LinkedAI. All rights reserved.
            <div className="flex space-x-4 mt-2">
              <Link href="#" className="text-gray-500 hover:text-white text-xs">Privacy Policy</Link>
              <Link href="#" className="text-gray-500 hover:text-white text-xs">Terms of Service</Link>
              <Link href="#" className="text-gray-500 hover:text-white text-xs">Cookies</Link>
            </div>
          </div>
          
          <div className="flex items-center justify-start md:justify-end space-x-4">
            <div className="text-xs text-gray-500">Payments secured by</div>
            {['Visa', 'Mastercard', 'PayPal', 'Apple Pay'].map(payment => (
              <div key={payment} className="h-6 w-10 bg-gray-800 rounded flex items-center justify-center">
                <div className="h-2 w-6 bg-gray-600 rounded-sm"></div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Floating Element */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="hidden md:block absolute right-10 bottom-40 w-52 h-52 z-[10]"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-[#0a0b17]/80 backdrop-blur-sm border border-white/10 p-3 rounded-xl rotate-6 hover:rotate-0 transition-transform duration-500">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg"></div>
              <div>
                <div className="h-2 w-16 bg-gray-200 rounded-full"></div>
                <div className="h-2 w-10 bg-gray-600 rounded-full mt-1"></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
