const taskRepository = require(`../repositories/task.repository`);

const normalizeStatus = (status) => {
	if (!status || typeof status !== "string") return status;
	return status.toLowerCase().replace(/[_\s]+/g, "-");
};

class TaskService {
	async getAllTasks(userId, filters) {
		const parsedFilters = { ...filters };
		if (parsedFilters.status) {
			parsedFilters.status = normalizeStatus(parsedFilters.status);
		}
		return await taskRepository.findAll(userId, parsedFilters);
	}

	async getTaskById(taskId, userId) {
		const task = await taskRepository.findById(taskId, userId);
		if (!task) {
			throw new Error("task not found");
		}
		return task;
	}

	async createTask(userId, taskData) {
		const payload = {
			...taskData,
			userId,
		};
		if (payload.status) {
			payload.status = normalizeStatus(payload.status);
		}
		const task = await taskRepository.create(payload);
		return task;
	}

	async updateTask(taskId, userId, taskData) {
		const payload = { ...taskData };
		if (payload.status) {
			payload.status = normalizeStatus(payload.status);
		}
		const task = await taskRepository.update(taskId, userId, payload);
		if (!task) {
			throw new Error("task not found");
		}
		return task;
	}

	async deleteTask(taskId, userId) {
		const result = await taskRepository.delete(taskId, userId);
		if (!result) {
			throw new Error("task not found");
		}
		return { message: "task deleted successfully" };
	}

	async getUserTaskStats(userId) {
		const tasks = await taskRepository.findAll(userId);
		return {
			total: tasks.length,
			pending: tasks.filter((t) => t.status === "pending").length,
			inProgress: tasks.filter((t) => t.status === "in-progress").length,
			completed: tasks.filter((t) => t.status === "completed").length,
		};
	}
}

module.exports = new TaskService();
