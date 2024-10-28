import {BaseSeeder} from '@adonisjs/lucid/seeders'
import Server from '../../app/models/server.js'

export default class ServerSeeder extends BaseSeeder {
  public async run () {
    await Server.createMany([
      {
        name: 'General Chat',
        privacy: false,
        creatorId: 1, // Assuming user ID 1 exists
      },
      {
        name: 'Private Discussions',
        privacy: true,
        creatorId: 2, // Assuming user ID 2 exists
      },
    ])
  }
}
