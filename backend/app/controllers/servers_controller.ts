import { HttpContext } from '@adonisjs/core/http'
import { Database } from '@adonisjs/lucid/database'
import Server from '../models/server.js'


export default class ServersController {
    async getServerList(ctx: HttpContext) {
        const user = ctx.auth.user!
    
        // Získanie serverov, kde používateľ nie je zabanovaný
        const servers = await user.related('servers')
            .query()
            .wherePivot('ban', false) // Filtrovanie podľa pivot stĺpca `ban`
        
        console.log(servers)

        
        // Vytvorenie výsledku s potrebnými údajmi
        const result = servers.map((server) => ({
            id: server.id,
            name: server.name,
            avatar: `https://ui-avatars.com/api/?name=${server.name}`,
            privacy: server.privacy,
            notifications: Math.floor(Math.random() * 100),   // radonm Notifikácie na serveri
            role: server.$extras.pivot_role, // Rola používateľa na serveri
            position: server.$extras.pivot_position, // Pozícia používateľa na serveri
        }))
        
        console.log(result)
        return {
            servers: result,
        }
    }

    public async createServer(ctx: HttpContext) {
        const user = ctx.auth.user! // Prihlásený používateľ
    
        const { name, privacy, position } = ctx.request.only(['name', 'privacy', 'position'])
    
        // Overenie, či už server s rovnakým názvom existuje
        const existingServer = await Server.query().where('name', name).first()
        if (existingServer) {
          return ctx.response.status(400).json({
            message: 'Server with this name already exists',
          })
        }
        
        // const trx = await Database.transaction()
    
        try {
          // Transakcia pre vytvorenie servera a pridanie používateľa
    
          // Vytvorenie servera
          const server = await Server.create({
            name,
            privacy,
          }/*,{ client: trx }*/)
    
          // Pridanie používateľa do pivot tabuľky `server_user`
          await server.related('users').attach({
            [user.id]: {
              role: 'creator', // Používateľ má rolu "admin"
              position: position, // Dynamická pozícia
              ban: false, // Nie je zabanovaný
              kick_counter: 0, // Žiadne vykopnutia
            },
          }/*, trx*/)
    
          // Potvrdenie transakcie
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













}