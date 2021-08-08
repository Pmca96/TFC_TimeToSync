import Badge from "../components/Badge";
import BaseAlert from "../components/BaseAlert";
import BaseButton from "../components/BaseButton";
import BaseCheckbox from "../components/BaseCheckbox";
import BaseDropdown from "../components/BaseDropdown";
import BaseHeader from "../components/BaseHeader";
import BaseInput from "../components/BaseInput";
import BaseNav from "../components/BaseNav";
import BasePagination from "../components/BasePagination";
import BaseProgress from "../components/BaseProgress";
import BaseSwitch from "../components/BaseSwitch";
import BaseRadio from "../components/BaseRadio";
import BaseTable from "../components/BaseTable";
import Card from "../components/Card";
import Modal from "../components/Modal";
import StatsCard from "../components/StatsCard";
import StatsCard1 from "../components/StatsCard1";
import TabPane from "../components/Tabs/TabPane";
import Tabs from "../components/Tabs/Tabs";
import Multiselect from "vue-multiselect";
import Multiselect_select from "../components/Multiselect_select";
import Multiselect_select_order from "../components/Multiselect_select_order";
import Multiselect_select_from from "../components/Multiselect_select_from";
import Task_FieldsList from "../components/Task_FieldsList";

import { ElTooltip, ElPopover } from "element-plus";
const GlobalComponents = {
  install(app) {
    app.component("badge", Badge);
    app.component("base-alert", BaseAlert);
    app.component("base-button", BaseButton);
    app.component("base-checkbox", BaseCheckbox);
    app.component("base-dropdown", BaseDropdown);
    app.component("base-header", BaseHeader);
    app.component("base-input", BaseInput);
    app.component("base-nav", BaseNav);
    app.component("base-pagination", BasePagination);
    app.component("base-progress", BaseProgress);
    app.component("base-switch", BaseSwitch);
    app.component("base-radio", BaseRadio);
    app.component("base-table", BaseTable);
    app.component("card", Card);
    app.component("modal", Modal);
    app.component("stats-card", StatsCard);
    app.component("stats-card1", StatsCard1);
    app.component("tab-pane", TabPane);
    app.component("tabs", Tabs);
    app.component("multiselect", Multiselect);
    app.component("multiselect-select", Multiselect_select);
    app.component("multiselect-select-order", Multiselect_select_order);
    app.component("multiselect-select-from", Multiselect_select_from);
    app.component("task-FieldsList", Task_FieldsList);
    app.use(ElTooltip);
    app.use(ElPopover);
  },
};

export default GlobalComponents;
