<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-5">
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col">
          <div class="card shadow">
            <div class="loaderShow">
              <div class="lds-ripple">
                <div></div>
                <div></div>
              </div>
            </div>

            <div class="card-header bg-transparent">
              <h3 class="mb-0">Filters</h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-xl-3 col-lg-6" id="maquinasDefaultCard">
                  <stats-card1
                    title="Total traffic"
                    sub-title="350,897"
                    class="mb-4 mb-xl-0"
                  >
                    <template v-slot:body>
                      <div class="line1">
                        <span class="text-success mr-2"
                          ><i class="fa fa-arrow-up"></i> 3.48%</span
                        >
                        <span class="text-nowrap">Since last month</span>
                      </div>
                      <div class="line2">
                        <span class="text-success mr-2"
                          ><i class="fa fa-arrow-up"></i> 3.48%</span
                        >
                        <span class="text-nowrap">Since last month</span>
                      </div>
                    </template>
                  </stats-card1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filters: {
        text: "",
        estado: 0,
      },
      maquinas: [],
    };
  },
  methods: {
    setupMaquinas() {
      let defaultElement = document.getElementById("maquinasDefaultCard");
      this.maquinas.map((i, k) => {
        let newMaquina = defaultElement.cloneNode(true);
        newMaquina.id = "newMaquina" + k;
        newMaquina.querySelector(".card-title").innerHTML = i.hostname;
        newMaquina.querySelector(".line1").innerHTML = i.hostname;
        newMaquina.querySelector(".line2").innerHTML = i.hostname;
        defaultElement.parentElement.appendChild(newMaquina);
      });
      setTimeout(function () {
        document
          .getElementsByClassName("loaderShow")[0]
          .classList.add("loaderHide");

        document
          .getElementsByClassName("loaderShow")[0]
          .classList.remove("loaderShow");
      }, 1000);
    },
    consoleteste(type) {
      console.log(type);
    },
    //------------------------------- API Recievers
    fileterReciever(data) {
      this.maquinas = data;
      this.setupMaquinas();
    },

    connectionReciever(data) {
      console.log("recieved 2");
      if (data.error == true) console.log(data);
      else
        window.api.send(
          "maquinas-filter",
          JSON.parse(JSON.stringify(this.filters))
        );
    },
  },

  created() {
    window.api.receive("maquinas-filter", this.fileterReciever);
    window.api.receive("maquinas-connection", this.connectionReciever);
  },
  mounted() {
    window.api.send("maquinas-connection");
  },
  unmounted() {
    window.api.removeAllListeners("maquinas-filter");
    window.api.removeAllListeners("maquinas-connection");
  },
};
</script>

<style scope>
#maquinasDefaultCard {
  display: none;
}
</style>
