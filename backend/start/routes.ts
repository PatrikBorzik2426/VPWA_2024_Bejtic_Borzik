/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import {middleware} from '#start/kernel'
import transmit from '@adonisjs/transmit/services/main'
import { HttpContext } from '@adonisjs/core/http'

const AuthController = () => import('#controllers/auth_controller')
const FriendController = () => import('#controllers/friends_controller')
const UserController = () => import('#controllers/user_controller')
const ServersController = () => import('#controllers/servers_controller')
const MessagesController = () => import('#controllers/messages_controller')
const ServerInvitesController = () => import('#controllers/server_invites_controller')

// transmits

// Register WebSocket routes
transmit.registerRoutes()

transmit.authorize<{ friendshipId: string }>('friendship:friendshipId', async (ctx: HttpContext, { friendshipId }) => {
    const userId = ctx.auth.user?.id;

    console.log("Authorizing friendshipId", friendshipId, "for user", userId);

    if (!userId) {
      return false;
    }else{
        return true;
    }
  
  });

// routes

router.get('/csrf-secret', async ({ response, request }) => {
    const csrfToken = request.csrfToken
    return response.json({ csrfToken })
})

router.get

router.group(()=>{
    router.post('register',[AuthController,'register']);
    router.post('login',[AuthController,'login']);
    router.post('logout',[AuthController,'logout']).use(middleware.auth());
    router.post('check',[AuthController,'check'])
}).prefix('auth')

router.group(()=>{
    router.post('add-friend-request',[FriendController,'addFriendRequest']).use(middleware.auth());
    router.post('accept-friend-request',[FriendController,'acceptFriendRequest']).use(middleware.auth());
    router.post('reject-friend-request',[FriendController,'rejectFriendRequest']).use(middleware.auth());
    router.post('list-friend-requests',[FriendController,'getFriendRequests']).use(middleware.auth());
    router.post('list-friends',[FriendController,'getFriendslist']).use(middleware.auth());
    router.post('remove-friend',[FriendController,'removeFriend']).use(middleware.auth());
    router.post('get-friendship-id',[FriendController,'getFriendshipId']).use(middleware.auth());
}).prefix('friend');


router.group(()=>{
    router.post('get-main-user', [UserController,'getMainUser']).use(middleware.auth());
    router.post('update-main-user', [UserController,'updateMainUser']).use(middleware.auth());
}).prefix('user');

router.group(()=>{
    router.post('get-server-list', [ServersController,'getServerList']).use(middleware.auth());
    router.post('get-active-server', [ServersController,'getActiveServer']).use(middleware.auth());
    router.post('create-server', [ServersController,'createServer']).use(middleware.auth());
    router.post('join-server', [ServersController,'joinServer']).use(middleware.auth());
    router.post('leave-server', [ServersController,'leaveServer']).use(middleware.auth());
    router.post('update-server', [ServersController,'updateServer']).use(middleware.auth());
    router.post('delete-server', [ServersController,'deleteServer']).use(middleware.auth());
    router.post('update-server-positions', [ServersController,'updateServerPositons']).use(middleware.auth());
    router.post('create-channel', [ServersController,'createChannel']).use(middleware.auth());
    router.post('update-channel', [ServersController,'updateChannel']).use(middleware.auth());
    router.post('delete-channel', [ServersController,'deleteChannel']).use(middleware.auth());
    router.post('get-server-channels', [ServersController,'getServerChannels']).use(middleware.auth());
    router.post('update-channel-positions', [ServersController,'updateChannelPositons']).use(middleware.auth());
    router.post('get-member-list', [ServersController,'getMemberList']).use(middleware.auth());
    router.post('add-server-member', [ServersController,'addServerMember']).use(middleware.auth());
    router.post('kick-server-member', [ServersController,'kickServerMember']).use(middleware.auth());
    router.post('ban-server-member', [ServersController,'banServerMember']).use(middleware.auth());
}).prefix('server');


router.group(()=>{
    router.post('get-personal-messages', [MessagesController,'getPersonalMessages']).use(middleware.auth());
    router.post('get-server-messages', [MessagesController,'getServerMessages']).use(middleware.auth());
    router.post('add-personal-message', [MessagesController,'addPersonalMessage']).use(middleware.auth());
    router.post('add-server-message', [MessagesController,'addServerMessage']).use(middleware.auth());
}).prefix('messages');

router.group(()=>{
    router.post('create-server-invite',[ServerInvitesController,'createServerInvite']).use(middleware.auth());
    router.post('accept-server-invite',[ServerInvitesController,'acceptServerInvite']).use(middleware.auth());
    router.post('reject-server-invite',[ServerInvitesController,'rejectServerInvite']).use(middleware.auth());
    router.post('get-server-invites',[ServerInvitesController,'getServerInvites']).use(middleware.auth());
}).prefix('server-invite');