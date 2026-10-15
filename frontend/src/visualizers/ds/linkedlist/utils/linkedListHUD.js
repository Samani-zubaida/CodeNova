import {
  AlertCircle, CheckCircle, Activity, Repeat, RefreshCw, Target, FastForward, GitMerge, Trash2, ShieldCheck, Compass
} from 'lucide-react';

export const getLinkedListHUDInfo = (algoId, step, nodes) => {
  const n = nodes || [];
  const currVal = step.currIdx >= 0 && step.currIdx < n.length ? n[step.currIdx]?.val : null;
  const prevVal = step.prevIdx >= 0 && step.prevIdx < n.length ? n[step.prevIdx]?.val : null;
  const nextVal = step.nextIdx >= 0 && step.nextIdx < n.length ? n[step.nextIdx]?.val : null;
  const slowVal = step.slow !== undefined && step.slow < n.length ? n[step.slow]?.val : null;
  const fastVal = step.fast !== undefined && step.fast < n.length ? n[step.fast]?.val : null;

  if (algoId === 'floyd_cycle') {
    if (step.collision) {
      return {
        badge: 'Collision Detected',
        icon: AlertCircle,
        bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        why: `Fast and slow pointers occupy the same node [${n[step.slow]?.val}]. This mathematically proves a loop exists.`
      };
    }
    if (step.cycleFound) {
      return {
        badge: 'Cycle Entrance Found',
        icon: CheckCircle,
        bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        why: `Slow pointer from head and fast pointer from collision point met at entrance Node [${n[step.slow]?.val}].`
      };
    }
    if (step.noCycleFound) {
      return {
        badge: 'No Cycle Found',
        icon: CheckCircle,
        bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        why: `Fast pointer reached NULL. The linked list is linear with no loop.`
      };
    }
    return {
      badge: step.phase === 2 ? 'Phase 2: Finding Entrance' : 'Phase 1: Race',
      icon: Activity,
      bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      why: step.phase === 2
        ? `Both pointers advance 1 step until meeting at the cycle entrance.`
        : `Hare leaps 2x while tortoise steps 1x. Distance between them shrinks by 1 each iteration.`
    };
  }

  if (algoId === 'reverse') {
    if (step.isFlipping) {
      return {
        badge: 'Flipping Pointer',
        icon: Repeat,
        bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        why: `Rewired curr.next = prev. Arrow direction is reversed without losing next node address.`
      };
    }
    if (step.isComplete) {
      return {
        badge: 'Reversal Complete',
        icon: CheckCircle,
        bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        why: `All links inverted in O(N) time and O(1) auxiliary memory.`
      };
    }
    return {
      badge: '3-Pointer Reversal',
      icon: RefreshCw,
      bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      why: `Saved next pointer before inverting link to maintain traversal access.`
    };
  }

  if (algoId === 'middle_node' || algoId === 'middle') {
    if (step.foundMiddle) {
      return {
        badge: 'Middle Node Found',
        icon: Target,
        bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        why: `When fast pointer hits the end of list, slow pointer is at the exact midpoint.`
      };
    }
    return {
      badge: 'Two-Pointer Midpoint Race',
      icon: FastForward,
      bg: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      why: `Fast moves at 2x velocity while slow moves at 1x. Ratio ensures midpoint convergence.`
    };
  }

  if (algoId === 'merge_sorted') {
    return {
      badge: 'Merge Sorted Lists',
      icon: GitMerge,
      bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      why: `Comparing head values of both lists and appending the smaller node to the merged list.`
    };
  }

  if (algoId === 'remove_nth') {
    return {
      badge: 'Remove N-th From End',
      icon: Trash2,
      bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      why: `Maintaining a gap of N between fast and slow pointers identifies the target in 1 pass.`
    };
  }

  if (algoId === 'palindrome') {
    return {
      badge: 'Palindrome Symmetry Check',
      icon: ShieldCheck,
      bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      why: `Comparing inward pointers from head and tail to verify mirrored symmetry.`
    };
  }

  return {
    badge: 'Linked List Traversal',
    icon: Compass,
    bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    why: step.status || 'Iterating through dynamic node references via .next pointers.'
  };
};

// ========================================================
// MAIN EXPORT COMPONENT
// ========================================================

