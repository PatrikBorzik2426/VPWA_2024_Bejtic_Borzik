import {BaseSeeder} from '@adonisjs/lucid/seeders'
import User from '../../app/models/user.js'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    await User.createMany([
      {
        login: 'john_doe',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        user_status: 'online',
      },
      {
        login: 'jane_smith',
        password: 'password456',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        user_status: 'offline',
      },
      {
        login: 'joe_bloggs',
        password: 'password789',
        firstName: 'Joe',
        lastName: 'Bloggs',
        email: 'joe_bloggs@example.com',
        user_status: 'DND',
      },
      {
        login: 'jane_doe',
        password : 'password123',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'janedoe@example.com',
        user_status: 'online',
      }
    ])
  }
}