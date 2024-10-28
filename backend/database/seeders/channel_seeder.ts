import {BaseSeeder} from '@adonisjs/lucid/seeders'
import Channel from '../../app/models/channel.js'

export default class ChannelSeeder extends BaseSeeder {
  public async run () {
    await Channel.createMany([
      {
        serverId: 1, // Assuming server ID 1 exists
        name: 'General Discussion',
      },
      {
        serverId: 1, // Assuming server ID 1 exists
        name: 'Off-topic',
      },
    ])
  }
}
