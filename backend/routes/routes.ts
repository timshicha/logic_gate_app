import dotenv from "dotenv";
dotenv.config();

import { FastifyInstance} from "fastify";
import { UserRoutesInit } from "./user_routes.js";

async function LogicGateAppRoutes(app: FastifyInstance, _options={}) {
	if(!app) {
		throw new Error("Fastify instance is null during construction.");
	}
	
	UserRoutesInit(app);
	
	app.get("/", async (req, reply) => {
		reply.send("hi");
	})
}

export default LogicGateAppRoutes;
