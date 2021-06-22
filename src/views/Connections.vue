<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-5">
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col mb-6">
          <tabs fill class="flex-column flex-md-row">
            <tab-pane icon="fas fa-project-diagram" title=" Connections">
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
                  <base-table
                    class="table align-items-center table-flush"
                    tbody-classes="list"
                    :data="filteredGeneral"
                  >
                    <template v-slot:columns>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Host</th>
                      <th>Port</th>
                      <th>Status</th>
                      <th></th>
                    </template>

                    <template v-slot:default="row">
                      <td scope="row">
                        <span class="mb-0 text-sm">
                          {{ row.item.name }}
                        </span>
                      </td>

                      <td>
                        <span class="mb-0 text-sm">
                          {{ row.item.typeDB }}
                        </span>
                      </td>

                      <td>
                        <span class="mb-0 text-sm">
                          {{ row.item.host }}
                        </span>
                      </td>

                      <td>
                        <span class="mb-0 text-sm">
                          {{ row.item.port }}
                        </span>
                      </td>

                      <td>
                        <span class="name mb-0 text-sm">
                          <el-tooltip
                            placement="top"
                            :content="
                              'Last date status: ' +
                              dateTimeToString(row.item.dateStatus, ' ---- ')
                            "
                          >
                            <badge type="danger" v-if="row.item.status == -1"
                              >Failed</badge
                            >
                            <badge type="info" v-else-if="row.item.status == 0"
                              >Pending</badge
                            >
                            <badge type="info" v-else-if="row.item.status == 1"
                              >Verifying</badge
                            >
                            <badge
                              type="success"
                              v-else-if="row.item.status == 2"
                              >Confirmed</badge
                            >
                          </el-tooltip>
                        </span>
                      </td>
                      <td class="p-0 pr-4">
                        <base-button
                          type="primary"
                          class="fas fa-edit"
                          @click="editDatabase(row.item._id)"
                          v-bind:iconOnly="true"
                          style="float: right"
                        ></base-button>
                      </td>
                    </template>
                  </base-table>

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
            <tab-pane icon="fas fa-database mr-2" title="My connections">
              <div class="card">
                <div class="card-header border-0 p-2">
                  <div class="row align-items-center">
                    <div class="col text-right">
                      <base-input
                        formClasses="input-group-alternative col-md-3 offset-md-9 mb-0 keyCheck"
                        placeholder="Search"
                        type="text"
                        addon-left-icon="fas fa-search"
                        v-bind:value="filters.text1"
                        v-on:input="filters.text1 = $event.target.value"
                      ></base-input>
                    </div>
                  </div>
                </div>

                <div class="table-responsive">
                  <base-table
                    class="table align-items-center table-flush"
                    tbody-classes="list"
                    :data="filteredMy"
                  >
                    <template v-slot:columns>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Host</th>
                      <th>Port</th>
                      <th>Status</th>
                      <th></th>
                    </template>

                    <template v-slot:default="row">
                      <td scope="row">
                        <span class="mb-0 text-sm">
                          {{ row.item.name }}
                        </span>
                      </td>

                      <td>
                        <span class="mb-0 text-sm">
                          {{ row.item.typeDB }}
                        </span>
                      </td>

                      <td>
                        <span class="mb-0 text-sm">
                          {{ row.item.host }}
                        </span>
                      </td>

                      <td>
                        <span class="mb-0 text-sm">
                          {{ row.item.port }}
                        </span>
                      </td>

                      <td>
                        <span class="name mb-0 text-sm">
                          <el-tooltip
                            placement="top"
                            :content="
                              'Last date status: ' +
                              dateTimeToString(row.item.dateStatus, ' ---- ')
                            "
                          >
                            <badge type="danger" v-if="row.item.status == -1"
                              >Failed</badge
                            >
                            <badge type="info" v-else-if="row.item.status == 0"
                              >Pending</badge
                            >
                            <badge type="info" v-else-if="row.item.status == 1"
                              >Verifying</badge
                            >
                            <badge
                              type="success"
                              v-else-if="row.item.status == 2"
                              >Confirmed</badge
                            >
                          </el-tooltip>
                        </span>
                      </td>

                      <td class="p-0 pr-4">
                        <base-button
                          type="primary"
                          class="fas fa-edit"
                          @click="editDatabase(row.item._id)"
                          v-bind:iconOnly="true"
                          style="float: right"
                        ></base-button>
                      </td>
                    </template>
                  </base-table>

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
          </tabs>
        </div>
      </div>
    </div>
  </div>
  <modal
    v-model:show="modals.modalAdicionar"
    body-classes="p-0"
    modal-classes="modal-dialog-centered modal-lg"
  >
    <card
      type="secondary"
      shadow
      header-classes="bg-white pb-2"
      body-classes="px-lg-4 py-lg-2"
      class="border-0"
    >
      <template v-slot:header>
        <div class="text-muted text-center mb-0">Create connection</div>
      </template>
      <base-alert
        style="display: none"
        type="danger"
        class="p-2 alertModal"
      ></base-alert>
      <base-alert
        style="display: none"
        type="success"
        class="p-2 alertModalSuccess"
      ></base-alert>
      <form role="form">
        <div class="form-row">
          <div class="form-group col-md-8 mb-0">
            <label>Name</label>
            <base-input
              formClasses="input-group-alternative mb-3"
              type="text"
              v-bind:value="creation.name"
              v-on:input="creation.name = $event.target.value"
              addon-left-icon="fas fa-signature"
            ></base-input>
          </div>
          <div class="form-group col-md-4 mb-0">
            <label>Type</label>
            <multiselect
              v-model="creation.typeDB"
              :options="typesDB"
              :searchable="false"
              :close-on-select="true"
              :show-labels="false"
              :allow-empty="false"
            ></multiselect>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col-md-12 mb-0">
            <label>Computers</label>

            <multiselect
              v-model="creation.computers"
              :options="computers"
              :multiple="true"
              :close-on-select="false"
              :clear-on-select="false"
              :preserve-search="true"
              :show-labels="false"
              label="hostname"
              track-by="hostname"
              :preselect-first="true"
            ></multiselect>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col-md-9 mb-0 mt-3">
            <label>Host</label>
            <base-input
              formClasses="input-group-alternative mb-3"
              type="text"
              addon-left-icon="fas fa-code"
              v-bind:value="creation.host"
              v-on:input="creation.host = $event.target.value"
            ></base-input>
          </div>
          <div class="form-group col-md-3 mb-0 mt-3">
            <label>Port</label>
            <base-input
              formClasses="input-group-alternative mb-3"
              type="text"
              v-bind:value="creation.port"
              v-on:input="creation.port = $event.target.value"
              addon-left-icon="fas fa-angle-right"
            ></base-input>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col-md-6 mb-0">
            <label>User</label>
            <base-input
              formClasses="input-group-alternative mb-3"
              type="text"
              addon-left-icon="fas fa-user"
              v-bind:value="creation.user"
              v-on:input="creation.user = $event.target.value"
            ></base-input>
          </div>
          <div class="form-group col-md-6 mb-0">
            <label>Password</label>
            <base-input
              formClasses="input-group-alternative mb-3"
              type="password"
              addon-left-icon="fas fa-unlock-alt"
              v-bind:value="creation.pass"
              v-on:input="creation.pass = $event.target.value"
            ></base-input>
          </div>
        </div>

        <div class="text-center">
          <base-button type="success" class="my-4" @click="saveConnection(0)"
            ><i class="fas fa-plus"></i> Create</base-button
          >
          <base-button
            type="primary"
            class="my-4"
            :class="checkVerifyCreate"
            @click="verifyConnection(0, checkVerifyCreate)"
          >
            <i class="fas fa-sync-alt"></i> Verify</base-button
          >
        </div>
      </form>
    </card>
  </modal>

  <modal
    v-model:show="modals.modalEditar"
    body-classes="p-0"
    modal-classes="modal-dialog-centered modal-lg"
  >
    <card
      type="secondary"
      shadow
      header-classes="bg-white pb-2"
      body-classes="px-lg-4 py-lg-2"
      class="border-0"
    >
      <template v-slot:header>
        <div class="text-muted text-center mb-0">Edit connection</div>
      </template>
      <base-alert
        style="display: none"
        type="danger"
        class="p-2 alertModal"
      ></base-alert>
      <base-alert
        style="display: none"
        type="success"
        class="p-2 alertModalSuccess"
      ></base-alert>
      <form role="form">
        <div class="form-row">
          <div class="form-group col-md-8 mb-0">
            <label>Name</label>
            <base-input
              formClasses="input-group-alternative mb-3"
              type="text"
              v-bind:value="edit.name"
              v-on:input="edit.name = $event.target.value"
              addon-left-icon="fas fa-signature"
            ></base-input>
          </div>
          <div class="form-group col-md-4 mb-0">
            <label>Type</label>
            <multiselect
              v-model="edit.typeDB"
              :options="typesDB"
              :searchable="false"
              :close-on-select="true"
              :show-labels="false"
              :allow-empty="false"
            ></multiselect>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col-md-12 mb-0">
            <label>Computers</label>

            <multiselect
              v-model="edit.computers"
              :options="computers"
              :multiple="true"
              :close-on-select="false"
              :clear-on-select="false"
              :preserve-search="true"
              :show-labels="false"
              label="hostname"
              track-by="hostname"
              :preselect-first="true"
            ></multiselect>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col-md-9 mb-0 mt-3">
            <label>Host</label>
            <base-input
              formClasses="input-group-alternative mb-3"
              type="text"
              addon-left-icon="fas fa-code"
              v-bind:value="edit.host"
              v-on:input="edit.host = $event.target.value"
            ></base-input>
          </div>
          <div class="form-group col-md-3 mb-0 mt-3">
            <label>Port</label>
            <base-input
              formClasses="input-group-alternative mb-3"
              type="text"
              v-bind:value="edit.port"
              v-on:input="edit.port = $event.target.value"
              addon-left-icon="fas fa-angle-right"
            ></base-input>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col-md-6 mb-0">
            <label>User</label>
            <base-input
              formClasses="input-group-alternative mb-3"
              type="text"
              addon-left-icon="fas fa-user"
              v-bind:value="edit.user"
              v-on:input="edit.user = $event.target.value"
            ></base-input>
          </div>
          <div class="form-group col-md-6 mb-0">
            <label>Password</label>
            <base-input
              formClasses="input-group-alternative mb-3"
              type="password"
              addon-left-icon="fas fa-unlock-alt"
              v-bind:value="edit.pass"
              v-on:input="edit.pass = $event.target.value"
            ></base-input>
          </div>
        </div>

        <div class="text-center">
          <base-button type="success" class="my-4" @click="saveConnection(1)"
            ><i class="fas fa-save"></i> Save</base-button
          >
          <base-button
            type="primary"
            class="my-4"
            :class="checkVerifyEdit"
            @click="verifyConnection(1, checkVerifyEdit)"
            ><i class="fas fa-sync-alt"></i> Verify</base-button
          >
          <base-button
            v-if="edit.status == -1"
            type="primary"
            class="my-4"
            @click="changeStatusToPending()"
            ><i class="fas fa-sync-alt"></i> Synchronize</base-button
          >
          <base-button
            type="danger"
            class="my-4"
            @click="deleteDatabase(edit._id)"
            style="margin-top: -10px"
            ><i class="fas fa-trash"></i> Delete
          </base-button>
        </div>
      </form>
    </card>
  </modal>
</template>

<script>
import mix from "../assets/js/mixins";
export default {
  mixins: [mix],
  data() {
    return {
      modals: {
        modalAdicionar: false,
        modalEditar: false,
      },
      creation: {
        name: "",
        typeDB: "MySQL",
        host: "",
        port: "",
        user: "",
        pass: "",
        computers: [],
      },
      edit: {},
      typesDB: ["MySQL", "SQL Server"],
      computers: [],
      computerDefault: {},
      filters: {
        text0: "",
        text1: "",
        estado: 0,
      },
      connections: [],
    };
  },
  methods: {
    //Connection Validations
    clearCreation() {
      document.getElementsByClassName("alertModal")[0].style.display = "none";
      document.getElementsByClassName("alertModalSuccess")[0].style.display =
        "none";
      this.creation.typeDB = "MySQL";
      this.creation.name = "";
      this.creation.host = "";
      this.creation.port = "";
      this.creation.user = "";
      this.creation.pass = "";
      this.creation.computers = [];
      this.computers.map((i) => {
        if (i.idMaquina == this.computerDefault.idMaquina)
          this.creation.computers.push(i);
      });

      this.modals.modalAdicionar = true;
    },
    verifyConnection(type, classPar = "") {
      if (classPar == "disabled") {
        document.getElementsByClassName("alertModal")[type].innerHTML =
          "We can only verify connection if you select your current computer.";
        document.getElementsByClassName("alertModal")[type].style.display =
          "block";
        document.getElementsByClassName("alertModalSuccess")[
          type
        ].style.display = "none";
        return;
      }

      let data = this.checkRequireds(type);
      if (data.error == 0) {
        if (type == 0) {
          window.api.send(
            "connections-verify",
            JSON.parse(JSON.stringify(this.creation))
          );
        } else {
          window.api.send(
            "connections-verify",
            JSON.parse(JSON.stringify(this.edit))
          );
        }
      } else {
        document.getElementsByClassName("alertModal")[type].innerHTML =
          data.msg;
        document.getElementsByClassName("alertModal")[type].style.display =
          "block";
        document.getElementsByClassName("alertModalSuccess")[
          type
        ].style.display = "none";
      }
    },
    verifyConnectionResponse(data) {
      if (this.modals.modalEditar == true) data.type = 1;
      else data.type = 0;

      if (data.state == "disconnected") {
        document.getElementsByClassName("alertModal")[data.type].innerHTML =
          "Connection to database not established with success";
        document.getElementsByClassName("alertModal")[data.type].style.display =
          "block";
        document.getElementsByClassName("alertModalSuccess")[
          data.type
        ].style.display = "none";
      } else if (data.state == "authenticated") {
        document.getElementsByClassName("alertModalSuccess")[
          data.type
        ].innerHTML = "Connection to database verified with success";
        document.getElementsByClassName("alertModalSuccess")[
          data.type
        ].style.display = "block";
        document.getElementsByClassName("alertModal")[data.type].style.display =
          "none";
      }
    },
    saveConnection(type) {
      let data = this.checkRequireds(type);
      if (data.error == 0) {
        if (type == 0) {
          window.api.send(
            "connections-creation",
            JSON.parse(JSON.stringify(this.creation))
          );
        } else if (type == 1) {
          window.api.send(
            "connections-edit",
            JSON.parse(JSON.stringify(this.edit))
          );
        }
      } else {
        document.getElementsByClassName("alertModal")[type].innerHTML =
          data.msg;
        document.getElementsByClassName("alertModal")[type].style.display =
          "block";
        document.getElementsByClassName("alertModalSuccess")[
          type
        ].style.display = "none";
      }
    },
    checkRequireds(type) {
      document.getElementsByClassName("alertModal")[type].style.display =
        "none";
      document.getElementsByClassName("alertModalSuccess")[type].style.display =
        "none";
      let returnData = { error: 0, msg: "" };
      //creation
      if (type == 0) {
        if (this.creation.name.length == 0) {
          returnData.error = 1;
          returnData.msg = "Name is required";
        } else if (this.creation.computers.length == 0) {
          returnData.error = 1;
          returnData.msg = "At least 1 computer is required";
        } else if (this.creation.host.length == 0) {
          returnData.error = 1;
          returnData.msg = "Host is required";
        } else if (this.creation.port.length == 0) {
          returnData.error = 1;
          returnData.msg = "Port is required";
        } else if (!new RegExp("^\\d[0-9]+$").test(this.creation.port)) {
          returnData.error = 1;
          returnData.msg = "Port only accepts numbers";
        } else if (this.creation.user.length == 0) {
          returnData.error = 1;
          returnData.msg = "User is required";
        } else if (this.creation.pass.length == 0) {
          returnData.error = 1;
          returnData.msg = "Password is required";
        }
      } else if (type == 1) {
        if (this.edit.name.length == 0) {
          returnData.error = 1;
          returnData.msg = "Name is required";
        } else if (this.edit.computers.length == 0) {
          returnData.error = 1;
          returnData.msg = "At least 1 computer is required";
        } else if (this.edit.host.length == 0) {
          returnData.error = 1;
          returnData.msg = "Host is required";
        } else if (this.edit.port.length == 0) {
          returnData.error = 1;
          returnData.msg = "Port is required";
        } else if (!new RegExp("^\\d[0-9]+$").test(this.edit.port)) {
          returnData.error = 1;
          returnData.msg = "Port only accepts numbers";
        } else if (this.edit.user.length == 0) {
          returnData.error = 1;
          returnData.msg = "User is required";
        }
      }
      return returnData;
    },
    //Table and data recievers
    prepareIndex(data) {
      this.computers = data.computers;
      this.computerDefault = data.myComputer;
      this.connections = data.connections;
      this.computers.map((i) => {
        if (i.idMaquina == this.computerDefault.idMaquina)
          this.creation.computers.push(i);
      });
      this.computers.map(
        (i, k) =>
          (this.computers[k]._id = Buffer.from(i._id.id).toString("hex"))
      );
      this.connections.map(
        (i, k) =>
          (this.connections[k]._id = Buffer.from(i._id.id).toString("hex"))
      );
     
      Array.from(document.querySelectorAll(".table-responsive")).map(
        (i) => (i.style.overflowY = "auto")
      );
      Array.from(document.querySelectorAll(".loaderBase")).map(
        (i) => (i.style.display = "none")
      );
      Array.from(
        document.querySelectorAll(".table-responsive table tbody")
      ).map((i) => (i.style.display = "table-row-group"));
    },
    editDatabase(id) {
      this.connections.map((i) => {
        if (i._id == id) {
          i.pass = "";
          this.edit = JSON.parse(JSON.stringify(i));
          this.edit.computers = [];
          this.computers.map((ii) => {
            if (i.computers.includes(ii._id)) this.edit.computers.push(ii);
          });
        }
      });
      document.getElementsByClassName("alertConnections")[0].innerHTML = "";
      document.getElementsByClassName("alertConnections")[0].style.display =
        "none";
      document.getElementsByClassName("alertConnections")[1].innerHTML = "";
      document.getElementsByClassName("alertConnections")[1].style.display =
        "none";
      document.getElementsByClassName("alertModal")[1].innerHTML = "";
      document.getElementsByClassName("alertModal")[1].style.display = "none";
      document.getElementsByClassName("alertModalSuccess")[1].style.display =
        "none";
      this.modals.modalEditar = true;
    },
    connectionReciever(data) {
      if (data.error == true) console.log(data);
      else window.api.send("connections-index");
    },
    changeStatusToPending() {
      window.api.send(
        "connections-statusChange",
        JSON.parse(JSON.stringify(this.edit))
      );
    },
    changeStatusToPendingResponse(data) {
      if (data.error == 0) {
        this.connections.map((i, k) => {
          if (i._id == this.edit._id) {
            this.connections[k].status = 0;
            this.connections[k].dateStatus = new Date();
          }
        });
        this.modals.modalEditar = false;
      } else {
        document.getElementsByClassName("alertModal")[1].innerHTML =
          "Something went wrong, please refresh aplication or try later.";
        document.getElementsByClassName("alertModal")[1].style.display =
          "block";
        document.getElementsByClassName("alertModalSuccess")[1].style.display =
          "none";
      }
    },
  },
  computed: {
    filteredGeneral() {
      let data = this.connections.filter((i) => {
        return (
          i.name.includes(this.filters.text0) ||
          i.typeDB.includes(this.filters.text0) ||
          i.host.includes(this.filters.text0) ||
          i.port.includes(this.filters.text0) ||
          i.port.includes(this.filters.text0)
        );
      });

      data.sort((a, b) => {
        if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
        else return 1;
      });
      return data;
    },
    filteredMy() {
      let data = this.connections.filter((i) => {
        return (
          i.computers.includes(this.computerDefault._id) &&
          (i.name.includes(this.filters.text1) ||
            i.typeDB.includes(this.filters.text1) ||
            i.host.includes(this.filters.text1) ||
            i.port.includes(this.filters.text1) ||
            i.port.includes(this.filters.text1))
        );
      });
      data.sort((a, b) => {
        if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
        else return 1;
      });
      return data;
    },
    checkVerifyEdit() {
      let disabled = "disabled";
      if (typeof this.edit.computers == "undefined") return disabled;
      if (this.edit.computers.length > 0)
        this.edit.computers.map((i) => {
          if (i._id == this.computerDefault._id) disabled = "";
        });
      return disabled;
    },
    checkVerifyCreate() {
      let disabled = "disabled";
      if (typeof this.creation.computers == "undefined") return disabled;
      if (this.creation.computers.length > 0)
        this.creation.computers.map((i) => {
          if (i._id == this.computerDefault._id) disabled = "";
        });
      return disabled;
    },
  },

  created() {
    window.api.receive("connections-connection", this.connectionReciever);
    window.api.receive("connections-index", this.prepareIndex);
    window.api.receive("connections-verify", this.verifyConnectionResponse);
    window.api.receive(
      "connections-statusChange",
      this.changeStatusToPendingResponse
    );
    window.api.receive("connections-creation", (data) => {
      if (typeof data != "undefined") {
        data._id = Buffer.from(data._id.id).toString("hex");
        this.connections.push(data);
        this.modals.modalAdicionar = false;
        this.clearCreation();
        document.getElementsByClassName("alertConnections")[0].innerHTML =
          "Database connection created with success.";
        document.getElementsByClassName("alertConnections")[0].style.display =
          "block";
        document.getElementsByClassName("alertConnections")[1].innerHTML = "";
        document.getElementsByClassName("alertConnections")[1].style.display =
          "";
      } else {
        document.getElementsByClassName("alertConnections")[0].innerHTML = "";
        document.getElementsByClassName("alertConnections")[0].style.display =
          "";
        document.getElementsByClassName("alertConnections")[1].innerHTML =
          "Couldn't create the database connection, please try again.";
        document.getElementsByClassName("alertConnections")[1].style.display =
          "block";
      }
    });

    window.api.receive("connections-edit", (dataResponse) => {
      let data = dataResponse.dataCopy;
      if (dataResponse.error == 0) {
        this.connections.map((i, k) => {
          if (i._id == data._id) this.connections[k] = data;
        });
        this.modals.modalEditar = false;

        document.getElementsByClassName("alertConnections")[0].innerHTML =
          "Database connection updated with success.";
        document.getElementsByClassName("alertConnections")[0].style.display =
          "block";

        document.getElementsByClassName("alertConnections")[1].innerHTML =
          "";
        document.getElementsByClassName("alertConnections")[1].style.display =
          "none";
      } else {
        document.getElementsByClassName("alertModal")[1].innerHTML =
          "Something went wrong, please refresh aplication or try later.";
        document.getElementsByClassName("alertModal")[1].style.display =
          "block";
        document.getElementsByClassName("alertModalSuccess")[1].style.display =
          "none";
      }
    });
  },
  mounted() {
    Array.from(document.querySelectorAll(".table-responsive table tbody")).map(
      (i) => (i.style.display = "none")
    );
    window.api.send("connections-connection");
  },
  unmounted() {
    window.api.send("connections-connection-close");
    window.api.removeAllListeners("connections-connection");
    window.api.removeAllListeners("connections-index");
    window.api.removeAllListeners("connections-creation");
    window.api.removeAllListeners("connections-edit");
    window.api.removeAllListeners("connections-verify");
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
