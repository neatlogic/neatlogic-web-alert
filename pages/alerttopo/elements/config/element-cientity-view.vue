<template>
  <div>
    <Button size="small" type="primary" @click="toCiEntityDetail(cell.getData()['ciId'], cell.getData()['ciEntityId'])">{{ $t('term.cmdb.viewcientity') }}</Button>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
  },
  props: {
    cell: { type: Object }
  },
  data() {
    return {
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
    toCiEntityDetail(ciId, ciEntityId) {
      window.open(HOME + '/cmdb.html#/ci/' + ciId + '/cientity-view/' + ciEntityId, '_blank');
    }
  },
  filter: {},
  computed: {
  },
  watch: {}
};
</script>
<style lang="less"></style>
