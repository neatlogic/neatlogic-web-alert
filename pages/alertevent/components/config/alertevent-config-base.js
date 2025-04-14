export const AlertEventBase = {
  components: {},
  props: {
    config: { type: Object },
    readonly: { type: Boolean, default: false }
  },
  data() {
    return {
      configLocal: {}
    };
  },
  methods: {
    getConfig() {
      return this.configLocal;
    },
    valid() {
      //子组件需要覆盖
      return true;
    }
  },
  beforeDestroy() {},
  watch: {
    config: {
      handler(val) {
        if (val) {
          this.configLocal = this.$utils.deepClone(val);
        } else {
          this.configLocal = {};
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {}
};
