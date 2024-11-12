import { HttpContext } from '@adonisjs/core/http'
import Server from '../models/server.js'
import User from '../models/user.js'
import Channel from '../models/channel.js'


export default class ServersController {
    async getServerList(ctx: HttpContext) {
        const user = ctx.auth.user!
    
        const servers = await user.related('servers')
            .query()
            .wherePivot('ban', false) 
        
        console.log(servers)

        const result = servers.map((server) => ({
            id: server.id,
            name: server.name,
            avatar: `https://ui-avatars.com/api/?name=${server.name}`,
            privacy: server.privacy,
            notifications: Math.floor(Math.random() * 100),   
            role: server.$extras.pivot_role, 
            position: server.$extras.pivot_position, 
        }))
        
        console.log(result)
        return {
            servers: result,
        }
    }

    async createServer(ctx: HttpContext) {
        const user = ctx.auth.user! 
    
        const { name, privacy} = ctx.request.only(['name', 'privacy'])
    
        console.log(name, privacy)
        const existingServer = await Server.query().where('name', name).first()
        if (existingServer) {
          return ctx.response.status(400).json({
            message: 'Server with this name already exists',
          })
        }
        
        // const trx = await Database.transaction()
    
        try {
          const server = await Server.create({
            name,
            privacy,
          }/*,{ client: trx }*/)

          const userWithServerCount = await User.query()
          .where('id', user.id) 
          .withCount('servers', (query) => {
            query.wherePivot('ban', false) 
          })
          .firstOrFail()
        
          const position = Number(userWithServerCount.$extras.servers_count)
    
          await server.related('users').attach({
            [user.id]: {
              role: 'creator', 
              position: position + 1, 
              ban: false, 
              kick_counter: 0, 
            },
          }/*, trx*/)

          //create channel
            await Channel.create({
                name: 'general',
                serverId: server.id,
                position: 1,
            }/*, trx*/)
    
        //   await trx.commit()
    
          return {
            server
          }
        } catch (error) {
          console.error(error)
        //   await trx.rollback()
          return ctx.response.status(500).json({
            message: 'Failed to create server',
          })
        }
      }

    async leaveServer(ctx: HttpContext) {
        const user = ctx.auth.user!
        const server_id = ctx.request.input('serverId')

        console.log(server_id)
    
        const pivot = await user.related('servers')
            .query()
            .where('server_id', server_id)
            .first()
    
        if (!pivot) {
            return ctx.response.status(403).json({ message: `User does not have access to server with ID ${server_id}` })
        }
    
        if (pivot.$extras.pivot_role === 'creator') {
            return ctx.response.status(403).json({ message: 'Creators cannot leave their own servers' })
        }
    
        try {
            await user.related('servers')
                .detach([server_id])
    
            return ctx.response.status(200).json({ message: 'Left server successfully' })
        } catch (error) {
            console.error('Error leaving server:', error)
            return ctx.response.status(500).json({ message: 'Failed to leave server', error })
        }
    }

    async updateServer(ctx: HttpContext) {
        const user = ctx.auth.user!
        const { serverId, name, privacy } = ctx.request.only(['serverId', 'name', 'privacy'])

        const server = await Server.findByOrFail('id', serverId)

        if (!server) {
            return ctx.response.status(404).json({ message: 'Server not found' });
        }

        const userServerPivot = await user.related('servers')
            .query()
            .where('server_id', serverId)
            .first();

        if (!userServerPivot) {
            return ctx.response.status(403).json({ message: 'You are not associated with this server' });
        }

        if (userServerPivot.$extras.pivot_ban) {
            return ctx.response.status(403).json({ message: 'You are banned from this server' });
        }

        try {
            await Server.query()
                .where('id', serverId)
                .update({ name, privacy })

            return {
                message: 'Server updated successfully'
            }
        } catch (error) {
            console.error(error)
            return ctx.response.status(500).json({
                message: 'Failed to update server',
            })
        }
    }

    async deleteServer(ctx: HttpContext) {
        const user = ctx.auth.user!
        const server_id = ctx.request.input('serverId')
    
        const pivot = await user.related('servers')
            .query()
            .where('server_id', server_id)
            .first()
    
        if (!pivot) {
            return ctx.response.status(403).json({ message: `User does not have access to server with ID ${server_id}` })
        }
    
        if (pivot.$extras.pivot_role === 'member') {
            return ctx.response.status(403).json({ message: 'You are not the creator of this server' })
        }

        const server = await Server.find(server_id);
        if (!server) {
          return ctx.response.status(404).json({ message: 'Server not found' });
        }
        console.log('jebo')
        try {
            await server.delete();
    
            return ctx.response.status(200).json({ message: 'Server deleted successfully' })
        } catch (error) {
            console.error('Error deleting server:', error)
            return ctx.response.status(500).json({ message: 'Failed to delete server', error })
        }
    }

    async updateServerPositons(ctx: HttpContext) {
        const user = ctx.auth.user!
        const servers = ctx.request.input('servers')
        let banned = 0;

        if (!Array.isArray(servers)) {
            return ctx.response.status(400).json({ message: 'Invalid input format. Expected an array of servers.' })
          }
    
        if (!servers || !Array.isArray(servers)) {
          return ctx.response.status(400).json({ message: 'Invalid input format. Expected an array of servers.' })
        }

        console.log(servers)
    
        try {
          for (const server of servers) {
            const { id, position } = server
            const pos = Number(position) - banned

            console.log(`Updating position for server with ID ${id} to ${pos}`)
    
            const pivot = await user.related('servers')
                .query()
                .where('server_id', id)
                .first()
    
            if (!pivot) {
              return ctx.response.status(403).json({ message: `User does not have access to server with ID ${id}` })
            }

            const isBanned = pivot.$extras.pivot_ban;

            if (isBanned) {
                console.log(`User is banned from server with ID ${id}. Exiting loop.`);
                banned++;
                continue; 
              }
    
            await user.related('servers')
                .query()
                .where('server_id', id)
                .update({ position: pos })
          }
    
          return ctx.response.status(200).json({ message: 'Server positions updated successfully' })
        } catch (error) {
          console.error('Error updating server positions:', error)
          console.log(servers)
          return ctx.response.status(500).json({ message: 'Failed to update server positions', error })
        }
      }    


    async getActiveServer(ctx: HttpContext) {
        const user = ctx.auth.user!

        const server_id = ctx.request.input('serverId')
        
        if (!server_id || typeof server_id !== 'number') {
            return ctx.response.status(400).json({ message: 'Invalid server ID' });
        }
        
        const activeServer = await Server.findByOrFail('id', server_id)
        
        if (!activeServer) {
            return ctx.response.status(404).json({ message: 'Server not found' });
        }
    
        const userServerPivot = await user.related('servers')
            .query()
            .where('server_id', server_id)
            .first();

        if (!userServerPivot) {
            return ctx.response.status(403).json({ message: 'You are not associated with this server' });
        }
        
        if (userServerPivot.$extras.pivot_ban) {
            return ctx.response.status(403).json({ message: 'You are banned from this server' });
        }

        

        const formattedActiveServer = {
            id: activeServer.id,
            name: activeServer.name,
            avatar: `https://ui-avatars.com/api/?name=${activeServer.name}`,
            privacy: activeServer.privacy,
            role: userServerPivot.$extras.pivot_role,
            userid: user.id,
        }
    
        return {
            formattedActiveServer,
        }
    }

    async getMemberList(ctx: HttpContext) {
        const user = ctx.auth.user!

        const server_id = ctx.request.input('serverId')
        
        if (!server_id || typeof server_id !== 'number') {
            return ctx.response.status(400).json({ message: 'Invalid server ID' });
        }
        
        const activeServer = await Server.findByOrFail('id', server_id)
        
        if (!activeServer) {
            return ctx.response.status(404).json({ message: 'Server not found' });
        }
    
        const userServerPivot = await user.related('servers')
            .query()
            .where('server_id', server_id)
            .first();

        if (!userServerPivot) {
            return ctx.response.status(403).json({ message: 'You are not associated with this server' });
        }
        
        if (userServerPivot.$extras.pivot_ban) {
            return ctx.response.status(403).json({ message: 'You are banned from this server' });
        }

        const members = await activeServer.related('users')
            .query()
            .wherePivot('ban', false)
            // .preload('user')
        
        const formattedMembers = members.map((member) => ({
            id: member.id,
            // username: member.username,
            // avatar: `https://ui-avatars.com/api/?name=${member.username}`,
            role: member.$extras.pivot_role,
        }))
    
        return {
            members: formattedMembers,
        }
    }


    async getServerChannels(ctx: HttpContext) {
        const user = ctx.auth.user!

        const server_id = ctx.request.input('serverId')
        
        const userServerPivot = await user.related('servers')
            .query()
            .where('server_id', server_id)
            .first();

        if (!userServerPivot) {
            return ctx.response.status(403).json({ message: 'You are not associated with this server' });
        }

        if (userServerPivot.$extras.pivot_ban) {
            return ctx.response.status(403).json({ message: 'You are banned from this server' });
        }

        if (!server_id || typeof server_id !== 'number') {
            return ctx.response.status(400).json({ message: 'Invalid server ID' });
        }

        const server = await Server.findByOrFail('id', server_id)

        if (!server) {
            return ctx.response.status(404).json({ message: 'Server not found' });
        }

        const serverChannls = await server.related('channels').query()

        console.log(serverChannls)
        const formattedChannels = serverChannls.map((channel) => ({
            id: channel.id,
            name: channel.name,
            notifications: Math.floor(Math.random() * 100),
            position: channel.position,
        }))

        return {
            serverChannels: formattedChannels,
        }
    }

    async createChannel(ctx: HttpContext) {
        const user = ctx.auth.user!
        const { name, serverId } = ctx.request.only(['name', 'serverId'])

        const server = await Server.findByOrFail('id', serverId)

        if (!server) {
            return ctx.response.status(404).json({ message: 'Server not found' });
        }

        const userServerPivot = await user.related('servers')
            .query()
            .where('server_id', serverId)
            .first();

        if (!userServerPivot) {
            return ctx.response.status(403).json({ message: 'You are not associated with this server' });
        }

        if (userServerPivot.$extras.pivot_ban) {
            return ctx.response.status(403).json({ message: 'You are banned from this server' });
        }

        const existingChannel = await Channel.query()
            .where('name', name)
            .where('server_id', serverId)
            .first()

        if (existingChannel) {
            return ctx.response.status(400).json({
                message: 'Channel with this name already exists',
            })
        }

        const channelCount = await Channel.query()
            .where('serverId', serverId)
            .count('* as totalChannels')
            .first();

        const position = Number(channelCount?.$extras?.totalChannels) + 1;

        try {
            const channel = await Channel.create({
                name,
                serverId,
                position,
            })

            return {
                channel
            }
        } catch (error) {
            console.error(error)
            return ctx.response.status(500).json({
                message: 'Failed to create channel',
            })
        }
    }


    async updateChannelPositons(ctx: HttpContext) {
        const user = ctx.auth.user!
        const { channels, serverId } = ctx.request.only(['channels', 'serverId'])
        let deleted = 0;

        if (!Array.isArray(channels)) {
            return ctx.response.status(400).json({ message: 'Invalid input format. Expected an array of servers.' })
          }
    
        if (!channels || !Array.isArray(channels)) {
          return ctx.response.status(400).json({ message: 'Invalid input format. Expected an array of servers.' })
        }

        console.log(channels)

        const pivot = await user.related('servers')
                .query()
                .where('server_id', serverId)
                .first()
    
            if (!pivot) {
              return ctx.response.status(403).json({ message: `User does not have access to server with ID ${serverId}` })
            }
    
        try {
          for (const channel of channels) {
            const { id, position } = channel
            const pos = Number(position) - deleted

            console.log(`Updating position for channel with ID ${id} to ${pos}`)

            const isDeleted = !(await Channel.query()
                .where('serverId', serverId)
                .where('id', id)
                .first());

            if (isDeleted) {
                console.log(`channel doesnt exist with ID ${id}. Exiting loop.`);
                deleted++;
                continue; 
              }
    
              await Channel.query()
              .where('serverId', serverId)
              .where('id', id)
              .update({ position: pos });
          }
    
          return ctx.response.status(200).json({ message: 'Server positions updated successfully' })
        } catch (error) {
          console.error('Error updating server positions:', error)
          console.log(channels)
          return ctx.response.status(500).json({ message: 'Failed to update server positions', error })
        }
      }  
      
    
    async updateChannel(ctx: HttpContext) {
        const user = ctx.auth.user!
        const { channelId, name, serverId } = ctx.request.only(['channelId', 'name', 'serverId'])

        const server = await Server.findByOrFail('id', serverId)

        if (!server) {
            return ctx.response.status(404).json({ message: 'Server not found' });
        }

        const userServerPivot = await user.related('servers')
            .query()
            .where('server_id', serverId)
            .first();

        if (!userServerPivot) {
            return ctx.response.status(403).json({ message: 'You are not associated with this server' });
        }

        if (userServerPivot.$extras.pivot_ban) {
            return ctx.response.status(403).json({ message: 'You are banned from this server' });
        }

        const channel = await Channel.query()
            .where('id', channelId)
            .where('serverId', serverId)
            .first()

        if (!channel) {
            return ctx.response.status(404).json({ message: 'Channel not found' });
        }

        try {
            await Channel.query()
                .where('id', channelId)
                .where('serverId', serverId)
                .update({ name })

            return {
                message: 'Channel updated successfully'
            }
        } catch (error) {
            console.error(error)
            return ctx.response.status(500).json({
                message: 'Failed to update channel',
            })
        }
    }

    async deleteChannel(ctx: HttpContext) {
        const user = ctx.auth.user!
        const { channelId, serverId } = ctx.request.only(['channelId', 'serverId'])

        const server = await Server.findByOrFail('id', serverId)

        if (!server) {
            return ctx.response.status(404).json({ message: 'Server not found' });
        }

        const userServerPivot = await user.related('servers')
            .query()
            .where('server_id', serverId)
            .first();

        if (!userServerPivot) {
            return ctx.response.status(403).json({ message: 'You are not associated with this server' });
        }

        if (userServerPivot.$extras.pivot_ban) {
            return ctx.response.status(403).json({ message: 'You are banned from this server' });
        }

        const channel = await Channel.query()
            .where('id', channelId)
            .where('serverId', serverId)
            .first()

        if (!channel) {
            return ctx.response.status(404).json({ message: 'Channel not found' });
        }

        try {
            await Channel.query()
                .where('id', channelId)
                .where('serverId', serverId)
                .delete()

            //recalculate positions
            const channels = await Channel.query()
                .where('serverId', serverId)
                .orderBy('position')
            
            for (let i = 0; i < channels.length; i++) {
                const channel = channels[i]
                await Channel.query()
                    .where('id', channel.id)
                    .update({ position: i + 1 })
            }

            return {
                message: 'Channel deleted successfully'
            }
        } catch (error) {
            console.error(error)
            return ctx.response.status(500).json({
                message: 'Failed to delete channel',
            })
        }
    }








}