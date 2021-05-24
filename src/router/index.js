import { createRouter, createWebHashHistory } from 'vue-router'
import chat from "@/components/chat";

const routes = [
  {
    path: '/',
    component: chat,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
