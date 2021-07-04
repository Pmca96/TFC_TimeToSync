<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar
      :background-color="sidebarBackground"
      short-title="TimeToSync"
      title="TimeToSync"
    >
      <template v-slot:links>
        <sidebar-item
          :link="{
            name: 'Dashboard',
            icon: 'fas fa-tachometer-alt text-green',
            path: '/dashboard',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Computers',
            icon: 'fas fa-desktop text-green',
            path: '/computers',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Connections',
            icon: 'fas fa-database text-green',
            path: '/connections',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Synchronizations',
            icon: 'fas fa-sync-alt text-green',
            path: '/synchronizations',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Logout',
            icon: 'ni ni-key-25 text-info',
            path: '/login',
          }"
        />
      </template>
    </side-bar>
    <div class="main-content" :data="sidebarBackground">
      <dashboard-navbar></dashboard-navbar>

      <div @click="toggleSidebar">
        <!-- your content here -->
        <router-view></router-view>
        <content-footer v-if="!$route.meta.hideFooter"></content-footer>
      </div>
    </div>
  </div>
</template>
<script>
import DashboardNavbar from "./DashboardNavbar.vue";
import ContentFooter from "./ContentFooter.vue";

export default {
  components: {
    DashboardNavbar,
    ContentFooter,
  },
  data() {
    return {
      sidebarBackground: "vue", //vue|blue|orange|green|red|primary
    };
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    myEventHandler() {
      // document.getElementById("loader").style.height = window.innerHeight + "px";
      document.querySelector(".main-content").style.minHeight =
        window.innerHeight + "px";
    },
  },
  created() {
    window.addEventListener("resize", this.myEventHandler);
  },
  mounted() {
    this.myEventHandler();
  },
  unmounted() {
    window.removeEventListener("resize", this.myEventHandler);
  },
};
</script>
<style lang="scss">

#content-section {
  padding-bottom: 70px;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
