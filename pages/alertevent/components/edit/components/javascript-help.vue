<template>
  <div>
    <Poptip
      trigger="hover"
      width="700"
      :transfer="true"
      :title="$t('term.framework.grammarhint')"
    >
      <a href="javascript:void(0)">{{ $t('term.framework.grammarhint') }}</a>
      <div slot="content">
        <dl class="javascript-help">
          <dt>
            <div>1. {{ $t('term.alert.javascriptconstraint') }}<strong>O</strong>{{ $t('term.alert.javascriptconstraintmiddle') }}<strong>N</strong>{{ $t('term.alert.javascriptconstraintsuffix') }}</div>
            <div class="help-indent">{{ $t('term.alert.javascriptprinttip') }}<strong>print("xx")</strong>{{ $t('term.alert.javascriptprinttipsuffix') }}</div>
          </dt>
          <dt>
            <pre>2. {{ $t('term.alert.javascriptexample') }}{{ $t('term.alert.javascriptdata') }}{
  "attrObj": {
    "customAttrKey": "customAttrValue"
  },
  "isClose": 0,
  "isCloseName": "No",
  "teamIdList": [
    "ce541bdaa1554ef787f604c28f6eee96"
  ],
  "level": 2,
  "uniqueKey": "c8c1dfe266205f3b4773d01d4df84ad6",
  "source": "ASM",
  "title": "Test Alarm",
  "alertTime": 1748501731000
}
   {{ $t('term.alert.javascriptrule') }}N = O;
        N.level = 3;
        N.title = "Test Alarm (Modified)";
   {{ $t('term.alert.javascriptresult') }}{
  "attrObj": {
    "customAttrKey": "customAttrValue"
  },
  "isClose": 0,
  "isCloseName": "No",
  "teamIdList": [
    "ce541bdaa1554ef787f604c28f6eee96"
  ],
  "level": 3,
  "uniqueKey": "c8c1dfe266205f3b4773d01d4df84ad6",
  "source": "ASM",
  "title": "Test Alarm (Modified)",
  "alertTime": 1748501731000
}</pre>
          </dt>
        </dl>
      </div>
    </Poptip>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
  },
  props: {},
  data() {
    return {};
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
<style lang="less" scoped>
.javascript-help {
  .help-indent {
    padding-left: 12px;
  }
  pre {
    white-space: pre-wrap;
  }
}
</style>
