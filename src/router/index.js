import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Inventario from '../views/Inventario.vue'
import Reportes from '../views/Reportes.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		redirect: '/home'
	},
	{
		path: '/home',
		name: 'home',
		component: Home
	},
	{
		path: '/inventario',
		name: 'inventario',
		component: Inventario // () => import('../views/Inventario.vue')
	},
    {
        path: '/reportes',
        name: 'reportes',
        component: Reportes
    }
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
