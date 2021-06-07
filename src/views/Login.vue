<template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7">
      <base-alert
        v-bind:value="model.email"
        v-on:input="model.email = $event.target.value"
        id="alert"
        style="display: none"
        type="danger"
      ></base-alert>
      <div class="card bg-secondary shadow border-0">
        <div class="card-body px-lg-5 py-lg-5 iniciarSessao">
          <div class="text-center text-muted mb-4">
            <small>Iniciar sessão</small>
          </div>
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
                >Entrar</base-button
              >
            </div>
          </form>
        </div>

        <div class="card-body px-lg-5 py-lg-5 recuperarConta">
          <div class="text-center text-muted mb-4">
            <small>Recuperação de conta</small>
          </div>
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
              <base-button type="primary" class="my-4">Recuperar</base-button>
            </div>
          </form>
        </div>

        <div class="card-body px-lg-5 py-lg-5 iniciarConfiguracao">
          <div class="text-center text-muted mb-4">
            <small>Configuração dos dados aplicacionais</small>
          </div>
          <form role="form">
            <base-input
              formClasses="input-group-alternative mb-3 keyCheck"
              placeholder="MongoDB ligação"
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
              placeholder="Verificação da password"
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
                >Seguinte</base-button
              >
            </div>
          </form>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-6 iniciarSessao">
          <a class="text-light" v-on:click="recuperarConta"
            ><small>Esqueceu-se da palavra chave?</small></a
          >
        </div>
        <div class="col-6 recuperarConta">
          <a class="text-light" v-on:click="iniciarSessao"
            ><small>Iniciar sessão?</small></a
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
      window.api.send(
        "login-configurar",
        JSON.parse(JSON.stringify(this.model))
      );
    },
    iniciarSessaoButton() {
      window.api.send("login-iniciar", JSON.parse(JSON.stringify(this.model)));
    },
    recieveData(data) {
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
  },
  mounted() {
    recuperarConta = document.getElementsByClassName("recuperarConta");
    if (recuperarConta.length > 0)
      Array.from(recuperarConta).map((i) => (i.style.display = "none"));

    iniciarSessao = document.getElementsByClassName("iniciarSessao");
    iniciarConfiguracao = document.getElementsByClassName(
      "iniciarConfiguracao"
    );

    window.api.send("login-check");

    Array.from(document.querySelectorAll(".keyCheck")).map((i) => {
      i.addEventListener("keypress", this.formSubmit);
    });
  },
  created() {
    window.api.receive("login-check", (data) => {
      if (data.page == "login") {
        if (iniciarConfiguracao.length > 0)
          Array.from(iniciarConfiguracao).map(
            (i) => (i.style.display = "none")
          );
      } else if (data.page == "setup")
        Array.from(iniciarSessao).map((i) => (i.style.display = "none"));

      document.querySelector("body").style.overflowY = "auto";
    });

    window.api.receive("login-configurar", (data) => {
      if (data.error == "") this.$router.push("icons");
      else this.recieveData(data);
    });

    window.api.receive("login-iniciar", (data) => {
      if (data.error == "") this.$router.push("dashboard");
      else this.recieveData(data);
    });
  },
  unmounted() {
    window.api.removeAllListeners("login-check");
    window.api.removeAllListeners("login-configurar");
    window.api.removeAllListeners("login-iniciar");
  },
};
</script>
<style scope>
a {
  cursor: pointer;
}
</style>
