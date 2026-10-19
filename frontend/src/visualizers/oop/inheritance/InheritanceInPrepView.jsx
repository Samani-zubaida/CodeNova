import React from 'react';
import { motion } from 'framer-motion';
import {
  GitFork, Sparkles, ArrowRight, Clock, Code2,
  Layers, Shield, Check, BookOpen, AlertCircle
} from 'lucide-react';
import useAppStore from '../../../store/useAppStore';

export const INHERITANCE_TYPES_DATA = {
  single: {
    id: 'single',
    num: '01',
    name: 'Single Inheritance',
    headline: '1 Base Class → 1 Derived Subclass',
    badge: 'ACTIVE LABORATORY',
    concept: 'class Dog extends Animal',
    description: 'A subclass inherits all non-private fields and methods directly from a single parent superclass. This represents the simplest form of object reuse and specialization in Java.',
    codeSnippet: `// 1 Base Class (Superclass)
public class Animal {
    protected String species = "Canine";
    public void eat() {
        System.out.println("Eating nutrient fuel...");
    }
}

// 1 Derived Subclass
public class Dog extends Animal {
    public void bark() {
        System.out.println("Woof! Woof!");
    }
}`,
    explanation: 'Single inheritance provides direct vertical reuse without ambiguous dispatch or multiple ancestry conflicts.',
  },
  multilevel: {
    id: 'multilevel',
    num: '02',
    name: 'Multilevel Inheritance',
    headline: 'Grandparent → Parent → Child Chain',
    badge: 'ACTIVE LABORATORY',
    concept: 'class BabyDog extends Dog extends Animal',
    description: 'A class extends another class that is itself a subclass of an ancestor base class, forming a vertical transitive inheritance chain where traits flow down through generations.',
    codeSnippet: `// Level 1: Grandparent
public class Animal {
    public void breathe() { System.out.println("Breathing..."); }
}

// Level 2: Parent (extends Animal)
public class Mammal extends Animal {
    public void walk() { System.out.println("Walking on four limbs..."); }
}

// Level 3: Child (extends Mammal)
public class Dog extends Mammal {
    public void bark() { System.out.println("Barking!"); }
}`,
    explanation: 'Subclasses at the bottom of the chain inherit members from every superclass above them in the hierarchy.',
  },
  hierarchical: {
    id: 'hierarchical',
    num: '03',
    name: 'Hierarchical Inheritance',
    headline: '1 Base Class (Person) → Multiple Subclasses (Child1 & Child2)',
    badge: 'ACTIVE LABORATORY',
    concept: 'class Child1 extends Person, class Child2 extends Person',
    description: 'One common parent class acts as the genetic root for multiple specialized child subclasses. Each child inherits the shared base properties while introducing its own unique traits or overriding behaviors.',
    codeSnippet: `// One Common Parent Superclass
public class Person {
    String skinTone = "dusky";
    String hairColor = "brown";
    String height = "tall";
    boolean wearsGlasses = true;
}

// Subclass 1: Specializes with black hair & shorter height
public class Child1 extends Person {
    String hairColor = "black"; // Overridden
    String height = "shorter";  // Modified
}

// Subclass 2: Introduces fair skin & blue eyes
public class Child2 extends Person {
    String skinTone = "fair";   // Unique
    String eyeColor = "blue";   // Unique
}`,
    explanation: 'Hierarchical inheritance enables high code reuse across parallel peer classes that share a fundamental domain model.',
  },
  multiple: {
    id: 'multiple',
    num: '04',
    name: 'Multiple Inheritance (Interface)',
    headline: 'Multiple Interface Implementation',
    badge: 'IN PREPARATION',
    concept: 'class Machine implements Flyable, Swimmable',
    description: 'Java strictly disallows multiple class inheritance (class C extends A, B) to eliminate Diamond Problem ambiguities. Instead, Java achieves multiple inheritance of type through interface implementation.',
    codeSnippet: `// Interface Contract 1
public interface Flyable {
    void fly();
}

// Interface Contract 2
public interface Swimmable {
    void swim();
}

// Concrete Class implementing both contracts
public class HydroPlane implements Flyable, Swimmable {
    @Override public void fly() { System.out.println("Airborne navigation"); }
    @Override public void swim() { System.out.println("Waterborne navigation"); }
}`,
    explanation: 'Interfaces allow a class to commit to multiple behavioral contracts while avoiding state collision ambiguities.',
  },
  hybrid: {
    id: 'hybrid',
    num: '05',
    name: 'Hybrid Inheritance',
    headline: 'Combined Hierarchy & Interface Trees',
    badge: 'IN PREPARATION',
    concept: 'class AmphibianVehicle extends GroundVehicle implements Aquatic',
    description: 'A hybrid architecture combines two or more different inheritance archetypes (e.g. hierarchical class inheritance paired with multiple interface contracts) to model complex enterprise domains.',
    codeSnippet: `// Class Hierarchy
public class BaseVehicle { int vin; }
public class GroundVehicle extends BaseVehicle { void drive() {} }

// Interface Contract
public interface Aquatic { void cruise(); }

// Hybrid Composition: Class inheritance + Interface contract
public class Amphibian extends GroundVehicle implements Aquatic {
    @Override public void cruise() { System.out.println("Engaging water jets"); }
}`,
    explanation: 'Hybrid systems compose deep inheritance chains with polymorphic interfaces to achieve rich multi-domain models.',
  },
};

export default function InheritanceInPrepView({
  type = 'single',
  onSwitchType,
  onSwitchToHierarchical
}) {
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  const archetype = INHERITANCE_TYPES_DATA[type] || INHERITANCE_TYPES_DATA.single;

  const bgClasses = isDark
    ? 'bg-[#080C16] text-[#FAF7F2]'
    : isWarm
      ? 'bg-[#FDFBF7] text-[#2D1F23]'
      : 'bg-[#F8FAFC] text-slate-900';

  const cardClasses = isDark
    ? 'bg-[#090D17]/90 border-white/10 shadow-2xl'
    : isWarm
      ? 'bg-[#FAF7F2]/95 border-[#EBE0D3] shadow-xl'
      : 'bg-white/95 border-slate-200/90 shadow-xl';

  const codeBgClasses = isDark
    ? 'bg-[#04060B] border-white/10 text-slate-300'
    : isWarm
      ? 'bg-[#F4EDE2] border-[#EBE0D3] text-[#2D1F23]'
      : 'bg-slate-900 border-slate-700 text-slate-200';

  return (
    <div className={`w-full flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-y-auto ${bgClasses} transition-colors duration-300`}>

      {/* Ambient Aurora Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-500/15 via-indigo-500/10 to-transparent rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf806_1px,transparent_1px),linear-gradient(to_bottom,#38bdf806_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center my-auto py-6">

        {/* Category Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl border backdrop-blur-md mb-6 overflow-x-auto max-w-full">
          {Object.values(INHERITANCE_TYPES_DATA).map((item) => {
            const isCurrent = item.id === type;
            const isLive = ['single', 'multilevel', 'hierarchical'].includes(item.id);

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (onSwitchType) onSwitchType(item.id);
                  if (item.id === 'hierarchical' && onSwitchToHierarchical) onSwitchToHierarchical();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${isCurrent
                    ? isDark
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-sm'
                      : 'bg-sky-500 text-white shadow-sm'
                    : isDark
                      ? 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-black/5 border border-transparent'
                  }`}
              >
                <span>{item.name}</span>
                {isLive ? (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-500/25 text-emerald-400 font-black border border-emerald-500/40">
                    LIVE
                  </span>
                ) : (
                  <span className="text-[9px] opacity-60">
                    {item.num}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Archetype Card */}
        <motion.div
          key={archetype.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={`w-full rounded-3xl p-6 sm:p-8 border backdrop-blur-xl flex flex-col gap-6 ${cardClasses}`}
        >
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-black uppercase tracking-wider bg-sky-500/15 text-sky-400 border border-sky-500/30">
                  INHERITANCE PATTERN {archetype.num} / 05
                </span>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  <Clock size={10} className="animate-pulse" />
                  {archetype.badge}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {archetype.name}
              </h2>
              <p className="font-mono text-xs sm:text-sm text-sky-400 mt-1">
                {archetype.headline}
              </p>
            </div>

            {/* Quick Link to Live Visualizer */}
            <button
              onClick={() => {
                if (type === 'single' && onSwitchType) onSwitchType('single');
                else if (type === 'multilevel' && onSwitchType) onSwitchType('multilevel');
                else if (onSwitchToHierarchical) onSwitchToHierarchical();
              }}
              className="self-start sm:self-center flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            >
              <Sparkles size={14} />
              <span>
                {type === 'single' ? 'Launch Live Single Lab' :
                 type === 'multilevel' ? 'Launch Live Multilevel Lab' :
                 'Launch Live Hierarchical Lab'}
              </span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Description & Concept Body */}
          <div className="flex flex-col gap-3">
            <p className="text-sm sm:text-base leading-relaxed opacity-90 font-sans">
              {archetype.description}
            </p>
            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs font-mono text-sky-300 flex items-center gap-2">
              <span className="font-bold">ARCHETYPE SIGNATURE:</span>
              <code className="text-amber-300 font-bold">{archetype.concept}</code>
            </div>
          </div>

          {/* Java Architecture Definition Preview */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-400">
                <Code2 size={13} className="text-sky-400" />
                Java Contract Preview
              </span>
              <span className="text-[10px] text-slate-500">
                Standard Java Specification
              </span>
            </div>

            <div className={`p-4 rounded-2xl border font-mono text-xs leading-relaxed overflow-x-auto ${codeBgClasses}`}>
              <pre>
                <code>{archetype.codeSnippet}</code>
              </pre>
            </div>
          </div>

          {/* Architecture Engineering Notice */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs">
            <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-mono font-bold text-amber-300 uppercase tracking-wide">
                Dedicated Engineering Notice
              </span>
              <p className="text-slate-300 leading-relaxed font-sans">
                To guarantee zero fake or placeholder diagrams and maintain our high-fidelity human character genetic metaphor, the interactive simulation engine is exclusively operational for <strong>Hierarchical Inheritance</strong>.
              </p>
            </div>
          </div>

          {/* Footer Navigation CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
            <span className="text-xs font-mono text-slate-400">
              Ready to explore live trait transmission, character genetic inheritance, and method overriding?
            </span>
            <button
              onClick={onSwitchToHierarchical}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all hover:scale-105 active:scale-95 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <span>Explore Hierarchical Inheritance (Live)</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
