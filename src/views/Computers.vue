<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-5">
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col mb-6">
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
                    <el-tooltip
                      placement="top"
                      :content="
                        getTitleTextBasedOnTime(row.item.lastSoftwareActive)
                      "
                    >
                      <span
                        class="badge badge-dot mr-4"
                        v-bind:class="
                          getBadgeBasedOnTime(row.item.lastSoftwareActive)
                        "
                      >
                        <i
                          v-bind:class="
                            getBgBasedOnTime(row.item.lastSoftwareActive)
                          "
                        ></i>
                        <span class="status">{{
                          dateTimeToString(
                            row.item.lastSoftwareActive,
                            " ---- "
                          )
                        }}</span>
                      </span>
                    </el-tooltip>
                  </td>

                  <td class="budget">
                    <el-tooltip
                      placement="top"
                      :content="
                        getTitleTextBasedOnTime(row.item.lastServiceActive)
                      "
                    >
                      <span
                        class="badge badge-dot mr-4"
                        v-bind:class="
                          getBadgeBasedOnTime(row.item.lastServiceActive)
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
                    </el-tooltip>
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
      document.querySelector(".table-responsive table tbody").style.display =
        "table-row-group";
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
          "computers-index",
          JSON.parse(JSON.stringify(this.filters))
        );
    },
  },

  computed: {
    filteredGeneral() {
      let data = this.computers.filter((i) => {
        return i.hostname.includes(this.filters.text);
      });

      data.sort((a, b) => {
        if (a.hostname.toUpperCase() < b.hostname.toUpperCase()) return -1;
        else return 1;
      });
      return data;
    },
  },
  created() {
    window.api.receive("computers-index", this.fileterReciever);
    window.api.receive("computers-connection", this.connectionReciever);
  },
  mounted() {
    document.querySelector(".table-responsive table tbody").style.display =
      "none";
    window.api.send("computers-connection");
  },
  unmounted() {
    window.api.removeAllListeners("computers-index");
    window.api.removeAllListeners("computers-connection");
  },
};
</script>
