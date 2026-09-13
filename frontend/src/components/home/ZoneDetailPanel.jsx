import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Telescope, Wrench, Swords,
  Database, Binary, GitBranch, Layers, Network, BarChart3,
  Code2, Play, Sparkles, Zap, BrainCircuit,
  Lock, KeyRound, Shield, FileSearch,
  Trophy, Medal, Users, Clock, BookOpen, Target,
  ArrowRight, X
} from 'lucide-react';

// ─── Zone Content Data ─────────────────────────────────────────────

const ZONE_DATA = {
  observatory: {
    title: 'The Observatory',
    subtitle: 'DSA & Algorithm Visualizer',
    icon: Telescope,
    accentColor: '#6366f1',   // indigo/purple
    glowColor: 'rgba(99, 102, 241, 0.15)',
    route: '/visualizer',
    description: 'Paste your code and watch algorithms execute step-by-step in real-time 3D. Every data structure, every operation, every comparison — visualized so you truly understand how it works.',
    features: [
      {
        icon: Database,
        title: '8 Data Structures',
        detail: 'Array, Linked List, Stack, Queue, Tree, Graph, Heap, HashMap — each with dedicated interactive 3D visualizers showing memory layout, pointers, and operations.'
      },
      {
        icon: BarChart3,
        title: '40+ Algorithms',
        detail: 'Sorting (Bubble, Merge, Quick, Heap, Radix), Searching (Linear, Binary), Graph traversals (BFS, DFS, Dijkstra, Cycle Detection), Tree traversals (Inorder, Preorder, Postorder, Level-order), and more.'
      },
      {
        icon: Layers,
        title: 'Step-by-Step Execution',
        detail: 'Every algorithm is broken into individual steps. Watch the pointer move, see comparisons happen, observe swaps in real-time. Control playback speed, step forward/backward.'
      },
      {
        icon: GitBranch,
        title: '4 OOP Concepts',
        detail: 'Encapsulation, Abstraction, Inheritance, Polymorphism — each with interactive class diagrams and live method resolution visualizations.'
      },
      {
        icon: Lock,
        title: '13 Cryptography Visualizers',
        detail: 'Caesar, Vigenère, Playfair, Rail Fence, Columnar, AES, RSA, SHA-256, Digital Signatures, Steganography, Enigma Machine, Diffie-Hellman — watch encryption happen byte by byte.'
      },
    ],
    callToAction: 'Enter the Observatory'
  },

  workshop: {
    title: 'The Workshop',
    subtitle: 'Live Code Sandbox',
    icon: Wrench,
    accentColor: '#f59e0b',   // amber
    glowColor: 'rgba(245, 158, 11, 0.15)',
    route: '/sandbox',
    description: 'Write code in JavaScript, Python, C++, or Java. Execute it live in the browser, then let AI analyze your code\'s complexity, detect data structures, and generate interactive visualizations of how your code actually behaves.',
    features: [
      {
        icon: Code2,
        title: 'Monaco Code Editor',
        detail: 'Full-featured code editor with syntax highlighting, auto-completion, and error detection. Supports JavaScript, Python, C++, and Java with language-specific formatting.'
      },
      {
        icon: Play,
        title: 'Live Execution',
        detail: 'Run your code instantly in a secure sandbox. See stdout output in a built-in terminal. Errors are highlighted with clear stack traces and line numbers.'
      },
      {
        icon: BrainCircuit,
        title: 'AI Code Analysis',
        detail: 'AI detects your code\'s time complexity (O(n), O(n²), O(log n)...), space complexity, and identifies which data structures you\'re using — arrays, linked lists, trees, graphs.'
      },
      {
        icon: Sparkles,
        title: 'Visual Canvas',
        detail: 'AI generates an interactive visualization of your code\'s behavior. Write a sorting algorithm → AI generates a visual showing the sort happening. Write a tree traversal → see the tree being traversed.'
      },
      {
        icon: Zap,
        title: 'Resizable Split Panes',
        detail: 'Drag to resize the editor, terminal, and visualization panels. Customize your workspace layout to focus on what matters most — code, output, or analysis.'
      },
    ],
    callToAction: 'Enter the Workshop'
  },

  arena: {
    title: 'The Arena',
    subtitle: 'Assessment & Competition Center',
    icon: Swords,
    accentColor: '#BC4A54',   // Code Nova red
    glowColor: 'rgba(188, 74, 84, 0.15)',
    route: '/game',
    description: 'Test your knowledge across 6 progressive levels of quizzes and coding challenges. Compete in real-time 1v1 duels, join organization-hosted competitions, and climb the leaderboard from beginner to expert.',
    features: [
      {
        icon: BookOpen,
        title: '6 Progressive Levels',
        detail: 'Data Structures, Algorithms, OOP, Cryptography, System Design, and Mixed — each level must be completed to unlock the next. Questions include MCQs, code output prediction, and live coding.'
      },
      {
        icon: Trophy,
        title: 'XP System & Leaderboard',
        detail: 'Earn XP for correct answers, speed bonuses, and streaks. Unlock levels as you progress. Compare your rank on the live leaderboard updated in real-time.'
      },
      {
        icon: Swords,
        title: '1v1 Real-Time Duels',
        detail: 'Challenge another player to a head-to-head quiz duel. Both players answer the same questions simultaneously. Fastest correct answers win. Live score tracking.'
      },
      {
        icon: Users,
        title: 'Host Competitions',
        detail: 'Teachers and organizations can create custom competitions with AI-generated questions. Set time limits, choose topics, invite participants. Live leaderboard during the event.'
      },
      {
        icon: Target,
        title: 'Activity Tracking',
        detail: 'GitHub-style activity heatmap showing your study consistency. Track completed assessments, past results, and in-progress tests. See your growth over time.'
      },
    ],
    callToAction: 'Enter the Arena'
  }
};

// ─── Component ─────────────────────────────────────────────────────

export default function ZoneDetailPanel({ activeZone, onClose }) {
  const navigate = useNavigate();
  const data = activeZone ? ZONE_DATA[activeZone] : null;

  return (
    <AnimatePresence>
      {data && (
        <motion.div
          key={activeZone}
          initial={{ opacity: 0, x: 60, filter: 'blur(12px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: 40, filter: 'blur(8px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-1/2 right-6 -translate-y-1/2 z-50 w-[420px] max-h-[85vh] pointer-events-auto"
        >
          <div
            className="relative rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
            style={{
              background: `linear-gradient(135deg, rgba(15,20,35,0.92), rgba(10,15,30,0.96))`,
              backdropFilter: 'blur(24px)',
            }}
          >
            {/* Accent glow */}
            <div
              className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] pointer-events-none"
              style={{ background: data.glowColor }}
            />

            {/* Header */}
            <div className="relative px-6 pt-6 pb-4 border-b border-white/5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ background: `${data.accentColor}20`, border: `1px solid ${data.accentColor}40` }}
                  >
                    <data.icon size={22} style={{ color: data.accentColor }} />
                  </div>
                  <div>
                    <h2 className="text-white text-lg font-bold tracking-wide">{data.title}</h2>
                    <p className="text-gray-400 text-xs tracking-wider uppercase mt-0.5">{data.subtitle}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mt-4">
                {data.description}
              </p>
            </div>

            {/* Features list */}
            <div className="px-6 py-4 space-y-3 max-h-[45vh] overflow-y-auto custom-scrollbar">
              {data.features.map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.35 }}
                  className="group flex gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors"
                >
                  <div
                    className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center mt-0.5"
                    style={{ background: `${data.accentColor}12`, border: `1px solid ${data.accentColor}20` }}
                  >
                    <feat.icon size={16} style={{ color: data.accentColor }} strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-semibold">{feat.title}</h4>
                    <p className="text-gray-400 text-xs leading-relaxed mt-1">{feat.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="px-6 pb-6 pt-3 border-t border-white/5">
              <button
                onClick={() => navigate(data.route)}
                className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:brightness-110 hover:shadow-lg active:scale-[0.98]"
                style={{
                  background: `linear-gradient(135deg, ${data.accentColor}, ${data.accentColor}cc)`,
                  boxShadow: `0 4px 20px ${data.accentColor}30`
                }}
              >
                {data.callToAction}
                <ArrowRight size={16} />
              </button>

              {/* Keyboard hint */}
              <p className="text-center text-gray-500 text-[10px] mt-3 tracking-wider uppercase">
                Walk into the door to enter
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
