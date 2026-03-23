const Project = require('./Project');

module.exports = async (req, res) => {
  try {
    const { projectId, step, data, completedStep } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: 'projectId is required' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update step data
    if (step && data) {
      project.steps[step] = { ...project.steps[step], ...data };
      project.markModified('steps');
    }

    // Mark step completed
    if (completedStep && !project.completedSteps.includes(completedStep)) {
      project.completedSteps.push(completedStep);
      project.currentStep = Math.max(project.currentStep, completedStep + 1);
    }

    await project.save();
    res.json(project);
  } catch (err) {
    console.error('Update project error:', err);
    res.status(500).json({ message: 'Failed to update project' });
  }
};
