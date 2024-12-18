export const AttrViewerBase = {
  props: {
    row: { type: Object }, //完整数据行
    type: { type: String }, //const或attr
    attr: { type: Object },
    value: { type: [String, Number, Object, Array] }
  },
  data() {
    return {
    };
  },
  methods: {
  },
  beforeDestroy() {
  },
  watch: {
  }
};
