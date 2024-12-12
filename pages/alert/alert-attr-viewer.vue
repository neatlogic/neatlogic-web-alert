<template>
  <span v-if="attr.type === 'datetime'">{{ value | formatDate }}</span>
  <span v-else>{{ value }}</span>
</template>
<script>
export default {
  name: '',
  components: {},
  props: {
    type: { type: String }, //const或attr
    attr: { type: Object },
    value: { type: [String, Number, Object, Array] }
  },
  data() {
    return {
      initData: null
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
  methods: {},
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
