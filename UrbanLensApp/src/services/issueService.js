// Stub — swap internals for Firestore in Phase 2

const MOCK_ISSUES = [
  {
    id: '1',
    title: 'Large pothole near bus stop',
    type: 'pothole',
    severity: 'high',
    status: 'pending',
    address: '14B, MG Road, New Delhi',
    description: 'Deep pothole causing traffic slowdowns and vehicle damage.',
    coordinates: { latitude: 28.6139, longitude: 77.2090 },
    reportedAt: '2 hours ago',
    reportedBy: 'user@example.com',
    upvotes: 12,
    isThisWeek: true,
    dayOfWeek: 1,
  },
  {
    id: '2',
    title: 'Overflowing garbage bin',
    type: 'garbage',
    severity: 'medium',
    status: 'pending',
    address: 'Sector 21, Noida',
    description: 'Garbage bin overflowing for 3 days.',
    coordinates: { latitude: 28.6200, longitude: 77.2150 },
    reportedAt: '5 hours ago',
    reportedBy: 'user2@example.com',
    upvotes: 5,
    isThisWeek: true,
    dayOfWeek: 2,
  },
  {
    id: '3',
    title: 'Broken street light',
    type: 'streetlight',
    severity: 'low',
    status: 'resolved',
    address: 'Connaught Place, New Delhi',
    description: 'Street light not working since last week.',
    coordinates: { latitude: 28.6330, longitude: 77.2194 },
    reportedAt: '1 day ago',
    reportedBy: 'user3@example.com',
    upvotes: 3,
    isThisWeek: true,
    dayOfWeek: 3,
  },
  {
    id: '4',
    title: 'Road flooding after rain',
    type: 'flooding',
    severity: 'high',
    status: 'pending',
    address: 'Lajpat Nagar, New Delhi',
    description: 'Entire road submerged. Vehicles unable to pass.',
    coordinates: { latitude: 28.5677, longitude: 77.2433 },
    reportedAt: '3 hours ago',
    reportedBy: 'user4@example.com',
    upvotes: 21,
    isThisWeek: true,
    dayOfWeek: 1,
  },
  {
    id: '5',
    title: 'Graffiti on public wall',
    type: 'graffiti',
    severity: 'low',
    status: 'resolved',
    address: 'Hauz Khas Village, Delhi',
    description: 'Obscene graffiti on boundary wall of school.',
    coordinates: { latitude: 28.5494, longitude: 77.2001 },
    reportedAt: '2 days ago',
    reportedBy: 'user5@example.com',
    upvotes: 7,
    isThisWeek: false,
    dayOfWeek: 5,
  },
  {
    id: '6',
    title: 'Pothole causing accidents',
    type: 'pothole',
    severity: 'high',
    status: 'pending',
    address: 'NH-48, Gurugram',
    description: 'Multiple accidents reported at this pothole.',
    coordinates: { latitude: 28.4595, longitude: 77.0266 },
    reportedAt: '4 hours ago',
    reportedBy: 'user6@example.com',
    upvotes: 18,
    isThisWeek: true,
    dayOfWeek: 4,
  },
];

export const issueService = {
  async getIssues(filters = {}) {
    // TODO: Firestore query with filters
    await new Promise(r => setTimeout(r, 300));
    let data = [...MOCK_ISSUES];
    if (filters.type) data = data.filter(i => i.type === filters.type);
    if (filters.severity) data = data.filter(i => i.severity === filters.severity);
    if (filters.status) data = data.filter(i => i.status === filters.status);
    return data;
  },

  async getIssueById(id) {
    // TODO: Firestore doc fetch
    await new Promise(r => setTimeout(r, 200));
    return MOCK_ISSUES.find(i => i.id === id) || null;
  },

  async createIssue(issueData) {
    // TODO: Firestore addDoc + image upload to Storage
    await new Promise(r => setTimeout(r, 600));
    const newIssue = {
      id: Date.now().toString(),
      ...issueData,
      status: 'pending',
      upvotes: 0,
      reportedAt: 'Just now',
      isThisWeek: true,
      dayOfWeek: new Date().getDay(),
    };
    MOCK_ISSUES.unshift(newIssue);
    return newIssue;
  },

  async upvoteIssue(id) {
    // TODO: Firestore increment
    const issue = MOCK_ISSUES.find(i => i.id === id);
    if (issue) issue.upvotes += 1;
    return issue;
  },

  async updateStatus(id, status) {
    // TODO: Firestore update
    const issue = MOCK_ISSUES.find(i => i.id === id);
    if (issue) issue.status = status;
    return issue;
  },

  async getStats() {
    // TODO: Firestore aggregation / Cloud Function
    const data = await this.getIssues();
    return {
      total:    data.length,
      resolved: data.filter(i => i.status === 'resolved').length,
      pending:  data.filter(i => i.status === 'pending').length,
      thisWeek: data.filter(i => i.isThisWeek).length,
    };
  },
};