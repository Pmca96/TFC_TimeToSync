<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
      <div class="row">
        <div class="col-xl-3 col-lg-6">
          <stats-card
            title="Services"
            type="gradient-info"
            :sub-title="(servicesActive + servicesFailed).toString()"
            icon="fas fa-spinner"
            class="mb-4 mb-xl-0"
          >
            <template v-slot:footer>
              <span class="text-nowrap">Active: </span>
              <span class="text-success mr-2">
                {{ servicesActive.toString() }}
              </span>
              <span class="text-nowrap">Failed: </span>
              <span class="text-danger mr-2">
                {{ servicesFailed.toString() }}
              </span>
            </template>
          </stats-card>
        </div>

        <div class="col-xl-3 col-lg-6">
          <stats-card
            title="Connections"
            type="gradient-green"
            :sub-title="(connectionsActive + connectionsFailed).toString()"
            icon="fas fa-database"
            class="mb-4 mb-xl-0"
          >
            <template v-slot:footer>
              <span class="text-nowrap">Active: </span>
              <span class="text-success mr-2">
                {{ connectionsActive.toString() }}
              </span>
              <span class="text-nowrap">Failed: </span>
              <span class="text-danger mr-2">
                {{ connectionsFailed.toString() }}
              </span>
            </template>
          </stats-card>
        </div>
        <div class="col-xl-3 col-lg-6">
          <stats-card
            title="Synchronizations"
            type="gradient-orange"
            :sub-title="
              (synchronizationsActive + synchronizationsFailed).toString()
            "
            icon="fas fa-sync-alt"
            class="mb-4 mb-xl-0"
          >
            <template v-slot:footer>
              <span class="text-nowrap">Active: </span>
              <span class="text-success mr-2">
                {{ synchronizationsActive.toString() }}
              </span>
              <span class="text-nowrap">Failed: </span>
              <span class="text-danger mr-2">
                {{ synchronizationsFailed.toString() }}
              </span>
            </template>
          </stats-card>
        </div>
        <div class="col-xl-3 col-lg-6">
          <stats-card
            title="Tasks"
            type="gradient-red"
            :sub-title="(tasksActive + tasksFailed).toString()"
            icon="fas fa-tasks"
            class="mb-4 mb-xl-0"
          >
            <template v-slot:footer>
              <span class="text-nowrap">Active: </span>
              <span class="text-success mr-2">
                {{ tasksActive.toString() }}
              </span>
              <span class="text-nowrap">Failed: </span>
              <span class="text-danger mr-2">
                {{ tasksFailed.toString() }}
              </span>
            </template>
          </stats-card>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <!--Charts-->
      <div class="row">
        <div class="col-xl-12 mb-5 mb-xl-0">
          <card type="dark" header-classes="bg-transparent">
            <template v-slot:header>
              <div class="row align-items-center">
                <div class="col">
                  <h6 class="text-light text-uppercase ls-1 mb-1">Overview</h6>
                  <h5 class="h3 text-white mb-0">Data</h5>
                </div>
              </div>
            </template>
            <div class="chart-area">
              <canvas :height="350" :id="salesChartID"></canvas>
            </div>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// Charts
import Chart from "chart.js";

export default {
  data() {
    return {
      salesChartID: "salesChart",
      ordersChartID: "ordersChart",
      bigLineChart: {
        activeIndex: 0,
      },
      servicesActive: 0,
      servicesFailed: 0,
      connectionsActive: 0,
      connectionsFailed: 0,
      synchronizationsActive: 0,
      synchronizationsFailed: 0,
      tasksActive: 0,
      tasksFailed: 0,
      tasksTotals: [[], [], []],
    };
  },
  methods: {
    indexReciever(data) {
      this.servicesActive = data[0];
      this.servicesFailed = data[1];
      this.connectionsActive = data[2];
      this.connectionsFailed = data[3];
      this.synchronizationsActive = data[4];
      this.synchronizationsFailed = data[5];
      this.tasksActive = data[6];
      this.tasksFailed = data[7];
      this.tasksTotals = data[8];

      this.createChart();
    },
    connectionReciever(data) {
      if (data.error == true) console.log(data);
      else window.api.send("dashboard-index");
    },

    createChart() {
      new Chart(document.getElementById(this.salesChartID).getContext("2d"), {
        type: "line",
        data: {
          labels: this.tasksTotals[0],
          datasets: [
            {
              label: "Data Updated",
              tension: 0.4,
              borderWidth: 4,
              borderColor: "green",
              pointRadius: 0,
              backgroundColor: "green",
              data: this.tasksTotals[1],
            },
            {
              label: "Data Inserted",
              tension: 0.4,
              borderWidth: 4,
              borderColor: "blue",
              pointRadius: 0,
              backgroundColor: "blue",
              data: this.tasksTotals[2],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false,
          },
          tooltips: {
            enabled: true,
            mode: "index",
            intersect: false,
          },
          scales: {
            yAxes: [
              {
                barPercentage: 1.6,
                gridLines: {
                  drawBorder: false,
                  color: "rgba(29,140,248,0.0)",
                  zeroLineColor: "transparent",
                },
                ticks: {
                  padding: 0,
                  fontColor: "white",
                  fontSize: 13,
                  fontFamily: "Open Sans",
                },
              },
            ],
            xAxes: [
              {
                barPercentage: 1.6,
                gridLines: {
                  drawBorder: false,
                  color: "rgba(29,140,248,0.0)",
                  zeroLineColor: "transparent",
                },
                ticks: {
                  padding: 10,
                  fontColor: "white",
                  fontSize: 13,
                  fontFamily: "Open Sans",
                },
              },
            ],
          },
          layout: {
            padding: 0,
          },
        },
      });
    },
  },
  mounted() {
    window.api.send("dashboard-connection");
  },
  created() {
    window.api.receive("dashboard-index", this.indexReciever);
    window.api.receive("dashboard-connection", this.connectionReciever);
  },
  unmounted() {
    window.api.send("dashboard-connection-close");
    window.api.removeAllListeners("dashboard-index");
    window.api.removeAllListeners("dashboard-connection");
  },
};
</script>
<style></style>
