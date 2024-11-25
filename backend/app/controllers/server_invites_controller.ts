import { HttpContext } from '@adonisjs/core/http'
import Server from '../models/server.js'
import User from '../models/user.js'
import ServerInvite from '../models/server_invite.js'


export default class ServerInvitesController {
    async createServerInvite(ctx: HttpContext) {
        const user = ctx.auth.user!
    
        const {serverId, invitedusername} = ctx.request.only(['serverId', 'invitedusername'])
    
        const server = await Server.findOrFail(serverId)

        const invitedUser = await User.findByOrFail('login', invitedusername)
    
        const invite = await ServerInvite.create({
          serverId: server.id,
          invitedUserId: invitedUser.id,
          invitedById: user.id,
          serverinvite_status: 'floating',
        })
    
        return {
          invite,
        }
      }

    async getServerInvites(ctx: HttpContext) {
        const user = ctx.auth.user!

        console.log(user.id)
    
        const serverinvites = await ServerInvite.query()
          .where('invitedUserId', user.id)
          .where('serverinvite_status', 'floating')
          .preload('server')
          .preload('invitedBy')
        
          const mappedInvites = serverinvites.map((invite) => ({
            id: invite.id,
            servername: invite.server.name,
            serveravatar: `https://ui-avatars.com/api/?name=${invite.server.name}`,
            // serveravatar: invite.server.avatar,
            serverprivacy: invite.server.privacy,
            invitedBy: invite.invitedBy.login,
          }))

          console.log(mappedInvites)
    
        return {
            mappedInvites
        }
      }

    async acceptServerInvite(ctx: HttpContext) {
        const user = ctx.auth.user!

        const serverInviteId = ctx.request.input('serverInviteId')

        console.log(serverInviteId)

        const serverInvite = await ServerInvite.findOrFail(serverInviteId)

        if (serverInvite.invitedUserId !== user.id) {
            return ctx.response.badRequest({ message: 'You are not the receiver of this invite' })
        }

        if (serverInvite.serverinvite_status !== 'floating') {
            return ctx.response.badRequest({ message: 'Server invite already accepted' })
        }

        serverInvite.serverinvite_status = 'accepted'

        await serverInvite.save()

        const server = await Server.findOrFail(serverInvite.serverId)

        const isBanned = await server.related('users')
            .query()
            .where('user_id', user.id)
            .where('ban', true)
            .first()

        if (isBanned) {
            return ctx.response.badRequest({ message: 'You are banned from this server' })
        }

        //chceck if user is already in server
        const isInServer = await server.related('users')
            .query()
            .where('user_id', user.id)
            .first()

        if (isInServer) {
            return ctx.response.badRequest({ message: 'You are already in this server' })
        }

        const wasInServer = await server.related('users')
            .query()
            .where('user_id', user.id)
            .where('inServer', false)
            .first()

        const serverCount = await user.related('servers')
            .query()
            .wherePivot('ban', false) 
            .wherePivot('inServer', true)
            .count('* as total') 
            .first()
    
        const pos = Number(serverCount?.$extras?.total || 0) + 1
    
        try {
            if (wasInServer) {
                await server.related('users')
                    .query()
                    .where('user_id', user.id)
                    .update({
                        inServer: true,
                        position: pos,
                    })
            }else {
                await server.related('users')
                    .attach({
                        [user.id]: {
                            role: 'member',
                            position: pos,
                            ban: false,
                            inServer: true,
                            kick_counter: 0,
                        }
                    })
            }
                
            return {
                serverId: server.id,
            }
        } catch (error) {
            console.error('Error joining server:', error)
            return ctx.response.status(500).json({ message: 'Failed to join server', error })
        }
    }

    async rejectServerInvite(ctx: HttpContext) {
        const user = ctx.auth.user!

        const serverInviteId = ctx.request.input('serverInviteId')

        console.log(serverInviteId)

        const serverInvite = await ServerInvite.findOrFail(serverInviteId)

        if (serverInvite.invitedUserId !== user.id) {
            return ctx.response.badRequest({ message: 'You are not the receiver of this invite' })
        }

        if (serverInvite.serverinvite_status === 'rejected') {
            return ctx.response.badRequest({ message: 'Server invite already rejected' })
        }

        serverInvite.serverinvite_status = 'rejected'

        await serverInvite.save()

        console.log(serverInvite)

        return {
            serverInvite,
        }
    }
    
}