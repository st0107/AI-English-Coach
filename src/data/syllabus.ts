export const syllabus = [
  {
    id: 'l1',
    title: 'Software Engineering Communication',
    description: 'Learn to explain technical concepts and participate in agile ceremonies.',
    level: 'B2',
    modules: [
      {
        id: 'm1',
        title: 'Daily Standups',
        lessons: [
          { id: 'les1', title: 'Giving a Clear Status Update', type: 'speaking' },
          { id: 'les2', title: 'Reporting Blockers', type: 'speaking' }
        ]
      },
      {
        id: 'm2',
        title: 'System Design & Architecture',
        lessons: [
          { id: 'les3', title: 'Explaining a Microservice Architecture', type: 'reading' },
          { id: 'les4', title: 'Discussing Trade-offs (SQL vs NoSQL)', type: 'conversation' }
        ]
      }
    ]
  },
  {
    id: 'l2',
    title: 'FAANG Interview Preparation',
    description: 'Master behavioral and technical interviews.',
    level: 'C1',
    modules: [
      {
        id: 'm3',
        title: 'Behavioral Interviews (STAR Method)',
        lessons: [
          { id: 'les5', title: 'Tell Me About Yourself', type: 'speaking' },
          { id: 'les6', title: 'Conflict Resolution Stories', type: 'writing' }
        ]
      }
    ]
  },
  {
    id: 'l3',
    title: 'Corporate English & Leadership',
    description: 'Navigate complex workplace scenarios with professionalism.',
    level: 'C1',
    modules: [
      {
        id: 'm4',
        title: 'Professional Disagreement',
        lessons: [
          { id: 'les7', title: 'Pushing Back on Deadlines', type: 'conversation' },
          { id: 'les8', title: 'Giving Constructive Code Review Feedback', type: 'writing' }
        ]
      }
    ]
  }
];
