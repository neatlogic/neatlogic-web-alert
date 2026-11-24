<template>
  <div>
    <div v-if="attr && attr.kind === 'const' && handlers[attr.name]">
      <component
        :is="handlers[attr.name]"
        :row="row"
        :value="value"
        :mode="mode"
        :view="view"
        :attr="attr"
        @toggleChildren="toggleChildren"
        @refresh="refresh"
      ></component>
    </div>
    <div v-else-if="attr && attr.kind === 'attr' && handlers['attr_' + attr.type]">
      <component
        :is="handlers['attr_' + attr.type]"
        :row="row"
        :mode="mode"
        :view="view"
        :value="extendedAttrValue"
        :attr="attr"
        @toggleChildren="toggleChildren"
        @refresh="refresh"
      ></component>
    </div>
    <div v-else-if="value != null && value !== undefined && value !== ''">{{ value }}</div>
    <div v-else class="text-grey">-</div>
  </div>
</template>
<script>
import * as handlers from '@/community-module/alert/pages/alert/alert-attr/index.js';
export default {
  name: '',
  components: {
    ...handlers
  },
  props: {
    row: { type: Object }, //完整数据行
    attr: { type: Object },
    view: { type: Object }, //视图
    mode: { type: String }, //detail|list
    // 字符串优先，避免 Vue 将空字符串属性值自动转换为 true。
    value: { type: [String, Boolean, Number, Object, Array] }
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
    toggleChildren() {
      this.$emit('toggleChildren', ...arguments);
    },
    refresh() {
      this.$emit('refresh');
    }
  },
  filter: {},
  computed: {
    // 操作记录用外层数组存储前后值。扩展属性渲染器需要属性值本身。
    extendedAttrValue() {
      if (this.mode !== 'audit' || !Array.isArray(this.value)) {
        return this.value;
      }
      const value = this.value.length > 1 ? this.value : this.value[0];
      if (this.attr.type === 'boolean') {
        if (value === 'true') return true;
        if (value === 'false') return false;
      }
      // 旧脚本审计把枚举和数字数组写成一个 JSON 字符串。
      if (['enum', 'number'].includes(this.attr.type) && typeof value === 'string' && value.trim().startsWith('[')) {
        try {
          const values = JSON.parse(value);
          if (Array.isArray(values)) return values;
        } catch (e) {
          return value;
        }
      }
      return value;
    }
  },
  watch: {}
};
</script>
<style lang="less"></style>
