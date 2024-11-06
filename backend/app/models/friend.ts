import { DateTime } from 'luxon'
import { BaseModel, column,  belongsTo } from '@adonisjs/lucid/orm'

import User from './user.js'

export default class Friend extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user1Id: number

  @column()
  declare user2Id: number

  @column()
  declare unreadMessagesCount: number

  @belongsTo(() => User, { foreignKey: 'user1Id' })
  declare user1: typeof User

  @belongsTo(() => User, { foreignKey: 'user2Id' })
  declare user2: typeof User

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}