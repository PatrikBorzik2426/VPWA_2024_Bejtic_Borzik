import {BaseSeeder} from '@adonisjs/lucid/seeders'
import FriendRequest from '../../app/models/friend_request.js'

export default class FriendRequestSeeder extends BaseSeeder {
  public async run () {
    await FriendRequest.createMany([
      {
        senderId: 1, // Assuming user ID 1 exists
        receiverId: 2, // Assuming user ID 2 exists
        accepted: false,
      },
      {
        senderId: 2, // Assuming user ID 2 exists
        receiverId: 1, // Assuming user ID 1 exists
        accepted: true,
      },
    ])
  }
}
