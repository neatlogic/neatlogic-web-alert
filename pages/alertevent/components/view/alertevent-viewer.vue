<template>
  <div :class="{ 'bg-grey': level % 2 === 0, 'bg-op': level % 2 !== 0 }" class="radius-md">
    <component
      :is="handlers[eventHandlerData.handler.toLowerCase() + '_eventhandler']"
      v-if="handlers[eventHandlerData.handler.toLowerCase() + '_eventhandler']"
      ref="pluginConfig"
      :event="{ name: eventHandlerData.event, label: eventHandlerData.eventName }"
      :handler="eventHandlerData"
      :level="level"
      :mode="mode"
    ></component>
    <div v-else>插件{{ eventHandlerData.handler }}不存在</div>
  </div>
</template>
<script>
import handlers from '@/commercial-module/alert/pages/alertevent/components/view/index.js';
export default {
  name: '',
  components: {
    ...handlers
  },
  props: {
    mode: { type: String, default: 'edit' }, //edit|audit
    level: { type: Number, default: 0 },
    eventHandlerData: { type: Object }
  },
  data() {
    return {
      handlers: handlers
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {},
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
