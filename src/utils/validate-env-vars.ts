import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

import { logger } from './logger.js'

config({ path:join(resolve(resolve(dirname(fileURLToPath(import.meta.url)), '..'), '..'), 'secrets.env') });

export type allowedTypes = 'string' | 'number'; 
export function validateEnvVars(variables: { name:string; type:allowedTypes }[]) {
    for (const variable of variables) {
		if (process.env[variable.name] === undefined){
			logger.error(`Missing required environment variable: ${variable.name}`);
			process.exit(1);
		}

        if(variable.type === 'number' && isNaN(Number(process.env[variable.name]))){
			logger.error(`Invalid type for ${variable.name}, expected ${variable.type}`);
			process.exit(1);
		}
    }
}