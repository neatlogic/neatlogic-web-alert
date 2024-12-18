<template>
  <div>
    <component
      :is="handlers[eventHandlerData.handler.toLowerCase() + '_eventhandler']"
      v-if="handlers[eventHandlerData.handler.toLowerCase() + '_eventhandler']"
      ref="pluginConfig"
      :config="eventHandlerData.config"
    ></component>
    <div v-else>插件{{ eventHandlerData.handler }}不存在</div>
  </div>
</template>
<script>
import * as handlers from '@/commercial-module/alert/pages/alertevent/components/view/index.js';
export default {
  name: '',
  components: {
    ...handlers
  },
  props: {
    eventHandlerData: { type: Object }
  },
  data() {
    return {
      handlers: handlers
    };
  },
  beforeCreate() {},
  async created() {},
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
