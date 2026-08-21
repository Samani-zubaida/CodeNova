import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PolymorphismVisualizer() {
  const [activeAnimal, setActiveAnimal] = useState(null);
  
  const animals = [
    { type: 'Dog', sound: 'Woof! Woof!', color: 'var(--color-nova-brown)' },
    { type: 'Cat', sound: 'Meow...', color: 'var(--color-nova-wheat)' },
    { type: 'Duck', sound: 'Quack!', color: 'var(--color-nova-green)' },
  ];

  const handleSpeak = (animal) => {
    setActiveAnimal(animal);
    setTimeout(() => setActiveAnimal(null), 2000);
  };

  return (
    <div className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl p-8 flex flex-col items-center">
      <h3 className="text-xl font-bold mb-2 text-[var(--color-nova-brown)]">Polymorphism</h3>
      <p className="text-sm text-gray-500 mb-8">Different classes can be treated as instances of the same class through a common interface.</p>

      <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
        
        {/* The Interface */}
        <div className="w-full border-2 border-dashed border-[var(--color-nova-red)] p-4 rounded-xl text-center bg-red-50/50 dark:bg-red-900/10">
          <div className="font-bold text-[var(--color-nova-red)] mb-2">Interface: Animal</div>
          <div className="font-mono text-sm bg-white dark:bg-black p-2 rounded inline-block shadow-sm border border-gray-200 dark:border-gray-800">
            function makeAnimalSpeak(animal) {'{'} <br/>
            &nbsp;&nbsp;animal.speak();<br/>
            {'}'}
          </div>
        </div>

        {/* The Instances */}
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
          {animals.map((animal) => (
            <div key={animal.type} className="flex flex-col items-center gap-4 flex-1">
              <button 
                onClick={() => handleSpeak(animal)}
                className="w-full py-3 rounded-lg font-bold shadow-md hover:scale-105 transition-transform border border-black/10"
                style={{ backgroundColor: animal.color, color: animal.type === 'Cat' || animal.type === 'Duck' ? 'black' : 'white' }}
              >
                {animal.type}
              </button>
              
              <div className="h-16 flex items-center justify-center w-full">
                <AnimatePresence>
                  {activeAnimal?.type === animal.type && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="bg-black text-white px-4 py-2 rounded-2xl relative shadow-lg font-bold tracking-wider"
                    >
                      "{animal.sound}"
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-black" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
