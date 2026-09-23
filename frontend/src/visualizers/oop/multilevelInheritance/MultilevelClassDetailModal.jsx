import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, GitFork, ArrowDown, Shield, CheckCircle2, Terminal } from 'lucide-react';
import useAppStore from '../../../store/useAppStore';
import { PERSON_CLASS, EMPLOYEE_CLASS, MANAGER_CLASS } from '../data/multilevelInheritanceData';

/**
 * MultilevelClassDetailModal - Deep-Dive Architectural Class Inspector
 * Displays detailed class breakdown when the user clicks Person, Employee, or Manager:
 * - Role in the inheritance chain
 * - Extends relationship
 * - Inherited members breakdown (with original source class)
 * - Own members breakdown
 * - Instantiation code preview
 */
export const MultilevelClassDetailModal = ({
  classId = null,
  onClose,
}) => {
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  if (!classId) return null;

  const classData = classId === 'person' 
    ? PERSON_CLASS 
    : classId === 'employee' 
    ? EMPLOYEE_CLASS 
    : MANAGER_CLASS;

  const colorScheme = classData.colorScheme;

  return (
    <AnimatePresence>
      {classId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden font-sans ${
              isDark
                ? 'bg-[#090D17] border-white/15 text-slate-100'
                : isWarm
                ? 'bg-[#FDFBF7] border-[#D8C7B8] text-[#2D1F23]'
                : 'bg-white border-slate-300 text-slate-900 shadow-2xl'
            }`}
          >
            {/* ── HEADER ── */}
            <div className={`px-6 py-4 border-b flex items-center justify-between ${
              isDark ? 'border-white/10 bg-[#060912]' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl border font-mono font-bold ${colorScheme.bgDark} ${colorScheme.border}`}
                  style={{ color: colorScheme.primary }}
                >
                  <Layers size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`font-mono text-lg font-black tracking-wide uppercase ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      class {classData.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${colorScheme.primary}20`,
                        color: isDark ? colorScheme.secondary : colorScheme.primary,
                        border: `1px solid ${colorScheme.primary}40`,
                      }}
                    >
                      {classData.badge}
                    </span>
                  </div>
                  <span className={`text-xs block font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Role: {classData.role} {classData.extendsClass ? `• extends ${classData.extendsClass}` : '• Root Ancestor'}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border-white/10'
                    : 'bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border-slate-300'
                }`}
              >
                <X size={18} />
              </button>
            </div>

            {/* ── CONTENT BODY ── */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5 text-left">
              {/* Description */}
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {classData.description}
              </p>

              {/* ── SECTION 1: INHERITED THROUGH MULTILEVEL CHAIN (if Manager) ── */}
              {classId === 'manager' && (
                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-sky-500/5 border-sky-500/30' : 'bg-sky-50 border-sky-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono font-black uppercase tracking-wider ${
                      isDark ? 'text-sky-300' : 'text-sky-900'
                    }`}>
                      Inherited Through Employee From Person:
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-600 font-bold">
                      2 Levels Up
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {MANAGER_CLASS.inheritedThroughEmployeeFromPerson.map(m => (
                      <div key={m.id} className={`p-2 rounded-xl border text-xs font-mono ${
                        isDark ? 'bg-slate-900/60 border-white/10 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                      }`}>
                        <span className="font-bold block text-sky-500">{m.name}</span>
                        <span className="text-[10px] text-slate-400">{m.dataType || m.returnType} • Origin: Person</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── SECTION 2: INHERITED FROM IMMEDIATE PARENT ── */}
              {classId === 'employee' && (
                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-sky-500/5 border-sky-500/30' : 'bg-sky-50 border-sky-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono font-black uppercase tracking-wider ${
                      isDark ? 'text-sky-300' : 'text-sky-900'
                    }`}>
                      Inherited Directly From Person:
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-600 font-bold">
                      1 Level Up
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {EMPLOYEE_CLASS.inheritedFromPerson.map(m => (
                      <div key={m.id} className={`p-2 rounded-xl border text-xs font-mono ${
                        isDark ? 'bg-slate-900/60 border-white/10 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                      }`}>
                        <span className="font-bold block text-sky-500">{m.name}</span>
                        <span className="text-[10px] text-slate-400">{m.dataType || m.returnType} • Origin: Person</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {classId === 'manager' && (
                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-indigo-500/5 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono font-black uppercase tracking-wider ${
                      isDark ? 'text-indigo-300' : 'text-indigo-900'
                    }`}>
                      Inherited Directly From Employee:
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-600 font-bold">
                      1 Level Up
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {MANAGER_CLASS.inheritedFromEmployee.map(m => (
                      <div key={m.id} className={`p-2 rounded-xl border text-xs font-mono ${
                        isDark ? 'bg-slate-900/60 border-white/10 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                      }`}>
                        <span className="font-bold block text-indigo-500">{m.name}</span>
                        <span className="text-[10px] text-slate-400">{m.dataType || m.returnType} • Origin: Employee</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── SECTION 3: OWN MEMBERS ── */}
              <div className={`p-4 rounded-2xl border ${
                isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-black uppercase tracking-wider ${
                    isDark ? 'text-slate-200' : 'text-slate-900'
                  }`}>
                    Own Members Declared In {classData.name}:
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 font-bold">
                    Specialized
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(classData.properties || classData.ownProperties || []).map(p => (
                    <div key={p.id} className={`p-2.5 rounded-xl border text-xs font-mono ${
                      isDark ? 'bg-slate-900 border-white/10 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-500">{p.dataType} {p.name}</span>
                        <span className="text-[10px] text-slate-400">Property</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1">{p.description}</span>
                    </div>
                  ))}

                  {(classData.methods || classData.ownMethods || []).map(m => (
                    <div key={m.id} className={`p-2.5 rounded-xl border text-xs font-mono ${
                      isDark ? 'bg-slate-900 border-white/10 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-500">{m.returnType} {m.name}</span>
                        <span className="text-[10px] text-slate-400">Method</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1">{m.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── SECTION 4: CODE USAGE SNIPPET ── */}
              <div className={`p-4 rounded-2xl border font-mono text-xs ${
                isDark ? 'bg-[#060810] border-white/10 text-slate-300' : 'bg-slate-900 text-slate-100'
              }`}>
                <div className="flex items-center gap-2 mb-2 text-slate-400 text-[11px]">
                  <Terminal size={13} className="text-emerald-400" />
                  <span>INSTANTIATION & USAGE DEMO</span>
                </div>
                <pre className="overflow-x-auto text-[11px] leading-relaxed">
                  {classId === 'person' && `Person p = new Person();\np.name = "Alex";\np.age = 28;\np.introduce(); // Prints greeting`}
                  {classId === 'employee' && `Employee emp = new Employee();\n// Inherited from Person:\nemp.name = "Alex";\nemp.introduce();\n// Own members:\nemp.employeeId = "EMP-204";\nemp.work();`}
                  {classId === 'manager' && `Manager mgr = new Manager();\n// Inherited through Employee from Person:\nmgr.name = "Alex";\nmgr.introduce();\n// Inherited from Employee:\nmgr.employeeId = "EMP-204";\nmgr.work();\n// Own members:\nmgr.teamSize = 12;\nmgr.conductMeeting();`}
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
