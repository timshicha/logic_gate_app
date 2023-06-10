import {FastifyInstance} from "fastify";
import {CircuitMap} from "../src/db/entities/CircuitMap.js";
import { User } from "../src/db/entities/User.js";

export function CircuitMapRoutesInit(app: FastifyInstance) {
	// Route that adds a user by a given email
	app.post("/circuitmaps/create", async (req, reply) => {
		// @ts-ignore
		let { email, mapTitle, initialMap } = req.body;
		// If no initial map provided, make empty initial map
		if(!initialMap) {
			initialMap = "{}";
		}
		// Add the map to the user
		try {
			const user = await req.em.findOne(User, {email: email});
			const newMap = await req.em.create(CircuitMap, {
				owner: user, title: mapTitle, circuitMap: initialMap
			});
			await req.em.flush();
			return reply.send(newMap);
		} catch(err) {
			reply.status(500).send(err);
		}
	});
}
