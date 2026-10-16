/**
 * Encapsulation Visualizer Timeline Phases & Pedagogical Metadata
 */

export const ENCAPSULATION_PHASES = {
  exposed: {
    id: 'exposed',
    stepNumber: 1,
    title: 'Exposed & Separated',
    desc: 'Data and methods float freely outside the capsule boundary, unprotected and vulnerable to direct tampering.',
    tag: 'UNPROTECTED STATE',
    accentColor: '#F43F5E',
    badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-500',
    principleInsight: 'Without encapsulation, any external script can directly read or corrupt internal variables without validation.'
  },
  bundling: {
    id: 'bundling',
    stepNumber: 2,
    title: 'Capsule Wrapping',
    desc: 'Protective shell halves move inward, bundling data fields and related methods into a single unified object unit.',
    tag: 'COHESIVE BUNDLING',
    accentColor: '#F59E0B',
    badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-500',
    principleInsight: 'Encapsulation groups internal state (data) together with the specific behaviors (methods) that operate upon it.'
  },
  sealed: {
    id: 'sealed',
    stepNumber: 3,
    title: 'Bundled & Sealed',
    desc: 'The capsule locks securely. Private data (#data) is now completely shielded and inaccessible from the global scope.',
    tag: 'PRIVATE VAULT SEALED',
    accentColor: '#10B981',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500',
    principleInsight: 'Information hiding ensures that external components cannot depend on internal implementation details.'
  },
  requesting: {
    id: 'requesting',
    stepNumber: 4,
    title: 'Controlled Access Gate',
    desc: 'An external caller queries internal data. Direct access is deflected by the shell and redirected through the public getData() getter.',
    tag: 'METHOD DISPATCH',
    accentColor: '#06B6D4',
    badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-500',
    principleInsight: 'Public getter and setter methods act as authorized gatekeepers, enforcing validation and integrity rules.'
  },
  responding: {
    id: 'responding',
    stepNumber: 4,
    title: 'Verified Response Flow',
    desc: 'The public getData() method safely accesses the private vault and returns a verified, sanitized data packet to the caller.',
    tag: 'CONTROLLED ACCESS',
    accentColor: '#06B6D4',
    badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-500',
    principleInsight: 'The caller receives the needed data without ever gaining direct access or write-permissions to internal memory.'
  },
  completed: {
    id: 'completed',
    stepNumber: 5,
    title: 'Encapsulation Verified',
    desc: 'Full triad verified: Data & methods bundled as one unit. Internal state strictly private. All interaction gated via public methods.',
    tag: 'PILLAR VERIFIED',
    accentColor: '#8B5CF6',
    badgeBg: 'bg-purple-500/10 border-purple-500/30 text-purple-500',
    principleInsight: 'Encapsulation = Data Hiding + Cohesive Object Bundling + Authorized Public Interfaces.'
  }
};

export const JAVA_ENCAPSULATION_CODE = `// Encapsulation: Bundling state & behavior with access control
public class BankAccount {
    // 1. Private data fields (Information Hiding)
    private double balance;
    private String accountNumber;

    // 2. Constructor: Bundles state into a single cohesive unit
    public BankAccount(String accountNumber, double initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }

    // 3. Public Getter: Controlled, read-only authorized access
    public double getBalance() {
        return this.balance;
    }

    // 4. Public Setter: Controlled modification with validation
    public void deposit(double amount) {
        if (amount > 0) {
            this.balance += amount;
            System.out.println("Deposited: $" + amount);
        }
    }
}`;
