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
                          <badge type="success" v-else-if="row.item.status == 0"
                            >Active</badge
                          >
                          <badge type="info" v-else-if="row.item.status == 1"
                            >In progress</badge
                          >
                          <badge type="success" v-else-if="row.item.status == 2"
                            >Completed</badge
                          >
                          <badge type="info" v-else-if="row.item.status == 3"
                            >Pending</badge
                          >
                        </span>
                      </el-tooltip>
                    </td>
                    <td class="p-0 pr-4">
                      <base-button
                        v-if="row.item.status != 1 && row.item.status != 3"
                        type="success"
                        class="fas fa-play mr-2"
                        @click="startService(row.item._id)"
                        v-bind:iconOnly="true"
                        style="float: right"
                      ></base-button>
                      <base-button
                        v-if="row.item.status == 1 || row.item.status == 3"
                        type="success"
                        class="fas fa-play mr-2 disabled"
                        v-bind:iconOnly="true"
                        style="float: right"
                      ></base-button>
                    </td>
                    <td class="p-0 pr-4">
                      <base-button
                        v-if="
                          typeof row.item.history != 'undefined' &&
                          row.item.history.length >= 0
                        "
                        type="primary"
                        class="fas fa-history mr-2"
                        @click="showHistory(row.item.history)"
                        v-bind:iconOnly="true"
                        style="float: right"
                      />
                      <base-button
                        v-else
                        type="primary"
                        class="fas fa-history mr-2 disabled"
                        v-bind:iconOnly="true"
                        style="float: right"
                      />
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
                    '/synchronizations/' + $route.params.id + '/tasksForm'
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

  <modal
    v-model:show="modelHistory"
    body-classes="p-0"
    modal-classes="modal-dialog-centered modal-lg"
  >
    <card
      type="secondary"
      shadow
      header-classes="bg-white pb-2"
      body-classes="px-lg-4 py-lg-2 mb-4"
      class="border-0"
    >
      <h3 class="mt-2">History</h3>
      <div class="col-md-12">
        <base-table
          class="table align-items-center table-flush"
          tbody-classes="list"
          :data="history"
        >
          <template v-slot:columns>
            <th class="text-center" style="width: 20%">Date</th>
            <th class="text-center" style="width: 20%">Status</th>
            <th class="text-center" style="width: 20%">Time running (H:M:S)</th>
            <th class="text-center" style="width: 20%">Details</th>
          </template>
        </base-table>
        <div class="tableData">
          <template v-for="(item, key) in history" :key="item._id">
            <div class="row" style="border-bottom: 1px solid #5e72e4">
              <div class="col-md-3 text-sm">
                {{ dateTimeToString(item.dateStatus, " ---- ") }}
              </div>
              <div class="col-md-3 text-center">
                <span class="name mb-0 text-sm">
                  <badge type="danger" v-if="item.status == 5">Failed</badge>

                  <badge
                    type="info"
                    v-else-if="item.status == 1 || item.status == 3"
                    >In progress</badge
                  >
                  <badge type="success" v-else-if="item.status == 4"
                    >Completed</badge
                  >
                  <badge
                    type="info"
                    v-else-if="item.status == 0 || item.status == 2"
                    >Pending</badge
                  >
                </span>
              </div>
              <div class="col-md-3 text-sm text-right">
                {{
                  dateTimeDiffHours(
                    item.dateStatus,
                    item.history[0].dateStatus,
                    " ---- "
                  )
                }}
              </div>
              <div class="col-md-3" style="text-align: center">
                <base-button
                  type="primary"
                  v-if="item.status == 4 || item.status == 5"
                  class="fas fa-plus mr-2 historyPlus"
                  v-bind:iconOnly="true"
                  @click="changeHiddenHist(key)"
                  style="width: 20px; height: 20px"
                ></base-button>
                <base-button
                  type="primary"
                  v-else
                  class="fas fa-plus mr-2 disabled"
                  v-bind:iconOnly="true"
                  style="width: 20px; height: 20px"
                ></base-button>
              </div>
              <template v-if="item.status == 4 && item.hidden == false">
                <div
                  class="col-md-12 row text-sm"
                  style="background-color: rgba(147, 231, 195, 0.3)"
                >
                  <div class="col-md-6">Data updated: {{ item.updated }}</div>
                  <div class="col-md-6">Data inserted: {{ item.inserted }}</div>
                </div>
              </template>
              <template v-else-if="item.status == 5 && item.hidden == false">
                <div
                  class="col-md-12 row text-sm"
                  style="background-color: rgba(251, 175, 190, 0.3)"
                >
                  <div class="col-md-12">Mensagem:</div>
                  <div class="col-md-12" style="white-space: pre-wrap">
                    {{ item.msg }}
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </card>
  </modal>
</template>

<script>
import mix from "../assets/js/mixins";
export default {
  mixins: [mix],
  data() {
    return {
      connectionTo: {},
      synchronism: { tasks: [] },
      history: [],
      modelHistory: false,
      filters: {
        text: "",
      },
    };
  },
  methods: {
    redirectToForm(id) {
      this.$router.push(
        "/synchronizations/" + this.$route.params.id + "/tasksForm/" + id
      );
    },
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
    startService(id) {
      window.api.send("tasks-run", {
        idSync: this.synchronism._id,
        fromComputer: this.synchronism.computerFrom,
        toComputer: this.synchronism.computerTo,
        status: 0,
        idTask: id,
      });
    },
    startServiceResponse(data) {
      if (data.result == 1) {
        this.synchronism.tasks.map((i) => {
          if (i._id == data.idTask) {
            i.status = 3;
            i.dateStatus = new Date();
          }
        });
      }
    },
    showHistory(data) {
      this.history = data;
      this.modelHistory = true;
    },
    changeHiddenHist(histKey) {
      if (this.history[histKey].hidden == true)
        this.history[histKey].hidden = false;
      else if (this.history[histKey].hidden == false)
        this.history[histKey].hidden = true;
      else this.history[histKey].hidden = false;
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
    window.api.receive("tasks-run", this.startServiceResponse);
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
    window.api.removeAllListeners("tasks-run");
  },
};

Array.from(document.getElementsByClassName("historyPlus")).map((i) => {
  i.addEventListener("click", () => {
    console.log("loading");
  });
});
</script>
