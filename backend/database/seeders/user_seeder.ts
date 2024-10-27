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
        status: 'online',
      },
      {
        login: 'jane_smith',
        password: 'password456',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        status: 'offline',
      },
    ])
  }
}
