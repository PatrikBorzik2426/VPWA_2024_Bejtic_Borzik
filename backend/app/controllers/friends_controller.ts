import { HttpContext } from '@adonisjs/core/http'
import User from '../models/user.js'
import FriendRequest from '../models/friend_request.js'
import Friend from '../models/friend.js'

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
                
                if (existingRequest.friendrequest_status === 'floating' || existingRequest.friendrequest_status === 'accepted') {
                    return ctx.response.badRequest({ message: 'Friend request already sent' })
                }else if (existingRequest.friendrequest_status === 'rejected') {
                existingRequest.friendrequest_status = 'floating'
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
                friendrequest_status: 'floating',
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

        if (friendRequest.friendrequest_status === 'accepted') {
            return ctx.response.badRequest({ message: 'Friend request already accepted' })
        }

        friendRequest.friendrequest_status = 'accepted'

        const sender = await User.find(friendRequest.senderId)
        const receiver = await User.find(friendRequest.receiverId)

        if (!sender || !receiver) {
            return ctx.response.badRequest({ message: 'Invalid sender or receiver ID'})
        }
    
        const existingFriendship = await Friend.query()
          .where('user1Id', friendRequest.senderId)
          .where('user2Id', friendRequest.receiverId)
          .orWhere('user1Id', friendRequest.receiverId)
          .where('user2Id', friendRequest.senderId)
          .first()
    
        if (existingFriendship) {
          return ctx.response.badRequest({ message: 'Friendship already exists'})
        }
    
        const user1Id = Math.min(friendRequest.senderId, friendRequest.receiverId)
        const user2Id = Math.max(friendRequest.senderId, friendRequest.receiverId)
    
        const friend = await Friend.create({
          user1Id : user1Id,
          user2Id : user2Id,
        })
    
        console.log('Friendship created:', friend)
    
        console.log(friendRequest)

        await friendRequest.save()

        return {
            friend,
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

        if (friendRequest.friendrequest_status === 'rejected') {
            return ctx.response.badRequest({ message: 'Friend request already rejected' })
        }

        friendRequest.friendrequest_status = 'rejected'

        await friendRequest.save()

        console.log(friendRequest)

        return {
            friendRequest,
        }
    }

    async getFriendRequests(ctx: HttpContext) {
        const user = ctx.auth.user!
    
        // Fetch friend requests and preload sender and receiver user information
        const friendRequests = await FriendRequest.query()
          .where('receiverId', user.id)
          .where('friendrequest_status', 'floating')
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

    async getFriendslist(ctx: HttpContext) {
        const user = ctx.auth.user!

        const friends = await Friend.query()
          .where('user1Id', user.id)
          .orWhere('user2Id', user.id)
          .preload('user1')
          .preload('user2')
        
        const mappedFriends = friends.map((friend) => ({
            friendId: friend.id,
            //friendAvatar: friend.user1.id === user.id ? friend.user2.avatar : friend.user1.avatar,
            friendName: friend.user1.id === user.id ? friend.user2.login : friend.user1.login,
            friendAvatar: `https://ui-avatars.com/api/?name=${friend.user1.id === user.id ? friend.user2.login : friend.user1.login}`,
            friendStatus: friend.user1.id === user.id ? friend.user2.user_status : friend.user1.user_status,
            friendUnreadMessages: Math.floor(Math.random() * 100),
        }))
    
        return {
          mappedFriends,
        }
    }

    async removeFriend(ctx: HttpContext) {
        const user = ctx.auth.user!
    
        const friendId = ctx.request.input('friendId')
    
        const friend = await Friend.findOrFail(friendId)
    
        if (friend.user1Id !== user.id && friend.user2Id !== user.id) {
          return ctx.response.badRequest({ message: 'You are not a part of this friendship'})
        }
    
        await friend.delete()
    
        return {
          message: 'Friendship deleted',
        }
      }
    
}