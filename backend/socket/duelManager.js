const crypto = require('crypto');

// In-memory state for duels
let waitingPlayer = null; 
const activeDuels = new Map();

// Expanded duel question bank
const questionBank = [
  // Data Structures & Algorithms
  {
    id: 'd1', type: 'multiple-choice',
    question: 'What is the time complexity of searching an unindexed array of size N?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
    correct: 2, xp: 20
  },
  {
    id: 'd2', type: 'multiple-choice',
    question: 'Which data structure uses LIFO (Last In First Out)?',
    options: ['Queue', 'Stack', 'Tree', 'Graph'],
    correct: 1, xp: 20
  },
  {
    id: 'd3', type: 'multiple-choice',
    question: 'What is the worst-case time complexity of QuickSort?',
    options: ['O(N log N)', 'O(N^2)', 'O(N)', 'O(log N)'],
    correct: 1, xp: 30
  },
  {
    id: 'd4', type: 'multiple-choice',
    question: 'In a Hash Table, what happens when two keys hash to the same index?',
    options: ['Syntax Error', 'Deadlock', 'Collision', 'Garbage Collection'],
    correct: 2, xp: 30
  },
  {
    id: 'd5', type: 'multiple-choice',
    question: 'Which tree balancing algorithm is used in C++ std::map or Java TreeMap?',
    options: ['AVL Tree', 'B-Tree', 'Red-Black Tree', 'Splay Tree'],
    correct: 2, xp: 40
  },
  {
    id: 'd6', type: 'multiple-choice',
    question: 'What is the time complexity to insert at the front of a Singly Linked List?',
    options: ['O(1)', 'O(N)', 'O(log N)', 'O(N^2)'],
    correct: 0, xp: 20
  },
  {
    id: 'd7', type: 'multiple-choice',
    question: 'Which graph traversal uses a Queue?',
    options: ['DFS', 'BFS', 'Dijkstra', 'Bellman-Ford'],
    correct: 1, xp: 20
  },
  
  // Object Oriented Programming
  {
    id: 'o1', type: 'multiple-choice',
    question: 'Which of these is NOT an OOP principle?',
    options: ['Encapsulation', 'Polymorphism', 'Compilation', 'Inheritance'],
    correct: 2, xp: 20
  },
  {
    id: 'o2', type: 'multiple-choice',
    question: 'What principle restricts direct access to some of an object\'s components?',
    options: ['Abstraction', 'Encapsulation', 'Inheritance', 'Polymorphism'],
    correct: 1, xp: 20
  },
  {
    id: 'o3', type: 'multiple-choice',
    question: 'What allows objects of different classes to be treated as objects of a common superclass?',
    options: ['Inheritance', 'Abstraction', 'Polymorphism', 'Encapsulation'],
    correct: 2, xp: 30
  },
  {
    id: 'o4', type: 'multiple-choice',
    question: 'A class that cannot be instantiated and is meant to be subclassed is called?',
    options: ['Virtual Class', 'Static Class', 'Abstract Class', 'Sealed Class'],
    correct: 2, xp: 30
  },
  
  // Cryptography
  {
    id: 'c1', type: 'multiple-choice',
    question: 'Which cipher shifts letters by a fixed number of positions in the alphabet?',
    options: ['Vigenère Cipher', 'Caesar Cipher', 'Playfair Cipher', 'AES'],
    correct: 1, xp: 20
  },
  {
    id: 'c2', type: 'multiple-choice',
    question: 'In RSA, what are the two keys used?',
    options: ['Symmetric & Asymmetric', 'Public & Private', 'Secret & Master', 'Session & Transport'],
    correct: 1, xp: 20
  },
  {
    id: 'c3', type: 'multiple-choice',
    question: 'Which of the following is a hashing algorithm?',
    options: ['RSA', 'AES', 'SHA-256', 'Diffie-Hellman'],
    correct: 2, xp: 20
  },
  {
    id: 'c4', type: 'multiple-choice',
    question: 'What is Steganography?',
    options: ['Encrypting text into numbers', 'Hiding data inside an image/file', 'Breaking AES encryption', 'Hashing passwords'],
    correct: 1, xp: 30
  },
  {
    id: 'c5', type: 'multiple-choice',
    question: 'The Diffie-Hellman algorithm is used primarily for:',
    options: ['Hashing files', 'Digital signatures', 'Secure key exchange', 'Encrypting hard drives'],
    correct: 2, xp: 40
  },
  
  // Networking & OS
  {
    id: 'n1', type: 'multiple-choice',
    question: 'Which OSI layer is responsible for logical addressing (IP)?',
    options: ['Data Link', 'Network', 'Transport', 'Application'],
    correct: 1, xp: 30
  },
  {
    id: 'n2', type: 'multiple-choice',
    question: 'What port does HTTPS typically run on?',
    options: ['80', '21', '443', '22'],
    correct: 2, xp: 10
  },
  {
    id: 'n3', type: 'multiple-choice',
    question: 'Which scheduling algorithm can lead to starvation?',
    options: ['Round Robin', 'Shortest Job First (SJF)', 'FCFS', 'All of the above'],
    correct: 1, xp: 40
  }
];

function getRandomQuestions(num) {
  const shuffled = [...questionBank].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // User joins matchmaking
    socket.on('join_matchmaking', (userData) => {
      const username = userData?.username || `Guest_${socket.id.substring(0,4)}`;
      console.log(`${username} joined matchmaking...`);

      if (waitingPlayer && waitingPlayer.socket.id !== socket.id) {
        // Match found!
        const roomId = `duel_${crypto.randomBytes(4).toString('hex')}`;
        
        const player1 = waitingPlayer;
        const player2 = { socket, username, score: 0, progress: 0 };

        // Add both to the socket.io room
        player1.socket.join(roomId);
        player2.socket.join(roomId);

        // Generate 5 random questions for this match
        const matchQuestions = getRandomQuestions(5);

        const duelState = {
          roomId,
          players: {
            [player1.socket.id]: player1,
            [player2.socket.id]: player2
          },
          questions: matchQuestions,
          status: 'active'
        };

        activeDuels.set(roomId, duelState);

        // Notify both players
        io.to(roomId).emit('duel_started', {
          roomId,
          questions: matchQuestions,
          players: [
            { id: player1.socket.id, username: player1.username },
            { id: player2.socket.id, username: player2.username }
          ]
        });

        waitingPlayer = null;
      } else {
        // Add to waiting room
        waitingPlayer = { socket, username, score: 0, progress: 0 };
        socket.emit('waiting_for_opponent');
      }
    });

    // Handle progress updates
    socket.on('update_progress', (data) => {
      const { roomId, progress, score } = data;
      const duel = activeDuels.get(roomId);
      
      if (duel) {
        if (duel.players[socket.id]) {
          duel.players[socket.id].progress = progress;
          duel.players[socket.id].score = score;
          
          // Broadcast to opponent
          socket.to(roomId).emit('opponent_progress', {
            opponentId: socket.id,
            progress,
            score
          });
        }
      }
    });

    // Handle completion
    socket.on('duel_complete', (data) => {
      const { roomId, finalScore, timeTakenMs } = data;
      const duel = activeDuels.get(roomId);

      if (duel && duel.players[socket.id]) {
        duel.players[socket.id].finalScore = finalScore;
        duel.players[socket.id].timeTakenMs = timeTakenMs;
        duel.players[socket.id].finished = true;

        // Check if both are finished
        const pIds = Object.keys(duel.players);
        const allFinished = pIds.every(id => duel.players[id].finished);

        if (allFinished) {
          const p1 = duel.players[pIds[0]];
          const p2 = duel.players[pIds[1]];

          // Determine winner (Score > Time)
          let winnerId = null;
          if (p1.finalScore > p2.finalScore) winnerId = p1.socket.id;
          else if (p2.finalScore > p1.finalScore) winnerId = p2.socket.id;
          else {
            // Tie breaker on time
            if (p1.timeTakenMs < p2.timeTakenMs) winnerId = p1.socket.id;
            else if (p2.timeTakenMs < p1.timeTakenMs) winnerId = p2.socket.id;
            else winnerId = 'tie';
          }

          io.to(roomId).emit('duel_results', {
            winnerId,
            results: {
              [p1.socket.id]: { username: p1.username, score: p1.finalScore, time: p1.timeTakenMs },
              [p2.socket.id]: { username: p2.username, score: p2.finalScore, time: p2.timeTakenMs }
            }
          });

          activeDuels.delete(roomId);
        } else {
          socket.to(roomId).emit('opponent_finished');
        }
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      if (waitingPlayer && waitingPlayer.socket.id === socket.id) {
        waitingPlayer = null;
      }
      
      // Notify opponents if disconnected during active duel
      for (const [roomId, duel] of activeDuels.entries()) {
        if (duel.players[socket.id]) {
          socket.to(roomId).emit('opponent_disconnected');
          activeDuels.delete(roomId);
        }
      }
    });
  });
};
