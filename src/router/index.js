import Vue from 'vue'
import VueRouter from 'vue-router'
//引入登录文件
import Login from '../components/Login'
// 引入Home组件
import Home from '../components/Home'
// 引入Welcome组件
import Welcome from '../components/Welcome'
import Users from '../components/Users/Users.vue'

Vue.use(VueRouter)

const routes = [{
        // path:'路由地址A'   redirect:'路由地址B'        A重定向跳转B
        path: '/',
        redirect: '/Login'
    },
    {
        path: '/Login',
        component: Login
    },
    {
        path: '/Home',
        component: Home,
        redirect: '/Welcome',
        children: [{
                path: '/Welcome',
                component: Welcome
            },
            {
                path: '/users',
                component: Users
            }
        ]
    }

]

const router = new VueRouter({
    mode: 'history',
    routes
})

//挂载路由守卫
router.beforeEach((to, from, next) => {
    //to 将要访问的路径
    //from 代表从哪个路径跳转而来
    // next是一个函数，表示放行
    //   next() 放行          next('/login') 强制跳转到登录界面
    //    1.如果访问登录界面直接放行
    if (to.path === '/login') return next()
        // 2.获取token
    const tokenstr = window.sessionStorage.getItem('token')
        //如果存在token，就放行，不存在，就强制跳转到登录界面
    if (!tokenstr) return next('/login')
    next()
})

export default router