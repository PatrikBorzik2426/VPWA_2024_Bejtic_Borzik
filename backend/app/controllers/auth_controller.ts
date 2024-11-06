// app/Controllers/Http/AuthController.ts
import { HttpContext } from '@adonisjs/core/http'
import User from '../models/user.js'
import { log } from 'console'

export default class AuthController {
    index(){
        return 'Hello World'
    }

  // Registration
  async register(ctx: HttpContext) {
    log('Registering a new user')

    // Extracting required fields for registration
    const { login, password, firstName, lastName, email } = ctx.request.only([
      'login',
      'password',
      'firstName',
      'lastName',
      'email',
    ])

    console.log(login, password, firstName, lastName, email)

    try {
      const user = await User.create({ login, password, firstName, lastName, email })

      const token = await User.accessTokens.create(user)

      console.log(token)

      return {
        user,
        token,
      }
    } catch (error) {
      console.log(error)
      return ctx.response.badRequest({ message: 'Registration failed', error })
    }
  }

  // Login
  async login(ctx: HttpContext) {
    const { login, password } = ctx.request.only(['login', 'password'])

    console.log(login,password)

    try {
      const user = await User.findByOrFail('login', login)

      if (!(await user.verifyPassword(user, password))) {
        return ctx.response.unauthorized({ message: 'Invalid login or password' })
      }

      user.status = 'online'

      const token = await User.accessTokens.create(user)

      return ctx.response.ok({
        user,
        token,
       })
    } catch {
      return ctx.response.unauthorized({ message: 'Invalid login or password' })
    }
  }

  // Logout
  async logout(ctx: HttpContext) {
    try {
      const user = ctx.auth.user!

      user.status = 'offline'
      await user.save()

      await User.accessTokens.delete(user, user.currentAccessToken.identifier)

      return ctx.response.ok({ message: 'Logged out successfully' })

    } catch (error) {
      return ctx.response.internalServerError({ message: 'Logout failed', error })
    }
  }

  // Me
  async check(ctx: HttpContext) {
    const user = ctx.auth.user!

    const check = await ctx.auth.check()

    console.log(check)

    if (!check) {
      return ctx.response.unauthorized({ message: 'Unauthorized' })
    }else{
      return ctx.response.ok({ user })
    }
  }

}
