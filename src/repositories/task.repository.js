const { Task } = require("../models");

class TaskRepository {
	async findAll(userId, filters = {}) {
		const where = { userId };

		if (filters.status) {
			where.status = filters.status;
		}

		return await Task.findAll({
			where,
			order: [["createdAt", "DESC"]],
		});
	}

	async findById(id, userId) {
		return await Task.findOne({
			where: { id, userId },
		});
	}

	async create(taskData) {
		return await Task.create(taskData);
	}

	async update(id, userId, taskData) {
		const task = await this.findById(id, userId);
		if (!task) return null;
		return await task.update(taskData);
	}

	async delete(id, userId) {
		const task = await this.findById(id, userId);
		if (!task) return null;
		await task.destroy();
		return true;
	}

	async countByUser(userId) {
		return await Task.count({ where: { userId: userId } });
	}

	async countByStatus(userId, status) {
		return await Task.count({ where: { userId, status } });
	}
}

module.exports = new TaskRepository();
