<template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7">
      <base-alert id="alert" style="display: none" type="danger"></base-alert>
      <base-alert
        id="alertSuccess"
        style="display: none"
        type="success"
      ></base-alert>
      <div class="card bg-secondary shadow border-0">
        <div class="card-body px-lg-5 py-lg-3 iniciarSessao">
          <h2 class="text-center text-primary mb-4">Authentication</h2>
          <form role="form">
            <base-input
              formClasses="input-group-alternative mb-3 keyCheck"
              placeholder="Email"
              addon-left-icon="ni ni-email-83"
              v-bind:value="model.email"
              v-on:input="model.email = $event.target.value"
            >
            </base-input>

            <base-input
              formClasses="input-group-alternative mb-3 keyCheck"
              placeholder="Password"
              type="password"
              addon-left-icon="ni ni-lock-circle-open"
              v-bind:value="model.password"
              v-on:input="model.password = $event.target.value"
            >
            </base-input>

            <div class="text-center">
              <base-button
                type="primary"
                class="my-4"
                v-on:click="iniciarSessaoButton"
                >Sign in</base-button
              >
            </div>
          </form>
        </div>

        <div class="card-body px-lg-5 py-lg-3 recuperarConta">
          <h2 class="text-center text-primary mb-4">Account recovery</h2>
          <form role="form">
            <base-input
              formClasses="input-group-alternative mb-3 keyCheck"
              placeholder="Email"
              addon-left-icon="ni ni-email-83"
              v-bind:value="model.email"
              v-on:input="model.email = $event.target.value"
            >
            </base-input>

            <div class="text-center">
              <base-button type="primary" class="my-4" v-on:click="recuperar"
                >Recover</base-button
              >
            </div>
          </form>
        </div>

        <div class="card-body px-lg-5 py-lg-3 iniciarConfiguracao">
          <h2 class="text-center text-primary mb-4">Setup configurations</h2>
          <form role="form">
            <base-input
              formClasses="input-group-alternative mb-3 keyCheck"
              placeholder="MongoDB connection"
              addon-left-icon="fas fa-code"
              v-bind:value="model.mongo"
              v-on:input="model.mongo = $event.target.value"
            >
            </base-input>

            <base-input
              formClasses="input-group-alternative mb-3 keyCheck"
              placeholder="Email"
              type="email"
              addon-left-icon="ni ni-email-83"
              v-bind:value="model.email"
              v-on:input="model.email = $event.target.value"
            >
            </base-input>

            <base-input
              formClasses="input-group-alternative mb-3 keyCheck"
              placeholder="Password"
              type="password"
              addon-left-icon="ni ni-lock-circle-open"
              v-bind:value="model.password"
              v-on:input="model.password = $event.target.value"
            >
            </base-input>

            <base-input
              formClasses="input-group-alternative mb-3 keyCheck"
              placeholder="Password validation"
              type="password"
              addon-left-icon="ni ni-lock-circle-open"
              v-bind:value="model.password1"
              v-on:input="model.password1 = $event.target.value"
            >
            </base-input>

            <div class="text-center">
              <base-button
                type="primary"
                class="my-4"
                v-on:click="configurarAplication"
                >Setup</base-button
              >
            </div>
          </form>
        </div>

        <div class="card-body px-lg-5 py-lg-3 loading" style="height: 370px">
          <div class="loaderBase bg-secondary" style="height: 100%">
            <div class="loaderShow bg-secondary">
              <div class="lds-ripple">
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-12 iniciarSessao">
          <a class="text-light" v-on:click="recuperarConta"
            ><small>Have you forgotten your password?</small></a
          >
        </div>
        <div class="col-12 recuperarConta">
          <a class="text-light" v-on:click="iniciarSessao"
            ><small>Sign in?</small></a
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let recuperarConta;
let iniciarConfiguracao;
let iniciarSessao;

export default {
  data() {
    return {
      model: {
        mongo: "",
        email: "",
        password: "",
        password1: "",
      },
    };
  },
  methods: {
    recuperarConta() {
      if (recuperarConta.length > 0)
        Array.from(recuperarConta).map((i) => (i.style.display = "block"));
      if (iniciarSessao.length > 0)
        Array.from(iniciarSessao).map((i) => (i.style.display = "none"));
    },
    iniciarSessao() {
      if (recuperarConta.length > 0)
        Array.from(recuperarConta).map((i) => (i.style.display = "none"));
      if (iniciarSessao.length > 0)
        Array.from(iniciarSessao).map((i) => (i.style.display = "block"));
    },
    configurarAplication() {
      window.api.send("login-settings", JSON.parse(JSON.stringify(this.model)));
    },
    iniciarSessaoButton() {
      window.api.send("login-iniciar", JSON.parse(JSON.stringify(this.model)));
    },
    recieveData(data) {
      document.getElementById("alert").style.display = "none";
      document.getElementById("alertSuccess").style.display = "none";
      if (data.error == true) {
        document.getElementById("alert").innerHTML = data.message;
        document.getElementById("alert").style.display = "block";
      }
    },
    formSubmit(event) {
      if (event.code == "Enter") {
        let nextSibling = event.target.parentElement.nextSibling;
        while (nextSibling && nextSibling.children[0].nodeName != "BUTTON")
          nextSibling = nextSibling.nextSibling;
        nextSibling.children[0].click();
      }
    },
    recuperar() {
      window.api.send("login-recuperar", this.model.email);
    },
    recuperarResult(data) {
      document.getElementById("alert").style.display = "none";
      document.getElementById("alertSuccess").style.display = "none";
      if (data.error) {
        document.getElementById("alert").innerHTML = data.message;
        document.getElementById("alert").style.display = "block";
      } else {
        document.getElementById("alertSuccess").innerHTML = data.message;
        document.getElementById("alertSuccess").style.display = "block";
      }
    },
  },
  mounted() {
    recuperarConta = document.getElementsByClassName("recuperarConta");
    if (recuperarConta.length > 0)
      Array.from(recuperarConta).map((i) => (i.style.display = "none"));

    iniciarSessao = document.getElementsByClassName("iniciarSessao");
    iniciarConfiguracao = document.getElementsByClassName(
      "iniciarConfiguracao"
    );
    Array.from(iniciarSessao).map((i) => (i.style.display = "none"));
    Array.from(iniciarConfiguracao).map((i) => (i.style.display = "none"));

    window.api.send("login-check");
    window.api.receive("login-recuperar", this.recuperarResult);
    Array.from(document.querySelectorAll(".keyCheck")).map((i) => {
      i.addEventListener("keypress", this.formSubmit);
    });
  },
  created() {
    window.api.receive("login-check", (data) => {
      if (data.page == "login")
        Array.from(iniciarSessao).map((i) => (i.style.display = "block"));
      else if (data.page == "setup")
        Array.from(iniciarConfiguracao).map((i) => (i.style.display = "block"));

      document.getElementsByClassName("loading")[0].style.display = "none";
      document.querySelector("body").style.overflowY = "auto";
    });

    window.api.receive("login-settings", (data) => {
      if (data.error == "") this.$router.push("dashboard");
      else this.recieveData(data);
    });

    window.api.receive("login-iniciar", (data) => {
      if (data.error == "") this.$router.push("dashboard");
      else this.recieveData(data);
    });
  },
  unmounted() {
    window.api.removeAllListeners("login-check");
    window.api.removeAllListeners("login-settings");
    window.api.removeAllListeners("login-iniciar");
    window.api.removeAllListeners("login-recuperar");
  },
};
</script>
<style scope>
a {
  cursor: pointer;
}
</style>
