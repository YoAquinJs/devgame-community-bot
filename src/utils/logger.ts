import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
		format: format.combine(
			format.colorize(),
			format.simple(),
		),
		transports: [new transports.Console()],
	});