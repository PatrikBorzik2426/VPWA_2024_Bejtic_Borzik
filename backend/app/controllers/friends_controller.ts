import { HttpContext } from '@adonisjs/core/http'
import User from '../models/user.js'
import FriendRequest from '../models/friend_request.js'

export default class FriendsController {
    async addFriendRequest(ctx: HttpContext) {
        const user = ctx.auth.user!

        const receiverLogin = ctx.request.input('receiverLogin')

        console.log(receiverLogin)

        const receiver = await User.findByOrFail('login', receiverLogin)

        console.log(receiver)

        try {
            try{
                const existingRequest = await FriendRequest.findByOrFail({
                    senderId: user.id,
                    receiverId: receiver.id,
                })
                
                if (existingRequest.status === 'floating' || existingRequest.status === 'accepted') {
                    return ctx.response.badRequest({ message: 'Friend request already sent' })
                }else if (existingRequest.status === 'rejected') {
                existingRequest.status = 'floating'
                await existingRequest.save()
                return {
                    friendRequest: existingRequest,
                }
                }
            }catch{
                console.log('No existing request')
            }

            const friendRequest = await FriendRequest.create({
                senderId: user.id,
                receiverId: receiver.id,
                status: 'floating',
            })

            console.log(friendRequest)

            return {
                friendRequest,
            }
        } catch (error) {
            console.log(error)
            return ctx.response.badRequest({ message: 'Failed to send friend request', error })
        }
    }

    async acceptFriendRequest(ctx: HttpContext) {
        const user = ctx.auth.user!

        const friendRequestId = ctx.request.input('friendRequestId')

        console.log(friendRequestId)

        const friendRequest = await FriendRequest.findOrFail(friendRequestId)

        if (friendRequest.receiverId !== user.id) {
            return ctx.response.badRequest({ message: 'You are not the receiver of this request' })
        }

        if (friendRequest.status === 'accepted') {
            return ctx.response.badRequest({ message: 'Friend request already accepted' })
        }

        friendRequest.status = 'accepted'

        await friendRequest.save()

        return {
            friendRequest,
        }
    }

    async rejectFriendRequest(ctx: HttpContext) {
        const user = ctx.auth.user!

        const friendRequestId = ctx.request.input('friendRequestId')

        console.log(friendRequestId)

        const friendRequest = await FriendRequest.findOrFail(friendRequestId)

        if (friendRequest.receiverId !== user.id) {
            return ctx.response.badRequest({ message: 'You are not the receiver of this request' })
        }

        if (friendRequest.status === 'rejected') {
            return ctx.response.badRequest({ message: 'Friend request already rejected' })
        }

        friendRequest.status = 'rejected'

        await friendRequest.save()

        return {
            friendRequest,
        }
    }

    async getFriendRequests(ctx: HttpContext) {
        const user = ctx.auth.user!
    
        // Fetch friend requests and preload sender and receiver user information
        const friendRequests = await FriendRequest.query()
          .where('receiverId', user.id)
          .where('status', 'floating')
          .preload('sender')
          .preload('receiver')
        
          const mappedRequests = friendRequests.map((request) => ({
            friendRequestId: request.id,
            senderName: request.sender.login,
          }))

          console.log(mappedRequests)
    
        return {
          mappedRequests,
        }
      }
}