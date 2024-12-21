export const AttrViewerBase = {
  props: {
    row: { type: Object }, //完整数据行
    type: { type: String }, //const或attr
    attr: { type: Object },
    mode: { type: String, default: 'list' }, //detail|list
    view: { type: Object }, //视图
    value: { type: [String, Number, Object, Array] }
  },
  data() {
    return {};
  },
  methods: {},
  beforeDestroy() {},
  watch: {}
};
