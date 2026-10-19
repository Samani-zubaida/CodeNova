import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Play, Activity } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { useAuth } from '../../context/AuthContext';
import { POLYMORPHIC_ROLES } from './data/polymorphismData';
import OopStudioWorkspace from './components/common/OopStudioWorkspace';

const JAVA_POLYMORPHISM_CODE = `// Superclass declaring abstract polymorphic contract
abstract class Person {
    abstract void performRole();
}

// Subclass Form 1: Developer
class Developer extends Person {
    void performRole() {
        System.out.println("Compiling software & building web apps.");
    }
}

// Subclass Form 2: Parent
class Parent extends Person {
    void performRole() {
        System.out.println("Preparing nutritious meals & household care.");
    }
}

// Subclass Form 3: Athlete
class Athlete extends Person {
    void performRole() {
        System.out.println("Conditioning drills & match soccer tournament.");
    }
}

// Subclass Form 4: Musician
class Musician extends Person {
    void performRole() {
        System.out.println("Electric guitar riffs & stage acoustic synthesis.");
    }
}

// Dynamic Method Dispatch
public class PolymorphismDemo {
    public static void main(String[] args) {
        Person alex = new Developer(); // Dynamic reference
        alex.performRole(); // Dispatched at runtime based on concrete type!
    }
}`;

const POLYMORPHISM_PHASES = [
  {
    id: 'developer',
    stepNumber: 1,
    title: 'Developer Subclass Form',
    tag: 'DEVELOPER DISPATCH',
    desc: 'alex.performRole() dispatched to Developer: Executes web app compilation and algorithm engineering.',
    accentColor: '#F43F5E',
    principleInsight: 'Polymorphism allows 1 interface call to trigger completely distinct behavior depending on the concrete instance type.'
  },
  {
    id: 'parent',
    stepNumber: 2,
    title: 'Parent Subclass Form',
    tag: 'PARENT DISPATCH',
    desc: 'alex.performRole() dispatched to Parent: Executes cooking, household coordination, and childcare behaviors.',
    accentColor: '#10B981',
    principleInsight: 'The caller doesn\'t need type-switching if-else logic; virtual method tables dispatch the correct method dynamically.'
  },
  {
    id: 'athlete',
    stepNumber: 3,
    title: 'Athlete Subclass Form',
    tag: 'ATHLETE DISPATCH',
    desc: 'alex.performRole() dispatched to Athlete: Executes cardiovascular conditioning, sprint drills, and soccer match play.',
    accentColor: '#38BDF8',
    principleInsight: 'Open-Closed Principle: New roles can be introduced without modifying the original Person call site.'
  },
  {
    id: 'musician',
    stepNumber: 4,
    title: 'Musician Subclass Form',
    tag: 'MUSICIAN DISPATCH',
    desc: 'alex.performRole() dispatched to Musician: Executes electric guitar chords, stage acoustics, and audio synthesis.',
    accentColor: '#A855F7',
    principleInsight: 'Subclasses override the base method signature (performRole()) with their own specialized runtime implementation.'
  },
  {
    id: 'dispatch',
    stepNumber: 5,
    title: 'Dynamic Dispatch Synthesis',
    tag: 'VIRTUAL METHOD DISPATCH',
    desc: '1 base identity (Person alex) refracts cleanly into 4 executable roles across 1 single public method invocation.',
    accentColor: '#F59E0B',
    principleInsight: 'Polymorphism ("many forms") is the crowning pillar of OOP, enabling modular and extensible systems.'
  }
];

export default function PolymorphismVisualizer({ isEmbedded = false, onNext }) {
  const { theme } = useAppStore();
  const { isAuthenticated, requireAuth } = useAuth();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  const [activeRole, setActiveRole] = useState('developer'); // 'developer' | 'parent' | 'athlete' | 'musician'
  const [activePulse, setActivePulse] = useState(null);
  const [logMessage, setLogMessage] = useState("Click any role card or 'Run performRole()' to trigger dynamic polymorphic dispatch!");
  const [isCodeOpen, setIsCodeOpen] = useState(false);

  const POLYMORPHISM_CODE_LINES = {
    developer: [16, 17, 18, 46, 47],
    parent: [23, 24, 25, 46, 47],
    athlete: [30, 31, 32, 46, 47],
    musician: [37, 38, 39, 46, 47],
    dispatch: [11, 12, 46, 47]
  };

  const handleExecuteRole = async (roleId) => {
    if (!requireAuth(null, { message: 'Please log in first to access this feature.' })) return;
    if (activePulse) return;
    setActiveRole(roleId);
    setActivePulse(roleId);

    const targetRole = POLYMORPHIC_ROLES.find(r => r.id === roleId) || POLYMORPHIC_ROLES[0];
    setLogMessage(`Calling alex.performRole() -> Dispatched to ${targetRole.title}`);

    await new Promise(r => setTimeout(r, 1500));

    setLogMessage(`Executed: ${targetRole.title} performed "${targetRole.task}"!`);
    setActivePulse(null);
  };

  return (
    <OopStudioWorkspace
      conceptName="Polymorphism"
      conceptSubtitle="OOP PILLAR • DYNAMIC DISPATCH"
      conceptDesc="One Base Identity (Person alex) dynamically dispatches to 4 specialized subclass role implementations through a single public method signature."
      conceptIcon={User}
      conceptAccent="#F59E0B"
      phases={POLYMORPHISM_PHASES}
      activePhaseId={activeRole}
      onSelectPhase={(phaseId) => {
        if (phaseId === 'dispatch') {
          handleExecuteRole(activeRole);
        } else {
          handleExecuteRole(phaseId);
        }
      }}
      onReplay={() => handleExecuteRole(activeRole)}
      primaryAction={{
        label: 'Run performRole()',
        onClick: () => handleExecuteRole(activeRole),
        icon: <Play size={12} className="text-amber-500 fill-amber-500" />
      }}
      isCodeOpen={isCodeOpen}
      onToggleCode={() => setIsCodeOpen(prev => !prev)}
      codeFilename="PolymorphismDemo.java"
      rawCode={JAVA_POLYMORPHISM_CODE}
      activeLineNumbers={POLYMORPHISM_CODE_LINES[activeRole] || [46, 47]}
      activeBadgeText={activeRole.toUpperCase()}
      canvasHeaderTitle="Dynamic Virtual Method Dispatch Tree"
      canvasHeaderBadge="RUNTIME V-TABLE"
      nextConcept={{
        label: "Overview: Complete",
        onNext: onNext
      }}
    >
      <div className="w-full max-w-4xl flex flex-col items-center justify-center py-4">

        {/* Realtime Action Toast / Telemetry Banner */}
        {activePulse && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 py-2 px-4 rounded-xl border text-center font-mono text-xs font-bold flex items-center justify-center gap-2 bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-lg"
          >
            <Activity size={14} className="animate-pulse" />
            <span>{logMessage}</span>
          </motion.div>
        )}

        {/* 1. TOP SINGLE PERSON NODE */}
        <motion.div
          animate={{ scale: activePulse ? 1.05 : 1 }}
          className={`p-3.5 sm:p-4 rounded-2xl border-2 shadow-xl font-mono text-center z-10 w-64 sm:w-72 relative transition-all ${isDark ? 'bg-slate-900/90 border-amber-400' : 'bg-white border-amber-500 shadow-md'
            }`}
        >
          <div className="text-2xl sm:text-3xl mb-0.5">👤</div>
          <div className={`text-sm sm:text-base font-extrabold ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
            Person alex
          </div>
          <div className={`text-[10px] sm:text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Base Reference Type
          </div>
          <div className={`mt-2 px-3 py-1 rounded-full text-[10px] font-bold border ${isDark ? 'bg-slate-800 text-amber-300 border-slate-700' : 'bg-amber-50 text-amber-900 border-amber-200'
            }`}>
            Method Signature: performRole()
          </div>
        </motion.div>

        {/* CONNECTING SVG ARROWS NETWORK */}
        <div className="w-full flex justify-center items-center my-3 relative z-0">
          <div className="w-full max-w-3xl h-8 flex justify-between items-center relative">
            {/* Horizontal Line */}
            <div className={`absolute top-1/2 left-8 right-8 h-0.5 -translate-y-1/2 transition-colors ${isDark ? 'bg-slate-700' : 'bg-slate-300'
              }`} />
            {/* Vertical Stem */}
            <div className={`absolute top-0 bottom-1/2 left-1/2 w-0.5 -translate-x-1/2 transition-colors ${isDark ? 'bg-slate-700' : 'bg-slate-300'
              }`} />

            {/* Glowing Connector Pulses */}
            {POLYMORPHIC_ROLES.map(r => (
              <div key={r.id} className="flex-1 flex justify-center relative">
                <div className={`w-0.5 h-5 transition-all ${activePulse === r.id
                    ? 'bg-amber-400 shadow-[0_0_15px_#F59E0B]'
                    : (isDark ? 'bg-slate-700' : 'bg-slate-300')
                  }`} />
              </div>
            ))}
          </div>
        </div>

        {/* 2. SINGLE HORIZONTAL LINE OF 4 FORMS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full z-10">
          {POLYMORPHIC_ROLES.map(role => {
            const isSelected = activeRole === role.id;
            const isPulsing = activePulse === role.id;

            return (
              <motion.div
                key={role.id}
                animate={{
                  scale: isPulsing ? 1.05 : isSelected ? 1.02 : 1,
                  y: isPulsing ? -3 : 0
                }}
                className={`p-3.5 rounded-2xl border-2 shadow-lg font-mono flex flex-col justify-between text-center space-y-2.5 transition-all relative ${isDark ? 'bg-slate-900/90' : 'bg-white'
                  } ${isPulsing
                    ? 'shadow-[0_0_25px_rgba(245,158,11,0.4)]'
                    : isSelected
                      ? 'shadow-md ring-2 ring-white/20'
                      : ''
                  }`}
                style={{ borderColor: role.color }}
              >
                <div>
                  <div className="text-2xl sm:text-3xl mb-1">{role.emoji}</div>
                  <h4 className={`text-xs sm:text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {role.title}
                  </h4>
                  <div className={`text-[9.5px] sm:text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {role.context}
                  </div>
                </div>

                <div className={`p-2 rounded-xl border text-[11px] font-bold ${isDark
                    ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}>
                  {role.task}
                </div>

                <button
                  type="button"
                  onClick={() => handleExecuteRole(role.id)}
                  className="w-full py-2 rounded-xl text-white text-xs font-extrabold shadow-sm transition-all hover:brightness-110 active:scale-95 cursor-pointer"
                  style={{ backgroundColor: role.color }}
                >
                  Run performRole()
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>
    </OopStudioWorkspace>
  );
}
