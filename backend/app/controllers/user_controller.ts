import { HttpContext } from '@adonisjs/core/http'
import User from '../models/user.js'

export default class UserController {

async getMainUser(ctx: HttpContext) {
    const user = ctx.auth.user!

    console.log(user)

    const mainUser = await User.query()
      .where('id', user.id)
      .firstOrFail()

    if (!mainUser) {
        return ctx.response.status(404).json({ message: 'User not found' })
      }

    const formattedMainUser = {
        id: mainUser.id,
        nickname: mainUser.login,
        name: mainUser.firstName,
        surname: mainUser.lastName,
        email: mainUser.email,
        // avatar: mainUser.avatar,
        avatar: `https://ui-avatars.com/api/?name=${mainUser.login}`,
        status: mainUser.user_status,
    }

    console.log(formattedMainUser)


    return {
        formattedMainUser,
    }
}

async updateMainUser(ctx: HttpContext) {
    const user = ctx.auth.user!

    const { nickname, name, surname, email, status } = ctx.request.all()

    const mainUser = await User.query()
      .where('id', user.id)
      .firstOrFail()

    if (!mainUser) {
        return ctx.response.status(404).json({ message: 'User not found' })
      }

    const existingUser = await User.query()
        .where('login', nickname)
        .whereNot('id', user.id) // Uistime sa, že nekontrolujeme aktuálneho používateľa
        .first();

    if (existingUser) {
      return ctx.response.status(400).json({
        message: 'Nickname is already taken',
      });
    }

    

    mainUser.login = nickname
    mainUser.firstName = name
    mainUser.lastName = surname
    mainUser.email = email
    mainUser.user_status = status

    await mainUser.save()

    return {
        message: 'User updated',
    }


}


}