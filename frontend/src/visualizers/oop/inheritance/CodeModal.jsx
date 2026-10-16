import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Terminal, Code2, BookOpen, Sparkles } from 'lucide-react';

export const JAVA_CODE_FILES = {
  Person: {
    filename: 'Person.java',
    desc: 'Base class declaring core genetic attributes, default constructor, and common behaviors.',
    code: `// Superclass / Base Class: Person
public class Person {
    // Protected attributes inherited by Child1 & Child2 subclasses
    protected String skinTone;
    protected String hairColor;
    protected String height;
    protected boolean wearsGlasses;

    // Default Constructor initializing genetic human traits
    public Person() {
        this.skinTone = "dusky";
        this.hairColor = "brown";
        this.height = "tall";
        this.wearsGlasses = true;
    }

    // Common Behaviors inherited by all subclasses
    public void eat() {
        System.out.println(getClass().getSimpleName() + " is eating nutritious food.");
    }

    public void sleep() {
        System.out.println(getClass().getSimpleName() + " sleeps 8 hours peacefully.");
    }

    // Method to display genetic traits
    public void displayTraits() {
        System.out.println("--- " + getClass().getSimpleName() + " Trait Profile ---");
        System.out.println("Skin Tone     : " + this.skinTone);
        System.out.println("Hair Color    : " + this.hairColor);
        System.out.println("Height        : " + this.height);
        System.out.println("Wears Glasses : " + this.wearsGlasses);
    }
}`,
    explanation: 'Person is the parent base class. By declaring attributes as protected, subclasses (Child1 & Child2) gain direct access to inherit and specialize them without rewriting code.'
  },
  Child1: {
    filename: 'Child1.java',
    desc: 'Subclass 1: extends Person via super(), inherits dusky skin & glasses, overrides hairColor to black and height to shorter.',
    code: `// Subclass 1: Child1 inherits from Person
public class Child1 extends Person {

    // Constructor: Invokes super() to inherit Person's base traits,
    // then specializes hairColor and height.
    public Child1() {
        super(); // Inherits: skinTone="dusky", height="tall", wearsGlasses=true

        // Specialize / Override inherited values
        this.hairColor = "black";   // Overrides Person's brown hair
        this.height = "shorter";    // Custom modified height
    }

    // Method Overriding: Specialize displayTraits() for Child1
    @Override
    public void displayTraits() {
        System.out.println("=== Child1 Profile (Hierarchical Subclass 1) ===");
        System.out.println("Skin Tone (Inherited)  : " + this.skinTone);     // dusky
        System.out.println("Glasses   (Inherited)  : " + this.wearsGlasses); // true
        System.out.println("Hair Color (Overridden): " + this.hairColor);    // black
        System.out.println("Height     (Modified)  : " + this.height);       // shorter
    }

    // Child1's own specialized behavior
    public void study() {
        System.out.println("Child1 is studying software engineering.");
    }
}`,
    explanation: 'Child1 calls super() in its constructor to inherit Person\'s traits, then modifies this.hairColor to "black" and this.height to "shorter". It also overrides displayTraits().'
  },
  Child2: {
    filename: 'Child2.java',
    desc: 'Subclass 2: extends Person via super(), inherits brown hair & tall height, introduces own fair skin and blue eyes.',
    code: `// Subclass 2: Child2 inherits from Person
public class Child2 extends Person {
    // Child2's own unique specialized attribute
    private String eyeColor;

    // Constructor: Invokes super() to inherit Person's base traits,
    // and initializes Child2's unique characteristics.
    public Child2() {
        super(); // Inherits: hairColor="brown", height="tall", eat(), sleep()

        // Own specialized genetic attributes
        this.skinTone = "fair";     // Unique skin tone
        this.eyeColor = "blue";     // Unique radiant eye color
    }

    // Getter for unique property
    public String getEyeColor() {
        return eyeColor;
    }

    // Method Overriding: Specialize displayTraits() for Child2
    @Override
    public void displayTraits() {
        System.out.println("=== Child2 Profile (Hierarchical Subclass 2) ===");
        System.out.println("Hair Color (Inherited) : " + this.hairColor); // brown
        System.out.println("Height     (Inherited) : " + this.height);    // tall
        System.out.println("Skin Tone  (Specialized): " + this.skinTone);  // fair
        System.out.println("Eye Color  (Own Trait)  : " + this.eyeColor);  // blue
    }

    // Child2's own specialized behavior
    public void play() {
        System.out.println("Child2 is playing outdoor sports.");
    }
}`,
    explanation: 'Child2 also inherits from Person, keeping Person\'s brown hair and tall height, but introduces its own fair skin and blue eyes. Both Child1 and Child2 share Person as their single parent.'
  },
  HierarchicalDemo: {
    filename: 'HierarchicalDemo.java',
    desc: 'Main runnable program demonstrating hierarchical inheritance and polymorphism.',
    code: `// Main Execution Class: Demonstrating Hierarchical Inheritance in Java
public class HierarchicalDemo {
    public static void main(String[] args) {
        System.out.println("=================================================");
        System.out.println("      JAVA HIERARCHICAL INHERITANCE DEMO         ");
        System.out.println("   One Base Class (Person) -> Multiple Subclasses");
        System.out.println("=================================================\\n");

        // 1. Instantiate Parent Class (Person)
        Person parent = new Person();
        parent.displayTraits();
        parent.eat();
        System.out.println();

        // 2. Instantiate Subclass 1 (Child1)
        Child1 child1 = new Child1();
        child1.displayTraits();
        child1.eat();   // Inherited method from Person
        child1.study(); // Child1's own method
        System.out.println();

        // 3. Instantiate Subclass 2 (Child2)
        Child2 child2 = new Child2();
        child2.displayTraits();
        child2.sleep(); // Inherited method from Person
        child2.play();  // Child2's own method
        System.out.println();

        // 4. Polymorphic Reference Demonstration
        System.out.println("--- Polymorphic Superclass References ---");
        Person ref1 = new Child1();
        Person ref2 = new Child2();
        ref1.eat(); // Dispatches cleanly via Person contract
        ref2.eat(); // Dispatches cleanly via Person contract
    }
}`,
    explanation: 'Hierarchical Inheritance allows Person to distribute a single proven foundation to Child1 and Child2. Both subclasses reuse Person\'s methods (eat, sleep) while having distinct traits.'
  }
};

export const CodeModal = ({ isOpen, onClose, initialTab = 'Person' }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'Person');
  const [copied, setCopied] = useState(false);

  // Normalize initialTab
  React.useEffect(() => {
    if (initialTab && JAVA_CODE_FILES[initialTab]) {
      setActiveTab(initialTab);
    } else if (initialTab === 'Student') {
      setActiveTab('Child1');
    } else if (initialTab === 'Employee') {
      setActiveTab('Child2');
    } else if (initialTab === 'MainDemo') {
      setActiveTab('HierarchicalDemo');
    }
  }, [initialTab]);

  if (!isOpen) return null;

  const currentFile = JAVA_CODE_FILES[activeTab] || JAVA_CODE_FILES.Person;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
        {/* Backdrop dismiss */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 w-full max-w-3xl rounded-3xl bg-[#090D17] border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.2)] flex flex-col overflow-hidden text-slate-100 font-sans max-h-[90vh]"
        >
          {/* 1. Modal Top Bar (macOS traffic lights + title + actions) */}
          <div className="px-5 py-3.5 bg-slate-900/90 border-b border-white/10 flex items-center justify-between shrink-0">
            {/* Left: Window Controls */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block" />
              <div className="ml-3 flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300">
                <Terminal size={13} className="text-cyan-400" />
                <span>Hierarchical Inheritance Java Architecture</span>
              </div>
            </div>

            {/* Right: Copy & Close */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* 2. File Tabs */}
          <div className="flex items-center gap-1 px-4 py-2 bg-slate-950/70 border-b border-white/5 overflow-x-auto shrink-0">
            {Object.keys(JAVA_CODE_FILES).map((key) => {
              const file = JAVA_CODE_FILES[key];
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Code2 size={12} className={isActive ? 'text-cyan-400' : 'text-slate-500'} />
                  <span>{file.filename}</span>
                </button>
              );
            })}
          </div>

          {/* 3. Code Editor Body */}
          <div className="flex-1 p-5 overflow-y-auto font-mono text-xs leading-relaxed bg-[#060911]">
            <pre className="text-slate-300 selection:bg-cyan-500/30">
              <code>
                {currentFile.code.split('\n').map((line, idx) => (
                  <div key={idx} className="table-row">
                    <span className="table-cell pr-4 text-right select-none text-slate-600 w-8">
                      {idx + 1}
                    </span>
                    <span className="table-cell">
                      {line.trim().startsWith('//') ? (
                        <span className="text-slate-500 italic">{line}</span>
                      ) : line.includes('@Override') ? (
                        <span className="text-amber-400 font-semibold">{line}</span>
                      ) : line.includes('class ') ? (
                        <span className="text-cyan-400 font-bold">{line}</span>
                      ) : line.includes('extends ') ? (
                        <span className="text-sky-300 font-semibold">{line}</span>
                      ) : line.includes('super(') ? (
                        <span className="text-emerald-400 font-semibold">{line}</span>
                      ) : line.includes('System.out.println') ? (
                        <span className="text-indigo-300">{line}</span>
                      ) : (
                        line
                      )}
                    </span>
                  </div>
                ))}
              </code>
            </pre>
          </div>

          {/* 4. Bottom Pedagogical Insight Card */}
          <div className="px-5 py-3.5 bg-slate-900/90 border-t border-white/10 flex items-start gap-3 shrink-0">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
              <Sparkles size={14} />
            </div>
            <div className="text-xs">
              <span className="font-mono font-bold text-cyan-300 uppercase tracking-wider">
                OOP Insight:
              </span>
              <p className="text-slate-300 font-sans mt-0.5 leading-snug">
                {currentFile.explanation}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
