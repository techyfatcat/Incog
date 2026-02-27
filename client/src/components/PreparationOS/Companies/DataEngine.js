export const COMPANIES_DATA = [
    {
        id: 'google',
        name: "Google",
        logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_咬_icon.svg",
        category: "Big Tech",
        difficulty: "Elite",
        rounds: 5,
        acceptance: "0.2%",
        salary: "35-65L",
        topics: ["Graph Theory", "DP", "System Design"],
        difficultySplit: { easy: 15, medium: 55, hard: 30 },
        topicFrequency: [
            { name: "Graph Theory", value: 85 },
            { name: "Dynamic Programming", value: 72 },
            { name: "Trees & Tries", value: 65 },
            { name: "System Design", value: 40 }
        ],
        insights: [
            "Heavy emphasis on optimization & space complexity.",
            "Expect 1-2 rounds dedicated purely to 'Googliness' (Culture).",
            "Code must be extremely readable and handle all edge cases.",
            "Recommended: Focus on Graph Traversals (BFS/DFS)."
        ],
        questions: [
            { title: "Longest Increasing Path in a Matrix", difficulty: "Hard", topic: "DP / Graph" },
            { title: "Find Median from Data Stream", difficulty: "Hard", topic: "Heaps" },
            { title: "Word Ladder II", difficulty: "Hard", topic: "BFS" }
        ]
    },
    {
        id: 'amazon',
        name: "Amazon",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg",
        category: "Big Tech",
        difficulty: "Hard",
        rounds: 4,
        acceptance: "1.5%",
        salary: "28-45L",
        topics: ["LP", "Trees", "DP"],
        difficultySplit: { easy: 25, medium: 50, hard: 25 },
        topicFrequency: [
            { name: "Leadership Principles", value: 95 },
            { name: "Trees & Hashing", value: 80 },
            { name: "Sliding Window", value: 60 },
            { name: "Object Oriented Design", value: 55 }
        ],
        insights: [
            "Leadership Principles are as important as coding.",
            "Heavy focus on Bar Raiser rounds.",
            "Prepare two unique stories for every LP.",
            "Code must be production-ready and modular."
        ],
        questions: [
            { title: "LRU Cache Implementation", difficulty: "Medium", topic: "Design" },
            { title: "Binary Tree Zigzag Level Order", difficulty: "Medium", topic: "Trees" },
            { title: "Number of Islands", difficulty: "Medium", topic: "DFS" }
        ]
    },
    {
        id: 'meta',
        name: "Meta",
        logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
        category: "Social Media",
        difficulty: "Elite",
        rounds: 4,
        acceptance: "0.5%",
        salary: "40-70L",
        topics: ["Arrays", "Recursion", "System Design"],
        difficultySplit: { easy: 10, medium: 60, hard: 30 },
        topicFrequency: [
            { name: "Binary Search", value: 90 },
            { name: "Recursive Backtracking", value: 85 },
            { name: "Product Design", value: 70 },
            { name: "Trie / Strings", value: 50 }
        ],
        insights: [
            "Speed is everything. Aim for 2 Mediums in 40 minutes.",
            "System Design rounds focus heavily on 'Product Architecture'.",
            "Expect a strong focus on variations of common LC problems.",
            "The 'Pirate' culture round assesses high-ownership mindset."
        ],
        questions: [
            { title: "Regular Expression Matching", difficulty: "Hard", topic: "DP" },
            { title: "Design Messenger Search", difficulty: "Hard", topic: "System Design" },
            { title: "Minimum Window Substring", difficulty: "Hard", topic: "Sliding Window" }
        ]
    },
    {
        id: 'microsoft',
        name: "Microsoft",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
        category: "Legacy Tech",
        difficulty: "Medium",
        rounds: 4,
        acceptance: "3%",
        salary: "25-42L",
        topics: ["LinkedLists", "Stacks", "OOD"],
        difficultySplit: { easy: 40, medium: 40, hard: 20 },
        topicFrequency: [
            { name: "Linked List Manipulation", value: 88 },
            { name: "OOD Patterns", value: 75 },
            { name: "Bit Manipulation", value: 45 },
            { name: "Threading / OS", value: 40 }
        ],
        insights: [
            "Heavy focus on fundamental data structures (LL/Queues).",
            "Expect questions on Operating Systems and Concurrency.",
            "Code quality and OOP principles are highly scrutinized.",
            "Standard technical questions with a focus on 'Edge Case' handling."
        ],
        questions: [
            { title: "Reverse Nodes in k-Group", difficulty: "Hard", topic: "Linked List" },
            { title: "Design Parking Lot", difficulty: "Medium", topic: "OOD" },
            { title: "Copy List with Random Pointer", difficulty: "Medium", topic: "Linked List" }
        ]
    }
];