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
import User from '#models/user'

const AuthController = () => import('#controllers/auth_controller')
const FriendController = () => import('#controllers/friends_controller')
const UserController = () => import('#controllers/user_controller')

router.get('/csrf-secret', async ({ response, request }) => {
    const csrfToken = request.csrfToken
    return response.json({ csrfToken })
})

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
}).prefix('friend');


router.group(()=>{
    router.post('get-main-user', [UserController,'getMainUser']).use(middleware.auth());
    router.post('update-main-user', [UserController,'updateMainUser']).use(middleware.auth());
}).prefix('user');