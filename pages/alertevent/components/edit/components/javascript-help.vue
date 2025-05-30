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
        <dl>
          <dt><pre>
1.约束：转换前数据的变量为<strong>O</strong>，转换后数据的变量为<strong>N</strong>。
       如需打印变量，请使用print("xx")，打印只会在转换测试时启用。</pre></dt>
          <dt>
            <pre>
2.范例：数据：{
  "attrObj": {//自定义属性
    "自定义属性唯一标识": "自定义属性值",
  },
  "isClose": 0,//是否关闭
  "isCloseName": "否",//是否关闭名称
  "teamIdList": [//团队ID列表
    "ce541bdaa1554ef787f604c28f6eee96"
  ],
  "level": 2,//告警等级
  "uniqueKey": "c8c1dfe266205f3b4773d01d4df84ad6",//uniquekey，如果提供新值系统会重新计算散列值
  "source": "ASM",//告警来源
  "title": "测试告警",//告警标题
  "alertTime": 1748501731000,//告警时间
}
       规则：N = O;
            N.level = 3;
            N.title = "测试告警（已修改）"
       结果：{
  "attrObj": {//自定义属性
    "自定义属性唯一标识": "自定义属性值",
  },
  "isClose": 0,//是否关闭
  "isCloseName": "否",//是否关闭名称
  "teamIdList": [//团队ID列表
    "ce541bdaa1554ef787f604c28f6eee96"
  ],
  "level": 3,//告警等级
  "uniqueKey": "c8c1dfe266205f3b4773d01d4df84ad6",//uniquekey，如果提供新值系统会重新计算散列值
  "source": "ASM",//告警来源
  "title": "测试告警（已修改）",//告警标题
  "alertTime": 1748501731000,//告警时间
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
<style lang="less">
</style>
