<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-5">
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col mb-6 card bg-secondary">
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
            <form role="form" class="smallTextForm mt-3" style="width: 99%">
              <div class="form-row">
                <div class="form-group col-md-6 mb-0">
                  <label>SMTP Host</label>
                  <base-input
                    formClasses="input-group-alternative mb-3"
                    type="text"
                    v-bind:value="configuration.smtpHost"
                    v-on:input="configuration.smtpHost = $event.target.value"
                    :disabled="mode == 0 ? true : false"
                  ></base-input>
                </div>
                <div class="form-group col-md-2 mb-0">
                  <label>SMTP Port</label>
                  <base-input
                    formClasses="input-group-alternative mb-3"
                    type="text"
                    v-bind:value="configuration.smtpPort"
                    v-on:input="configuration.smtpPort = $event.target.value"
                    :disabled="mode == 0 ? true : false"
                  ></base-input>
                </div>
                <div class="form-group col-md-2 mb-0">
                  <div style="float: left">
                    <label>SMTP Secure</label>
                  </div>
                  <base-checkbox
                    class="ml-2"
                    style="float: left"
                    :checked="configuration.smtpSecure"
                    @update="configuration.smtpSecure = $event"
                    :disabled="mode == 0 ? true : false"
                  />
                </div>
                <div class="form-group col-md-6 mb-0">
                  <label>SMTP User</label>
                  <base-input
                    formClasses="input-group-alternative mb-3"
                    type="text"
                    addon-left-icon="fas fa-user"
                    v-bind:value="configuration.smtpUser"
                    v-on:input="configuration.smtpUser = $event.target.value"
                    :disabled="mode == 0 ? true : false"
                  ></base-input>
                </div>
                <div class="form-group col-md-6 mb-0">
                  <label>SMTP Password</label>
                  <base-input
                    formClasses="input-group-alternative mb-3"
                    type="password"
                    addon-left-icon="fas fa-unlock-alt"
                    v-bind:value="configuration.smtpPass"
                    v-on:input="configuration.smtpPass = $event.target.value"
                    :disabled="mode == 0 ? true : false"
                  ></base-input>
                </div>
              </div>

              <div class="text-center">
                <base-button
                  type="primary"
                  class="my-4"
                  @click="mode = 1"
                  v-if="mode == 0"
                  ><i class="fas fa-edit"></i> Edit</base-button
                >
                <base-button
                  v-if="mode == 1"
                  type="success"
                  class="my-4"
                  @click="save()"
                >
                  <i class="fas fa-save"></i> Save</base-button
                >
                <base-button
                  v-if="mode == 1"
                  type="primary"
                  class="my-4"
                  @click="cancel()"
                >
                  Cancel</base-button
                >
              </div>
            </form>
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
      mode: 0,
      configuration: {
        smtpHost: "",
        smtpPort: "",
        smtpSecure: false,
        smtpUser: "",
        smtpPass: "",
      },
    };
  },
  methods: {
    edit() {
      this.configurationBackup = JSON.parse(JSON.stringify(this.configuration));
      this.mode = 1;
    },
    cancel() {
      this.mode = 0;
      this.configuration = JSON.parse(JSON.stringify(this.configurationBackup));
    },
    save() {
      document.getElementsByClassName("alertModalSuccess")[0].style.display =
        "none";
      document.getElementsByClassName("alertModalDanger")[0].style.display =
        "none";
      window.api.send(
        "system-save",
        JSON.parse(JSON.stringify(this.configuration))
      );
    },

    saveRecieve(data) {
      if (data == 1 || typeof data._id == "object") {
        document.getElementsByClassName("alertModalSuccess")[0].innerHTML =
          "Configuration updated successfully";

        document.getElementsByClassName("alertModalSuccess")[0].style.display =
          "block";
        this.mode = 0;
        if (typeof data._id == "object")
          this.configuration._id = Buffer.from(data._id.id).toString("hex");
        this.configuration.smtpPass = "";
        this.configurationBackup = JSON.parse(
          JSON.stringify(this.configuration)
        );
      } else {
        document.getElementsByClassName("alertModalDanger")[0].innerHTML =
          "Configuration failed to updated";
        document.getElementsByClassName("alertModalDanger")[0].style.display =
          "block";
      }
    },
    conectionRecieve() {
      window.api.send("system-index");
    },
    indexRecieve(data) {
      if (data.length > 0) {
        data[0]._id = Buffer.from(data[0]._id.id).toString("hex");
        this.configuration = data[0];
        this.configuration.smtpPass = "";
      }
    },
  },
  computed: {},

  created() {
    window.api.receive("system-connection", this.conectionRecieve);
    window.api.receive("system-index", this.indexRecieve);
    window.api.receive("system-save", this.saveRecieve);
  },
  mounted() {
    window.api.send("system-connection");
  },
  unmounted() {
    window.api.send("system-connection-close");
    window.api.removeAllListeners("system-connection");
    window.api.removeAllListeners("system-index");
    window.api.removeAllListeners("system-save");
  },
};
</script>
