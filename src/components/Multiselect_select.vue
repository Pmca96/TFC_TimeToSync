<template>
  <template v-if="modeValue == 0">
    <div
      class="col-xl-2 col-lg-4 p-0 pl-3 pr-1 h30"
      v-if="type == 0 || type == 2"
    >
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

    <div v-if="type != 0" class="col-xl-2 col-lg-4 p-0 pl-2 pr-3 h30">
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
    </div>

    <div v-if="type == 0" class="col-xl-2 col-lg-4 p-0 pl-2 pr-3 h30">
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
    <div
      class="col-xl-2 col-lg-4 p-0 pl-2 pr-3 h30"
      v-if="type == 1 || type == 2"
    >
      <multiselect
        v-model="columnValue"
        :options="columnToFilter"
        :searchable="false"
        :close-on-select="true"
        :show-labels="false"
        :allow-empty="false"
        label="columnName"
        @select="emitValue"
        track-by="columnName"
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
    <div
      class="col-xl-6 col-lg-12 p-0 pl-3 pr-5 h30"
      v-if="type == 0 || type == 2"
    >
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
          <a v-on:click="modalVisible = true" class="text-green"
            ><i class="fas fa-expand"></i
          ></a>
        </div>
        <div
          class="h30"
          style="width: 10px; font-size: 11px; float: left; margin-right: 10px"
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
          v-model="queryValue"
          lang="sql"
          theme="sqlserver"
          @init="init"
        ></CodeEditor>
      </card>
    </modal>
  </template>
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
    database: {
      type: Array,
      required: true,
    },
    type: {
      type: Number,
      required: true,
      // type 0 : from condition (database, table)
      // type 1 : select condition (table,column)
      // type 2 : select condition with database (database,table,column)
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
      modalVisible: false,
      databaseValue: this.data.database,
      tableValue: this.data.table,
      columnValue: this.data.column,
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
    onChangeTable(value) {
      if (this.type != 0) this.columnValue = value.columns[0];

      this.emitValue();
    },
    onChangeQuery(value) {
      this.queryValue = value.target.value;
      this.emitValue();
    },
    emitValue() {
      setTimeout(() => {
        let item = {};
        if (this.modeValue == 0) {
          if (this.type == 0)
            item = {
              id: this.id,
              database: this.databaseValue.database,
              table: this.tableValue.name,
              column: "",
              query: "",
            };
          else if (this.type == 1) {
            item = {
              id: this.id,
              database: "",
              table: this.tableValue.name,
              column: this.columnValue.columnName,
              query: "",
            };
          } else if (this.type == 2) {
            item = {
              id: this.id,
              database: this.databaseValue.database,
              table: this.tableValue.name,
              column: this.columnValue.columnName,
              query: "",
            };
          }
        } else {
          item = {
            id: this.id,
            database: "",
            table: "",
            column: "",
            query: this.queryValue,
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
    columnToFilter() {
      let tables = this.tablesToFilterMethod();
      let columnsData = [];
      tables.map((i) => {
        if (i.name == this.tableValue.name) {
          if (this.optAll) columnsData = [{ columnName: "*" }];
          i.columns.sort(this.sortColumn);
          columnsData = columnsData.concat(i.columns);
          this.columnValue = columnsData[0];
        }
      });
      return columnsData;
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

    if (typeof this.columnValue === "string" && this.columnValue != "") {
      this.tableValue.columns.map((i) => {
        if (i.columnName == this.columnValue) this.columnValue = i;
      });
    }
  },
  setup() {
    return {
      init: function () {
        require("brace/theme/sqlserver");
        require("brace/mode/sql");
      },
    };
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
