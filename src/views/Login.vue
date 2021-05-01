<template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7">
      <div class="card bg-secondary shadow border-0">
        <div class="card-body px-lg-5 py-lg-5 iniciarSessao">
          <div class="text-center text-muted mb-4">
            <small>Iniciar sessão</small>
          </div>
          <form role="form">
            <base-input
              formClasses="input-group-alternative mb-3"
              placeholder="Email"
              addon-left-icon="ni ni-email-83"
              v-model="model.email"
            >
            </base-input>

            <base-input
              formClasses="input-group-alternative mb-3"
              placeholder="Password"
              type="password"
              addon-left-icon="ni ni-lock-circle-open"
              v-model="model.password"
            >
            </base-input>

            <div class="text-center">
              <base-button type="primary" class="my-4">Entrar</base-button>
            </div>
          </form>
        </div>

        <div class="card-body px-lg-5 py-lg-5 recuperarConta">
          <div class="text-center text-muted mb-4">
            <small>Recuperação de conta</small>
          </div>
          <form role="form">
            <base-input
              formClasses="input-group-alternative mb-3"
              placeholder="Email"
              addon-left-icon="ni ni-email-83"
              v-model="model.email"
            >
            </base-input>

            <div class="text-center">
              <base-button type="primary" class="my-4">Recuperar</base-button>
            </div>
          </form>
        </div>

        <div class="card-body px-lg-5 py-lg-5 setup">
          <div class="text-center text-muted mb-4">
            <small>Configuração dos dados aplicacionais</small>
          </div>
          <form role="form">
            <base-input
              formClasses="input-group-alternative mb-3"
              placeholder="MongoDB ligação"
              addon-left-icon="ni ni-email-83"
              v-model="model.email"
            >
            </base-input>

            <base-input
              formClasses="input-group-alternative mb-3"
              placeholder="Email"
              addon-left-icon="ni ni-email-83"
              v-model="model.email"
            >
            </base-input>

            <base-input
              formClasses="input-group-alternative mb-3"
              placeholder="Password"
              type="password"
              addon-left-icon="ni ni-lock-circle-open"
              v-model="model.password"
            >
            </base-input>

            <base-input
              formClasses="input-group-alternative mb-3"
              placeholder="Verificação da password"
              type="password"
              addon-left-icon="ni ni-lock-circle-open"
              v-model="model.password1"
            >
            </base-input>

            <div class="text-center">
              <base-button type="primary" class="my-4">Seguinte</base-button>
            </div>
          </form>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-6 iniciarSessao">
          <a href="#" class="text-light"
            ><small>Esqueceu-se da palavra chave?</small></a
          >
        </div>
        <div class="col-6 recuperarConta">
          <a href="#" class="text-light"><small>Iniciar sessão?</small></a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      model: {
        email: "",
        password: "",
      },
    };
  },
  mounted() {
    window.api.receive("login-check", (data) => {
      console.log(`Received ${data} from main process`);
    });
    window.api.send("login-check", "some data");
  },
};
</script>
<style></style>
