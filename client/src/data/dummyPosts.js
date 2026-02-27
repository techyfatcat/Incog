export const posts = [
    {
        id: 1,
        title: "Amazon OA experience?",
        body: "How difficult was the OA for 2026 batch?",
        hp: 42,
        comments: [
            {
                id: 101,
                text: "Focus on DSA basics.",
                upvotes: 15,
                replies: [
                    {
                        id: 102,
                        text: "Specifically Graphs and Dynamic Programming. They've been asking a lot of those lately.",
                        upvotes: 8,
                        replies: [
                            {
                                id: 103,
                                text: "Is LeetCode medium enough or should I go for hard?",
                                upvotes: 2,
                                replies: []
                            }
                        ]
                    }
                ]
            },
            {
                id: 104,
                text: "Time management is key. The coding section is tight.",
                upvotes: 22,
                replies: []
            },
        ],
    },
    {
        id: 2,
        title: "Best roadmap for DBMS?",
        body: "Any good resources for a complete beginner? Looking for something that covers normalization well.",
        hp: 30,
        comments: [
            {
                id: 201,
                text: "Use Gate Smashers. Their playlist is gold for normalization.",
                upvotes: 12,
                replies: []
            }
        ],
    },
];