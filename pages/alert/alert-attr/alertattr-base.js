export const AttrViewerBase = {
  props: {
    row: { type: Object }, //完整数据行
    attr: { type: Object },
    mode: { type: String, default: 'list' }, //detail|list|audit
    view: { type: Object }, //视图
    // 字符串优先，避免 Vue 将空字符串属性值自动转换为 true。
    value: { type: [String, Boolean, Number, Object, Array] }
  },
  data() {
    return {};
  },
  methods: {},
  beforeDestroy() {},
  watch: {}
};
