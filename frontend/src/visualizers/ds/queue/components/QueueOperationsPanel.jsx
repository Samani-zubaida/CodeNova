import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function QueueOperationsPanel({
  activeAlgo,
  // Basic Queue props
  basicInput,
  setBasicInput,
  onBasicEnqueue,
  onBasicDequeue,
  onBasicClear,
  // Circular Queue props
  circularInput,
  setCircularInput,
  onCircularEnqueue,
  onCircularDequeue,
  // Deque props
  dequeInput,
  setDequeInput,
  onDequePushFront,
  onDequePushRear,
  onDequePopFront,
  onDequePopRear,
  // Priority Queue props
  prioValInput,
  setPrioValInput,
  prioLevelInput,
  setPrioLevelInput,
  onPriorityEnqueue,
  onPriorityDequeue,
  // Two Stacks props
  stackInput,
  setStackInput,
  onTwoStacksEnqueue,
  onTwoStacksDequeue,
  // Sliding Window props
  swK,
  setSwK,
  // Hot Potato props
  potatoK,
  setPotatoK
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Basic FIFO Controls */}
      {activeAlgo === 'basic' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={basicInput}
              onChange={e => setBasicInput(e.target.value)}
              placeholder="Val"
              className="w-20 bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold focus:outline-none focus:border-[#AB526B]"
            />
            <button
              onClick={onBasicEnqueue}
              className="flex-1 py-1.5 px-3 rounded-xl bg-[#AB526B] hover:bg-[#8F3E53] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95"
            >
              <Plus size={13} /> Enqueue Rear
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBasicDequeue}
              className="flex-1 py-1.5 px-3 rounded-xl bg-[#423834] hover:bg-[#5C4E49] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95"
            >
              <Trash2 size={13} /> Dequeue Front
            </button>
            <button
              onClick={onBasicClear}
              className="py-1.5 px-2.5 rounded-xl border border-[#5C4E49]/40 text-gray-600 dark:text-[#BCA297] text-xs hover:text-white"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Circular Queue Controls */}
      {activeAlgo === 'circular' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={circularInput}
              onChange={e => setCircularInput(e.target.value)}
              placeholder="Val"
              className="w-20 bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold focus:outline-none focus:border-[#AB526B]"
            />
            <button
              onClick={onCircularEnqueue}
              className="flex-1 py-1.5 px-3 rounded-xl bg-[#AB526B] hover:bg-[#8F3E53] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95"
            >
              <Plus size={13} /> Modulo Enqueue
            </button>
          </div>
          <button
            onClick={onCircularDequeue}
            className="w-full py-1.5 px-3 rounded-xl bg-[#423834] hover:bg-[#5C4E49] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95"
          >
            <Trash2 size={13} /> Modulo Dequeue
          </button>
        </div>
      )}

      {/* Deque Controls */}
      {activeAlgo === 'deque' && (
        <div className="flex flex-col gap-2">
          <input
            type="number"
            value={dequeInput}
            onChange={e => setDequeInput(e.target.value)}
            placeholder="Value"
            className="w-full bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold focus:outline-none focus:border-[#AB526B]"
          />
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={onDequePushFront}
              className="py-1.5 px-2 rounded-xl bg-[#AB526B] hover:bg-[#8F3E53] text-white font-bold text-xs"
            >
              + Push Front
            </button>
            <button
              onClick={onDequePushRear}
              className="py-1.5 px-2 rounded-xl bg-[#C5CEAE] hover:bg-[#B8C29D] text-[#2D1F23] font-bold text-xs"
            >
              + Push Rear
            </button>
            <button
              onClick={onDequePopFront}
              className="py-1.5 px-2 rounded-xl bg-[#423834] hover:bg-[#5C4E49] text-white font-bold text-xs"
            >
              - Pop Front
            </button>
            <button
              onClick={onDequePopRear}
              className="py-1.5 px-2 rounded-xl bg-[#5C4E49] hover:bg-[#73635D] text-white font-bold text-xs"
            >
              - Pop Rear
            </button>
          </div>
        </div>
      )}

      {/* Priority Queue Controls */}
      {activeAlgo === 'priority' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={prioValInput}
              onChange={e => setPrioValInput(e.target.value)}
              placeholder="Val"
              className="w-20 bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold focus:outline-none focus:border-[#AB526B]"
            />
            <select
              value={prioLevelInput}
              onChange={e => setPrioLevelInput(Number(e.target.value))}
              className="flex-1 bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] text-xs rounded-xl px-2 py-1.5 font-mono font-bold"
            >
              <option value={1}>P1 (Urgent - Gold)</option>
              <option value={2}>P2 (Normal - Sage)</option>
              <option value={3}>P3 (Low - Muted)</option>
            </select>
          </div>
          <button
            onClick={onPriorityEnqueue}
            className="w-full py-1.5 px-3 rounded-xl bg-[#AB526B] hover:bg-[#8F3E53] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm"
          >
            <Plus size={13} /> Enqueue with Priority
          </button>
          <button
            onClick={onPriorityDequeue}
            className="w-full py-1.5 px-3 rounded-xl bg-[#423834] hover:bg-[#5C4E49] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm"
          >
            <Trash2 size={13} /> Dequeue Highest Rank
          </button>
        </div>
      )}

      {/* Two Stacks Controls */}
      {activeAlgo === 'twoStacks' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={stackInput}
              onChange={e => setStackInput(e.target.value)}
              placeholder="Val"
              className="w-20 bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold focus:outline-none focus:border-[#AB526B]"
            />
            <button
              onClick={onTwoStacksEnqueue}
              className="flex-1 py-1.5 px-3 rounded-xl bg-[#AB526B] hover:bg-[#8F3E53] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm"
            >
              Push In-Stack
            </button>
          </div>
          <button
            onClick={onTwoStacksDequeue}
            className="w-full py-1.5 px-3 rounded-xl bg-[#423834] hover:bg-[#5C4E49] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm"
          >
            Pop Out-Stack (Transfer if empty)
          </button>
        </div>
      )}

      {/* Sliding Window / Hot Potato / BFS Quick Actions */}
      {activeAlgo === 'slidingWindow' && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-gray-500 dark:text-[#BCA297]">Window Size K:</span>
          <div className="flex items-center gap-1">
            {[2, 3, 4].map(kVal => (
              <button
                key={kVal}
                onClick={() => setSwK(kVal)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                  swK === kVal ? 'bg-[#AB526B] text-white' : 'bg-gray-100 dark:bg-[#423834] text-gray-700 dark:text-[#BCA297]'
                }`}
              >
                k={kVal}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeAlgo === 'hotPotato' && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-gray-500 dark:text-[#BCA297]">Pass Ticks (K):</span>
          <div className="flex items-center gap-1">
            {[2, 3, 4, 5].map(kVal => (
              <button
                key={kVal}
                onClick={() => setPotatoK(kVal)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                  potatoK === kVal ? 'bg-[#AB526B] text-white' : 'bg-gray-100 dark:bg-[#423834] text-gray-700 dark:text-[#BCA297]'
                }`}
              >
                {kVal}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
