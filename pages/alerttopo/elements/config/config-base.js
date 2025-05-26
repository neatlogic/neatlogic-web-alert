//import ThemeUtils from '@/views/pages/framework/theme/themeUtils.js';
import { Cell } from '@antv/x6';

export const ConfigBase = {
  components: { TsForm: () => import('@/resources/plugins/TsForm/TsForm') },
  props: {
    mode: { type: String, default: 'widget' }, //编辑模式，widget或graph两种模式，对应widget管理和graph编辑
    cell: { type: Cell },
    form: { type: Array }, //表单定义
    formData: { type: Object } //表单数据,element定义的data部分（用于vue图元）
  },
  data() {
    return {
      data: {}
    };
  },
  created() {
    this.data = this.$utils.deepClone(this.formData || {});
  },
  methods: {},
  beforeDestroy() {},
  watch: {
    data: {
      handler(val) {
        this.$emit('data:update', val);
      },
      deep: true
    }
  }
};
