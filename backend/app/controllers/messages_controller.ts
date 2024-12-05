import { HttpContext } from "@adonisjs/core/http"
import DirectMessage from "../models/direct_message.js"
import transmit from "@adonisjs/transmit/services/main"
import ChannelMessage from "../models/channel_message.js"
import Channel from "../models/channel.js"
import { DateTime } from "luxon"

export default class MessagesController {

    async getPersonalMessages(ctx: HttpContext) {
        const user = ctx.auth.user!

        const { receiverId, additionalMsgs } = ctx.request.all()

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
        .orderBy('created_at', 'desc')
        .preload('sender')
        .preload('receiver')
        .limit(8+additionalMsgs)

        const totalMessagesCount = await DirectMessage.query()
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
        .count('* as total');

        const count = Number(totalMessagesCount[0]?.$extras?.total)

        console.log('10+additionalMsgs', 10+additionalMsgs,'totalMessagesCount', count)

        const messageData = messages.map(message => ({
            messageId: message.id,
            messageContent: message.message,   // Example field
            senderName: message.sender?.login,  // Accessing preloaded sender data
            receiverName: message.receiver?.login, // Accessing preloaded receiver data
            createdAt: message.timeSent, // Example: formatting timestamp
          }))
      
        return ctx.response.ok({ messages: messageData, totalMessagesCount: count })
    }

    async getServerMessages(ctx: HttpContext) {
      const { receiverId } = ctx.request.all()

      const channelId: number = receiverId

      const messages = await ChannelMessage.query()
      .where('channel_id', channelId)
      .orderBy('created_at', 'asc')
      .preload('user')

      const messageData = messages.map(message => ({
          messageId: message.id,
          messageContent: message.message,   // Example field
          senderName: message.user?.login,  // Accessing preloaded sender data
          receiverName: message.user?.login, // Accessing preloaded receiver data
          createdAt: message.timeSent, // Example: formatting timestamp
        }))
    
        return ctx.response.ok({ messages: messageData })
    }

    async addPersonalMessage(ctx: HttpContext) {
        const user = ctx.auth.user!

        const { receiverId, content, friendshipId } = ctx.request.all()

        console.log('receiver_id', receiverId, 'user_id', user.id, 'message', content, 'friendshipId', friendshipId)

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

    async addServerMessage(ctx : HttpContext) {
      const user = ctx.auth.user!

      const { receiverId, content } = ctx.request.all()

      const newMsg = await ChannelMessage.create({
          userId: user.id,
          channelId: receiverId,
          message: content
      })

      const channel = await Channel.findByOrFail('id', receiverId)
      
      const channelsServer = await channel.related('server').query().firstOrFail()

      channelsServer.lastActivity = DateTime.now();

      await channelsServer.save();
 
      const Msg = await (await ChannelMessage.findByOrFail('id', newMsg.id))

      // Authorization middleware example (ensure it’s applied correctly)
      transmit.broadcast(`channel:${receiverId}`, {
          message: {
            id: Msg.id,
            senderId: Msg.userId,
            content: Msg.message,
            login: user.login,
            createdAt: Msg.timeSent.toString(),
          },
        }); 
    }

    async getChannelMessageCount(ctx: HttpContext) {
      const user = ctx.auth.user!

      const { channelId } = ctx.request.all()

      const totalMessagesCount = await ChannelMessage.query()
      .where('channel_id', channelId)
      .count('* as total');

      const count = Number(totalMessagesCount[0]?.$extras?.total)

      return ctx.response.ok({ totalMessagesCount: count })
    };

    async currentChatting(ctx: HttpContext) {
      const user = ctx.auth.user!

      const { channelId, message } = ctx.request.only(['channelId', 'message'])

      console.log('channelId', channelId, 'message', message)

      if (user.user_status === 'Offline') {
        return ctx.response.badRequest({ message: 'User is offline' });
      }else{ 
        transmit.broadcast(`channel-current-chatting:${channelId}`, {
          message: message,
          login: user.login,
        });
      }
    }
}