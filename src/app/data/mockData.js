export const mockCourses = [
  {
    id: '1',
    code: 'CS101',
    name: 'Introduction to Computer Science',
    instructor: 'Dr. Harsha Ganesh',
    department: 'Computer Science',
    semester: 'ODD SEM 2026'
  },
  {
    id: '2',
    code: 'MATH201',
    name: 'Advanced Calculus',
    instructor: 'Prof. Shyam Chandu',
    department: 'Mathematics',
    semester: 'ODD SEM 2026'
  },
  {
    id: '3',
    code: 'ENG102',
    name: 'English Composition',
    instructor: 'Dr. Yaswanth',
    department: 'English',
    semester: 'ODD SEM 2026'
  },
  {
    id: '4',
    code: 'PHYS301',
    name: 'Quantum Mechanics',
    instructor: 'Dr. B.Venkateswarulu',
    department: 'Physics',
    semester: 'ODD SEM 2026'
  },
  {
    id: '5',
    code: 'BIO150',
    name: 'Cell Biology',
    instructor: 'Prof. Dhoni',
    department: 'Biology',
    semester: 'ODD SEM 2026'
  }
];

export const mockInstructors = [
  {
    id: '1',
    name: 'Dr. Harsha Ganesh',
    department: 'Computer Science',
    courses: ['CS101', 'CS201', 'CS301']
  },
  {
    id: '2',
    name: 'Prof. Shyam Chandu',
    department: 'Mathematics',
    courses: ['MATH201', 'MATH301']
  },
  {
    id: '3',
    name: 'Dr. Yaswanth',
    department: 'English',
    courses: ['ENG102', 'ENG205']
  },
  {
    id: '4',
    name: 'Dr. B.Venkateswarulu',
    department: 'Physics',
    courses: ['PHYS301', 'PHYS401']
  },
  {
    id: '5',
    name: 'Prof. Dhoni',
    department: 'Biology',
    courses: ['BIO150', 'BIO250']
  }
];

export const mockServiceCategories = [
  {
    id: '1',
    name: 'Library Services',
    description: 'Resources, study spaces, and research assistance'
  },
  {
    id: '2',
    name: 'Student Affairs',
    description: 'Student support, counseling, and campus activities'
  },
  {
    id: '3',
    name: 'IT Services',
    description: 'Technology support, WiFi, and computer labs'
  },
  {
    id: '4',
    name: 'Dining Services',
    description: 'Cafeteria, meal plans, and food quality'
  },
  {
    id: '5',
    name: 'Housing Services',
    description: 'Dormitories, maintenance, and residential life'
  },
  {
    id: '6',
    name: 'Career Services',
    description: 'Job placement, internships, and career counseling'
  }
];

export const mockFeedbacks = [
  {
    id: '1',
    studentId: 'S001',
    type: 'course',
    targetId: '1',
    targetName: 'CS101',
    rating: 5,
    comments: 'Excellent course structure and clear explanations.',
    timestamp: '2026-02-20T10:30:00Z'
  },
  {
    id: '2',
    studentId: 'S002',
    type: 'instructor',
    targetId: '1',
    targetName: 'Dr. Harsha Ganesh',
    rating: 5,
    comments: 'Very knowledgeable and approachable instructor.',
    timestamp: '2026-02-19T14:20:00Z'
  },
  {
    id: '3',
    studentId: 'S003',
    type: 'service',
    targetId: '1',
    targetName: 'Library Services',
    rating: 4,
    comments: 'Great study spaces, but could use more late-night hours.',
    category: 'Library Services',
    timestamp: '2026-02-18T09:15:00Z'
  },
  {
    id: '4',
    studentId: 'S001',
    type: 'course',
    targetId: '2',
    targetName: 'MATH201',
    rating: 4,
    comments: 'Challenging but rewarding content.',
    timestamp: '2026-02-17T11:45:00Z'
  },
  {
    id: '5',
    studentId: 'S004',
    type: 'instructor',
    targetId: '2',
    targetName: 'Prof. Shyam Chandu',
    rating: 5,
    comments: 'Makes complex topics easy to understand.',
    timestamp: '2026-02-16T16:00:00Z'
  },
  {
    id: '6',
    studentId: 'S002',
    type: 'service',
    targetId: '3',
    targetName: 'IT Services',
    rating: 3,
    comments: 'Response time could be improved.',
    category: 'IT Services',
    timestamp: '2026-02-15T13:30:00Z'
  }
];

export const mockAnalyticsData = {
  totalFeedbacks: 342,
  averageRating: 4.3,
  responseRate: 68,
  trendData: [
    { month: 'Aug', feedbacks: 45, avgRating: 4.1 },
    { month: 'Sep', feedbacks: 52, avgRating: 4.2 },
    { month: 'Oct', feedbacks: 58, avgRating: 4.3 },
    { month: 'Nov', feedbacks: 63, avgRating: 4.4 },
    { month: 'Dec', feedbacks: 48, avgRating: 4.2 },
    { month: 'Jan', feedbacks: 76, avgRating: 4.5 }
  ],
  categoryBreakdown: [
    { category: 'Course', count: 156, avgRating: 4.4 },
    { category: 'Instructor', count: 128, avgRating: 4.5 },
    { category: 'Services', count: 58, avgRating: 4.0 }
  ]
};