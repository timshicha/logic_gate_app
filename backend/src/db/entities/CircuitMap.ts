import {Entity, ManyToOne, Property, Ref} from "@mikro-orm/core";
import {AppBaseEntity} from "./AppBaseEntity.js";
import {User} from "./User.js";

@Entity()
export class CircuitMap extends AppBaseEntity {
	
	// The user to whom the map belongs
	@ManyToOne()
	owner!: Ref<User>;
	
	@Property()
	title!: string;
	
	// The map as a json string
	@Property()
	circuitMap!: string;
}
