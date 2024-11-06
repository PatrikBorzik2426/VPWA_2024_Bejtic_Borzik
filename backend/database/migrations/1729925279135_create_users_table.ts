import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('login', 64).notNullable().unique()
      table.binary('password').notNullable()
      table.string('first_name', 35).notNullable()
      table.string('last_name', 35).notNullable()
      table.string('email', 254).notNullable().unique()
      table.enu('status', ['online', 'offline', 'DND']).defaultTo('offline').notNullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())

      // Automatically managed timestamps for created and updated dates
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
