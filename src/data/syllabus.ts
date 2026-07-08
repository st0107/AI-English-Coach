export const syllabus = [
  {
    id: 'l0',
    title: 'Daily Life English',
    description: 'Master everyday conversations, social interactions, and essential vocabulary.',
    level: 'B1',
    modules: [
      {
        id: 'm0_1',
        title: 'Socializing & Networking',
        lessons: [
          { id: 'les_dl_1', title: 'Small Talk and Introductions', type: 'speaking' },
          { id: 'les_dl_2', title: 'Inviting Friends and Making Plans', type: 'conversation' }
        ]
      },
      {
        id: 'm0_2',
        title: 'Everyday Errands',
        lessons: [
          { id: 'les_dl_3', title: 'Ordering Food and Dining Out', type: 'speaking' },
          { id: 'les_dl_4', title: 'Shopping and Asking for Help', type: 'conversation' }
        ]
      }
    ]
  },
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
      },
      {
        id: 'm4',
        title: 'Technical Whiteboarding',
        lessons: [
          { id: 'les7', title: 'Explaining Your Thought Process', type: 'speaking' },
          { id: 'les8', title: 'Handling Hints and Edge Cases', type: 'conversation' }
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
        id: 'm5',
        title: 'Professional Disagreement',
        lessons: [
          { id: 'les9', title: 'Pushing Back on Deadlines', type: 'conversation' },
          { id: 'les10', title: 'Giving Constructive Code Review Feedback', type: 'writing' }
        ]
      },
      {
        id: 'm6',
        title: 'Leading Meetings',
        lessons: [
          { id: 'les11', title: 'Kicking Off a Project', type: 'speaking' },
          { id: 'les12', title: 'Facilitating a Post-Mortem', type: 'conversation' }
        ]
      }
    ]
  },
  {
    id: 'l4',
    title: 'Advanced Tech Writing',
    description: 'Produce high-quality engineering documents.',
    level: 'C2',
    modules: [
      {
        id: 'm7',
        title: 'Design Docs (RFCs)',
        lessons: [
          { id: 'les13', title: 'Structuring an RFC', type: 'reading' },
          { id: 'les14', title: 'Writing the Executive Summary', type: 'writing' }
        ]
      },
      {
        id: 'm8',
        title: 'Documentation',
        lessons: [
          { id: 'les15', title: 'Writing API Documentation', type: 'writing' },
          { id: 'les16', title: 'Creating Clear READMEs', type: 'writing' }
        ]
      }
    ]
  }
];
