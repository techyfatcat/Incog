// src/data/subjectsData.js

export const SUBJECTS = [
    {
        id: 'dsa',
        name: 'Data Structures & Algorithms',
        shortName: 'DSA',
        tagline: 'Crack coding rounds efficiently',
        category: 'Core CS',
        icon: '⚡',
        color: 'indigo',
        totalProblems: 185,
        solvedProblems: 120,
        totalHours: 40,
        topics: [
            {
                id: 'arrays', name: 'Arrays', status: 'completed', difficulty: 'Easy',
                problems: 25, solved: 25, order: 1,
                description: 'Foundation of all data structures.',
                theory: 'Arrays are contiguous memory locations. Key ops: traversal O(n), access O(1), insertion O(n).',
                keyFormulas: ['Two pointer technique', 'Sliding window', 'Prefix sum array'],
                problems_list: [
                    { id: 1, title: 'Two Sum', difficulty: 'Easy', companies: ['Amazon', 'Google'], frequency: 95 },
                    { id: 2, title: 'Best Time to Buy Stock', difficulty: 'Easy', companies: ['Amazon', 'TCS'], frequency: 88 },
                    { id: 3, title: 'Maximum Subarray', difficulty: 'Medium', companies: ['Microsoft', 'Flipkart'], frequency: 82 },
                    { id: 4, title: 'Product of Array Except Self', difficulty: 'Medium', companies: ['Amazon', 'Meta'], frequency: 78 },
                    { id: 5, title: 'Container With Most Water', difficulty: 'Medium', companies: ['Google', 'Adobe'], frequency: 72 },
                ],
                insights: [
                    { type: 'interview', text: 'Amazon loves Two Pointer + Sliding Window combos in L1 rounds', author: 'Ex-Amazon SDE' },
                    { type: 'tip', text: 'Always clarify: sorted or unsorted? It changes your approach entirely.', author: 'Senior Dev' },
                    { type: 'trap', text: 'Off-by-one errors are the #1 cause of WA in array problems. Double check boundaries.', author: 'Competitive Programmer' },
                ]
            },
            {
                id: 'strings', name: 'Strings', status: 'completed', difficulty: 'Easy',
                problems: 20, solved: 18, order: 2,
                description: 'Character arrays with powerful manipulation.',
                theory: 'Strings are immutable sequences of characters. KMP, Rabin-Karp for pattern matching.',
                keyFormulas: ['KMP Algorithm', 'Z-Algorithm', 'Anagram detection via frequency map'],
                problems_list: [
                    { id: 1, title: 'Longest Substring Without Repeating', difficulty: 'Medium', companies: ['Amazon', 'Google'], frequency: 91 },
                    { id: 2, title: 'Valid Anagram', difficulty: 'Easy', companies: ['TCS', 'Infosys'], frequency: 85 },
                    { id: 3, title: 'Group Anagrams', difficulty: 'Medium', companies: ['Amazon', 'Meta'], frequency: 79 },
                ],
                insights: [
                    { type: 'interview', text: 'String + HashMap is the most common pattern in TCS NQT', author: 'Placed at TCS' },
                ]
            },
            {
                id: 'linked-list', name: 'Linked List', status: 'in-progress', difficulty: 'Medium',
                problems: 22, solved: 14, order: 3,
                description: 'Dynamic linear data structure with pointers.',
                theory: 'Nodes with data + pointer. Fast insertion/deletion O(1) but O(n) access.',
                keyFormulas: ['Floyd\'s Cycle Detection', 'Reverse in k-groups', 'Merge sort on LL'],
                problems_list: [
                    { id: 1, title: 'Reverse Linked List', difficulty: 'Easy', companies: ['Amazon', 'Microsoft'], frequency: 88 },
                    { id: 2, title: 'Detect Cycle', difficulty: 'Medium', companies: ['Google', 'Amazon'], frequency: 83 },
                    { id: 3, title: 'Merge Two Sorted Lists', difficulty: 'Easy', companies: ['TCS', 'Wipro'], frequency: 77 },
                ],
                insights: [
                    { type: 'tip', text: 'Draw pointers on paper before coding — mental simulation prevents bugs.', author: 'FAANG Prep Coach' },
                    { type: 'trap', text: 'Don\'t forget edge cases: empty list, single node, cycle at head.', author: 'Ex-Google Interviewer' },
                ]
            },
            {
                id: 'stack-queue', name: 'Stack & Queue', status: 'in-progress', difficulty: 'Medium',
                problems: 18, solved: 10, order: 4,
                description: 'LIFO and FIFO structures for ordered processing.',
                theory: 'Stack: LIFO, used for backtracking. Queue: FIFO, used for BFS.',
                keyFormulas: ['Monotonic stack', 'Queue using two stacks', 'Next Greater Element'],
                problems_list: [
                    { id: 1, title: 'Valid Parentheses', difficulty: 'Easy', companies: ['Amazon', 'Microsoft', 'Google'], frequency: 93 },
                    { id: 2, title: 'Next Greater Element', difficulty: 'Medium', companies: ['Flipkart', 'Amazon'], frequency: 80 },
                ],
                insights: [
                    { type: 'interview', text: 'Monotonic stack appears in 60%+ of Google phone screens', author: 'Placed at Google' },
                ]
            },
            {
                id: 'trees', name: 'Trees', status: 'pending', difficulty: 'Medium',
                problems: 30, solved: 0, order: 5,
                description: 'Hierarchical structures powering most real systems.',
                theory: 'BST, AVL, Red-Black. Height-balanced trees have O(log n) ops.',
                keyFormulas: ['DFS/BFS traversals', 'LCA (Lowest Common Ancestor)', 'Tree DP'],
                problems_list: [
                    { id: 1, title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', companies: ['Amazon', 'TCS'], frequency: 89 },
                    { id: 2, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', companies: ['Google', 'Microsoft'], frequency: 84 },
                ],
                insights: []
            },
            {
                id: 'graphs', name: 'Graphs', status: 'locked', difficulty: 'Hard',
                problems: 35, solved: 0, order: 6,
                description: 'Networks, paths, and connection problems.',
                theory: 'BFS/DFS, Dijkstra, Bellman-Ford, Floyd-Warshall.',
                keyFormulas: ['Dijkstra\'s Algorithm', 'Union Find', 'Topological Sort'],
                problems_list: [],
                insights: []
            },
            {
                id: 'dp', name: 'Dynamic Programming', status: 'locked', difficulty: 'Hard',
                problems: 40, solved: 0, order: 7,
                description: 'Optimization through memoization and tabulation.',
                theory: 'Break problem into subproblems. Top-down (memoization) vs Bottom-up (tabulation).',
                keyFormulas: ['Knapsack variants', 'LCS/LIS', 'Matrix chain multiplication'],
                problems_list: [],
                insights: []
            },
        ],
        roadmap: ['arrays', 'strings', 'linked-list', 'stack-queue', 'trees', 'graphs', 'dp'],
        nextTopic: 'trees',
        mostAsked: ['Amazon', 'Google', 'Microsoft'],
    },
    {
        id: 'os',
        name: 'Operating Systems',
        shortName: 'OS',
        tagline: 'Master the engine behind every app',
        category: 'Core CS',
        icon: '🖥',
        color: 'cyan',
        totalProblems: 80,
        solvedProblems: 35,
        totalHours: 18,
        topics: [
            { id: 'processes', name: 'Processes & Threads', status: 'completed', difficulty: 'Medium', problems: 15, solved: 15, order: 1, description: 'Process lifecycle, PCB, context switching.', theory: 'A process is a program in execution. Thread is lightweight process sharing same memory.', keyFormulas: ['Context switch overhead', 'Thrashing condition', 'CPU utilization formula'], problems_list: [], insights: [{ type: 'interview', text: 'Difference between process and thread is asked in 90% of OS interviews', author: 'Placed at Infosys' }] },
            { id: 'scheduling', name: 'CPU Scheduling', status: 'completed', difficulty: 'Medium', problems: 20, solved: 20, order: 2, description: 'FCFS, SJF, Round Robin, Priority.', theory: 'Scheduling algorithms determine CPU allocation order.', keyFormulas: ['Gantt chart drawing', 'Average waiting time', 'Turnaround time'], problems_list: [], insights: [] },
            { id: 'memory', name: 'Memory Management', status: 'in-progress', difficulty: 'Hard', problems: 25, solved: 0, order: 3, description: 'Paging, segmentation, virtual memory.', theory: 'Virtual memory extends RAM using disk. Page faults trigger disk access.', keyFormulas: ['Page replacement (LRU, FIFO, OPT)', 'Belady\'s Anomaly', 'TLB hit ratio'], problems_list: [], insights: [] },
            { id: 'deadlock', name: 'Deadlock', status: 'pending', difficulty: 'Hard', problems: 20, solved: 0, order: 4, description: 'Prevention, avoidance, detection.', theory: '4 conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.', keyFormulas: ['Banker\'s Algorithm', 'Resource allocation graph', 'Safety algorithm'], problems_list: [], insights: [] },
        ],
        roadmap: ['processes', 'scheduling', 'memory', 'deadlock'],
        nextTopic: 'memory',
        mostAsked: ['TCS', 'Wipro', 'Infosys'],
    },
    {
        id: 'dbms',
        name: 'Database Management',
        shortName: 'DBMS',
        tagline: 'Data storage, retrieval & design',
        category: 'Core CS',
        icon: '🗄',
        color: 'emerald',
        totalProblems: 65,
        solvedProblems: 20,
        totalHours: 12,
        topics: [
            { id: 'sql', name: 'SQL & Queries', status: 'completed', difficulty: 'Easy', problems: 20, solved: 20, order: 1, description: 'SELECT, JOIN, GROUP BY, subqueries.', theory: 'Structured Query Language for relational databases.', keyFormulas: ['INNER/OUTER JOINs', 'Window functions', 'CTEs'], problems_list: [], insights: [] },
            { id: 'normalization', name: 'Normalization', status: 'in-progress', difficulty: 'Medium', problems: 15, solved: 0, order: 2, description: '1NF to BCNF, anomaly elimination.', theory: 'Eliminate redundancy. 3NF is usually sufficient for practical purposes.', keyFormulas: ['1NF, 2NF, 3NF, BCNF rules', 'Functional dependencies', 'Lossless decomposition'], problems_list: [], insights: [] },
            { id: 'indexing', name: 'Indexing & Optimization', status: 'pending', difficulty: 'Hard', problems: 20, solved: 0, order: 3, description: 'B+ trees, query optimization.', theory: 'Indexes speed up queries at cost of storage.', keyFormulas: ['B+ tree operations', 'Query execution plan', 'Covering index'], problems_list: [], insights: [] },
            { id: 'transactions', name: 'Transactions & ACID', status: 'locked', difficulty: 'Hard', problems: 10, solved: 0, order: 4, description: 'Concurrency control, isolation levels.', theory: 'ACID: Atomicity, Consistency, Isolation, Durability.', keyFormulas: ['Two-phase locking', 'Serializability', 'MVCC'], problems_list: [], insights: [] },
        ],
        roadmap: ['sql', 'normalization', 'indexing', 'transactions'],
        nextTopic: 'normalization',
        mostAsked: ['Infosys', 'Amazon', 'Microsoft'],
    },
    {
        id: 'cn',
        name: 'Computer Networks',
        shortName: 'CN',
        tagline: 'How the internet actually works',
        category: 'Core CS',
        icon: '🌐',
        color: 'blue',
        totalProblems: 55,
        solvedProblems: 10,
        totalHours: 8,
        topics: [
            { id: 'osi', name: 'OSI & TCP/IP Model', status: 'completed', difficulty: 'Easy', problems: 10, solved: 10, order: 1, description: 'Layers, protocols, encapsulation.', theory: '7 layer OSI vs 4 layer TCP/IP.', keyFormulas: ['Each layer responsibilities', 'PDU names per layer', 'Protocol examples'], problems_list: [], insights: [] },
            { id: 'tcp-udp', name: 'TCP vs UDP', status: 'in-progress', difficulty: 'Medium', problems: 15, solved: 0, order: 2, description: 'Connection, reliability, congestion.', theory: 'TCP: reliable, ordered. UDP: fast, unreliable.', keyFormulas: ['3-way handshake', 'TCP congestion control', 'Sliding window'], problems_list: [], insights: [] },
            { id: 'http', name: 'HTTP & REST', status: 'pending', difficulty: 'Medium', problems: 15, solved: 0, order: 3, description: 'Stateless protocol, REST APIs.', theory: 'HTTP verbs: GET/POST/PUT/DELETE. Status codes.', keyFormulas: ['HTTP methods', 'Status code groups', 'RESTful constraints'], problems_list: [], insights: [] },
            { id: 'security', name: 'Network Security', status: 'locked', difficulty: 'Hard', problems: 15, solved: 0, order: 4, description: 'SSL/TLS, firewalls, encryption.', theory: 'Public key cryptography underlies HTTPS.', keyFormulas: ['SSL handshake', 'Symmetric vs Asymmetric', 'Digital certificates'], problems_list: [], insights: [] },
        ],
        roadmap: ['osi', 'tcp-udp', 'http', 'security'],
        nextTopic: 'tcp-udp',
        mostAsked: ['Amazon', 'Cisco', 'Startup'],
    },
    {
        id: 'oops',
        name: 'Object Oriented Programming',
        shortName: 'OOP',
        tagline: 'Design patterns & clean code thinking',
        category: 'Core CS',
        icon: '🧩',
        color: 'violet',
        totalProblems: 45,
        solvedProblems: 40,
        totalHours: 25,
        topics: [
            { id: 'pillars', name: 'Four Pillars', status: 'completed', difficulty: 'Easy', problems: 10, solved: 10, order: 1, description: 'Encapsulation, Inheritance, Polymorphism, Abstraction.', theory: 'Core OOP concepts that form the foundation of good design.', keyFormulas: ['SOLID principles', 'DRY principle', 'YAGNI principle'], problems_list: [], insights: [] },
            { id: 'design-patterns', name: 'Design Patterns', status: 'completed', difficulty: 'Hard', problems: 20, solved: 18, order: 2, description: 'Singleton, Factory, Observer, and more.', theory: '23 GoF patterns categorized as Creational, Structural, Behavioral.', keyFormulas: ['Singleton implementation', 'Factory vs Abstract Factory', 'Observer pattern'], problems_list: [], insights: [] },
            { id: 'solid', name: 'SOLID Principles', status: 'in-progress', difficulty: 'Medium', problems: 15, solved: 12, order: 3, description: 'Maintainable and extensible code design.', theory: 'Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion.', keyFormulas: ['SRP violations', 'OCP extension points', 'DI containers'], problems_list: [], insights: [] },
        ],
        roadmap: ['pillars', 'design-patterns', 'solid'],
        nextTopic: 'solid',
        mostAsked: ['Amazon', 'Microsoft', 'Adobe'],
    },
    {
        id: 'aptitude',
        name: 'Aptitude & Reasoning',
        shortName: 'Aptitude',
        tagline: 'Crack every placement screening test',
        category: 'Aptitude',
        icon: '🎯',
        color: 'orange',
        totalProblems: 200,
        solvedProblems: 80,
        totalHours: 30,
        topics: [
            { id: 'quant', name: 'Quantitative Aptitude', status: 'in-progress', difficulty: 'Medium', problems: 80, solved: 40, order: 1, description: 'Number system, percentages, time & work.', theory: 'Speed = Distance/Time. Work = Rate × Time.', keyFormulas: ['SI/CI formulas', 'Profit & Loss', 'Time, Speed, Distance'], problems_list: [], insights: [] },
            { id: 'logical', name: 'Logical Reasoning', status: 'in-progress', difficulty: 'Medium', problems: 60, solved: 25, order: 2, description: 'Patterns, sequences, syllogisms.', theory: 'Pattern recognition and logical deduction.', keyFormulas: ['Blood relations tree', 'Seating arrangement', 'Coding-decoding rules'], problems_list: [], insights: [] },
            { id: 'verbal', name: 'Verbal Ability', status: 'pending', difficulty: 'Easy', problems: 60, solved: 15, order: 3, description: 'Grammar, comprehension, vocabulary.', theory: 'Strong vocabulary and grammar fundamentals.', keyFormulas: ['Common idioms', 'Error spotting patterns', 'Para jumbles approach'], problems_list: [], insights: [] },
        ],
        roadmap: ['quant', 'logical', 'verbal'],
        nextTopic: 'quant',
        mostAsked: ['TCS', 'Wipro', 'Infosys', 'Capgemini'],
    },
];

export const CATEGORIES = ['All', 'Core CS', 'Aptitude', 'Company Specific'];

export const getSubjectById = (id) => SUBJECTS.find(s => s.id === id);

export const getTopicById = (subjectId, topicId) => {
    const subject = getSubjectById(subjectId);
    return subject?.topics.find(t => t.id === topicId);
};