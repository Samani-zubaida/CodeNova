/**
 * Encapsulation Visualizer Timeline Phases & Pedagogical Metadata
 */

export const ENCAPSULATION_PHASES = {
  exposed: {
    step: "PHASE 1 / 4",
    title: "Exposed & Separated",
    desc: "Data and methods float freely outside the capsule, unprotected and separated.",
    tag: "UNPROTECTED",
    color: "text-rose-400",
    badgeBg: "bg-rose-500/10 border-rose-500/30 text-rose-400"
  },
  bundling: {
    step: "PHASE 2 / 4",
    title: "Capsule Wrapping",
    desc: "Protective shell halves move inward, bundling data and methods into a single unit.",
    tag: "BUNDLING",
    color: "text-amber-400",
    badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-400"
  },
  sealed: {
    step: "PHASE 3 / 4",
    title: "Bundled & Sealed",
    desc: "Capsule is locked. Internal state is now encapsulated and protected from direct tampering.",
    tag: "PROTECTED",
    color: "text-emerald-400",
    badgeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
  },
  requesting: {
    step: "PHASE 4 / 4",
    title: "Controlled Access Attempt",
    desc: "Direct access blocked by shell boundary. Request redirected to public getData() method.",
    tag: "DIRECT ACCESS BLOCKED",
    color: "text-cyan-400",
    badgeBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
  },
  responding: {
    step: "PHASE 4 / 4",
    title: "Secure Method Response",
    desc: "The public getData() method safely accesses internal data and returns a verified result.",
    tag: "CONTROLLED ACCESS",
    color: "text-emerald-400",
    badgeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
  },
  completed: {
    step: "COMPLETE",
    title: "Encapsulation Demonstrated",
    desc: "Data & methods bundled into one unit. Internal state protected. Controlled access guaranteed.",
    tag: "BUNDLE + PROTECT + CONTROL",
    color: "text-cyan-300",
    badgeBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
  }
};
