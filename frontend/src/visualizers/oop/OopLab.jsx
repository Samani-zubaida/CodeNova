import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipBack, SkipForward, RotateCcw, Plus, Trash2, 
  ArrowRight, Shield, Lock, Unlock, Eye, EyeOff, Layers, Code2, 
  Terminal, Zap, Sparkles, CheckCircle2, ChevronRight, HelpCircle,
  Database, User, GitFork, Sliders, Flame, Cpu, Compass, Activity, 
  AlertTriangle, RefreshCw
} from 'lucide-react';
import VisualizerNav from '../../components/layout/VisualizerNav';

// ============================================================================
// OOP RUNTIME DEFINITIONS (CLASSES & SCHEMAS)
// ============================================================================

const BLUEPRINTS = {
  Car: {
    name: 'Car',
    parent: 'Vehicle',
    badge: 'Standard Class',
    color: '#AB526B', // deep rose
    fields: [
      { name: 'color', type: 'string', default: 'Red', isPrivate: false },
      { name: 'speed', type: 'number', default: 0, isPrivate: false }
    ],
    methods: ['accelerate(20)', 'brake(15)', 'start()'],
    codeLines: {
      create: [
        'const car = new Car("Red", 0);',
        '// Memory allocated on Heap at reference'
      ],
      accelerate: [
        'car.accelerate(20) {',
        '  this.speed += 20;',
        '  return this.speed;',
        '}'
      ],
      start: [
        'car.start() {',
        '  this.engine.start();',
        '  this.isRunning = true;',
        '}'
      ]
    }
  },
  Engine: {
    name: 'Engine',
    parent: null,
    badge: 'Component Class',
    color: '#F0E2A4', // sand gold
    fields: [
      { name: 'cylinders', type: 'number', default: 4, isPrivate: false },
      { name: 'isRunning', type: 'boolean', default: false, isPrivate: false }
    ],
    methods: ['start()', 'stop()'],
    codeLines: {
      start: [
        'engine.start() {',
        '  this.isRunning = true;',
        '  return "VROOOM";',
        '}'
      ]
    }
  },
  BankAccount: {
    name: 'BankAccount',
    parent: null,
    badge: 'Encapsulated Class',
    color: '#C5CEAE', // sage green
    fields: [
      { name: '#balance', type: 'number', default: 500, isPrivate: true },
      { name: '#pin', type: 'string', default: '9841', isPrivate: true }
    ],
    methods: ['deposit(200)', 'withdraw(100)', 'directTamper()'],
    codeLines: {
      deposit: [
        'account.deposit(200) {',
        '  if (amount > 0) {',
        '    this.#balance += 200;',
        '  }',
        '}'
      ],
      directTamper: [
        '// ILLEGAL DIRECT ACCESS ATTEMPT:',
        'account.#balance = 0;',
        '// => TypeError: Private field "#balance" cannot be accessed'
      ]
    }
  },
  Animal: {
    name: 'Animal',
    parent: null,
    badge: 'Superclass',
    color: '#BCA297', // taupe
    fields: [
      { name: 'energy', type: 'number', default: 100, isPrivate: false }
    ],
    methods: ['sleep()', 'makeSound()'],
    codeLines: {
      sleep: [
        'animal.sleep() {',
        '  this.energy += 20;',
        '  return "Zzz...";',
        '}'
      ],
      makeSound: [
        'animal.makeSound() {',
        '  return "Generic animal sound";',
        '}'
      ]
    }
  },
  Dog: {
    name: 'Dog',
    parent: 'Animal',
    badge: 'Subclass (Inherits Animal)',
    color: '#AB526B',
    fields: [
      { name: 'barkVolume', type: 'number', default: 90, isPrivate: false }
    ],
    methods: ['makeSound()', 'fetch()'],
    codeLines: {
      makeSound: [
        'dog.makeSound() {',
        '  // OVERRIDDEN METHOD:',
        '  return "WOOF! WOOF!";',
        '}'
      ]
    }
  },
  Cat: {
    name: 'Cat',
    parent: 'Animal',
    badge: 'Subclass (Inherits Animal)',
    color: '#F0E2A4',
    fields: [
      { name: 'isSleeping', type: 'boolean', default: false, isPrivate: false }
    ],
    methods: ['makeSound()', 'purr()'],
    codeLines: {
      makeSound: [
        'cat.makeSound() {',
        '  // OVERRIDDEN METHOD:',
        '  return "MEOW! =^.^=";',
        '}'
      ]
    }
  }
};

// Guided Interactive Missions
const GUIDED_MISSIONS = [
  {
    id: 1,
    title: 'Mission 1: Instantiation & State Isolation',
    instruction: 'Create two Cars. Accelerate Car 1 and verify Car 2 remains at 0 speed!',
    check: (objs) => {
      const cars = objs.filter(o => o.className === 'Car');
      return cars.length >= 2 && cars.some(c => c.fields.speed > 0) && cars.some(c => c.fields.speed === 0);
    },
    hint: 'Click "+ New Car" twice, then click "accelerate(20)" on the first car.'
  },
  {
    id: 2,
    title: 'Mission 2: Object-to-Object Communication',
    instruction: 'Trigger car.start() to send a message signal from Car to its Engine!',
    check: (objs) => objs.some(o => o.className === 'Engine' && o.fields.isRunning),
    hint: 'Create an Engine, create a Car, and click "start()" on the Car.'
  },
  {
    id: 3,
    title: 'Mission 3: Method Overriding & Upward Lookup',
    instruction: 'Call dog.makeSound() (overridden on Dog) and dog.sleep() (lookup to Animal)!',
    check: (objs) => objs.some(o => o.className === 'Dog' && o.hasOverriddenSound && o.hasInheritedSleep),
    hint: 'Click "makeSound()" on Dog, then click "sleep()" to watch lookup traverse up to Animal.'
  },
  {
    id: 4,
    title: 'Mission 4: Polymorphic Broadcast',
    instruction: 'Broadcast animal.makeSound() across Dog and Cat to see distinct behaviors!',
    check: (objs) => objs.some(o => o.className === 'Dog' && o.hasPolymorphed) && objs.some(o => o.className === 'Cat' && o.hasPolymorphed),
    hint: 'Click the "Polymorphic Broadcast" button in the action bar.'
  },
  {
    id: 5,
    title: 'Mission 5: Encapsulation & Laser Barrier',
    instruction: 'Test direct tamper on BankAccount to trigger the defense forcefield, then use deposit()!',
    check: (objs) => objs.some(o => o.className === 'BankAccount' && o.deflectedAttack && o.fields['#balance'] > 500),
    hint: 'Click "directTamper()" to watch deflection, then click "deposit(200)".'
  }
];

export default function OopLab({ isEmbedded = false }) {
  // Mode: 'explore' vs 'guided'
  const [labMode, setLabMode] = useState('explore');
  const [activeMissionIdx, setActiveMissionIdx] = useState(0);

  // Persistent Objects on Canvas
  const [objects, setObjects] = useState([
    {
      id: 'car_1',
      name: 'car1',
      className: 'Car',
      heapAddress: '0x10A4',
      x: 320,
      y: 60,
      fields: { color: 'Red', speed: 20 },
      isExpanded: false,
      hasOverriddenSound: false,
      hasInheritedSleep: false,
      hasPolymorphed: false,
      deflectedAttack: false
    },
    {
      id: 'car_2',
      name: 'car2',
      className: 'Car',
      heapAddress: '0x10BC',
      x: 320,
      y: 280,
      fields: { color: 'Blue', speed: 0 },
      isExpanded: false,
      hasOverriddenSound: false,
      hasInheritedSleep: false,
      hasPolymorphed: false,
      deflectedAttack: false
    }
  ]);

  // Active Blueprint for Inspection
  const [selectedBlueprint, setSelectedBlueprint] = useState('Car');
  const [selectedObjectId, setSelectedObjectId] = useState('car_1');

  // Animation & Execution States
  const [thisPointerId, setThisPointerId] = useState(null); // Which object currently has 'this' badge
  const [activeSignal, setActiveSignal] = useState(null); // { fromX, fromY, toX, toY, text, color }
  const [activeLaser, setActiveLaser] = useState(null); // { targetId, isDeflected }
  const [activeLookupRay, setActiveLookupRay] = useState(null); // { fromObj, toClass }
  const [highlightedCodeLine, setHighlightedCodeLine] = useState(0);
  const [codeLines, setCodeLines] = useState(BLUEPRINTS.Car.codeLines.accelerate);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // 0.5x, 1x, 2x
  const [callStack, setCallStack] = useState([{ name: 'main()', addr: '0x0001' }]);
  const [statusMessage, setStatusMessage] = useState('Workspace ready. Interact with objects or blueprints.');

  // Dragging states
  const [draggedObjectId, setDraggedObjectId] = useState(null);
  const canvasRef = useRef(null);

  // 1. CLASS -> OBJECT CREATION ANIMATION
  const handleCreateObject = async (className) => {
    const blueprint = BLUEPRINTS[className];
    const newId = `${className.toLowerCase()}_${Date.now().toString().slice(-3)}`;
    const newName = `${className.toLowerCase()}${objects.filter(o => o.className === className).length + 1}`;
    const newAddr = `0x${(0x1000 + Math.floor(Math.random() * 0x0FFF)).toString(16).toUpperCase()}`;

    // Compute non-overlapping position
    const offsetX = 300 + (objects.length % 3) * 220;
    const offsetY = 60 + Math.floor(objects.length / 3) * 220;

    setStatusMessage(`Extruding new instance from ${className} blueprint...`);
    setHighlightedCodeLine(0);
    setCodeLines([
      `const ${newName} = new ${className}();`,
      `// 1. Memory allocated at Heap address ${newAddr}`,
      `// 2. constructor() called`,
      `// 3. Properties initialized`
    ]);

    // Push call stack
    setCallStack(prev => [...prev, { name: `new ${className}()`, addr: newAddr }]);

    // Initial embryonic object
    const newObj = {
      id: newId,
      name: newName,
      className,
      heapAddress: newAddr,
      x: offsetX,
      y: offsetY,
      fields: {},
      isExpanded: false,
      status: 'allocating',
      hasOverriddenSound: false,
      hasInheritedSleep: false,
      hasPolymorphed: false,
      deflectedAttack: false
    };

    setObjects(prev => [...prev, newObj]);

    // Sequential property population animation
    for (const f of blueprint.fields) {
      await new Promise(r => setTimeout(r, 400 / speedMultiplier));
      setObjects(prev => prev.map(o => {
        if (o.id === newId) {
          return {
            ...o,
            fields: { ...o.fields, [f.name]: f.default }
          };
        }
        return o;
      }));
    }

    // Finished
    await new Promise(r => setTimeout(r, 300 / speedMultiplier));
    setObjects(prev => prev.map(o => o.id === newId ? { ...o, status: 'idle' } : o));
    setCallStack(prev => prev.slice(0, -1));
    setStatusMessage(`Created instance "${newName}" from class ${className} at heap address ${newAddr}.`);
    setSelectedObjectId(newId);
  };

  // 2. PROPERTY MUTATION ANIMATION (Old value leaving, new value entering)
  const handleModifyProperty = async (objId, propName, delta = 20) => {
    const targetObj = objects.find(o => o.id === objId);
    if (!targetObj) return;

    setThisPointerId(objId);
    const oldVal = targetObj.fields[propName];
    const newVal = typeof oldVal === 'number' ? oldVal + delta : oldVal;

    setStatusMessage(`Modifying ${targetObj.name}.${propName}: ${oldVal} -> ${newVal}`);
    setHighlightedCodeLine(1);
    setCodeLines([
      `${targetObj.name}.${propName} = ${newVal};`,
      `// State isolated: only ${targetObj.name} updates. Other instances untouched.`
    ]);

    // Highlight target object
    setObjects(prev => prev.map(o => o.id === objId ? { ...o, mutatingProp: propName } : o));

    await new Promise(r => setTimeout(r, 500 / speedMultiplier));

    // Update value
    setObjects(prev => prev.map(o => {
      if (o.id === objId) {
        return {
          ...o,
          fields: { ...o.fields, [propName]: newVal },
          mutatingProp: null
        };
      }
      return o;
    }));

    setThisPointerId(null);
  };

  // 3. METHOD EXECUTION ANIMATION & 'THIS' POINTER TRACKING
  const handleExecuteMethod = async (objId, methodName) => {
    const targetObj = objects.find(o => o.id === objId);
    if (!targetObj) return;

    setSelectedObjectId(objId);
    setThisPointerId(objId); // Snap THIS badge to target
    setStatusMessage(`Executing ${targetObj.name}.${methodName}...`);

    // Call stack frame push
    setCallStack(prev => [...prev, { name: `${targetObj.name}.${methodName}`, addr: targetObj.heapAddress }]);

    if (methodName.startsWith('accelerate')) {
      setCodeLines(BLUEPRINTS.Car.codeLines.accelerate);
      setHighlightedCodeLine(0);
      await new Promise(r => setTimeout(r, 400 / speedMultiplier));

      setHighlightedCodeLine(1);
      // Mutate speed
      setObjects(prev => prev.map(o => {
        if (o.id === objId) {
          return {
            ...o,
            fields: { ...o.fields, speed: (o.fields.speed || 0) + 20 }
          };
        }
        return o;
      }));

      await new Promise(r => setTimeout(r, 500 / speedMultiplier));
      setHighlightedCodeLine(2);
      setStatusMessage(`${targetObj.name} accelerated: speed is now ${targetObj.fields.speed + 20} MPH.`);

    } else if (methodName.startsWith('brake')) {
      setObjects(prev => prev.map(o => {
        if (o.id === objId) {
          return {
            ...o,
            fields: { ...o.fields, speed: Math.max(0, (o.fields.speed || 0) - 15) }
          };
        }
        return o;
      }));
      setStatusMessage(`${targetObj.name} decelerated.`);

    } else if (methodName === 'start()') {
      // 4. OBJECT-TO-OBJECT COMMUNICATION (Car -> Engine)
      const engineObj = objects.find(o => o.className === 'Engine');
      if (engineObj) {
        setCodeLines(BLUEPRINTS.Car.codeLines.start);
        setHighlightedCodeLine(0);
        await new Promise(r => setTimeout(r, 400 / speedMultiplier));

        // Signal travels to engine
        setStatusMessage(`car.start() sending message signal to engine @ ${engineObj.heapAddress}...`);
        setActiveSignal({
          fromX: targetObj.x + 80,
          fromY: targetObj.y + 40,
          toX: engineObj.x + 80,
          toY: engineObj.y + 40,
          text: 'start()'
        });

        await new Promise(r => setTimeout(r, 700 / speedMultiplier));
        setActiveSignal(null);

        // Engine starts
        setCallStack(prev => [...prev, { name: `${engineObj.name}.start()`, addr: engineObj.heapAddress }]);
        setObjects(prev => prev.map(o => o.id === engineObj.id ? { ...o, fields: { ...o.fields, isRunning: true } } : o));
        setStatusMessage(`engine.start() executed! Return value "VROOOM" returning to car...`);

        // Return signal
        setActiveSignal({
          fromX: engineObj.x + 80,
          fromY: engineObj.y + 40,
          toX: targetObj.x + 80,
          toY: targetObj.y + 40,
          text: 'return "VROOOM"'
        });

        await new Promise(r => setTimeout(r, 700 / speedMultiplier));
        setActiveSignal(null);
        setCallStack(prev => prev.filter(f => !f.name.includes('engine')));
      } else {
        setStatusMessage(`car.start() called. (Tip: Instantiate an Engine on canvas to see inter-object message passing!)`);
      }

    } else if (methodName === 'makeSound()') {
      // 6. METHOD OVERRIDING LOOKUP
      if (targetObj.className === 'Dog' || targetObj.className === 'Cat') {
        const sound = targetObj.className === 'Dog' ? 'WOOF! WOOF!' : 'MEOW! =^.^=';
        setCodeLines(BLUEPRINTS[targetObj.className].codeLines.makeSound);
        setHighlightedCodeLine(0);
        setStatusMessage(`Method lookup: Checking ${targetObj.className} prototype... Found overridden ${targetObj.className}::makeSound()!`);
        await new Promise(r => setTimeout(r, 600 / speedMultiplier));

        setHighlightedCodeLine(2);
        setStatusMessage(`${targetObj.name} executed overridden method: "${sound}"`);
        setObjects(prev => prev.map(o => o.id === objId ? { ...o, hasOverriddenSound: true, soundBubble: sound } : o));
        setTimeout(() => setObjects(prev => prev.map(o => o.id === objId ? { ...o, soundBubble: null } : o)), 2000);
      } else {
        setStatusMessage(`Animal::makeSound() executed.`);
      }

    } else if (methodName === 'sleep()') {
      // Upward lookup to superclass Animal
      setStatusMessage(`Method lookup: Checking ${targetObj.className}... Not found! Traversing up inheritance conduit to Animal...`);
      setActiveLookupRay({ fromObj: targetObj.id, toClass: 'Animal' });
      setCodeLines(BLUEPRINTS.Animal.codeLines.sleep);
      setHighlightedCodeLine(0);

      await new Promise(r => setTimeout(r, 700 / speedMultiplier));
      setActiveLookupRay(null);
      setHighlightedCodeLine(1);

      setObjects(prev => prev.map(o => {
        if (o.id === objId) {
          return {
            ...o,
            fields: { ...o.fields, energy: (o.fields.energy || 100) + 20 },
            hasInheritedSleep: true,
            soundBubble: 'Zzz... (+20 Energy)'
          };
        }
        return o;
      }));
      setTimeout(() => setObjects(prev => prev.map(o => o.id === objId ? { ...o, soundBubble: null } : o)), 2000);
      setStatusMessage(`Inherited Animal::sleep() executed on ${targetObj.name}!`);

    } else if (methodName === 'directTamper()') {
      // 8. ENCAPSULATION LASER DEFLECTION BARRIER
      setStatusMessage(`Hacker attempt: Direct write to ${targetObj.name}.#balance!`);
      setCodeLines(BLUEPRINTS.BankAccount.codeLines.directTamper);
      setHighlightedCodeLine(1);
      setActiveLaser({ targetId: objId, isDeflected: true });

      await new Promise(r => setTimeout(r, 600 / speedMultiplier));
      setHighlightedCodeLine(2);
      setStatusMessage(`DEFLECTED! TypeError: Cannot access private identifier '#balance' outside class.`);
      setObjects(prev => prev.map(o => o.id === objId ? { ...o, deflectedAttack: true } : o));

      await new Promise(r => setTimeout(r, 1200 / speedMultiplier));
      setActiveLaser(null);

    } else if (methodName.startsWith('deposit')) {
      setCodeLines(BLUEPRINTS.BankAccount.codeLines.deposit);
      setHighlightedCodeLine(0);
      await new Promise(r => setTimeout(r, 400 / speedMultiplier));

      setHighlightedCodeLine(2);
      setObjects(prev => prev.map(o => {
        if (o.id === objId) {
          return {
            ...o,
            fields: { ...o.fields, '#balance': (o.fields['#balance'] || 500) + 200 }
          };
        }
        return o;
      }));
      setStatusMessage(`Validated public deposit(200) entered vault. Internal #balance updated.`);
    }

    setCallStack(prev => prev.slice(0, -1));
    setThisPointerId(null);
  };

  // 7. POLYMORPHIC BROADCAST (One call -> Multiple Objects -> Different Behaviors)
  const handlePolymorphicBroadcast = async () => {
    const animals = objects.filter(o => ['Animal', 'Dog', 'Cat'].includes(o.className));
    if (animals.length === 0) {
      setStatusMessage('Instantiate a Dog and a Cat on the workspace first!');
      return;
    }

    setStatusMessage('Broadcasting polymorphic call: animals.forEach(a => a.makeSound())');
    for (const a of animals) {
      setThisPointerId(a.id);
      const sound = a.className === 'Dog' ? 'WOOF!' : a.className === 'Cat' ? 'MEOW!' : 'Chirp';
      setObjects(prev => prev.map(o => o.id === a.id ? { ...o, hasPolymorphed: true, soundBubble: sound } : o));
      await new Promise(r => setTimeout(r, 600 / speedMultiplier));
    }

    setTimeout(() => {
      setObjects(prev => prev.map(o => ({ ...o, soundBubble: null })));
      setThisPointerId(null);
    }, 1800);
    setStatusMessage('Polymorphism verified: One command triggered unique concrete behaviors!');
  };

  // Delete Object
  const handleDeleteObject = (id) => {
    setObjects(prev => prev.filter(o => o.id !== id));
    if (selectedObjectId === id) setSelectedObjectId(null);
    setStatusMessage('Object deallocated from Heap.');
  };

  // Dragging support
  const handleMouseDown = (id, e) => {
    setDraggedObjectId(id);
  };

  const handleMouseMove = (e) => {
    if (!draggedObjectId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(20, Math.min(rect.width - 220, e.clientX - rect.left - 100));
    const newY = Math.max(20, Math.min(rect.height - 220, e.clientY - rect.top - 50));

    setObjects(prev => prev.map(o => o.id === draggedObjectId ? { ...o, x: newX, y: newY } : o));
  };

  const handleMouseUp = () => {
    setDraggedObjectId(null);
  };

  // Check guided mission completion
  const currentMission = GUIDED_MISSIONS[activeMissionIdx];
  const isCurrentMissionDone = useMemo(() => {
    return currentMission ? currentMission.check(objects) : false;
  }, [currentMission, objects]);

  return (
    <div 
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="w-full flex-1 flex flex-col text-[#FAF7F2] font-sans select-none relative overflow-hidden"
    >
      {!isEmbedded && <VisualizerNav title="Interactive OOP Laboratory" />}

      {/* TOP CONTROL BAR: PLAYBACK, SPEED & SPAWN PILLS */}
      <div className="w-full bg-[#423834] border-b border-[#5C4E49] px-4 py-3 flex flex-wrap items-center justify-between gap-3 z-30 shadow-md">
        
        {/* Left: Spawn Class Instance Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono font-bold text-[#BCA297] uppercase mr-1 flex items-center gap-1">
            <Plus size={14} className="text-[#C5CEAE]" /> Instantiate:
          </span>
          {Object.keys(BLUEPRINTS).map(cName => {
            const bp = BLUEPRINTS[cName];
            return (
              <button
                key={cName}
                onClick={() => handleCreateObject(cName)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#331921] hover:bg-[#5C4E49] text-[#FAF7F2] border border-[#5C4E49] transition-all flex items-center gap-1.5 hover:scale-105 shadow-sm"
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: bp.color }} />
                <span>+ {cName}</span>
              </button>
            );
          })}
        </div>

        {/* Center: Polymorphic Broadcast & Abstraction Internals */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePolymorphicBroadcast}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#AB526B] hover:bg-[#8C3850] text-white shadow-md transition-all flex items-center gap-1.5"
          >
            <Sparkles size={14} />
            <span>Polymorphic Broadcast</span>
          </button>
        </div>

        {/* Right: Speed & Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex bg-[#331921] p-1 rounded-xl border border-[#5C4E49]">
            {['explore', 'guided'].map(m => (
              <button
                key={m}
                onClick={() => setLabMode(m)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  labMode === m ? 'bg-[#AB526B] text-white shadow' : 'text-[#BCA297] hover:text-[#FAF7F2]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-[#331921] p-1 rounded-xl border border-[#5C4E49] text-xs font-mono font-bold">
            {[0.5, 1, 2].map(spd => (
              <button
                key={spd}
                onClick={() => setSpeedMultiplier(spd)}
                className={`px-2 py-0.5 rounded-md ${speedMultiplier === spd ? 'bg-[#5C4E49] text-[#F0E2A4]' : 'text-[#BCA297]'}`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* MISSION BANNER (GUIDED MODE) */}
      {labMode === 'guided' && currentMission && (
        <div className="w-full bg-[#331921] border-b border-[#AB526B]/50 px-4 py-2.5 flex items-center justify-between text-xs z-20">
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${
              isCurrentMissionDone ? 'bg-[#C5CEAE] text-[#331921]' : 'bg-[#AB526B] text-white'
            }`}>
              {isCurrentMissionDone ? <CheckCircle2 size={14} /> : activeMissionIdx + 1}
            </div>
            <span className="font-bold text-[#FAF7F2]">{currentMission.title}:</span>
            <span className="text-[#BCA297]">{currentMission.instruction}</span>
          </div>

          <div className="flex items-center gap-2">
            {isCurrentMissionDone && (
              <span className="px-2 py-0.5 rounded bg-[#C5CEAE]/20 text-[#C5CEAE] font-bold text-[10px]">
                MISSION COMPLETE!
              </span>
            )}
            <button
              disabled={activeMissionIdx >= GUIDED_MISSIONS.length - 1}
              onClick={() => setActiveMissionIdx(i => i + 1)}
              className="px-3 py-1 rounded-lg bg-[#423834] hover:bg-[#5C4E49] text-[#FAF7F2] font-bold text-xs disabled:opacity-40"
            >
              Next Mission &rarr;
            </button>
          </div>
        </div>
      )}

      {/* LIVE STATUS BAR */}
      <div className="w-full bg-[#331921]/90 border-b border-[#5C4E49]/60 px-4 py-1.5 flex items-center justify-between text-[11px] font-mono text-[#F0E2A4] z-20">
        <div className="flex items-center gap-2 truncate">
          <Activity size={13} className="text-[#AB526B] animate-pulse" />
          <span className="truncate">&gt; {statusMessage}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span>Heap Objects: {objects.length}</span>
          <span>Stack Frames: {callStack.length}</span>
        </div>
      </div>

      {/* MAIN LAB CANVAS & SPLIT INSPECTOR */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT SIDEBAR: CLASS BLUEPRINTS DOCK */}
        <aside className="w-64 border-r border-[#5C4E49] bg-[#423834]/80 p-3 overflow-y-auto hidden md:flex flex-col space-y-3 z-10">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#BCA297] flex items-center gap-1.5">
            <Layers size={14} className="text-[#F0E2A4]" /> Class Blueprints
          </span>

          {Object.keys(BLUEPRINTS).map(cName => {
            const bp = BLUEPRINTS[cName];
            const isSelected = selectedBlueprint === cName;
            return (
              <div
                key={cName}
                onClick={() => setSelectedBlueprint(cName)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSelected ? 'bg-[#331921] border-[#AB526B] shadow-md' : 'bg-[#331921]/60 border-[#5C4E49] hover:border-[#BCA297]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-xs text-[#FAF7F2]">{bp.name}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-[#BCA297]">
                    {bp.parent ? `extends ${bp.parent}` : 'Root'}
                  </span>
                </div>

                <div className="text-[10px] font-mono text-[#BCA297] space-y-0.5 border-t border-[#5C4E49]/40 pt-1.5 mt-1">
                  {bp.fields.map(f => (
                    <div key={f.name} className="flex justify-between">
                      <span className={f.isPrivate ? 'text-[#AB526B]' : 'text-[#C5CEAE]'}>{f.name}</span>
                      <span className="text-[#F0E2A4]">{f.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </aside>

        {/* 2D INTERACTIVE WORKSPACE (CANVAS) */}
        <div className="flex-1 relative bg-[#331921] overflow-hidden">
          
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#5C4E4915_1px,transparent_1px),linear-gradient(to_bottom,#5C4E4915_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

          {/* SVG DYNAMIC CONNECTIONS & SIGNAL PARTICLES */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* Inheritance Conduits (Dog/Cat -> Animal) */}
            {objects.map(obj => {
              if (obj.className === 'Dog' || obj.className === 'Cat') {
                const parentObj = objects.find(o => o.className === 'Animal');
                if (parentObj) {
                  return (
                    <g key={`inherit_${obj.id}`}>
                      <path
                        d={`M ${obj.x + 100} ${obj.y} C ${obj.x + 100} ${obj.y - 40}, ${parentObj.x + 100} ${parentObj.y + 120}, ${parentObj.x + 100} ${parentObj.y + 80}`}
                        stroke="#BCA297"
                        strokeWidth="2.5"
                        strokeDasharray="4 4"
                        fill="none"
                      />
                    </g>
                  );
                }
              }
              return null;
            })}

            {/* Active Moving Message Signal Particle */}
            {activeSignal && (
              <g>
                <line
                  x1={activeSignal.fromX}
                  y1={activeSignal.fromY}
                  x2={activeSignal.toX}
                  y2={activeSignal.toY}
                  stroke="#F0E2A4"
                  strokeWidth="3"
                />
                <motion.circle
                  initial={{ cx: activeSignal.fromX, cy: activeSignal.fromY }}
                  animate={{ cx: activeSignal.toX, cy: activeSignal.toY }}
                  transition={{ duration: 0.6 / speedMultiplier, ease: 'easeInOut' }}
                  r="7"
                  fill="#AB526B"
                  stroke="#FAF7F2"
                  strokeWidth="2"
                />
              </g>
            )}
          </svg>

          {/* HEAP OBJECT NODES (DRAGGABLE) */}
          {objects.map(obj => {
            const bp = BLUEPRINTS[obj.className] || BLUEPRINTS.Car;
            const isThis = thisPointerId === obj.id;
            const isSelected = selectedObjectId === obj.id;

            return (
              <motion.div
                key={obj.id}
                onMouseDown={(e) => handleMouseDown(obj.id, e)}
                style={{ left: obj.x, top: obj.y }}
                animate={{ scale: isThis ? 1.04 : 1 }}
                className={`absolute w-52 md:w-56 rounded-3xl border-2 shadow-2xl p-4 cursor-grab active:cursor-grabbing z-10 transition-colors ${
                  isThis 
                    ? 'bg-[#423834] border-[#F0E2A4] ring-4 ring-[#F0E2A4]/40 shadow-[0_0_30px_#F0E2A4]' 
                    : isSelected 
                    ? 'bg-[#423834] border-[#AB526B]' 
                    : 'bg-[#423834]/95 border-[#5C4E49]'
                }`}
              >
                {/* THIS / SELF FLOATING BADGE */}
                {isThis && (
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: -24, opacity: 1 }}
                    className="absolute -top-1 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full font-mono text-[10px] font-black bg-[#F0E2A4] text-[#331921] shadow-xl border border-white"
                  >
                    THIS &bull; {obj.name}
                  </motion.div>
                )}

                {/* Speech Bubble / Sound */}
                {obj.soundBubble && (
                  <motion.div
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: -30, opacity: 1 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-2xl bg-[#331921] text-[#F0E2A4] border-2 border-[#AB526B] font-mono text-xs font-bold shadow-2xl whitespace-nowrap z-30"
                  >
                    {obj.soundBubble}
                  </motion.div>
                )}

                {/* Laser Deflection Shield Visual */}
                {activeLaser?.targetId === obj.id && (
                  <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 0.3 }}
                    className="absolute -inset-3 rounded-3xl border-4 border-[#AB526B] bg-[#AB526B]/20 shadow-[0_0_40px_#AB526B] flex items-center justify-center z-30 pointer-events-none"
                  >
                    <Shield size={48} className="text-white drop-shadow-2xl" />
                  </motion.div>
                )}

                {/* Node Header */}
                <div className="flex items-center justify-between border-b border-[#5C4E49] pb-2 mb-2.5">
                  <div>
                    <div className="font-bold text-xs text-[#FAF7F2]">{obj.name}</div>
                    <div className="text-[9px] font-mono text-[#BCA297] flex items-center gap-1">
                      <span>:{bp.name}</span>
                      <span>@{obj.heapAddress}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteObject(obj.id); }}
                    className="text-[#5C4E49] hover:text-[#AB526B] p-1 rounded"
                    title="Deallocate Object"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Properties Section (Animated State) */}
                <div className="space-y-1 mb-3">
                  <div className="text-[9px] font-mono font-bold uppercase text-[#BCA297]">Properties</div>
                  {Object.keys(obj.fields).map(fName => {
                    const val = obj.fields[fName];
                    const isMutating = obj.mutatingProp === fName;
                    const isPrivate = fName.startsWith('#');

                    return (
                      <div 
                        key={fName} 
                        onClick={() => handleModifyProperty(obj.id, fName, 20)}
                        className={`flex items-center justify-between text-xs font-mono px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                          isMutating 
                            ? 'bg-[#C5CEAE]/30 border-[#C5CEAE] scale-105' 
                            : 'bg-[#331921] border-[#5C4E49]/60 hover:border-[#FAF7F2]'
                        }`}
                      >
                        <span className={isPrivate ? 'text-[#AB526B] font-bold' : 'text-[#C5CEAE]'}>
                          {fName}:
                        </span>
                        
                        {/* Animated Value Replacement */}
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={String(val)}
                            initial={{ y: -6, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 6, opacity: 0 }}
                            className="font-bold text-[#F0E2A4]"
                          >
                            {String(val)}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                {/* Methods Section */}
                <div className="space-y-1">
                  <div className="text-[9px] font-mono font-bold uppercase text-[#BCA297]">Methods</div>
                  <div className="grid grid-cols-1 gap-1">
                    {bp.methods.map(m => (
                      <button
                        key={m}
                        onClick={(e) => { e.stopPropagation(); handleExecuteMethod(obj.id, m); }}
                        className="py-1 px-2 rounded-lg text-[10px] font-mono font-bold bg-[#331921] hover:bg-[#5C4E49] text-[#FAF7F2] border border-[#5C4E49] transition-all flex items-center justify-between"
                      >
                        <span>.{m}</span>
                        <Play size={10} className="text-[#AB526B]" />
                      </button>
                    ))}
                  </div>
                </div>

              </motion.div>
            );
          })}

        </div>

        {/* RIGHT DOCK: CODE SYNCHRONIZER & STACK/HEAP INSPECTOR */}
        <aside className="w-80 border-l border-[#5C4E49] bg-[#423834]/80 p-3 overflow-y-auto hidden lg:flex flex-col space-y-4 z-10">
          
          {/* Synchronized Code Panel */}
          <div className="space-y-1.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F0E2A4] flex items-center gap-1.5">
              <Code2 size={14} /> Synchronized Code
            </span>
            <div className="bg-[#331921] p-3 rounded-2xl border border-[#5C4E49] font-mono text-[11px] space-y-1">
              {codeLines.map((line, idx) => (
                <div 
                  key={idx}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    highlightedCodeLine === idx ? 'bg-[#AB526B] text-white font-bold' : 'text-[#BCA297]'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Call Stack Panel */}
          <div className="space-y-1.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C5CEAE] flex items-center gap-1.5">
              <Activity size={14} /> Call Stack (LIFO)
            </span>
            <div className="bg-[#331921] p-2 rounded-2xl border border-[#5C4E49] space-y-1 font-mono text-[11px]">
              {callStack.map((f, i) => (
                <div key={i} className="p-1.5 rounded-lg bg-[#423834] flex items-center justify-between border border-[#5C4E49]/60">
                  <span className="text-[#FAF7F2] font-bold">{f.name}</span>
                  <span className="text-[9px] text-[#BCA297]">{f.addr}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Heap Memory Address Allocation */}
          <div className="space-y-1.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#AB526B] flex items-center gap-1.5">
              <Database size={14} /> Heap Allocated Objects
            </span>
            <div className="bg-[#331921] p-2 rounded-2xl border border-[#5C4E49] space-y-1 font-mono text-[11px]">
              {objects.map(o => (
                <div key={o.id} className="p-1.5 rounded-lg bg-[#423834] flex items-center justify-between border border-[#5C4E49]/60">
                  <span className="text-[#F0E2A4]">{o.heapAddress} &rarr; {o.name}</span>
                  <span className="text-[9px] text-[#C5CEAE]">{o.className}</span>
                </div>
              ))}
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
