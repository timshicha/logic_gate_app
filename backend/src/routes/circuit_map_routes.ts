import {FastifyInstance} from "fastify";
import {CircuitMap} from "../db/entities/CircuitMap.js";
import { User } from "../db/entities/User.js";
import {Collection, wrap} from '@mikro-orm/core';
import { selectMap} from "../utils/collectionTools.js";

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
			const user = await req.em.findOne(User, {email: email}, {populate: ["circuitMaps"]});
			// Get the user's map
			const map = selectMap(user.circuitMaps, mapTitle);
			await wrap(map).assign({ circuitMap: newMap });
			await req.em.flush();
			return reply.send(map);
		} catch (err) {
			reply.status(500).send(err);
		}
	});
	
	// Find a map
	app.search("/circuitmaps", async (req, reply) => {
		// @ts-ignore
		const { email, mapTitle } = req.body;
		// Find the map
		try {
			// Find user first
			const user = await req.em.findOne(User, {email: email}, {populate: ["circuitMaps"]});
			// Get the user's map
			const map = selectMap(user.circuitMaps, mapTitle);
			return reply.send(map);
		} catch (err) {
			reply.status(500).send(err);
		}
	})
}
