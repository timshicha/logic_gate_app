
import {Entity, Property, Unique, ManyToOne, PrimaryKey} from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";
import { User } from "./User.js";


@Entity()
export class Message {
	
	@PrimaryKey()
		id!:number;
	
	@Property()
		email_from!: User;
	
	@Property()
		email_to!: User;
	
	@Property()
		message: string;
}
