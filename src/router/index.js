import { createRouter, createWebHashHistory } from "vue-router";

import DashboardLayout from "@/layout/DashboardLayout";
import AuthLayout from "@/layout/AuthLayout";

import Dashboard from "../views/Dashboard.vue";
import Computers from "../views/Computers.vue";
import Connections from "../views/Connections.vue";
import Synchronizations from "../views/Synchronizations.vue";
import SynchronizationsForm from "../views/SynchronizationsForm.vue";
import Tasks from "../views/Tasks.vue";
import TasksForm from "../views/TasksForm.vue";
import Login from "../views/Login.vue";
import User from "../views/User.vue";
import System from "../views/System.vue";

const routes = [
  {
    path: "/",
    redirect: "login",
    component: AuthLayout,
    children: [
      {
        path: "/login",
        name: "login",
        components: { default: Login },
      },
    ],
  },
  {
    path: "/",
    redirect: "dashboard",
    component: DashboardLayout,
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        components: { default: Dashboard },
      },
      {
        path: "/computers",
        name: "Computers",
        components: { default: Computers },
      },
      {
        path: "/connections",
        name: "Connections",
        components: { default: Connections },
      },
      {
        path: "/synchronizations",
        name: "Synchronizations",
        components: { default: Synchronizations },
      },
      {
        path: "/user",
        name: "User",
        components: { default: User },
      },
      {
        path: "/system",
        name: "System",
        components: { default: System },
      },
      {
        path: "/synchronizationsForm",
        name: "Synchronizations - Create",
        components: { default: SynchronizationsForm },
        meta: {
          breadcrumb: [{ name: "Synchronizations", link: "/synchronizations" }],
        },
      },
      {
        path: "/synchronizationsForm/:id",
        name: "Synchronizations - Edit",
        components: { default: SynchronizationsForm },
        meta: {
          breadcrumb: [{ name: "Synchronizations", link: "/synchronizations" }],
        },
      },
      {
        path: "/synchronizations/:id/tasks",
        name: "Task - ----",
        components: { default: Tasks },
        meta: {
          breadcrumb: [{ name: "Synchronizations", link: "/synchronizations" }],
        },
      },
      {
        path: "/synchronizations/:id/tasksForm",
        name: "Tasks - ---- - Criar",
        components: { default: TasksForm },
        meta: {
          breadcrumb: [
            {
              name: "Tasks - ---",
              link: "/synchronizations/:id/tasks",
            },
          ],
        },
      },
      {
        path: "/synchronizations/:id/tasksForm/:idTask",
        name: "Tasks - ---- - Editar",
        components: { default: TasksForm },
        meta: {
          breadcrumb: [
            {
              name: "Tasks - ----",
              link: "/synchronizations/:id/tasks",
            },
          ],
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: "active",
  routes,
});

export default router;
