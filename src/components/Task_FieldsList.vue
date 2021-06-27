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
        v-model="uniqueValue"
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
        header-classes="bg-white pb-5"
        body-classes="px-lg-3 py-lg-3"
        class="border-0"
      >
        <textarea
          class="form-control"
          rows="3"
          style="height: 200px"
          v-bind:value="transformValue"
          v-on:input="onChangeTransform"
        ></textarea>
      </card>
    </modal>
  </div>
</template>
<script>
import mix from "../assets/js/mixins";
export default {
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
};
</script>

<style scoped>
.buttonsStyles {
  position: absolute;
}
</style>

