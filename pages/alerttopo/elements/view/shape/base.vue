<script>
export default {
  name: '',
  components: {},
  inject: ['getGraph', 'getNode'], //这是由antV注入进来的
  props: {
    importData: { type: Object } //自动填充时通过这个参数送进数据
  },
  data() {
    return {
      data: {},
      mode: null,
      readonly: false,
      graphData: {}
    };
  },
  beforeCreate() {},
  created() {
    if (!this.importData) {
      const node = this.getNode();
      this.data = node.getData();
      node.on('change:data', ({ current }) => {
        this.data = current;
      });
    } else {
      this.data = this.importData;
    }
    const diagramData = {};
    this.getGraph().trigger('custom:getDiagramData', diagramData);
    this.mode = diagramData.mode;
    this.readonly = diagramData.readonly;
    this.graphData = diagramData.graphData;
  },
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
  computed: {
    isAutoFill() {
      return !!this.importData;
    }
  },
  watch: {}
};
</script>
<style lang="less"></style>
