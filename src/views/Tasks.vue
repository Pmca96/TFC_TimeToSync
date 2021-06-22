<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-5">
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col mb-6">
          <tabs fill class="flex-column flex-md-row">
            <tab-pane icon="fas fa-project-diagram" title=" List tasks">
              <base-alert
                style="display: none"
                type="success"
                class="p-2 alertConnections"
              ></base-alert>
              <base-alert
                style="display: none"
                type="danger"
                class="p-2 alertConnections"
              ></base-alert>
              <div class="card">
                <div class="card-header border-0 p-2">
                  <div class="row align-items-center">
                    <div class="col text-right">
                      <base-input
                        formClasses="input-group-alternative col-md-3 offset-md-9 mb-0 keyCheck"
                        placeholder="Search"
                        type="text"
                        addon-left-icon="fas fa-search"
                        v-bind:value="filters.text0"
                        v-on:input="filters.text0 = $event.target.value"
                      ></base-input>
                    </div>
                  </div>
                </div>

                <div class="table-responsive">
                 

                  <div class="loaderBase">
                    <div class="loaderShow">
                      <div class="lds-ripple">
                        <div></div>
                        <div></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="card-footer d-flex justify-content-end">
                  <base-button
                    type="success"
                    class="fas fa-plus"
                    @click="clearCreation()"
                    v-bind:iconOnly="true"
                    v-bind:rounded="true"
                    style="float: right"
                  ></base-button>
                </div>
              </div>
            </tab-pane>
            <tab-pane icon="fas fa-database mr-2" title="Graph Tasks">
             
            </tab-pane>
          </tabs>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import mix from "../assets/js/mixins";
export default {
  mixins: [mix],
  data() {
    return {
      filters: {
        text: "",
      },
    };
  },
  methods: {

  },
  computed: {

  },

  created() {
    window.api.receive("tasks-connection", this.connectionReciever);
    window.api.receive("tasks-index", this.prepareIndex);
  },
  mounted() {
    Array.from(document.querySelectorAll(".table-responsive table tbody")).map(
      (i) => (i.style.display = "none")
    );
    window.api.send("tasks-connection");
  },
  unmounted() {
    window.api.send("tasks-connection-close");
    window.api.removeAllListeners("tasks-connection");
    window.api.removeAllListeners("tasks-index");
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
