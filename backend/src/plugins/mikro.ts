import { MikroORM, Options } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";

import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

export type MikroORMPluginOptions = Options & FastifyMikroOrmOptions;

type FastifyMikroOrmOptions = {
	forkOnRequest?: boolean;
};

declare module "fastify" {
	interface FastifyInstance {
		db: Awaited<ReturnType<(typeof MikroORM)["init"]>>;
	}
	
	interface FastifyRequest {
		db: Awaited<ReturnType<(typeof MikroORM)["init"]>>;
		em: EntityManager | undefined;
	}
}

export const fastifyMikroORMCore: FastifyPluginAsync<MikroORMPluginOptions> = async function (
	fastify,
	options
) {
	if (options.forkOnRequest === undefined) {
		options.forkOnRequest = true;
	}
	
	const db = await MikroORM.init(options);
	
	// gives us access to `app.db`
	fastify.decorate("db", db);
	
	if (options.forkOnRequest) {
		fastify.addHook("onRequest", async function (this: typeof fastify, request, reply) {
			request.db = Object.assign({}, this.db);
			// Must fork context as per https://mikro-orm.io/docs/identity-map/
			request.em = request.db.em.fork() as EntityManager;
		});
	} else {
		fastify.addHook("onRequest", async function (this: typeof fastify, request, reply) {
			request.db = this.db;
			request.em = undefined;
		});
	}
	
	fastify.addHook("onClose", () => db.close());
};

export const FastifyMikroOrmPlugin = fp(fastifyMikroORMCore, {
	name: "fastify-mikro-orm",
});
