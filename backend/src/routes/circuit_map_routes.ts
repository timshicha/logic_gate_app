import {FastifyInstance} from "fastify";
import {CircuitMap} from "../db/entities/CircuitMap.js";
import { User } from "../db/entities/User.js";
import { wrap } from '@mikro-orm/core';

export function CircuitMapRoutesInit(app: FastifyInstance) {
	// Route to create a map for a user
	app.post("/circuitmaps", async (req, reply) => {
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
	
	// Modify an existing map
	app.put("/circuitmaps", async (req, reply) => {
		// @ts-ignore
		let { email, mapTitle, newMap } = req.body;
		// Modify the map
		try {
			const user = await req.em.findOne(User, {email: email});
			const map = await req.em.findOne(CircuitMap, {
				owner: user, title: mapTitle
			});
			await wrap(map).assign({ circuitMap: newMap });
			await req.em.flush();
			return reply.send(map);
		} catch (err) {
			reply.status(500).send(err);
		}
	});
}
