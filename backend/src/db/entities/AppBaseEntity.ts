import { BaseEntity, PrimaryKey, Property} from "@mikro-orm/core";

export class AppBaseEntity extends BaseEntity<AppBaseEntity, "id"> {
	@PrimaryKey()
	id!: number;
	
	@Property()
	created_at = new Date();
	
	@Property({onUpdate: () => new Date()})
	updated_at = new Date();
}
