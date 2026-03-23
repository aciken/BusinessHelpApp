const Project = require('./Project');

module.exports = async (req, res) => {
  try {
    const { userId, name, description, icon } = req.body;

    if (!userId || !name || !icon) {
      return res.status(400).json({ message: 'userId, name, and icon are required' });
    }

    const project = await Project.create({
      userId,
      name: name.trim(),
      description: description || '',
      icon,
      steps: {
        idea: { description: description || '' },
        market: {},
        product: {},
        plan: {},
        marketing: {},
        launch: {},
      },
    });

    res.status(201).json(project);
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ message: 'Failed to create project' });
  }
};
