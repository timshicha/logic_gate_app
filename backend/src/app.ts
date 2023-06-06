import Fastify from "fastify";
import LogicGateAppRoutes from "../routes/routes.js";
import {FastifyMikroOrmPlugin} from "./mikro.js";
import config from "./db/mikro-orm.config.js";


const envToLogger = {
	development: {
		transport: {
			target: 'pino-pretty',
			options: {
				translateTime: 'HH:MM:ss Z',
				ignore: 'pid,hostname',
			},
		},
		level: "debug",
	},
	production: {
		level: "error"
	},
	test: {
		transport: {
			target: 'pino-pretty',
			options: {
				translateTime: 'HH:MM:ss Z',
				ignore: 'pid,hostname',
			},
		},
		level: "warn"
	},
};

const app = Fastify({
	logger: envToLogger[process.env.NOVE_ENV]
});

await app.register(FastifyMikroOrmPlugin, config);
await app.register(LogicGateAppRoutes, {});

export default app;
