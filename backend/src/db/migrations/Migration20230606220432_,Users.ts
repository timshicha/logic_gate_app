import { Migration } from '@mikro-orm/migrations';

export class Migration20230606220432 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" varchar(255) not null);');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');

    this.addSql('create table "circuit_map" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "owner_id" int not null, "title" varchar(255) not null, "circuit_map" varchar(255) not null);');

    this.addSql('alter table "circuit_map" add constraint "circuit_map_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "circuit_map" drop constraint "circuit_map_owner_id_foreign";');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "circuit_map" cascade;');
  }

}
