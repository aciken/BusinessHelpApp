const Project = require('./Project');

module.exports = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const projects = await Project.find({ userId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('Get projects error:', err);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
};
