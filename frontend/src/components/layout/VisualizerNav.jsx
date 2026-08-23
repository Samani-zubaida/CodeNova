import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

const ALL_MODULES = [
  // DS
  { path: '/visualizer/array', name: 'Array', tab: 'ds' },
  { path: '/visualizer/string', name: 'String', tab: 'ds' },
  { path: '/visualizer/stack', name: 'Stack', tab: 'ds' },
  { path: '/visualizer/queue', name: 'Queue', tab: 'ds' },
  { path: '/visualizer/linkedlist', name: 'Linked List', tab: 'ds' },
  { path: '/visualizer/tree', name: 'Tree', tab: 'ds' },
  { path: '/visualizer/heap', name: 'Heap', tab: 'ds' },
  { path: '/visualizer/map', name: 'Hash Map', tab: 'ds' },
  // OOP
  { path: '/visualizer/encapsulation', name: 'Encapsulation', tab: 'oop' },
  { path: '/visualizer/abstraction', name: 'Abstraction', tab: 'oop' },
  { path: '/visualizer/inheritance', name: 'Inheritance', tab: 'oop' },
  { path: '/visualizer/polymorphism', name: 'Polymorphism', tab: 'oop' },
  // Crypto
  { path: '/visualizer/caesar', name: 'Caesar Cipher', tab: 'crypto' },
  { path: '/visualizer/railfence', name: 'Rail Fence', tab: 'crypto' },
  { path: '/visualizer/columnar', name: 'Columnar', tab: 'crypto' },
];

export default function VisualizerNav({ currentPath }) {
  const navigate = useNavigate();
  
  const currentIndex = ALL_MODULES.findIndex(m => m.path === currentPath);
  const currentModule = ALL_MODULES[currentIndex] || { tab: 'ds' };
  
  const prevModule = currentIndex > 0 ? ALL_MODULES[currentIndex - 1] : null;
  const nextModule = currentIndex < ALL_MODULES.length - 1 ? ALL_MODULES[currentIndex + 1] : null;

  return (
    <div className="flex items-center gap-2 mb-2 w-full max-w-sm">
      <button 
        disabled={!prevModule}
        onClick={() => prevModule && navigate(prevModule.path)}
        title={prevModule ? prevModule.name : ''}
        className="p-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} className="text-gray-600 dark:text-gray-300" />
      </button>

      <Link 
        to="/visualizer" 
        state={{ activeTab: currentModule.tab }}
        className="flex-1 text-center text-gray-500 hover:text-[var(--color-nova-brown)] transition-colors flex items-center justify-center gap-2 font-semibold bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full text-sm border border-gray-200 dark:border-white/10"
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      <button 
        disabled={!nextModule}
        onClick={() => nextModule && navigate(nextModule.path)}
        title={nextModule ? nextModule.name : ''}
        className="p-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} className="text-gray-600 dark:text-gray-300" />
      </button>
    </div>
  );
}
