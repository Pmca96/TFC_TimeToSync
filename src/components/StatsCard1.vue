<template>
  <card class="card-stats" :show-footer-line="true">
    <div class="row">
      <div class="col">
        <slot name="head">
          <h5 class="card-title text-uppercase text-muted mb-0" v-if="title">
            {{ title }}
          </h5>
        </slot>
      </div>
    </div>

    <div class="mt-2 mb-0 text-sm">
      <slot name="body"> </slot>
    </div>
  </card>
</template>
<script>
import Card from "./Card.vue";

export default {
  name: "stats-card1",
  components: {
    Card,
  },
  props: {
    type: {
      type: String,
      default: "primary",
    },
    icon: String,
    title: String,
    subTitle: String,
    iconClasses: [String, Array],
  },
};
</script>
<style></style>
