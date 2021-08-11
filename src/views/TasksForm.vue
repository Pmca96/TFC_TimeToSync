<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-5">
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col mb-6">
          <div class="card shadow bg-secondary">
            <div class="table-responsive">
              <base-alert
                style="display: none"
                type="danger"
                class="p-2 m-3 alertModalDanger"
              ></base-alert>
              <base-alert
                style="display: none"
                type="success"
                class="p-2 m-3 alertModalSuccess"
              ></base-alert>
              <form role="form" class="m-3 smallTextForm">
                <div class="form-row">
                  <div class="form-group col-md-4 mb-0">
                    <label>Synchronism</label>
                    <base-input
                      formClasses="input-group-alternative mb-3"
                      type="text"
                      disabled="true"
                      v-bind:value="synchronism.name"
                    ></base-input>
                  </div>

                  <div class="form-group col-md-4 mb-0">
                    <label>From Computer</label>
                    <base-input
                      formClasses="input-group-alternative mb-3"
                      type="text"
                      disabled="true"
                      v-bind:value="
                        synchronism.computerFrom +
                        ' (' +
                        synchronism.computerFromConnection +
                        ')'
                      "
                    ></base-input>
                  </div>
                  <div class="form-group col-md-4 mb-0">
                    <label>To Computer</label>
                    <base-input
                      formClasses="input-group-alternative mb-3"
                      type="text"
                      disabled="true"
                      v-bind:value="
                        synchronism.computerTo +
                        ' (' +
                        synchronism.computerToConnection +
                        ')'
                      "
                    ></base-input>
                  </div>

                  <div class="form-group col-md-4 mb-0">
                    <label>Task</label>
                    <base-input
                      formClasses="input-group-alternative mb-3"
                      type="text"
                      v-bind:value="task.name"
                      v-on:input="task.name = $event.target.value"
                    ></base-input>
                  </div>

                  <div class="form-group col-md-4 mb-0">
                    <label>To Database</label>
                    <multiselect
                      v-model="task.databaseTo"
                      :options="databaseTo"
                      :searchable="false"
                      :close-on-select="true"
                      :disabled="this.formType == 1 ? true : false"
                      :show-labels="false"
                      :allow-empty="false"
                      label="database"
                      track-by="_id"
                    ></multiselect>
                  </div>

                  <div class="form-group col-md-4 mb-0">
                    <label>To Table</label>
                    <multiselect
                      v-model="task.tableTo"
                      :options="tableToFilter"
                      :searchable="false"
                      :close-on-select="true"
                      :disabled="this.formType == 1 ? true : false"
                      :show-labels="false"
                      :allow-empty="false"
                      label="name"
                      track-by="name"
                    ></multiselect>
                  </div>

                  <div class="form-group col-md-4 mb-0">
                    <label>Dependencies</label>
                    <multiselect
                      v-model="task.dependencies"
                      :options="
                        typeof synchronism.tasks == 'undefined'
                          ? []
                          : synchronism.tasks
                      "
                      :searchable="false"
                      :close-on-select="true"
                      :show-labels="false"
                      :allow-empty="false"
                      :custom-label="dependenciesLabel"
                      :multiple="true"
                      label="name"
                      track-by="_id"
                    ></multiselect>
                  </div>
                  <div class="col-md-4 p-0 pl-2 pr-3 mt-2 text-center">
                    <label style="float: left">Use only query</label>
                    <base-checkbox
                      class="ml-2"
                      style="float: left"
                      :checked="task.useOnlyQuery"
                      @update="task.useOnlyQuery = $event"
                    />
                  </div>
                  <div class="col-md-4 p-0 pl-2 pr-3 mt-2 text-center">
                    <label style="float: left">Inactive</label>
                    <base-checkbox
                      class="ml-2"
                      style="float: left"
                      :checked="task.inactive"
                      @update="task.inactive = $event"
                    />
                  </div>
                </div>
                <div class="tabs col-md-11" style="margin-left: 4%">
                  <tabs fill class="flex-column flex-md-row">
                    <tab-pane title="Select">
                      <div class="tabs-panel row">
                        <template
                          v-for="(item, index) in task.select"
                          :key="item.id"
                        >
                          <multiselect-select
                            v-if="index == 0"
                            :database="filterDatabaseData"
                            @update="updateDataSelect"
                            :hasDelete="false"
                            :type="2"
                            :mode="item.query == '' ? 0 : 1"
                            :data="item"
                          />
                          <multiselect-select
                            v-if="index != 0"
                            :database="filterDatabaseData"
                            @update="updateDataSelect"
                            @destroy="destroyId"
                            :data="item"
                            :type="2"
                            :mode="item.query == '' ? 0 : 1"
                          />
                        </template>
                      </div>
                    </tab-pane>
                    <tab-pane title="From">
                      <div class="tabs-panel row">
                        <template
                          v-for="(item, index) in task.from"
                          :key="item.id"
                        >
                          <multiselect-select
                            v-if="index == 0"
                            :database="databaseFrom"
                            @update="updateDataFrom"
                            :hasDelete="false"
                            :data="item"
                            :type="0"
                            :mode="item.query == '' ? 0 : 1"
                          />
                          <multiselect-select-from
                            v-if="index > 0"
                            :database="databaseFrom"
                            @update="updateDataFrom"
                            @destroy="destroyId"
                            :data="item"
                            :mode="item.query == '' ? 0 : 1"
                          />
                        </template>
                      </div>
                    </tab-pane>
                    <tab-pane title="Where">
                      <div class="row tabs-panel">
                        <template
                          v-for="(item, index) in task.where"
                          :key="item.id"
                        >
                          <multiselect-select
                            v-if="index == 0"
                            :database="filterDatabaseData"
                            @update="updateDataWhere"
                            :hasDelete="false"
                            :data="item"
                            :type="2"
                            :mode="1"
                            :hasToggle="false"
                          />
                          <multiselect-select
                            v-if="index != 0"
                            :database="filterDatabaseData"
                            @update="updateDataWhere"
                            @destroy="destroyId"
                            :data="item"
                            :type="2"
                            :mode="1"
                            :hasToggle="false"
                          />
                        </template>
                      </div>
                    </tab-pane>
                    <tab-pane title="Group By"
                      ><div class="row tabs-panel">
                        <template
                          v-for="(item, index) in task.groupBy"
                          :key="item.id"
                        >
                          <multiselect-select
                            v-if="index == 0"
                            :database="filterDatabaseData"
                            @update="updateDataGroupBy"
                            :hasDelete="false"
                            :type="2"
                            :mode="item.query == '' ? 0 : 1"
                            :data="item"
                          />
                          <multiselect-select
                            v-if="index != 0"
                            :database="filterDatabaseData"
                            @update="updateDataGroupBy"
                            @destroy="destroyId"
                            :data="item"
                            :type="2"
                            :mode="item.query == '' ? 0 : 1"
                          />
                        </template>
                      </div>
                    </tab-pane>
                    <tab-pane title="Having">
                      <div class="row tabs-panel">
                        <template
                          v-for="(item, index) in task.having"
                          :key="item.id"
                        >
                          <multiselect-select
                            v-if="index == 0"
                            :database="filterDatabaseData"
                            @update="updateDataHaving"
                            :hasDelete="false"
                            :data="item"
                            :type="2"
                            :mode="1"
                            :hasToggle="false"
                          />
                          <multiselect-select
                            v-if="index != 0"
                            :database="filterDatabaseData"
                            @update="updateDataHaving"
                            @destroy="destroyId"
                            :data="item"
                            :type="2"
                            :mode="1"
                            :hasToggle="false"
                          />
                        </template>
                      </div>
                    </tab-pane>
                    <tab-pane title="Order By">
                      <div class="row tabs-panel">
                        <template
                          v-for="(item, index) in task.orderBy"
                          :key="item.id"
                        >
                          <multiselect-select-order
                            v-if="index == 0"
                            :database="filterDatabaseData"
                            @update="updateDataOrderBy"
                            :hasDelete="false"
                            :data="item"
                            :mode="item.query == '' ? 0 : 1"
                          />
                          <multiselect-select-order
                            v-if="index != 0"
                            :database="filterDatabaseData"
                            @update="updateDataOrderBy"
                            @destroy="destroyId"
                            :data="item"
                            :mode="item.query == '' ? 0 : 1"
                          />
                        </template>
                      </div>
                    </tab-pane>
                    <tab-pane title="Query">
                      <div class="row tabs-panel">
                        <textarea
                          v-if="task.useOnlyQuery == false"
                          class="form-control"
                          rows="3"
                          style="height: 100%; width: 100%; resize: none"
                          readonly
                          v-bind:value="taskQuery"
                        ></textarea>

                        <textarea
                          v-if="task.useOnlyQuery == true"
                          class="form-control"
                          rows="3"
                          style="height: 100%; width: 100%; resize: none"
                          v-bind:value="task.query"
                          v-on:input="task.query = $event.target.value"
                        ></textarea>
                      </div>
                    </tab-pane>
                  </tabs>
                  <base-button
                    type="primary"
                    class="my-4 far fa-info"
                    @click="modal.m1 = !modal.m1"
                    style="position: absolute; right: -35px; top: -5px"
                    v-bind:iconOnly="true"
                  />
                </div>

                <h3 class="text-center mt-4">Mapping</h3>
                <div class="col-md-11 row" style="margin-left: 4%; float: left">
                  <div class="col-xl-2 col-md-3 tableMode">
                    <a class="nav-link active"><span>Unique</span></a>
                  </div>
                  <div class="col-xl-6 col-md-5 tableMode">
                    <a class="nav-link active"><span>From</span></a>
                  </div>
                  <div class="col-xl-4 col-md-4 tableMode">
                    <a class="nav-link active"><span>To</span></a>
                  </div>
                </div>
                <div class="tabs col-md-11" style="margin-left: 4%">
                  <div class="flex-column flex-md-row">
                    <div class="tabs-panel">
                      <template
                        v-for="(item, index) in task.columnFrom"
                        :key="item.id"
                      >
                        <task-FieldsList
                          v-if="index == 0"
                          :columnsFrom="columnsFrom"
                          :columnsTo="columnsTo"
                          :data="[item, task.columnTo[index]]"
                          :hasDelete="false"
                          @update="updateRow"
                        />
                        <task-FieldsList
                          v-if="index != 0"
                          :columnsFrom="columnsFrom"
                          :columnsTo="columnsTo"
                          :data="[item, task.columnTo[index]]"
                          @update="updateRow"
                          @destroy="destroyId"
                        />
                      </template>
                    </div>
                  </div>
                  <base-button
                    type="primary"
                    class="my-4 far fa-info"
                    @click="modal.m2 = !modal.m2"
                    style="position: absolute; right: -35px; top: -25px"
                    v-bind:iconOnly="true"
                  />
                </div>
                <base-button
                  v-if="this.formType == 0"
                  type="success"
                  class="my-4"
                  @click="createTask()"
                  style="float: right"
                  ><i class="fas fa-plus"></i> Create</base-button
                >
                <base-button
                  v-if="this.formType == 1"
                  type="success"
                  class="my-4 ml-3"
                  @click="saveTask()"
                  style="float: right"
                  ><i class="far fa-save"></i> Save</base-button
                >
                <base-button
                  v-if="this.formType == 1"
                  type="danger"
                  class="my-4"
                  style="float: right"
                  ><i class="fas fa-trash"></i> Delete</base-button
                >
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <modal
    v-model:show="modal.m1"
    body-classes="p-0"
    modal-classes="modal-dialog-centered modal-lg"
  >
    <card
      type="secondary"
      shadow
      header-classes="bg-white pb-2"
      body-classes="px-lg-4 py-lg-2 mb-4"
      class="border-0"
    >
      <h3 class="mt-2">Quey Documentation</h3>
      <div class="tabs col-md-12">
        <tabs fill class="flex-column flex-md-row">
          <tab-pane title="Select">
            <div class="tabs-panel row">
              <div class="col-12 text-sm mt-2">How does it work</div>

              <div class="col-12 text-sm mt-2 font-weight-bold">Select :</div>
              <div class="col-12 text-sm mt-1 ml-3">
                - You can choose options based on your option selection in the
                <b>FROM</b> tab.
              </div>

              <div class="col-12 text-sm mt-2 font-weight-bold">Input :</div>
              <div class="col-12 text-sm mt-1 ml-3">
                - You can place your part of the query.
              </div>
              <div class="col-12 text-sm mt-1 ml-3">
                - Each part can only contain a column.
              </div>
              <div class="col-12 text-sm mt-1 ml-3">
                - Can be used for subquery returning a single value.
              </div>
              <div class="col-12 text-sm mt-1 ml-3">
                - Can be used for operations such as <b>CONCAT</b>, <b>SUM</b>,
                <b>IF</b>, <b>CASE</b> or any other one.
              </div>
            </div>
          </tab-pane>
          <tab-pane title="From">
            <div class="tabs-panel row">
              <div class="col-12 text-sm mt-2">How does it work</div>

              <div class="col-12 text-sm mt-2 font-weight-bold">From :</div>
              <div class="col-12 text-sm mt-1 ml-3">
                - Can select a table based on the information available in the
                selects.
              </div>
              <div class="col-12 text-sm mt-1 ml-3">
                - Or you can make a subquery to return the information you
                pretend.
              </div>

              <div class="col-12 text-sm mt-2 font-weight-bold">Join :</div>
              <div class="col-12 text-sm mt-1 ml-3">
                - Can choose bettwen <b>INNER JOIN</b>,<b>LEFT JOIN</b>,<b
                  >RIGHT JOIN</b
                >,<b>FULL JOIN</b>.
              </div>
              <div class="col-12 text-sm mt-1 ml-3">
                - Select a table base on the information available in the
                selects.
              </div>
              <div class="col-12 text-sm mt-1 ml-3">
                - Or you can make a subquery to return the information you
                pretend.
              </div>
              <div class="col-12 text-sm mt-1 ml-3">
                - The condition must always be handled by the user, you must
                follow the structure <b>DATABASE.TABLE.COLUMN</b> unless you
                have a alias.
              </div>
              <div class="col-12 text-sm mt-1 ml-3">
                - In the condition since is query you may use any type of
                validator.
              </div>

              <div class="col-12 text-sm mt-3 font-weight-bold">Variables:</div>
              <div class="col-12 text-sm mt-1">
                <b>**lastUpdatedData**</b> - Last date the scripted runned
                successfully, default is 1980-01-01 (YYYY-mm-dd)
              </div>
              <div class="col-12 text-sm mt-1">
                <b>**lastUpdatedTime**</b> - Last time the scripted runned
                successfully, default is 1980-01-01 00:00:00 (YYYY-mm-dd
                HH:ii:ss)
              </div>
            </div>
          </tab-pane>
          <tab-pane title="Where">
            <div class="row tabs-panel">
              <div class="col-12 text-sm mt-2">How does it work</div>

              <div class="col-12 text-sm mt-2 font-weight-bold">Where :</div>
              <div class="col-12 text-sm mt-1 ml-3">
                - The condition must always be handled by the user, you must
                follow the structure <b>DATABASE.TABLE.COLUMN</b> unless you
                have a alias.
              </div>
              <div class="col-12 text-sm mt-1 ml-3">
                - Every piece of condition is connected with operator AND
              </div>
              <div class="col-12 text-sm mt-1 ml-3">
                - You can make a subquery to return the information you pretend.
              </div>

              <div class="col-12 text-sm mt-2 font-weight-bold">Example :</div>
              <div class="col-12 text-sm mt-1 ml-3">
                - " db1.shop.customer = '456'" " db1.customer.location
                ='England'"
              </div>
              <div class="col-12 text-sm mt-1 ml-3">=</div>
              <div class="col-12 text-sm mt-1 ml-3">
                - "WHERE db1.shop.customer = '456' and db1.customer.location
                ='England' "
              </div>

              <div class="col-12 text-sm mt-3 font-weight-bold">Variables:</div>
              <div class="col-12 text-sm mt-1">
                <b>**lastUpdatedData**</b> - Last date the scripted runned
                successfully, default is 1980-01-01 (YYYY-mm-dd)
              </div>
              <div class="col-12 text-sm mt-1">
                <b>**lastUpdatedTime**</b> - Last time the scripted runned
                successfully, default is 1980-01-01 00:00:00 (YYYY-mm-dd
                HH:ii:ss)
              </div>
            </div>
          </tab-pane>
          <tab-pane title="Group By"
            ><div class="row tabs-panel">
              <div class="col-12 text-sm mt-2">How does it work</div>

              <div class="col-12 text-sm mt-2 font-weight-bold">Group By :</div>
              <div class="col-12 text-sm mt-1 ml-3">
                - You can choose options based on your option selection in the
                <b>FROM</b> tab.
              </div>

              <div class="col-12 text-sm mt-2 font-weight-bold">Input :</div>
              <div class="col-12 text-sm mt-1 ml-3">
                - You can place your part of the query.
              </div>
              <div class="col-12 text-sm mt-1 ml-3">
                - Each part should only contain a column.
              </div>
              <div class="col-12 text-sm mt-1 ml-3">
                - Can be used for subquery returning a single value.
              </div>
              <div class="col-12 text-sm mt-1 ml-3">
                - Can be used for operations such as <b>CONCAT</b>, <b>SUM</b>,
                <b>IF</b>, <b>CASE</b> or any other one.
              </div>
            </div>
          </tab-pane>
          <tab-pane title="Having">
            <div class="row tabs-panel">
              <div class="col-12 text-sm mt-2">How does it work</div>

              <div class="col-12 text-sm mt-2 font-weight-bold">
                Having (Input):
              </div>
              <div class="col-12 text-sm mt-1 ml-3">
                - You can place your part of the query.
              </div>
              <div class="col-12 text-sm mt-1 ml-3">
                - Can be used for operations such as <b>CONCAT</b>, <b>SUM</b>,
                <b>IF</b>, <b>CASE</b> or any other one.
              </div>
            </div>
          </tab-pane>
          <tab-pane title="Order By">
            <div class="row tabs-panel">
              <div class="col-12 text-sm mt-2">How does it work</div>

              <div class="col-12 text-sm mt-2 font-weight-bold">Order By :</div>
              <div class="col-12 text-sm mt-1 ml-3">
                - You can choose options based on your option selection in the
                <b>FROM</b> tab.
              </div>

              <div class="col-12 text-sm mt-2 font-weight-bold">Input :</div>
              <div class="col-12 text-sm mt-1 ml-3">
                - You can place your part of the query.
              </div>
              <div class="col-12 text-sm mt-1 ml-3">
                - Each part should only contain a column.
              </div>
              <div class="col-12 text-sm mt-1 ml-3">
                - Can be used for subquery returning a single value.
              </div>
              <div class="col-12 text-sm mt-1 ml-3">
                - Can be used for operations such as <b>CONCAT</b>, <b>SUM</b>,
                <b>IF</b>, <b>CASE</b> or any other one.
              </div>
            </div>
          </tab-pane>
          <tab-pane title="Query">
            <div class="row tabs-panel">
              <div class="col-12 text-sm mt-2">How does it work</div>

              <div class="col-12 text-sm mt-1 ml-3">
                You can preview the final query generated by the other tabs.
              </div>

              <div class="col-12 text-sm mt-1 ml-3">
                Further functionality is under development.
              </div>
            </div>
          </tab-pane>
        </tabs>
      </div>
    </card>
  </modal>

  <modal
    v-model:show="modal.m2"
    body-classes="p-0"
    modal-classes="modal-dialog-centered modal-lg"
  >
    <card
      type="secondary"
      shadow
      header-classes="bg-white pb-2"
      body-classes="px-lg-4 py-lg-2 mb-4"
      class="border-0"
    >
      <h3 class="mt-2">Transform Documentation</h3>
      <div class="tabs col-md-12 mt-4">
        <div class="tabs-panel row">
          <div class="col-12 text-sm mt-2">How does it work</div>
          <div class="col-12 text-sm mt-1 ml-3">
            - You must always return any type of value null or anything defined;
          </div>
          <div class="col-12 text-sm mt-1 ml-3">
            - There will be a variable named "value" that will be the value of
            each field;
          </div>
          <div class="col-12 text-sm mt-1 ml-3">
            - You can declare variables, change values and manipulate values;
          </div>
          <div class="col-12 text-sm mt-1 ml-3">
            - By default return always it's value, so you don't have to define
            anything.
          </div>

          <div class="col-12 text-sm mt-2 font-weight-bold">Example :</div>
          <div class="col-12 text-sm mt-1 ml-3">
            - "return value.replace('ccity', 'city');"
          </div>
          <div class="col-12 text-sm mt-1 ml-3">
            - "let x = 2; <br />&nbsp;&nbsp;&nbsp;return value*x;"
          </div>
        </div>
      </div>
    </card>
  </modal>
</template>

<script>
import mix from "../assets/js/mixins";
export default {
  mixins: [mix],
  data() {
    return {
      modal: {
        m1: false,
        m2: false,
      },
      formType: null,
      synchronism: {},
      databaseFrom: [],
      databaseTo: [],
      task: {
        _id: this.uuidv4(),
      },
      taskDefault: {
        _id: this.uuidv4(),
        name: "",
        description: "",
        useOnlyQuery: false,
        query: "",
        inactive: false,
        dependencies: [],
        select: [
          { id: this.uuidv4(), database: "", table: "", column: "", query: "" },
        ],
        from: [
          {
            id: this.uuidv4(),
            type: "",
            database: "",
            table: "",
            column: "",
            query: "",
            onCondition: "",
          },
        ],
        where: [
          {
            id: this.uuidv4(),
            database: "",
            table: "",
            column: "",
            query: "",
          },
        ],
        groupBy: [
          { id: this.uuidv4(), database: "", table: "", column: "", query: "" },
        ],
        having: [
          { id: this.uuidv4(), database: "", table: "", column: "", query: "" },
        ],
        orderBy: [
          {
            id: this.uuidv4(),
            database: "",
            table: "",
            column: "",
            query: "",
            order: "ASC",
          },
        ],
        columnFrom: [
          { id: this.uuidv4(), name: "", transform: "", unique: false },
        ],
        columnTo: [""],
      },
    };
  },
  methods: {
    connectionReciever(data) {
      if (data.error == false)
        window.api.send("tasksForm-index", this.$route.params);
    },
    prepareIndex(data) {
      if (data.synchronism.length == 1) {
        this.computers = data.computers;
        this.connections = data.connections;
        this.databaseFrom = data.databaseFrom;
        this.databaseTo = data.databaseTo;

        this.computers.map(
          (i, k) =>
            (this.computers[k]._id = Buffer.from(i._id.id).toString("hex"))
        );
        this.connections.map(
          (i, k) =>
            (this.connections[k]._id = Buffer.from(i._id.id).toString("hex"))
        );

        this.computers.map((j) => {
          if (j._id == data.synchronism[0].computerFrom)
            data.synchronism[0].computerFrom = j.hostname;
          if (j._id == data.synchronism[0].computerTo)
            data.synchronism[0].computerTo = j.hostname;
        });
        this.connections.map((j) => {
          if (j._id == data.synchronism[0].computerFromConnection)
            data.synchronism[0].computerFromConnection = j.name;
          if (j._id == data.synchronism[0].computerToConnection)
            data.synchronism[0].computerToConnection = j.name;
        });

        this.synchronism = data.synchronism[0];
        document.getElementById("syncName").innerHTML = this.synchronism.name;
        this.synchronism._id = Buffer.from(this.synchronism._id.id).toString(
          "hex"
        );

        this.databaseFrom.map(
          (i, k) =>
            (this.databaseFrom[k]._id = Buffer.from(i._id.id).toString("hex"))
        );

        this.databaseTo.map(
          (i, k) =>
            (this.databaseTo[k]._id = Buffer.from(i._id.id).toString("hex"))
        );

        if (data.task != null) {
          this.task = data.task;
          this.databaseTo.map((i) => {
            if (i._id == this.task.databaseTo) {
              this.task.databaseTo = i;
              i.tables.map((j) => {
                if (j.name == this.task.tableTo) this.task.tableTo = j;
              });
            }
          });
          if (this.task.dependencies.length > 0) {
            let dependenciesToReplace = [];
            this.synchronism.tasks.map((i) => {
              if (this.task.dependencies.includes(i._id))
                dependenciesToReplace.push(i);
            });
            this.task.dependencies = dependenciesToReplace;
          }
        }
      }
    },
    sortTables(a, b) {
      if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
      else return 1;
    },
    updateDataSelect(data) {
      let allDataDefined = true;
      this.task.select.map((i, k) => {
        if (i.id == data.id) {
          i = data;
          this.task.select[k] = data;
        }
        if (i.database == "" && i.query == "") allDataDefined = false;
      });
      if (allDataDefined) {
        this.task.select.push({
          id: this.uuidv4(),
          database: "",
          table: "",
          column: "",
          query: "",
        });
      }
    },

    updateDataFrom(data) {
      let allDataDefined = true;
      this.task.from.map((i, k) => {
        if (i.id == data.id) {
          i = data;
          this.task.from[k] = data;
        }
        if (i.database == "" && i.query == "") allDataDefined = false;
      });
      if (allDataDefined) {
        this.task.from.push({
          id: this.uuidv4(),
          type: "INNER JOIN",
          database: "",
          table: "",
          column: "",
          query: "",
          onCondition: "",
        });
      }
    },

    updateDataWhere(data) {
      let allDataDefined = true;
      this.task.where.map((i, k) => {
        if (i.id == data.id) {
          i = data;
          this.task.where[k] = data;
        }
        if (i.database == "" && i.query == "") allDataDefined = false;
      });
      if (allDataDefined) {
        this.task.where.push({
          id: this.uuidv4(),
          database: "",
          table: "",
          column: "",
          query: "",
        });
      }
    },

    updateDataGroupBy(data) {
      let allDataDefined = true;
      this.task.groupBy.map((i, k) => {
        if (i.id == data.id) {
          i = data;
          this.task.groupBy[k] = data;
        }
        if (i.database == "" && i.query == "") allDataDefined = false;
      });
      if (allDataDefined) {
        this.task.groupBy.push({
          id: this.uuidv4(),
          database: "",
          table: "",
          column: "",
          query: "",
        });
      }
    },

    updateDataHaving(data) {
      let allDataDefined = true;
      this.task.having.map((i, k) => {
        if (i.id == data.id) {
          i = data;
          this.task.having[k] = data;
        }
        if (i.database == "" && i.query == "") allDataDefined = false;
      });
      if (allDataDefined) {
        this.task.having.push({
          id: this.uuidv4(),
          database: "",
          table: "",
          column: "",
          query: "",
        });
      }
    },

    updateDataOrderBy(data) {
      let allDataDefined = true;
      this.task.orderBy.map((i, k) => {
        if (i.id == data.id) {
          i = data;
          this.task.orderBy[k] = data;
        }
        if (i.database == "" && i.query == "") allDataDefined = false;
      });
      if (allDataDefined) {
        this.task.orderBy.push({
          id: this.uuidv4(),
          database: "",
          table: "",
          column: "",
          query: "",
          order: "ASC",
        });
      }
    },

    destroyId(data) {
      let indexToRemove = null;
      //SELECT REMOVE
      this.task.select.map((i, k) => {
        if (i.id == data.id) indexToRemove = k;
      });
      if (indexToRemove != null) {
        this.task.select.splice(indexToRemove, 1);
        return;
      }
      //FROM REMOVE
      this.task.from.map((i, k) => {
        if (i.id == data.id) indexToRemove = k;
      });
      if (indexToRemove != null) {
        this.task.from.splice(indexToRemove, 1);
        return;
      }
      //WHERE REMOVE
      this.task.where.map((i, k) => {
        if (i.id == data.id) indexToRemove = k;
      });
      if (indexToRemove != null) {
        this.task.where.splice(indexToRemove, 1);
        return;
      }

      //GROUPBY REMOVE
      this.task.groupBy.map((i, k) => {
        if (i.id == data.id) indexToRemove = k;
      });
      if (indexToRemove != null) {
        this.task.groupBy.splice(indexToRemove, 1);
        return;
      }

      //HAVING REMOVE
      this.task.having.map((i, k) => {
        if (i.id == data.id) indexToRemove = k;
      });
      if (indexToRemove != null) {
        this.task.having.splice(indexToRemove, 1);
        return;
      }

      //ORDERBY REMOVE
      this.task.orderBy.map((i, k) => {
        if (i.id == data.id) indexToRemove = k;
      });
      if (indexToRemove != null) {
        this.task.orderBy.splice(indexToRemove, 1);
        return;
      }

      //ROW REMOVE
      this.task.columnFrom.map((i, k) => {
        if (i.id == data.id) indexToRemove = k;
      });
      if (indexToRemove != null) {
        this.task.columnFrom.splice(indexToRemove, 1);
        this.task.columnTo.splice(indexToRemove, 1);
        return;
      }
    },

    updateRow(data) {
      let allDataDefined = true;
      this.task.columnFrom.map((i, k) => {
        if (i.id == data.id) {
          i.name = data.columnFrom;
          i.transform = data.transform;
          i.unique = data.unique;
          this.task.columnFrom[k].name = data.columnFrom;
          this.task.columnFrom[k].transform = data.transform;
          this.task.columnFrom[k].unique = data.unique;
          this.task.columnTo[k] = data.columnTo;
        }

        if (
          (typeof i.name == "undefined" || i.name == "") &&
          (typeof this.task.columnTo[k] == "undefined" ||
            this.task.columnTo[k] == "")
        )
          allDataDefined = false;
      });
      if (allDataDefined) {
        this.task.columnTo.push("");
        this.task.columnFrom.push({
          id: this.uuidv4(),
          name: "",
          transform: "",
          unique: false,
        });
      }
    },
    createTask() {
      document.getElementsByClassName("alertModalSuccess")[0].style.display =
        "none";
      document.getElementsByClassName("alertModalDanger")[0].style.display =
        "none";
      let required = this.checkRequired();
      if (required.erro == true) {
        document.getElementsByClassName("alertModalDanger")[0].innerHTML =
          required.msg;
        document.getElementsByClassName("alertModalDanger")[0].style.display =
          "block";
        return;
      }
      window.api.send("tasksForm-create", [
        JSON.parse(JSON.stringify(this.synchronism)),
        JSON.parse(JSON.stringify(this.task)),
      ]);
    },
    createTaskResponse(data) {
      document.getElementsByClassName("alertModalSuccess")[0].style.display =
        "none";
      document.getElementsByClassName("alertModalDanger")[0].style.display =
        "none";
      if (data == 1) {
        this.task.select = [];
        this.task.from = [];
        this.task.where = [];
        this.task.groupBy = [];
        this.task.having = [];
        this.task.orderBy = [];
        this.task.columnTo = [];
        this.task.columnFrom = [];
        setTimeout(() => {
          this.task = JSON.parse(JSON.stringify(this.taskDefault));
          document.getElementsByClassName("alertModalSuccess")[0].innerHTML =
            "Task created with success.";
          document.getElementsByClassName(
            "alertModalSuccess"
          )[0].style.display = "block";
        }, 1);
      } else {
        document.getElementsByClassName("alertModalDanger")[0].innerHTML =
          "Task not created with success, please try again later";
        document.getElementsByClassName("alertModalDanger")[0].style.display =
          "block";
      }
    },
    saveTask() {
      document.getElementsByClassName("alertModalSuccess")[0].style.display =
        "none";
      document.getElementsByClassName("alertModalDanger")[0].style.display =
        "none";
      let required = this.checkRequired();
      if (required.erro == true) {
        document.getElementsByClassName("alertModalDanger")[0].innerHTML =
          required.msg;
        document.getElementsByClassName("alertModalDanger")[0].style.display =
          "block";
        return;
      }
      window.api.send("tasksForm-save", [
        JSON.parse(JSON.stringify(this.synchronism)),
        JSON.parse(JSON.stringify(this.task)),
      ]);
    },
    saveTaskResponse(data) {
      if (data == 1) {
        document.getElementsByClassName("alertModalSuccess")[0].style.display =
          "none";
        document.getElementsByClassName("alertModalDanger")[0].style.display =
          "none";
        document.getElementsByClassName("alertModalSuccess")[0].innerHTML =
          "Task updated with success.";
        document.getElementsByClassName("alertModalSuccess")[0].style.display =
          "block";
      } else {
        document.getElementsByClassName("alertModalDanger")[0].innerHTML =
          "Task not updated with success, please try again later";
        document.getElementsByClassName("alertModalDanger")[0].style.display =
          "block";
      }
    },
    checkRequired() {
      let response = { erro: false, msg: "" };
      if (typeof this.task.name == "undefined" || this.task.name == "") {
        response.erro = true;
        response.msg = "Task name must be defined";
        return response;
      }
      if (
        typeof this.task.databaseTo == "undefined" ||
        this.task.databaseTo == ""
      ) {
        response.erro = true;
        response.msg = "To Database must be defined";
        return response;
      }
      if (typeof this.task.tableTo == "undefined" || this.task.tableTo == "") {
        response.erro = true;
        response.msg = "To Table must be defined";
        return response;
      }
      this.task.columnFrom.map((i, k) => {
        if (
          (typeof i.name == "undefined" || i.name == "") &&
          this.task.columnTo[k] != "" &&
          typeof this.task.columnTo[k] != "undefined"
        ) {
          response.erro = true;
          response.msg = "Data transfer from and to must be both defined";
        }
        if (
          typeof i.name != "undefined" &&
          i.name != "" &&
          (this.task.columnTo[k] == "" ||
            typeof this.task.columnTo[k] == "undefined")
        ) {
          response.erro = true;
          response.msg = "Data transfer from and to must be both defined";
        }
        if (
          k == 0 &&
          (typeof i.name == "undefined" || i.name == "") &&
          (this.task.columnTo[k] == "" ||
            typeof this.task.columnTo[k] == "undefined")
        ) {
          response.erro = true;
          response.msg = "No data to transfer from this task";
        }
      });

      return response;
    },
    dependenciesLabel(data) {
      return data.taskNumber + " - " + data.name;
    },
  },
  computed: {
    tableToFilter() {
      if (typeof this.task.databaseTo != "undefined") {
        let allowed = this.databaseTo.filter((i) =>
          i._id.includes(this.task.databaseTo._id)
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
    tableFromFilter() {
      if (typeof this.task.databaseTo != "undefined") {
        let allowed = this.databaseTo.filter((i) =>
          i._id.includes(this.task.databaseTo._id)
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
    filterDatabaseData() {
      let databases = [];
      let tables = [];
      let labels = {};
      this.task.from.filter((i) => {
        if (i.query != "") return;

        //check databases
        this.databaseFrom.map((j) => {
          if (i.database == j.database) {
            let exists = false;
            databases.map((k) => {
              if (k.database == j.database) exists = true;
            });
            if (exists == false) {
              databases.push(JSON.parse(JSON.stringify(j)));
              labels[j.database] = databases.length - 1;
            }

            //check tables
            j.tables.map((k) => {
              if (i.table == k.name) {
                let exists = false;
                tables.map((l) => {
                  if (l.table == k.name) exists = true;
                });
                if (exists == false)
                  try {
                    tables[labels[j.database]].push(k);
                  } catch (exception) {
                    tables.push([k]);
                  }
              }
            });
          }
        });
      });

      databases.map((i, k) => (databases[k].tables = tables[k]));
      return databases;
    },
    columnsFrom() {
      let data = [];
      this.task.select.map((i) => {
        if (i.query != "") {
          if (i.query.toLowerCase().includes(" as ")) {
            let querySplitted = i.query.split(" as ");
            if (querySplitted.length == 0)
              querySplitted = i.query.split(" AS ");

            if (querySplitted.length != 0)
              data.push(querySplitted[querySplitted.length - 1]);
          }
        } else if (typeof i.database != "undefined" && i.database != "") {
          data.push(i.database + "." + i.table + "." + i.column);
        }
      });
      data.sort();
      return data;
    },
    columnsTo() {
      let data = [];
      if (
        typeof this.task != "undefined" &&
        typeof this.task.tableTo != "undefined"
      ) {
        this.task.tableTo.columns.map((i) => {
          data.push(i.columnName);
        });
      }
      data.sort();
      return data;
    },
    taskQuery() {
      let dataQuery = "";
      this.task.select.map((i) => {
        if (typeof i.query != "undefined" && i.query != "") {
          if (dataQuery == "") dataQuery = "SELECT " + i.query;
          else dataQuery += " , " + i.query;
        }

        if (typeof i.database != "undefined" && i.database != "") {
          if (dataQuery == "")
            dataQuery = "SELECT " + i.database + "." + i.table + "." + i.column;
          else dataQuery += " , " + i.database + "." + i.table + "." + i.column;
        }
      });
      if (dataQuery == "") return dataQuery;

      this.task.from.map((i, k) => {
        if (typeof i.query != "undefined" && i.query != "") {
          if (k == 0) dataQuery += " \nFROM " + i.query;
          else dataQuery += " \n\t" + i.query;
        }
        if (typeof i.onCondition == "undefined") i.onCondition = "";

        if (typeof i.database != "undefined" && i.database != "") {
          if (k == 0) dataQuery += " \nFROM " + i.database + "." + i.table;
          else
            dataQuery +=
              " \n\t" +
              i.type +
              " " +
              i.database +
              "." +
              i.table +
              " ON " +
              i.onCondition;
        }
      });

      this.task.where.map((i, k) => {
        if (typeof i.query != "undefined" && i.query != "") {
          if (k == 0) dataQuery += " \n\tWHERE " + i.query;
          else dataQuery += " AND " + i.query;
        }
      });

      this.task.groupBy.map((i, k) => {
        if (typeof i.query != "undefined" && i.query != "") {
          if (k == 0) dataQuery += " \n\tGROUP BY " + i.query;
          else dataQuery += " , " + i.query;
        }
        if (typeof i.database != "undefined" && i.database != "") {
          if (k == 0)
            dataQuery +=
              " \n\tGROUP BY " + i.database + "." + i.table + "." + i.column;
          else dataQuery += " , " + i.database + "." + i.table + "." + i.column;
        }
      });

      this.task.having.map((i, k) => {
        if (typeof i.query != "undefined" && i.query != "") {
          if (k == 0) dataQuery += " \n\tHAVING " + i.query;
          else dataQuery += " AND " + i.query;
        }
      });

      this.task.orderBy.map((i, k) => {
        if (typeof i.query != "undefined" && i.query != "") {
          if (k == 0) dataQuery += " \n\tORDER BY " + i.query;
          else dataQuery += " , " + i.query;
        }
        if (typeof i.database != "undefined" && i.database != "") {
          if (k == 0)
            dataQuery +=
              " \n\tORDER BY " +
              i.database +
              "." +
              i.table +
              "." +
              i.column +
              " " +
              i.order;
          else
            dataQuery +=
              " , " +
              i.database +
              "." +
              i.table +
              "." +
              i.column +
              " " +
              i.order;
        }
      });

      return dataQuery;
    },
  },

  created() {
    window.api.receive("tasksForm-connection", this.connectionReciever);
    window.api.receive("tasksForm-index", this.prepareIndex);
    window.api.receive("tasksForm-create", this.createTaskResponse);
    window.api.receive("tasksForm-save", this.saveTaskResponse);
  },
  mounted() {
    this.task = JSON.parse(JSON.stringify(this.taskDefault));
    let text = document.getElementById("tagToRemove").innerHTML;
    text = text.replace("----", "<span id='syncName'></span>");
    document.getElementById("tagToRemove").innerHTML = text;
    if (typeof this.$route.params.idTask != "undefined") this.formType = 1;
    else this.formType = 0;
    window.api.send("tasksForm-connection");
  },
  unmounted() {
    window.api.send("tasksForm-connection-close");
    window.api.removeAllListeners("tasksForm-connection");
    window.api.removeAllListeners("tasksForm-index");
    window.api.removeAllListeners("tasksForm-create");
    window.api.removeAllListeners("tasksForm-save");
  },
};
</script>
