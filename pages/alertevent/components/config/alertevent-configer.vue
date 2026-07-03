<template>
  <div>
    <component
      :is="handlers[pluginData.name.toLowerCase() + '_eventhandler']"
      v-if="pluginData && pluginData.name && handlers[pluginData.name.toLowerCase() + '_eventhandler']"
      ref="pluginConfig"
      :config="pluginData.config"
      :pluginData="pluginData"
      :readonly="readonly"
    ></component>
    <div v-else-if="!readonly">{{ $t('term.alert.noeventconfig') }}</div>
  </div>
</template>
<script>
import handlers from '@/community-module/alert/pages/alertevent/components/config/index.js';
export default {
  name: '',
  components: {
    ...handlers
  },
  props: {
    readonly: { type: Boolean, default: false },
    pluginData: { type: Object }
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
  methods: {
    getConfig() {
      if (this.$refs.pluginConfig) {
        return this.$refs.pluginConfig.getConfig();
      }
    },
    valid() {
      if (this.$refs.pluginConfig && this.$refs.pluginConfig.valid) {
        return this.$refs.pluginConfig.valid();
      }
      return true;
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
