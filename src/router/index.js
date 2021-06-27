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
        path: "/synchronizationsForm/:id/tasks",
        name: "Task - ----",
        components: { default: Tasks },
        meta: {
          breadcrumb: [{ name: "Synchronizations", link: "/synchronizations" }],
        },
      },
      {
        path: "/synchronizationsForm/:id/tasksForm",
        name: "Tasks - ---- - Criar",
        components: { default: TasksForm },
        meta: {
          breadcrumb: [
            {
              name: "Tasks - ---",
              link: "/synchronizationsForm/:id/tasks",
            },
          ],
        },
      },
      {
        path: "/synchronizationsForm/:id/tasksForm/:idTask",
        name: "Tasks - ---- - Editar",
        components: { default: TasksForm },
        meta: {
          breadcrumb: [
            {
              name: "Tasks - ----",
              link: "/synchronizationsForm/:id/tasks",
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
