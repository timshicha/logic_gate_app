import {Entity, ManyToOne, Property, TextType, Unique} from "@mikro-orm/core";
import type { Ref, Rel } from "@mikro-orm/core";
import {AppBaseEntity} from "./AppBaseEntity.js";
import {User} from "./User.js";

@Entity()
export class CircuitMap extends AppBaseEntity {
	
	// The user to whom the map belongs
	@ManyToOne()
	owner!: Ref<User>;
	
	@Property()
	@Unique()
	title!: string;
	
	// The map as a json string
	@Property({ type: TextType, nullable: true })
	circuitMap!: string;
}
