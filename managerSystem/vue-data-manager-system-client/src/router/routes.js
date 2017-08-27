import Home from '../views/home.vue';
import User from '../views/user.vue';
import Cate from '../views/cate.vue';
import News from '../views/news.vue';
import Upload from '../views/upload.vue';
import Album from '../views/album.vue';
import Common from '../views/common.vue';
import Comments from '../views/comments.vue';
import UnLogin from '../views/unLogin.vue';

export const routes = [
    {path: '/',component:Home},
    {path: '/home',component:Home},
    {path: '/user',component:User},
    {path: '/cate',component:Cate},
    {path: '/news',component:News},
    {path: '/upload',component:Upload},
    {path: '/album',component:Album},
    {path: '/common',component:Common},
    {path: '/comments',component:Comments},
    {path: '/unLogin',component:UnLogin},
];