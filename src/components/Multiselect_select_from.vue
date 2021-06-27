<template>
  <div class="row col-12">
    <div class="col-xl-2 col-lg-4 p-0 pl-3 pr-1 h30">
      <multiselect
        v-model="typeValue"
        :options="typeFrom"
        :searchable="false"
        :close-on-select="true"
        :show-labels="false"
        :allow-empty="false"
      ></multiselect>
    </div>
    <template v-if="modeValue == 0">
      <div class="col-xl-2 col-lg-4 p-0 pl-2 pr-1 h30">
        <multiselect
          v-model="databaseValue"
          :options="database"
          :searchable="false"
          :close-on-select="true"
          :show-labels="false"
          :allow-empty="false"
          v-on:change="onChangeDatabase"
          @select="onChangeDatabase"
          label="database"
          track-by="_id"
        ></multiselect>
      </div>

      <div class="col-xl-2 col-lg-4 p-0 pl-2 pr-3 h30">
        <multiselect
          v-model="tableValue"
          :options="tableToFilter"
          :searchable="false"
          :close-on-select="true"
          :show-labels="false"
          :allow-empty="false"
          @select="onChangeTable"
          label="name"
          track-by="name"
        ></multiselect>
        <div class="h30 buttonsStyles">
          <a v-on:click="changeMode" v-if="hasToggle" class="text-primary"
            ><i class="fas fa-sync-alt"></i
          ></a>
          <a v-else-if="!hasToggle" class="text-default"
            ><i class="fas fa-sync-alt"></i
          ></a>
          <a v-on:click="destroyComp" v-if="hasDelete" class="text-danger"
            ><i class="fas fa-trash"></i
          ></a>
          <a v-else-if="!hasDelete" class="text-default"
            ><i class="fas fa-trash"></i
          ></a>
        </div>
      </div>
    </template>
    <template v-else-if="modeValue == 1">
      <div class="col-xl-4 col-lg-12 p-0 pl-3 pr-5 h30">
        <base-input
          formClasses="input-group-alternative mb-3"
          type="text"
          v-bind:value="queryValue"
          v-on:input="onChangeQuery"
        />
        <div style="position: absolute; top: 0; right: 0; z-index: 2">
          <div
            style="
              width: 10px;
              font-size: 16px;
              margin: 6px 10px 0px 0px;
              float: left;
            "
          >
            <a v-on:click="modalVisible1 = true" class="text-green"
              ><i class="fas fa-expand"></i
            ></a>
          </div>
          <div
            class="h30"
            style="
              width: 10px;
              font-size: 11px;
              float: left;
              margin-right: 10px;
            "
          >
            <a v-on:click="changeMode" v-if="hasToggle" class="text-primary"
              ><i class="fas fa-sync-alt"></i
            ></a>
            <a v-else-if="!hasToggle" class="text-default"
              ><i class="fas fa-sync-alt"></i
            ></a>
            <a v-on:click="destroyComp" v-if="hasDelete" class="text-danger"
              ><i class="fas fa-trash"></i
            ></a>
            <a v-else-if="!hasDelete" class="text-default"
              ><i class="fas fa-trash"></i
            ></a>
          </div>
        </div>
      </div>

      <modal
        v-model:show="modalVisible1"
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
            v-bind:value="queryValue"
            v-on:input="queryValue = $event.target.value"
          ></textarea>
        </card>
      </modal>
    </template>

    <label style="margin: 5px 0px 5px 15px;">ON</label>

    <div class="col-xl-4 col-lg-12 p-0 pl-3 pr-5 h30">
      <base-input
        formClasses="input-group-alternative mb-3"
        type="text"
        v-bind:value="onConditionValue"
        v-on:input="onChangeCondition"
      />
      <div style="position: absolute; top: 0; right: 0; z-index: 2">
        <div
          style="
            width: 10px;
            font-size: 16px;
            margin: 6px 10px 0px 0px;
            float: left;
          "
        >
          <a v-on:click="modalVisible2 = true" class="text-green"
            ><i class="fas fa-expand"></i
          ></a>
        </div>
        <div
          class="h30"
          style="width: 10px; font-size: 11px; float: left; margin-right: 10px"
        >
          <a class="text-default"><i class="fas fa-sync-alt"></i></a>
          <a v-on:click="destroyComp" class="text-danger"
            ><i class="fas fa-trash"></i
          ></a>
        </div>
      </div>
    </div>

    <modal
      v-model:show="modalVisible2"
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
          v-bind:value="onConditionValue"
          v-on:input="onConditionValue = $event.target.value"
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
    database: {
      type: Array,
      required: true,
    },
    value: {
      type: String,
      required: false,
    },
    optAll: {
      type: Boolean,
      required: false,
      defult: true,
    },
    mode: {
      type: Number,
      required: false,
    },
    hasDelete: {
      type: Boolean,
      required: false,
      default: true,
    },
    hasToggle: {
      type: Boolean,
      required: false,
      default: true,
    },
    data: Object,
  },

  data() {
    return {
      typeFrom: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"],
      modalVisible1: false,
      modalVisible2: false,
      databaseValue: this.data.database,
      tableValue: this.data.table,
      columnValue: this.data.column,
      typeValue: this.data.type,
      onConditionValue: this.data.onCondition,
      queryValue: this.data.query,
      id: this.data.id,
      modeValue: this.mode,
    };
  },
  methods: {
    sortTables(a, b) {
      if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
      else return 1;
    },
    sortColumn(a, b) {
      if (a.columnName.toUpperCase() < b.columnName.toUpperCase()) return -1;
      else return 1;
    },
    changeMode() {
      if (this.modeValue == 1) this.modeValue = 0;
      else this.modeValue = 1;
    },

    tablesToFilterMethod() {
      if (typeof this.database != "undefined") {
        let allowed = this.database.filter(
          (i) => i.database == this.databaseValue.database
        );
        if (
          typeof allowed != "undefined" &&
          allowed != null &&
          allowed.length == 1
        ) {
          allowed = allowed[0].tables;
          allowed.sort(this.sortTables);
          return allowed;
        }
      }
      return [];
    },
    onChangeDatabase(value) {
      this.databaseValue = value;
      this.tableValue = value.tables[0];
      this.onChangeTable(this.tableValue);
    },
    onChangeTable() {
      this.emitValue();
    },
    onChangeQuery(value) {
      this.queryValue = value.target.value;
      this.emitValue();
    },
    onChangeCondition(value) {
      this.onConditionValue = value.target.value;
      this.emitValue();
    },
    emitValue() {
      setTimeout(() => {
        let item = {};
        if (this.mode == 0) {
          item = {
            id: this.id,
            type: this.typeValue,
            database: this.databaseValue.database,
            table: this.tableValue.name,
            column: "",
            query: "",
            onCondition: this.onConditionValue,
          };
        } else {
          item = {
            id: this.id,
            type: this.typeValue,
            database: "",
            table: "",
            column: "",
            query: this.queryValue,
            onCondition: this.onConditionValue,
          };
        }
        this.$emit("update", item);
      }, 1);
    },

    destroyComp() {
      this.$emit("destroy", { id: this.id });
    },
  },
  computed: {
    tableToFilter() {
      return this.tablesToFilterMethod();
    },
  },
  mounted() {
    if (typeof this.databaseValue === "string" && this.database != "") {
      this.database.map((i) => {
        if (i.database == this.databaseValue) this.databaseValue = i;
      });
    }
    if (typeof this.tableValue === "string" && this.tableValue != "") {
      this.databaseValue.tables.map((i) => {
        if (i.name == this.tableValue) this.tableValue = i;
      });
    }
  },
};
</script>
<style scoped>
.buttonsStyles {
  width: 10px;
  font-size: 11px;
  z-index: 2;
  right: 2px;
  top: 0;
  position: absolute;
}
</style>

