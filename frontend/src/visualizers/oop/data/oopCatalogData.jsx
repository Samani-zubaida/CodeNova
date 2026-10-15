import React from 'react';
import { Lock, Shield, GitFork, RefreshCw } from 'lucide-react';
import { 
  EncapsulationGraphic, 
  AbstractionGraphic, 
  InheritanceGraphic, 
  PolymorphismGraphic 
} from '../components/catalog/ConceptGraphics';

export const OOP_CATALOG = [
  {
    id: 'encapsulation',
    num: '01',
    name: 'Encapsulation',
    category: 'Information Hiding & Access Control',
    tag: 'Private Data Vault & Deflection Shields',
    path: '/visualizer/encapsulation',
    graphic: <EncapsulationGraphic />,
    icon: Lock,
    accentColor: '#F43F5E',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    gradient: 'from-[#F43F5E] to-[#E11D48]',
    borderHover: 'hover:border-[#F43F5E]/60',
    lightBorder: 'border-rose-200 hover:border-rose-400',
    badgeText: 'VAULT ACCESS'
  },
  {
    id: 'abstraction',
    num: '02',
    name: 'Abstraction',
    category: 'Interface Separation & Hiding',
    tag: 'Clean Cockpit API vs 10,000 Circuit Nodes',
    path: '/visualizer/abstraction',
    graphic: <AbstractionGraphic />,
    icon: Shield,
    accentColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    gradient: 'from-[#10B981] to-[#059669]',
    borderHover: 'hover:border-[#10B981]/60',
    lightBorder: 'border-emerald-200 hover:border-emerald-400',
    badgeText: 'SIMPLIFIED API'
  },
  {
    id: 'inheritance',
    num: '03',
    name: 'Inheritance',
    category: 'Hierarchical Reuse & super()',
    tag: 'Evolutionary Class Trees & Method Delegation',
    path: '/visualizer/inheritance',
    graphic: <InheritanceGraphic />,
    icon: GitFork,
    accentColor: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.25)',
    gradient: 'from-[#38BDF8] to-[#6366F1]',
    borderHover: 'hover:border-[#38BDF8]/60',
    lightBorder: 'border-sky-200 hover:border-sky-400',
    badgeText: 'CLASS HIERARCHY'
  },
  {
    id: 'polymorphism',
    num: '04',
    name: 'Polymorphism',
    category: 'Dynamic Dispatch & Overriding',
    tag: 'Single Call Refracting into 4 Dynamic Forms',
    path: '/visualizer/polymorphism',
    graphic: <PolymorphismGraphic />,
    icon: RefreshCw,
    accentColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    gradient: 'from-[#F59E0B] to-[#D97706]',
    borderHover: 'hover:border-[#F59E0B]/60',
    lightBorder: 'border-amber-200 hover:border-amber-400',
    badgeText: 'DYNAMIC DISPATCH'
  }
];
