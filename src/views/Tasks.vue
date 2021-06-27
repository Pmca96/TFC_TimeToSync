<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-5">
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col mb-6">
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
                    <th>Nº</th>
                    <th>Name</th>
                    <th>To database</th>
                    <th>To table</th>
                    <th>Dependencies</th>
                    <th>Status</th>
                    <th></th>
                    <th></th>
                  </template>

                  <template v-slot:default="row">
                    <td scope="row" class="text-center">
                      <span class="mb-0 text-sm">
                        {{ row.item.taskNumber }}
                      </span>
                    </td>
                    <td scope="row">
                      <span class="mb-0 text-sm">
                        {{ row.item.name }}
                      </span>
                    </td>
                    <td scope="row">
                      <span class="mb-0 text-sm">
                        {{ row.item.databaseToName }}
                      </span>
                    </td>
                    <td scope="row">
                      <span class="mb-0 text-sm">
                        {{ row.item.tableTo }}
                      </span>
                    </td>
                    <td scope="row">
                      <span class="mb-0 text-sm">
                        {{ row.item.dependenciesNumber.join(", ") }}
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

            <div class="card-footer d-flex justify-content-end">
              <base-button
                type="success"
                class="fas fa-plus"
                @click="
                  $router.push(
                    '/synchronizationsForm/' + $route.params.id + '/tasksForm'
                  )
                "
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
</template>

<script>
import mix from "../assets/js/mixins";
export default {
  mixins: [mix],
  data() {
    return {
      connectionTo: {},
      synchronism: { tasks: [] },
      filters: {
        text: "",
      },
    };
  },
  methods: {
    connectionReciever(data) {
      if (data.error == false)
        window.api.send("tasks-index", this.$route.params.id);
    },
    prepareIndex(data) {
      if (data.synchronism.length == 1) {
        this.synchronism = data.synchronism[0];
        document.getElementById("syncName").innerHTML = this.synchronism.name;
        this.synchronism._id = Buffer.from(this.synchronism._id.id).toString(
          "hex"
        );
        Array.from(
          document.querySelectorAll(".table-responsive table tbody")
        ).map((i) => (i.style.display = "table-row-group"));
        document.getElementsByClassName("loaderBase")[0].style.display = "none";

        if (data.connectionsTo.length > 0) {
          this.connectionsTo = data.connectionsTo;
          this.connectionsTo.map((i) => {
            i._id = Buffer.from(i._id.id).toString("hex");
          });
        }

        this.synchronism.tasks.map((i, k) => {
          this.connectionsTo.map((j) => {
            if (i.databaseTo == j._id)
              this.synchronism.tasks[k].databaseToName = j.database;
          });
          this.synchronism.tasks[k].dependenciesNumber = [];
          if (i.dependencies.length > 0) {
            this.synchronism.tasks.map((j) => {
              if (i.dependencies.includes(j._id))
                this.synchronism.tasks[k].dependenciesNumber.push(j.taskNumber);
            });
          }
          this.synchronism.tasks[k].dependenciesNumber.sort();
        });
      }
    },
  },
  computed: {
    filteredMy() {
      return this.synchronism.tasks.filter((i) => {
        return (
          i.name.toLowerCase().includes(this.filters.text.toLowerCase()) ||
          i.databaseToName
            .toLowerCase()
            .includes(this.filters.text.toLowerCase()) ||
          i.tableTo.toLowerCase().includes(this.filters.text.toLowerCase()) ||
          i.taskNumber == this.filters.text ||
          i.dependenciesNumber
            .join(", ")
            .includes(this.filters.text.toLowerCase())
        );
      });
    },
  },

  created() {
    window.api.receive("tasks-connection", this.connectionReciever);
    window.api.receive("tasks-index", this.prepareIndex);
  },
  mounted() {
    let text = document.getElementById("tagToRemove").innerHTML;
    text = text.replace("----", "<span id='syncName'></span>");
    document.getElementById("tagToRemove").innerHTML = text;
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

