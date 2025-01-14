export const AlertEventBase = {
  components: {},
  props: {
    mode: { type: String, default: 'edit' }, //edit|audit
    level: { type: Number, default: 1 },
    handler: { type: Object },
    event: { type: Object },
    isChild: { type: Boolean, default: false }
  },
  data() {
    return {
      configLocal: this.$utils.deepClone(this.handler.config || this.handler.result) || {}
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
  watch: {},
  computed: {
    config() {
      //如果是审计记录配置在result中
      return this.handler.config || this.handler.result;
    }
  }
};
