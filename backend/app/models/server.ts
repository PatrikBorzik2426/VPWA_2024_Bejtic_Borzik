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

  @column()
  declare creatorId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'creatorId',
  })
  declare creator: BelongsTo<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'server_user',
    pivotForeignKey: 'server_id',
    relatedKey: 'user_id',
    pivotColumns: ['kick_counter', 'ban'], 
  })
  declare users: ManyToMany<typeof User>

  @hasMany(() => Channel, {
    foreignKey: 'serverId',
  })
  declare channels: HasMany<typeof Channel>
}
