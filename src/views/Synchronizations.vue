<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-5">
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col mb-6">
          <div class="card shadow bg-secondary">
            <div class="card-header border-0 p-2">
              <div class="row align-items-center">
                <div class="col text-right">
                  <base-input
                    formClasses="input-group-alternative col-md-3 offset-md-9 mb-0 keyCheck"
                    placeholder="Search"
                    type="text"
                    addon-left-icon="fas fa-search"
                    v-bind:value="filters.text"
                    v-on:input="filters.text = $event.target.value"
                  ></base-input>
                </div>
              </div>
            </div>

            <div class="table-responsive">
              <div class="row" style="width: 100%; margin: 0px">
                <base-table
                  class="table align-items-center table-flush"
                  tbody-classes="list"
                  :data="filteredMy"
                >
                  <template v-slot:columns>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Tasks</th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </template>

                  <template v-slot:default="row">
                    <td scope="row">
                      <span class="mb-0 text-sm">
                        {{ row.item.name }}
                      </span>
                    </td>
                    <td scope="row">
                      <span class="mb-0 text-sm">
                        {{ row.item.description }}
                      </span>
                    </td>

                    <td>
                      <el-tooltip
                        placement="top"
                        :content="
                          'Last date status: ' +
                          dateTimeToString(row.item.dateStatus, ' ---- ')
                        "
                      >
                        <span class="name mb-0 text-sm">
                          <badge
                            type="default"
                            v-if="
                              row.item.status == -1 || row.item.inactive == true
                            "
                            >Inactive</badge
                          >
                          <badge type="danger" v-else-if="row.item.status == -2"
                            >Failed</badge
                          >
                          <badge type="info" v-else-if="row.item.status == 0"
                            >Active</badge
                          >
                          <badge type="info" v-else-if="row.item.status == 1"
                            >In progress</badge
                          >
                          <badge type="success" v-else-if="row.item.status == 2"
                            >Completed</badge
                          >
                        </span>
                      </el-tooltip>
                    </td>
                    <td>
                      <el-tooltip
                        placement="top"
                        :content="row.item.computerFromConnection.name"
                      >
                        <span class="mb-0 text-sm">
                          {{ row.item.computerFromData.hostname }}
                        </span>
                      </el-tooltip>
                    </td>
                    <td>
                      <el-tooltip
                        placement="top"
                        :content="row.item.computerToConnection.name"
                      >
                        <span class="mb-0 text-sm">
                          {{ row.item.computerToData.hostname }}
                        </span>
                      </el-tooltip>
                    </td>

                    <td>
                      <span class="mb-0 text-sm">
                        {{ row.item.tasks.length }}
                      </span>
                    </td>
                    <td class="p-0 pr-4">
                      <base-button
                        type="primary"
                        class="fas fa-tasks"
                        @click="
                          $router.push(
                            '/synchronizationsForm/' + row.item._id + '/tasks'
                          )
                        "
                        v-bind:iconOnly="true"
                        style="float: right"
                      ></base-button>
                    </td>
                    <td class="p-0 pr-4">
                      <base-button
                        v-if="row.item.status != 1"
                        type="success"
                        class="fas fa-play mr-2"
                        @click="startService(row.item._id)"
                        v-bind:iconOnly="true"
                        style="float: right"
                      ></base-button>
                      <base-button
                        v-if="row.item.status == 1"
                        type="success"
                        class="fas fa-play mr-2 disabled"
                        v-bind:iconOnly="true"
                        style="float: right"
                      ></base-button>
                    </td>
                    <td class="p-0 pr-4">
                      <base-button
                        type="primary"
                        class="fas fa-edit mr-2"
                        @click="redirectToForm(row.item._id)"
                        v-bind:iconOnly="true"
                        style="float: right"
                      ></base-button>
                    </td>
                  </template>
                </base-table>
              </div>
              <div class="loaderBase">
                <div class="loaderShow">
                  <div class="lds-ripple">
                    <div></div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-footer d-flex justify-content-end px-2 py-3">
              <div class="card-footer d-flex justify-content-end p-0">
                <base-button
                  type="success"
                  class="fas fa-plus"
                  @click="redirectToForm()"
                  v-bind:iconOnly="true"
                  v-bind:rounded="true"
                  style="float: right"
                ></base-button>
              </div>
            </div>
          </div>
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
      synchronizations: [],
      computers: [],
      filters: {
        text: "",
        estado: 0,
      },
    };
  },
  methods: {
    redirectToForm(id = null) {
      if (id == null) this.$router.push("/synchronizationsForm");
      else this.$router.push("/synchronizationsForm/" + id);
    },
    syncIndex(data) {
      this.synchronizations = data.synchronizations;
      this.computers = data.computers;
      this.connections = data.connections;
      this.computers.map(
        (i, k) =>
          (this.computers[k]._id = Buffer.from(i._id.id).toString("hex"))
      );
      this.connections.map(
        (i, k) =>
          (this.connections[k]._id = Buffer.from(i._id.id).toString("hex"))
      );
      this.synchronizations.map(this.syncPrepareSyncs);
      Array.from(
        document.querySelectorAll(".table-responsive table tbody")
      ).map((i) => (i.style.display = "table-row-group"));
      document.getElementsByClassName("loaderBase")[0].style.display = "none";
    },
    syncPrepareSyncs(i, k) {
      this.synchronizations[k]._id = Buffer.from(i._id.id).toString("hex");
      this.computers.map((j) => {
        if (j._id == i.computerFrom)
          this.synchronizations[k].computerFromData = j;
        if (j._id == i.computerTo) this.synchronizations[k].computerToData = j;
      });
      this.connections.map((j) => {
        if (j._id == i.computerFromConnection)
          this.synchronizations[k].computerFromConnection = j;
        if (j._id == i.computerToConnection)
          this.synchronizations[k].computerToConnection = j;
      });
    },
    syncConnection(data) {
      if (data.error == false) window.api.send("synchronizations-index");
    },
  },

  computed: {
    filteredMy() {
      return this.synchronizations.filter((i) => {
        return (
          i.name.toLowerCase().includes(this.filters.text) ||
          i.description.toLowerCase().includes(this.filters.text) ||
          i.computerFromData.hostname
            .toLowerCase()
            .includes(this.filters.text) ||
          i.computerToData.hostname.toLowerCase().includes(this.filters.text) ||
          i.computerToConnection.name
            .toLowerCase()
            .includes(this.filters.text) ||
          i.computerFromConnection.name
            .toLowerCase()
            .includes(this.filters.text) ||
          i.tasks.length == this.filters.text
        );
      });
    },
  },
  created() {
    window.api.receive("synchronizations-index", this.syncIndex);
    window.api.receive("synchronizations-connection", this.syncConnection);
  },
  mounted() {
    window.api.send("synchronizations-connection");
    Array.from(document.querySelectorAll(".table-responsive table tbody")).map(
      (i) => (i.style.display = "none")
    );
  },
  unmounted() {
    window.api.send("synchronizations-connection-close");
    window.api.removeAllListeners("synchronizations-index");
    window.api.removeAllListeners("synchronizations-connection");
  },
};
</script>

<style scoped>
.synchronism {
  width: 97.3%;
  margin-left: 1%;
  border-radius: 3px;
  -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.5);
  margin: 3px 1% 5px 1%;
  font-size: 0.75rem;
}

.table-responsive {
  background-color: white;
}
</style>
