import { HttpContext } from "@adonisjs/core/http"
import DirectMessage from "../models/direct_message.js"
import transmit from "@adonisjs/transmit/services/main"

export default class MessagesController {

    async getPersonalMessages(ctx: HttpContext) {
        const user = ctx.auth.user!

        const { receiverId } = ctx.request.all()

        const user2_id: number = receiverId

        console.log('user2_id', user2_id, 'user.id', user.id)

        const messages = await DirectMessage.query()
        .where((query) => {
          query
          .where(function (query) {
            query
              .where('sender_user_id', user.id)
              .andWhere('receiver_user_id', user2_id);
          })
          .orWhere(function (query) {
            query
              .where('sender_user_id', user2_id)
              .andWhere('receiver_user_id', user.id);
          })
        })
        .orderBy('created_at', 'asc')
        .preload('sender')
        .preload('receiver')

        const messageData = messages.map(message => ({
            messageId: message.id,
            messageContent: message.message,   // Example field
            senderName: message.sender?.login,  // Accessing preloaded sender data
            receiverName: message.receiver?.login, // Accessing preloaded receiver data
            createdAt: message.timeSent, // Example: formatting timestamp
          }))
      
          return ctx.response.ok({ messages: messageData })
    }

    async getServerMessages({ request, response }: HttpContext) {
        const { server_id } = request.all()
        return response.json({ message: 'getServerMessages', server_id })
    }

    async addPersonalMessage(ctx: HttpContext) {
        const user = ctx.auth.user!

        const { receiverId, content, friendshipId } = ctx.request.all()

        console.log('receiver_id', receiverId, 'message', content, 'friendshipId', friendshipId)

        const newMsg = await DirectMessage.create({
            senderUserId: user.id,
            receiverUserId: receiverId,
            message: content
        })

        const Msg = await (await DirectMessage.findByOrFail('id', newMsg.id))

        // Authorization middleware example (ensure it’s applied correctly)
        transmit.broadcast(`friendship:${friendshipId}`, {
            message: {
              id: Msg.id,
              senderId: Msg.senderUserId,
              content: Msg.message,
              login: user.login,
              createdAt: Msg.timeSent.toString(),
                
            },
          }); 

    }

    async addServerMessage({ request, response }: HttpContext) {
        const { server_id, message } = request.all()
        return response.json({ message: 'addServerMessage', server_id, message })
    }
}