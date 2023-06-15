import {FastifyInstance} from "fastify";
import { User } from "../db/entities/User.js";

export function UserRoutesInit(app: FastifyInstance) {
	// Route that adds a user by a given email
	app.post("/users", async (req, reply) => {
		// @ts-ignore
		const { email } = req.body;
		// If user already exists, simply ignore request
		try {
			const user = await req.em.findOne(User, {
				email
			});
			if(user) {
				return reply.send(user);
			}
			const newUser = await req.em.create(User, {
				email
			});
			await req.em.flush();
			return reply.send(newUser);
		} catch (err) {
			reply.status(500).send(err);
		}
	});
}
