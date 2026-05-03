import express from 'express';
import Task from '../models/Task.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, async (req, res) => {
    try {
      let tasks;
      if (req.user.role === 'Admin') {
        tasks = await Task.find().populate('project', 'name').populate('assignedTo', 'name email');
      } else {
        tasks = await Task.find({ assignedTo: req.user._id }).populate('project', 'name').populate('assignedTo', 'name email');
      }
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .post(protect, async (req, res) => {
    // Admin can create tasks, or project owner, keeping it simple: anyone can create but must be assigned.
    const { title, description, project, assignedTo, status, dueDate } = req.body;
    try {
      if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Only Admins can create tasks' });
      }
      const task = new Task({
        title,
        description,
        project,
        assignedTo,
        status,
        dueDate
      });
      const createdTask = await task.save();
      res.status(201).json(createdTask);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.route('/:id')
  .put(protect, async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (task) {
        // Members can only update status
        if (req.user.role === 'Member') {
          if (task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
          }
          task.status = req.body.status || task.status;
        } else {
          task.title = req.body.title || task.title;
          task.description = req.body.description || task.description;
          task.project = req.body.project || task.project;
          task.assignedTo = req.body.assignedTo || task.assignedTo;
          task.status = req.body.status || task.status;
          task.dueDate = req.body.dueDate || task.dueDate;
        }
        const updatedTask = await task.save();
        res.json(updatedTask);
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .delete(protect, async (req, res) => {
    try {
      if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Only Admins can delete tasks' });
      }
      const task = await Task.findById(req.params.id);
      if (task) {
        await task.deleteOne();
        res.json({ message: 'Task removed' });
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

export default router;
