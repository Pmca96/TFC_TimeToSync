<template>
  <div class="row m-0 bb-1 p-1">
    <div class="col-md-2 p-0 pl-2 pr-3 text-center">
      <div class="h30 buttonsStyles mt-1">
        <a v-on:click="destroyComp" v-if="hasDelete" class="text-danger"
          ><i class="fas fa-trash"></i
        ></a>
        <a v-else-if="!hasDelete" class="text-default"
          ><i class="fas fa-trash"></i
        ></a>
      </div>
      <base-checkbox
        class="ml-5 mt-1"
        style="float: left"
        :checked="uniqueValue"
        @update="onChangeUnique"
      />
    </div>
    <div class="col-md-4 p-0 pl-2 pr-3">
      <multiselect
        v-model="columnFromValue"
        :options="columnsFrom"
        :searchable="false"
        :close-on-select="true"
        :show-labels="false"
        :allow-empty="false"
        open-direction="bottom"
        @select="onChangeColumnFrom"
      ></multiselect>
    </div>
    <div class="col-md-2 p-0 pl-2 pr-3 text-right">
      <base-button
        type="success"
        class="p-1 btnSmallText"
        @click="modalVisible = true"
      >
        Transformation</base-button
      >
    </div>
    <div class="col-md-4 p-0 pl-2 pr-3">
      <multiselect
        v-model="columnToValue"
        :options="columnsTo"
        :searchable="false"
        :close-on-select="true"
        :show-labels="false"
        :allow-empty="false"
        open-direction="bottom"
        @select="onChangeColumnTo"
      ></multiselect>
    </div>
    <modal
      v-model:show="modalVisible"
      body-classes="p-0"
      modal-classes="modal-dialog-centered modal-md"
    >
      <card
        type="secondary"
        shadow
        header-classes="bg-white pb-0"
        body-classes="px-lg-0 py-lg-0"
        class="border-0"
        style="height: 300px; overflow-y: scroll"
      >
        <CodeEditor
          v-model="transformValue"
          lang="javascript"
          theme="sqlserver"
          @init="init"
        ></CodeEditor>
      </card>
    </modal>
  </div>
</template>

<script>
import mix from "../assets/js/mixins";
import CodeEditor from "vue3-code-editor";
export default {
  components: {
    CodeEditor,
  },
  mixins: [mix],
  emits: ["update", "destroy"],
  props: {
    columnsTo: {
      type: Array,
      required: true,
    },
    columnsFrom: {
      type: Array,
      required: true,
    },
    hasDelete: {
      type: Boolean,
      required: false,
      default: true,
    },
    data: Object,
  },

  data() {
    return {
      modalVisible: false,
      columnFromValue: this.data[0].name,
      transformValue: this.data[0].transform,
      columnToValue: this.data[1],
      uniqueValue: this.data[0].unique,
      id: this.data[0].id,
    };
  },
  methods: {
    onChangeColumnFrom(value) {
      this.columnFromValue = value;
      this.emitValue();
    },
    onChangeColumnTo(value) {
      this.columnToValue = value;
      this.emitValue();
    },
    onChangeUnique(value) {
      this.uniqueValue = value;
      this.emitValue();
    },
    onChangeTransform(value) {
      this.transformValue = value.target.value;
      this.emitValue();
    },
    emitValue() {
      setTimeout(() => {
        let item = {};
        item = {
          id: this.id,
          columnFrom: this.columnFromValue,
          columnTo: this.columnToValue,
          transform: this.transformValue,
          unique: this.uniqueValue,
        };

        this.$emit("update", item);
      }, 1);
    },

    destroyComp() {
      this.$emit("destroy", { id: this.id });
    },
  },
  setup() {
    return {
      init: function () {
        require("brace/theme/sqlserver");
        require("brace/mode/javascript");
      },
    };
  },
};
</script>

<style scoped>
.buttonsStyles {
  position: absolute;
}

.my-editor {
  /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
  background: #2d2d2d;
  color: #ccc;

  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
  outline: none;
}
</style>
