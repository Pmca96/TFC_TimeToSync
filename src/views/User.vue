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
            <form role="form" class="smallTextForm" style="width: 99%">
              <div class="form-row mt-4">
                <div class="form-group col-md-6 mb-0">
                  <label>Email</label>
                  <base-input
                    formClasses="input-group-alternative mb-3"
                    type="email"
                    addon-left-icon="fas fa-user"
                    v-bind:value="UserSettings.email"
                    v-on:input="UserSettings.email = $event.target.value"
                    :disabled="mode == 0 ? true : false"
                  ></base-input>
                </div>
                <div class="form-group col-md-6 mb-0"></div>
                <div class="form-group col-md-6 mb-0">
                  <label>Password</label>
                  <base-input
                    formClasses="input-group-alternative mb-3"
                    type="password"
                    addon-left-icon="fas fa-unlock-alt"
                    v-bind:value="UserSettings.password"
                    v-on:input="UserSettings.password = $event.target.value"
                    :disabled="mode == 0 ? true : false"
                  ></base-input>
                </div>
                <div class="form-group col-md-6 mb-0">
                  <label>Confirm password</label>
                  <base-input
                    formClasses="input-group-alternative mb-3"
                    type="password"
                    addon-left-icon="fas fa-unlock-alt"
                    v-bind:value="UserSettings.passConfirm"
                    v-on:input="UserSettings.passConfirm = $event.target.value"
                    :disabled="mode == 0 ? true : false"
                  ></base-input>
                </div>
                <div class="form-group col-md-11 offset-md-1 mb-2">
                  <base-checkbox
                    class="ml-2"
                    style="float: left"
                    :checked="UserSettings.notificationOnTaskFailed"
                    @update="UserSettings.notificationOnTaskFailed = $event"
                    :disabled="mode == 0 ? true : false"
                  />
                  <div style="float: left">
                    <label
                      >Notify me when tasks fail (only for the first
                      time)</label
                    >
                  </div>
                </div>
                <div class="form-group col-md-11 offset-md-1 mb-2">
                  <base-checkbox
                    class="ml-2"
                    style="float: left"
                    :checked="UserSettings.notificationOnServiceFailed"
                    @update="UserSettings.notificationOnServiceFailed = $event"
                    :disabled="mode == 0 ? true : false"
                  />
                  <div style="float: left">
                    <label
                      >Notify me when services fail (minimum two services
                      active)</label
                    >
                  </div>
                </div>
              </div>

              <div class="text-center">
                <base-button
                  type="primary"
                  class="my-4"
                  @click="edit()"
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
      UserSettings: {
        email: "",
        password: "",
        passConfirm: "",
        notificationOnTaskFailed: false,
        notificationOnServiceFailed: false,
      },
    };
  },
  methods: {
    edit() {
      this.UserSettingsBackup = JSON.parse(JSON.stringify(this.UserSettings));
      this.mode = 1;
    },
    cancel() {
      this.mode = 0;
      this.UserSettings = JSON.parse(JSON.stringify(this.UserSettingsBackup));
    },
    save() {
      document.getElementsByClassName("alertModalSuccess")[0].style.display =
        "none";
      document.getElementsByClassName("alertModalDanger")[0].style.display =
        "none";
      let response = this.checkRequired();

      if (response.error == 1) {
        document.getElementsByClassName("alertModalDanger")[0].innerHTML =
          response.msg;
        document.getElementsByClassName("alertModalDanger")[0].style.display =
          "block";
      } else
        window.api.send(
          "user-save",
          JSON.parse(JSON.stringify(this.UserSettings))
        );
    },

    saveRecieve(data) {
      if (data == 1) {
        document.getElementsByClassName("alertModalSuccess")[0].innerHTML =
          "Data user updated successfully";

        document.getElementsByClassName("alertModalSuccess")[0].style.display =
          "block";
        this.mode = 0;
        this.UserSettings.password = "";
        this.UserSettings.passConfirm = "";
        this.UserSettingsBackup = JSON.parse(JSON.stringify(this.UserSettings));
      } else {
        document.getElementsByClassName("alertModalDanger")[0].innerHTML =
          "Data user not updated with success";
        document.getElementsByClassName("alertModalDanger")[0].style.display =
          "block";
      }
    },
    checkRequired() {
      if (this.UserSettings.email == "" || !this.validateEmail())
        return { error: 1, msg: "Email not valid." };
      if (
        this.UserSettings.password != "" &&
        this.UserSettings.password != this.UserSettings.passConfirm
      )
        return { error: 1, msg: "Passwords are not equal." };
      return { error: 0, msg: "" };
    },

    validateEmail() {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.UserSettings.email).toLowerCase());
    },

    conectionRecieve() {
      window.api.send("user-index");
    },
    indexRecieve(data) {
      data[0].password = "";
      data[0]._id = Buffer.from(data[0]._id.id).toString("hex");
      this.UserSettings = data[0];
    },
  },

  created() {
    window.api.receive("user-connection", this.conectionRecieve);
    window.api.receive("user-index", this.indexRecieve);
    window.api.receive("user-save", this.saveRecieve);
  },
  mounted() {
    window.api.send("user-connection");
  },
  unmounted() {
    window.api.send("user-connection-close");
    window.api.removeAllListeners("user-connection");
    window.api.removeAllListeners("user-index");
    window.api.removeAllListeners("user-save");
  },
};
</script>

