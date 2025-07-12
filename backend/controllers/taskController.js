const Task = require('../models/Task');

// @desc    Get all tasks for logged-in user (optionally filtered by status)
exports.getTasks = async (req, res) => {
  const { status } = req.query;
  const query = { user: req.user._id };
  if (status) query.status = status;

  try {
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
};

// @desc    Create a new task
exports.createTask = async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  try {
    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status,
      dueDate
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: 'Invalid task data' });
  }
};

// @desc    Update a task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error updating task' });
  }
};

// @desc    Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};
