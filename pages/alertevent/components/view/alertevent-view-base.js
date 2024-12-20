export const AlertEventBase = {
  components: {},
  props: {
    level: { type: Number, default: 1 },
    config: { type: Object },
    event: { type: Object },
    isChild: { type: Boolean, default: false }
  },
  data() {
    return {
      configLocal: this.$utils.deepClone(this.config) || {}
    };
  },
  methods: {
    getConfig() {
      //需要子类覆盖
      return this.configLocal;
    },
    valid() {
      //需要子类覆盖
      return true;
    }
  },
  beforeDestroy() {},
  watch: {}
};
