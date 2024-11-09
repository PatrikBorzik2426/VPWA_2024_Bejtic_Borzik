import { BaseModel, column, hasMany, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { HasMany, BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Channel from './channel.js'

export default class Server extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare privacy: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTimestamps: true,
    pivotTable: 'server_user',
    localKey: 'id',
    pivotForeignKey: 'server_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
    pivotColumns: ['kick_counter', 'ban', 'role', 'position'], 
  })
  declare users: ManyToMany<typeof User>

  @hasMany(() => Channel, {
    foreignKey: 'serverId',
  })
  declare channels: HasMany<typeof Channel>
}
