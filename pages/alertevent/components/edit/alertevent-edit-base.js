export const AlertEventBase = {
  components: {},
  props: {
    level: { type: Number, default: 1 },
    handler: { type: Object },
    event: { type: Object },
    alertType: { type: Object },
    isChild: { type: Boolean, default: false }
  },
  data() {
    return {
      configLocal: this.$utils.deepClone(this.handler.config) || {}
    };
  },
  methods: {
    getConfig() {
      return this.configLocal;
    },
    async valid() {
      //需要子类覆盖
      return true;
    }
  },
  beforeDestroy() {},
  watch: {},
  computed: {
    config() {
      return this.handler.config;
    }
  }
};
