const { Sequelize } = require('sequelize');

const { logger } = require('./../utils/logger.js');

// Option 1: Passing a connection URI
// const sequelize = new Sequelize('sqlite::memory:') // Example for sqlite
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname') // Example for postgres

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
	host: 'localhost',
	dialect: 'mysql',
	port: process.env.DB_PORT,
});

module.exports = {
	sequelize : sequelize,
	async testDBConnection() {
		await sequelize.authenticate()
			.then(() => {
				logger.info('Connected to the database succesfully');
			})
			.catch(() => {
				logger.error('Can\'t connect to the database');
			});
	},
};