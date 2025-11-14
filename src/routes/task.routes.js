const express = require("express");
const taskController = require("../controllers/task.controller");
const authMiddleware = require("../middleware/auth.middleware");
const {
	validateCreateTask,
	validateUpdateTask,
	validateQueryFilters,
} = require("../validators/task.validator");
const router = express.Router();

router.use(authMiddleware);

router.get("/", validateQueryFilters, taskController.getAllTasks);
router.get("/stats", taskController.getStats);
router.get("/:id", taskController.getTask);
router.post("/", validateCreateTask, taskController.createTask);
router.put("/:id", validateUpdateTask, taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
