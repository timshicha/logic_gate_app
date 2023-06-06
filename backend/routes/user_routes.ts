import {FastifyInstance} from "fastify";
import { User } from "../src/db/entities/User.js";

export function UserRoutesInit(app: FastifyInstance) {
	// Route that adds a user by a given email
	app.post("/create", async (req, reply) => {
		const { email } = req.body;
		// Make sure this user does not already exist
		try {
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
