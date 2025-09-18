import {Cascade, Collection, Entity, OneToMany, Property, Unique} from "@mikro-orm/core";
import {AppBaseEntity} from "./AppBaseEntity.js";
import {CircuitMap} from "./CircuitMap.js";

@Entity()
export class User extends AppBaseEntity {
	@Property()
	@Unique()
	email!: string;
	
	@OneToMany(
		() => CircuitMap,
		circuitMap => circuitMap.owner,
		{cascade: [Cascade.PERSIST, Cascade.REMOVE], orphanRemoval: true}
	)
	circuitMaps!: Collection<CircuitMap>;
}
