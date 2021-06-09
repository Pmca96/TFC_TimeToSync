<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-5">
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col">
          <div class="card shadow">
            <div class="card-header border-0 p-2">
              <div class="row align-items-center">
                <div class="col">
                  <h3 class="mb-0">Filters</h3>
                </div>
                <div class="col text-right">
                  <base-input
                    formClasses="input-group-alternative col-md-6 offset-md-6 mb-0 keyCheck"
                    placeholder="Search"
                    type="text"
                    addon-left-icon="fas fa-search"
                    v-bind:value="filters.text"
                    v-on:input="filters.text = $event.target.value"
                    v-on:keyup="sendFilter"
                  ></base-input>
                </div>
              </div>
            </div>

            <div class="table-responsive">
              <base-table
                class="table align-items-center table-flush"
                tbody-classes="list"
                :data="computers"
              >
                <template v-slot:columns>
                  <th>Name</th>
                  <th>Software status</th>
                  <th>Service status</th>
                  <th></th>
                </template>

                <template v-slot:default="row">
                  <th scope="row">
                    <div class="media align-items-center">
                      <div class="media-body">
                        <span class="name mb-0 text-sm">
                          {{ row.item.hostname }}
                        </span>
                      </div>
                    </div>
                  </th>

                  <td class="budget">
                    <span
                      class="badge badge-dot mr-4"
                      v-bind:class="
                        getBadgeBasedOnTime(row.item.lastSoftwareActive)
                      "
                      v-bind:title="
                        getTitleTextBasedOnTime(row.item.lastSoftwareActive)
                      "
                    >
                      <i
                        v-bind:class="
                          getBgBasedOnTime(row.item.lastSoftwareActive)
                        "
                      ></i>
                      <span class="status">{{
                        dateTimeToString(row.item.lastSoftwareActive, " ---- ")
                      }}</span>
                    </span>
                  </td>

                  <td class="budget">
                    <span
                      class="badge badge-dot mr-4"
                      v-bind:class="
                        getBadgeBasedOnTime(row.item.lastServiceActive)
                      "
                      v-bind:title="
                        getTitleTextBasedOnTime(row.item.lastServiceActive)
                      "
                    >
                      <i
                        v-bind:class="
                          getBgBasedOnTime(row.item.lastServiceActive)
                        "
                      ></i>
                      <span class="status">{{
                        dateTimeToString(row.item.lastServiceActive, " ---- ")
                      }}</span>
                    </span>
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

            <div class="card-footer d-flex justify-content-end"></div>
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
      filters: {
        text: "",
        estado: 0,
      },
      computers: [],
    };
  },
  methods: {
    fileterReciever(data) {
      this.computers = data;
      document.querySelector(".table-responsive table tbody").style.visibility =
        "initial";
      document.querySelector(".table-responsive").style.overflowY = "auto";
      if (document.getElementsByClassName("loaderBase").length > 0)
        document.getElementsByClassName("loaderBase")[0].style.display = "none";
    },

    connectionReciever(data) {
      if (data.error == true) console.log(data);
      else
        window.api.send(
          "computers-filter",
          JSON.parse(JSON.stringify(this.filters))
        );
    },

    sendFilter() {
      document.querySelector(".table-responsive").style.overflowY = "hidden";
      document.querySelector(".table-responsive table tbody").style.visibility =
        "collapse";
      if (document.getElementsByClassName("loaderBase").length > 0)
        document.getElementsByClassName("loaderBase")[0].style.display =
          "block";

      window.api.send(
        "computers-filter",
        JSON.parse(JSON.stringify(this.filters))
      );
    },
  },

  created() {
    window.api.receive("computers-filter", this.fileterReciever);
    window.api.receive("computers-connection", this.connectionReciever);
  },
  mounted() {
    window.api.send("computers-connection");
  },
  unmounted() {
    window.api.removeAllListeners("computers-filter");
    window.api.removeAllListeners("computers-connection");
  },
};
</script>
