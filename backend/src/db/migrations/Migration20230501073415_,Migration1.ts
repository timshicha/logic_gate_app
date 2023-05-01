import { Migration } from '@mikro-orm/migrations';

export class Migration20230501073415 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "message" add column "email_from" varchar(255) not null, add column "email_to" varchar(255) not null;');
    this.addSql('alter table "message" drop column "sender";');
    this.addSql('alter table "message" drop column "receiver";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "message" add column "sender" varchar(255) not null, add column "receiver" varchar(255) not null;');
    this.addSql('alter table "message" drop column "email_from";');
    this.addSql('alter table "message" drop column "email_to";');
  }

}
