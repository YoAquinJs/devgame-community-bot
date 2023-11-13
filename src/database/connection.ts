import { Sequelize } from 'sequelize';

import { logger } from './../utils/logger.js';
import { validateEnvVars, allowedTypes } from './../utils/validate-env-vars.js';

const requiredEnvVars:{name:string,type:allowedTypes}[] = [
	{name:'DB_NAME', type:'string'},
	{name:'DB_USER', type:'string'},
	{name:'DB_PASSWORD', type:'string'},
	{name:'DB_PORT', type:'number'},
];
validateEnvVars(requiredEnvVars);

export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
	host: 'localhost',
	dialect: 'mysql',
	port: parseInt(process.env.DB_PORT),
});

export async function testDBConnection() {
	await sequelize.authenticate()
		.then(() => {
			logger.info('Connected to the database succesfully');
		})
		.catch(() => {
			logger.error('Can\'t connect to the database');
			process.exit(1);
		});
}