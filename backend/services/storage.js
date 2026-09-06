const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');
const COMPETITIONS_FILE = path.join(DATA_DIR, 'competitions.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson(filePath, defaultValue) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading ' + filePath + ':', err.message);
    return defaultValue;
  }
}

function writeJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing ' + filePath + ':', err.message);
  }
}

// Initial default competitions
const DEFAULT_COMPETITIONS = [
  {
    _id: 'comp_1',
    id: 'comp_1',
    title: 'Global Code-Off 2024',
    dateString: 'May 15-16',
    prizePool: ',000',
    registrations: '1,200/5,000',
    status: 'Active',
    type: 'Global'
  },
  {
    _id: 'comp_2',
    id: 'comp_2',
    title: 'AI Challenge: Image Recognition',
    dateString: 'June 1',
    difficulty: 'Expert',
    status: 'Upcoming',
    type: 'Challenge'
  },
  {
    _id: 'comp_3',
    id: 'comp_3',
    title: 'Fastest Coder Series: Python',
    dateString: 'Weekly (Next: Mon)',
    difficulty: 'Leaderboard Qualified',
    status: 'Upcoming',
    type: 'Series'
  }
];

// Initial default users
const DEFAULT_USERS = [
  {
    id: 'usr_default_1',
    _id: 'usr_default_1',
    username: 'aanmirack',
    email: 'aanmirack@example.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    xp: 62350,
    currentStreak: 12,
    longestStreak: 25,
    activityLog: ['2026-09-05', '2026-09-06'],
    earnedBadges: [{ badgeId: 'badge_1', name: 'Master Coder' }]
  },
  {
    id: 'usr_default_2',
    _id: 'usr_default_2',
    username: 'Christrova',
    email: 'christrova@example.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    xp: 31280,
    currentStreak: 5,
    longestStreak: 14,
    activityLog: ['2026-09-06'],
    earnedBadges: [{ badgeId: 'badge_2', name: 'Algo Scout' }]
  },
  {
    id: 'usr_default_3',
    _id: 'usr_default_3',
    username: 'NovaCoder',
    email: 'novacoder@example.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    xp: 25000,
    currentStreak: 8,
    longestStreak: 19,
    activityLog: ['2026-09-04', '2026-09-05', '2026-09-06'],
    earnedBadges: []
  },
  {
    id: 'usr_default_4',
    _id: 'usr_default_4',
    username: 'demo_user',
    email: 'demo@algoverse.io',
    passwordHash: bcrypt.hashSync('demo1234', 10),
    xp: 15400,
    currentStreak: 3,
    longestStreak: 7,
    activityLog: ['2026-09-06'],
    earnedBadges: [{ badgeId: 'demo_badge', name: 'Explorer' }]
  }
];

let users = readJson(USERS_FILE, DEFAULT_USERS);
if (users.length === 0) {
  users = DEFAULT_USERS;
  writeJson(USERS_FILE, users);
}

let progresses = readJson(PROGRESS_FILE, []);
let competitions = readJson(COMPETITIONS_FILE, DEFAULT_COMPETITIONS);
if (competitions.length === 0) {
  competitions = DEFAULT_COMPETITIONS;
  writeJson(COMPETITIONS_FILE, competitions);
}

const getTodayStr = () => new Date().toISOString().split('T')[0];
const getYesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

const storage = {
  findUserByEmail: (email) => {
    if (!email) return null;
    return users.find(u => u.email && u.email.toLowerCase() === email.trim().toLowerCase()) || null;
  },

  findUserByUsername: (username) => {
    if (!username) return null;
    return users.find(u => u.username && u.username.toLowerCase() === username.trim().toLowerCase()) || null;
  },

  findUserById: (id) => {
    if (!id) return null;
    return users.find(u => u.id === id || u._id === id) || null;
  },

  getAllUsers: () => {
    return [...users].sort((a, b) => (b.xp || 0) - (a.xp || 0));
  },

  createUser: ({ username, email, passwordHash }) => {
    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      activityLog: [getTodayStr()],
      currentStreak: 1,
      longestStreak: 1,
      earnedBadges: [{ badgeId: 'welcome', name: 'Novice Coder' }],
      xp: 100,
      createdAt: new Date().toISOString()
    };
    newUser._id = newUser.id;
    users.push(newUser);
    writeJson(USERS_FILE, users);
    return newUser;
  },

  updateUser: (id, updates) => {
    const idx = users.findIndex(u => u.id === id || u._id === id);
    if (idx === -1) return null;
    users[idx] = Object.assign({}, users[idx], updates, { updatedAt: new Date().toISOString() });
    writeJson(USERS_FILE, users);
    return users[idx];
  },

  recordActivity: (username) => {
    let user = storage.findUserByUsername(username);
    if (!user) {
      user = storage.createUser({
        username,
        email: username.toLowerCase() + '@local.dev',
        passwordHash: 'mock_local_hash'
      });
    }

    const today = getTodayStr();
    const yesterday = getYesterdayStr();

    if (!user.activityLog) user.activityLog = [];

    if (user.activityLog.includes(today)) {
      return {
        success: true,
        message: 'Already logged today',
        currentStreak: user.currentStreak || 1,
        longestStreak: user.longestStreak || 1,
        activityLog: user.activityLog,
        earnedBadges: user.earnedBadges || []
      };
    }

    if (user.activityLog.includes(yesterday)) {
      user.currentStreak = (user.currentStreak || 0) + 1;
    } else {
      user.currentStreak = 1;
    }

    if (user.currentStreak > (user.longestStreak || 0)) {
      user.longestStreak = user.currentStreak;
    }

    user.activityLog.push(today);
    storage.updateUser(user.id, {
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      activityLog: user.activityLog
    });

    return {
      success: true,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      activityLog: user.activityLog,
      earnedBadges: user.earnedBadges || []
    };
  },

  awardBadge: (username, badgeId, badgeName) => {
    let user = storage.findUserByUsername(username);
    if (!user) return null;

    if (!user.earnedBadges) user.earnedBadges = [];
    const alreadyHas = user.earnedBadges.find(b => b.badgeId === badgeId);
    if (alreadyHas) {
      return { success: true, message: 'Badge already earned', badges: user.earnedBadges };
    }

    user.earnedBadges.push({ badgeId, name: badgeName, awardedAt: new Date().toISOString() });
    storage.updateUser(user.id, { earnedBadges: user.earnedBadges });
    return { success: true, badges: user.earnedBadges };
  },

  getProgress: (userId) => {
    let prog = progresses.find(p => p.userId === userId);
    if (!prog) {
      prog = {
        id: 'prog_' + Date.now(),
        userId,
        town1Unlocked: true,
        town2Unlocked: false,
        town3Unlocked: false,
        totalScore: 0,
        createdAt: new Date().toISOString()
      };
      progresses.push(prog);
      writeJson(PROGRESS_FILE, progresses);
    }
    return prog;
  },

  updateProgress: (userId, updates) => {
    let prog = storage.getProgress(userId);
    const idx = progresses.findIndex(p => p.userId === userId);
    if (idx !== -1) {
      progresses[idx] = Object.assign({}, progresses[idx], updates, { updatedAt: new Date().toISOString() });
      writeJson(PROGRESS_FILE, progresses);
      return progresses[idx];
    }
    return prog;
  },

  getCompetitions: () => {
    return competitions;
  },

  createCompetition: (compData) => {
    const newComp = Object.assign({
      id: 'comp_' + Date.now(),
      _id: 'comp_' + Date.now()
    }, compData, {
      createdAt: new Date().toISOString()
    });
    competitions.push(newComp);
    writeJson(COMPETITIONS_FILE, competitions);
    return newComp;
  }
};

module.exports = storage;
