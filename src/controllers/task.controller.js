const taskService = require('../services/task.service');
const { successResponse, errorResponse } = require('../utils/response.util');

class TaskController {
	async getAllTasks(req, res) {
		try {
			const filters = {};
			if (req.query.status) {
				filters.status = req.query.status;
			}

			const tasks = await taskService.getAllTasks(req.user.userId, filters);
			return successResponse(res, tasks, 'Tasks fetched Successfully');
		} catch (error) {
			return errorResponse(res, error.message);
		}
	}

	async getTask(req, res) {
		try {
			const task = await taskService.getTaskById(req.params.id, req.user.userId);
			return successResponse(res, task, 'Task fetched Successfully');
		} catch (error) {
			return errorResponse(res, error.message, 401);
		}
	}

	async createTask(req, res) {
		try {
			const task = await taskService.createTask(req.user.userId, req.body);
			return successResponse(res, task, 'Task created Successfully', 201);
		} catch (error) {
			return errorResponse(res, error.message, 400);
		}
	}

	async updateTask(req, res) {
		try {
			const task = await taskService.updateTask(req.params.id, req.user.userId, req.body);
			return successResponse(res, task, 'Task updated Successfully');
		} catch (error) {
			return errorResponse(res, error.message, 404);
		}
	}

	async deleteTask(req, res) {
		try {
			const result = await taskService.deleteTask(req.params.id, req.user.userId);
			return successResponse(res, result, 'Task deleted Successfully');
		} catch (error) {
			return errorResponse(res, error.message, 404);
		}
	}

	async getStats(req, res) {
		try {
			const stats = await taskService.getUserTaskStats(req.user.userId);
			return successResponse(res, stats, 'Task stats fetched Successfully');
		} catch (error) {
			return errorResponse(res, error.message);
		}
	}
}

module.exports = new TaskController();