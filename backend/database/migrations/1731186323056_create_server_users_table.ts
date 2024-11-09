import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ServerUser extends BaseSchema {
  protected tableName = 'server_user'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('server_id').unsigned().notNullable()
        .references('servers.id')
        .onDelete('CASCADE') // Vymaže záznamy pri vymazaní servera

      table.integer('user_id').unsigned().notNullable()
        .references('users.id')
        .onDelete('CASCADE') // Vymaže záznamy pri vymazaní používateľa

      // Dodatočné stĺpce
      table.enum('role', ['creator', 'admin', 'member']).notNullable().defaultTo('member')
      table.integer('position').notNullable().defaultTo(0)
      table.integer('kick_counter').defaultTo(0) // Počet "vykopnutí"
      table.boolean('ban').defaultTo(false) // Ban

      // Časové pečiatky
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())

      // Primárny kľúč
      table.primary(['server_id', 'user_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}