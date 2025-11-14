module.exports = (sequelize, DataTypes) => {
	const Task = sequelize.define(
		"Task",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			title: {
				type: DataTypes.STRING(255),
				allowNull: false,
				validate: {
					notEmpty: {
						msg: "Title cannot be empty",
					},
					len: {
						args: [1, 255],
						msg: "Title must be between 1 and 255 characters",
					},
				},
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			status: {
				type: DataTypes.ENUM("pending", "in-progress", "completed"),
				defaultValue: "pending",
				validate: {
					isIn: {
						args: [["pending", "in-progress", "completed"]],
						msg: "Status must be pending, in-progress, or completed",
					},
				},
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				field: "user_id",
				references: {
					model: "users",
					key: "id",
				},
			},
		},
		{
			timestamps: true,
			tableName: "tasks",
			indexes: [
				{
					fields: ["user_id"],
				},
				{
					fields: ["status"],
				},
			],
		}
	);

	Task.associate = (models) => {
		Task.belongsTo(models.User, {
			foreignKey: {
				name: "userId",
				field: "user_id",
			},
			as: "User",
		});
	};

	return Task;
};
