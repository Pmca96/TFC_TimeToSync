<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-5">
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col mb-6">
          <div class="card shadow bg-secondary">
            <div class="table-responsive">
              <base-alert
                style="display: none"
                type="danger"
                class="p-2 m-3 alertModalDanger"
              ></base-alert>
              <base-alert
                style="display: none"
                type="success"
                class="p-2 m-3 alertModalSuccess"
              ></base-alert>
              <form role="form" class="m-3 smallTextForm">
                <div class="form-row">
                  <div class="form-group col-md-4 mb-0">
                    <label>Name</label>
                    <base-input
                      formClasses="input-group-alternative mb-3"
                      type="text"
                      v-bind:value="syncronizationData.name"
                      v-on:input="syncronizationData.name = $event.target.value"
                    ></base-input>
                  </div>

                  <div class="form-group col-md-8 mb-0">
                    <label>Description</label>
                    <base-input
                      formClasses="input-group-alternative mb-3"
                      type="text"
                      v-bind:value="syncronizationData.description"
                      v-on:input="
                        syncronizationData.description = $event.target.value
                      "
                    ></base-input>
                  </div>

                  <div class="form-group col-md-6 col-lg-3 mb-2">
                    <label>From computer</label>
                    <multiselect
                      v-model="syncronizationData.computerFrom"
                      :options="computersList"
                      :searchable="false"
                      :close-on-select="true"
                      :show-labels="false"
                      :allow-empty="false"
                      :disabled="
                        syncronizationData.computerFrom != '' &&
                        syncronizationData.tasks.length != 0
                          ? true
                          : false
                      "
                      label="hostname"
                      track-by="_id"
                    ></multiselect>
                  </div>
                  <div class="form-group col-md-6 col-lg-3 mb-2">
                    <label>From connection</label>
                    <multiselect
                      v-model="syncronizationData.computerFromConnection"
                      :options="connecFrom"
                      :searchable="false"
                      :close-on-select="true"
                      :show-labels="false"
                      :allow-empty="false"
                      :disabled="
                        syncronizationData.computerFrom != '' &&
                        syncronizationData.tasks.length != 0
                          ? true
                          : false
                      "
                      label="name"
                      track-by="_id"
                    ></multiselect>
                  </div>

                  <div class="form-group col-md-6 col-lg-3 mb-2">
                    <label>To computer</label>

                    <multiselect
                      v-model="syncronizationData.computerTo"
                      :options="computersList"
                      :searchable="false"
                      :close-on-select="true"
                      :show-labels="false"
                      :allow-empty="false"
                      :disabled="
                        syncronizationData.computerTo != '' &&
                        syncronizationData.tasks.length != 0
                          ? true
                          : false
                      "
                      label="hostname"
                      track-by="_id"
                    ></multiselect>
                  </div>
                  <div class="form-group col-md-6 col-lg-3 mb-2">
                    <label>To connection</label>
                    <multiselect
                      v-model="syncronizationData.computerToConnection"
                      :options="connecTo"
                      :searchable="false"
                      :close-on-select="true"
                      :show-labels="false"
                      :allow-empty="false"
                      :disabled="
                        syncronizationData.computerTo != '' &&
                        syncronizationData.tasks.length != 0
                          ? true
                          : false
                      "
                      label="name"
                      track-by="_id"
                    ></multiselect>
                  </div>
                  <div class="form-group col-md-6 mb-2">
                    <div style="float: left"><label>Inactive</label></div>
                    <base-checkbox
                      class="ml-2"
                      style="float: left"
                      :checked="syncronizationData.inactive"
                      @update="syncronizationData.inactive = $event"
                    />
                  </div>
                  <div
                    class="form-group col-md-12 mb-2 text-center text-primary"
                  >
                    <label>Crontab</label>
                  </div>
                  <div class="form-group col-md-2 mb-0">
                    <label>Minute</label>
                    <base-input
                      formClasses="input-group-alternative mb-3"
                      type="text"
                      v-bind:value="syncronizationData.crontab.minute"
                      v-on:input="
                        syncronizationData.crontab.minute = $event.target.value
                      "
                    ></base-input>
                  </div>
                  <div class="form-group col-md-2 mb-0">
                    <label>Hour</label>
                    <base-input
                      formClasses="input-group-alternative mb-3"
                      type="text"
                      v-bind:value="syncronizationData.crontab.hour"
                      v-on:input="
                        syncronizationData.crontab.hour = $event.target.value
                      "
                    ></base-input>
                  </div>
                  <div class="form-group col-md-2 mb-0">
                    <label>Day of Month</label>
                    <base-input
                      formClasses="input-group-alternative mb-3"
                      type="text"
                      v-bind:value="syncronizationData.crontab.dayMonth"
                      v-on:input="
                        syncronizationData.crontab.dayMonth =
                          $event.target.value
                      "
                    ></base-input>
                  </div>
                  <div class="form-group col-md-2 mb-0">
                    <label>Month</label>
                    <base-input
                      formClasses="input-group-alternative mb-3"
                      type="text"
                      v-bind:value="syncronizationData.crontab.month"
                      v-on:input="
                        syncronizationData.crontab.month = $event.target.value
                      "
                    ></base-input>
                  </div>
                  <div class="form-group col-md-2 mb-0">
                    <label>Day of week</label>
                    <base-input
                      formClasses="input-group-alternative mb-3"
                      type="text"
                      v-bind:value="syncronizationData.crontab.dayWeek"
                      v-on:input="
                        syncronizationData.crontab.dayWeek = $event.target.value
                      "
                    ></base-input>
                  </div>
                </div>
                <base-button
                  v-if="this.formType == 0"
                  type="success"
                  class="my-4"
                  @click="createSyncronization()"
                  style="float: right"
                  ><i class="fas fa-plus"></i> Create</base-button
                >
                <base-button
                  v-if="this.formType == 1"
                  type="success"
                  class="my-4 ml-3"
                  @click="saveSyncronization()"
                  style="float: right"
                  ><i class="far fa-save"></i> Save</base-button
                >
                <base-button
                  v-if="this.formType == 1"
                  type="danger"
                  class="my-4"
                  @click="deleteSyncronization()"
                  style="float: right"
                  ><i class="fas fa-trash"></i> Delete</base-button
                >
              </form>
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
      formType: null,
      computersList: [],
      connectionsList: [],
      connectionsListTo: [],
      connectionsListFrom: [],
      syncronizationData: {
        _id: null,
        name: "",
        description: "",
        computerFrom: "",
        computerTo: "",
        computerFromConnection: "",
        computerToConnection: "",
        inactive: false,
        tasks: [],
        crontab: {
          minute: "*",
          hour: "*",
          dayMonth: "*",
          month: "*",
          dayWeek: "*",
        },
      },
      syncronizationDataDefault: {
        _id: null,
        name: "",
        description: "",
        computerFrom: "",
        computerTo: "",
        computerFromConnection: "",
        computerToConnection: "",
        inactive: false,
        tasks: [],
        crontab: {
          minute: "*",
          hour: "*",
          dayMonth: "*",
          month: "*",
          dayWeek: "*",
        },
      },
    };
  },
  methods: {
    syncIndex(data) {
      this.computersList = data.computers;
      this.computersList.map(
        (i, k) =>
          (this.computersList[k]._id = Buffer.from(i._id.id).toString("hex"))
      );

      this.connectionsList = data.connections;
      this.connectionsList.map(
        (i, k) =>
          (this.connectionsList[k]._id = Buffer.from(i._id.id).toString("hex"))
      );

      if (data.synchronism != null) {
        this.syncronizationData = data.synchronism[0];
        this.computersList.map((i) => {
          if (this.syncronizationData.computerFrom == i._id)
            this.syncronizationData.computerFrom = i;

          if (this.syncronizationData.computerTo == i._id)
            this.syncronizationData.computerTo = i;
        });
        this.connectionsList.map((i) => {
          if (this.syncronizationData.computerFromConnection == i._id)
            this.syncronizationData.computerFromConnection = i;
          if (this.syncronizationData.computerToConnection == i._id)
            this.syncronizationData.computerToConnection = i;
        });
        this.syncronizationData._id = Buffer.from(
          this.syncronizationData._id.id
        ).toString("hex");
      }
    },

    checkRequireds() {
      document.getElementsByClassName("alertModalDanger")[0].style.display =
        "none";
      document.getElementsByClassName("alertModalSuccess")[0].style.display =
        "none";
      let returnData = { error: 0, msg: "" };
      if (this.syncronizationData.name.length == 0)
        returnData = { error: 1, msg: "Name of syncronization is empty." };
      else if (this.syncronizationData.description.length == 0)
        returnData = {
          error: 1,
          msg: "Description of syncronization is empty.",
        };
      else if (this.syncronizationData.computerFrom.length == 0)
        returnData = {
          error: 1,
          msg: "Computer(From) of syncronization is not defined.",
        };
      else if (
        typeof this.syncronizationData.computerFromConnection == "undefined" ||
        this.syncronizationData.computerFromConnection.length == 0
      )
        returnData = {
          error: 1,
          msg: "Connection(From) of syncronization is not defined.",
        };
      else if (this.syncronizationData.computerTo.length == 0)
        returnData = {
          error: 1,
          msg: "Computer(To) of syncronization is not defined.",
        };
      else if (
        typeof this.syncronizationData.computerToConnection == "undefined" ||
        this.syncronizationData.computerToConnection.length == 0
      )
        returnData = {
          error: 1,
          msg: "Connection(To) of syncronization is not defined.",
        };
      else if (
        this.syncronizationData.crontab.minute.length == 0 ||
        this.syncronizationData.crontab.hour.length == 0 ||
        this.syncronizationData.crontab.dayMonth.length == 0 ||
        this.syncronizationData.crontab.month.length == 0 ||
        this.syncronizationData.crontab.dayWeek.length == 0
      )
        returnData = {
          error: 1,
          msg: "None of the field from crontab can be empty.",
        };
      else if (
        !new RegExp(
          "^\\*|(?:[0-9]|(?:[1-5][0-9]))(?:(?:\\-[0-9]|\\-(?:[1-5][0-9]))?|(?:\\,(?:[0-9]|(?:[1-5][0-9])))*)$"
        ).test(this.syncronizationData.crontab.minute)
      )
        returnData = {
          error: 1,
          msg: "Minutes in crontab is incorrect, please verify.",
        };
      else if (
        !new RegExp(
          "^\\*|(?:[0-9]|1[0-9]|2[0-3])(?:(?:-(?:[0-9]|1[0-9]|2[0-3]))?|(?:,(?:[0-9]|1[0-9]|2[0-3]))*)$"
        ).test(this.syncronizationData.crontab.hour)
      )
        returnData = {
          error: 1,
          msg: "Hours in crontab is incorrect, please verify.",
        };
      else if (
        !new RegExp(
          "^\\*|(?:[1-9]|(?:[12][0-9])|3[01])(?:(?:\\-(?:[1-9]|(?:[12][0-9])|3[01]))?|(?:\\,(?:[1-9]|(?:[12][0-9])|3[01]))*)$"
        ).test(this.syncronizationData.crontab.month)
      )
        returnData = {
          error: 1,
          msg: "Months in crontab is incorrect, please verify.",
        };
      else if (
        !new RegExp(
          "^\\*|(?:[0-9]|1[0-9]|2[0-3])(?:(?:\\-(?:[0-9]|1[0-9]|2[0-3]))?|(?:\\,(?:[0-9]|1[0-9]|2[0-3]))*)$"
        ).test(this.syncronizationData.crontab.dayMonth)
      )
        returnData = {
          error: 1,
          msg: "Day of months in crontab is incorrect, please verify.",
        };
      else if (
        !new RegExp(
          "^\\*|(?:[0-6])(?:(?:\\-(?:[0-6]))?|(?:\\,(?:[0-6]))*)$"
        ).test(this.syncronizationData.crontab.dayWeek)
      )
        returnData = {
          error: 1,
          msg: "Day of weeks in crontab is incorrect, please verify.",
        };
      if (returnData.error == 1) {
        document.getElementsByClassName("alertModalDanger")[0].style.display =
          "block";
        document.getElementsByClassName("alertModalDanger")[0].innerHTML =
          returnData.msg;
      }
      return returnData;
    },
    createSyncronization() {
      let response = this.checkRequireds();
      if (response.error == 0) {
        window.api.send(
          "synchronizationsForm-create",
          JSON.parse(JSON.stringify(this.syncronizationData))
        );
      }
    },
    createSyncronizationResponse(data) {
      if (typeof data != "undefined") {
        document.getElementsByClassName("alertModalDanger")[0].style.display =
          "none";
        document.getElementsByClassName("alertModalSuccess")[0].innerHTML =
          "Synchronism created with success.";
        document.getElementsByClassName("alertModalSuccess")[0].style.display =
          "block";
        this.syncronizationData = this.syncronizationDataDefault;
      } else {
        document.getElementsByClassName("alertModalDanger")[0].style.display =
          "block";
        document.getElementsByClassName("alertModalDanger")[0].innerHTML =
          "Couldn't create the synchronism, please try again later.";
        document.getElementsByClassName("alertModalSuccess")[0].style.display =
          "none";
      }
    },
    saveSyncronization() {
      let response = this.checkRequireds();
      if (response.error == 0) {
        window.api.send(
          "synchronizationsForm-save",
          JSON.parse(JSON.stringify(this.syncronizationData))
        );
      }
    },
    saveSyncronizationResponse(data) {
      if (data == 1) {
        document.getElementsByClassName("alertModalDanger")[0].style.display =
          "none";
        document.getElementsByClassName("alertModalSuccess")[0].innerHTML =
          "Synchronism saved with success.";
        document.getElementsByClassName("alertModalSuccess")[0].style.display =
          "block";
      } else {
        document.getElementsByClassName("alertModalDanger")[0].style.display =
          "block";
        document.getElementsByClassName("alertModalDanger")[0].innerHTML =
          "Couldn't save the synchronism, please try again later.";
        document.getElementsByClassName("alertModalSuccess")[0].style.display =
          "none";
      }
    },
    deleteSyncronization() {
      window.api.send(
        "synchronizationsForm-delete",
        JSON.parse(JSON.stringify(this.syncronizationData))
      );
    },
    deleteSyncronizationResponse(data) {
      console.log(data);
    },
  },
  computed: {
    connecTo() {
      return this.connectionsList.filter((i) =>
        i.computers.includes(this.syncronizationData.computerTo._id)
      );
    },
    connecFrom() {
      return this.connectionsList.filter((i) =>
        i.computers.includes(this.syncronizationData.computerFrom._id)
      );
    },
  },
  created() {
    window.api.receive("synchronizationsForm-index", this.syncIndex);
    window.api.receive("synchronizationsForm-connection", () => {
      if (typeof this.$route.params.id != "undefined")
        window.api.send("synchronizationsForm-index", this.$route.params.id);
      else window.api.send("synchronizationsForm-index");
    });

    window.api.receive(
      "synchronizationsForm-create",
      this.createSyncronizationResponse
    );
    window.api.receive(
      "synchronizationsForm-save",
      this.saveSyncronizationResponse
    );
    window.api.receive(
      "synchronizationsForm-delete",
      this.deleteSyncronizationResponse
    );
  },
  mounted() {
    if (typeof this.$route.params.id != "undefined") {
      //EDIT MODE
      window.api.send("synchronizationsForm-connection");
      this.formType = 1;
    } else {
      // CREATE MODE
      window.api.send("synchronizationsForm-connection");
      this.formType = 0;
    }
  },
  unmounted() {
    window.api.send("synchronizationsForm-connection-close");
    window.api.removeAllListeners("synchronizationsForm-index");
    window.api.removeAllListeners("synchronizationsForm-connection");
    window.api.removeAllListeners("synchronizationsForm-create");
    window.api.removeAllListeners("synchronizationsForm-save");
    window.api.removeAllListeners("synchronizationsForm-delete");
  },
};
</script>
