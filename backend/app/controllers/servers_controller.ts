import { HttpContext } from '@adonisjs/core/http'
import Server from '../models/server.js'
import User from '../models/user.js'


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

    async updateServerPositons(ctx: HttpContext) {
        const user = ctx.auth.user!
        console.log('1')
        const servers = ctx.request.input('servers')
        console.log('2')
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












}