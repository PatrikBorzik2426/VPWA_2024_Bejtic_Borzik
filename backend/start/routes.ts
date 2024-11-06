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

const AuthController = () => import('#controllers/auth_controller')
const FriendController = () => import('#controllers/friends_controller')

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
    router.post('list-friend-requests',[FriendController,'getFriendRequests']).use(middleware.auth());
}).prefix('friend');