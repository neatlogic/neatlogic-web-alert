<template>
  <div class="freemarker-help">
    <div style="white-space:normal">
      {{ $t('term.alert.freemarkerrootprefix') }}
      <strong>DATA</strong>
      {{ $t('term.alert.freemarkerrootmiddle') }}
      <strong>${DATA.keyword}</strong>
      {{ $t('term.alert.freemarkerrootsuffix') }}
    </div>
    <dl>
      <dt>{{ $t('term.alert.freemarkervaluetitle') }}</dt>
      <dd>
        (1)
        <strong>${var}</strong>
        {{ $t('term.alert.freemarkergetstring') }}
        <strong>${strVar}</strong>
        {{ $t('term.alert.freemarkergetint') }}
        <strong>${intVar}</strong>
        {{ $t('term.alert.freemarkergetboolean') }}
        <strong>${booVar?string("yes","no")}</strong>
      </dd>
      <dd>
        (2)
        <strong>${var!}</strong>
        {{ $t('term.alert.freemarkerdefaultvalue') }}
        <strong>${var!'Default Value'}</strong>
      </dd>
      <dd>
        (3)
        <strong>${Object.field}</strong>
        {{ $t('term.alert.freemarkerobjectvalue') }}
        <strong>${User.name}</strong>
      </dd>
      <dd>
        (4)
        <strong>&lt;#assign num = 100 /&gt;</strong>
        {{ $t('term.alert.freemarkerassign') }}
      </dd>
      <dd>
        (5)
        {{ $t('term.alert.freemarkerlistvalue') }}
        <strong>&lt;#list list as item&gt;</strong>
        <strong>${item}</strong>
        {{ $t('term.alert.freemarkervalue') }}
        <strong>&lt;/#list&gt;</strong>
      </dd>
      <dd>
        (6)
        {{ $t('term.alert.freemarkermapvalue') }}
        <strong>&lt;#list map?keys as key&gt;</strong>
        <strong>${key}:${map[key]}</strong>
        <strong>&lt;/#list&gt;</strong>
      </dd>
      <dt>{{ $t('term.alert.freemarkerconditiontitle') }}</dt>
      <dd>
        (1)
        <strong>if</strong>
        {{ $t('term.alert.freemarkersinglecondition') }}
        <strong>&lt;#if condition&gt;</strong>
        {{ $t('term.alert.freemarkeroutput') }}
        <strong>&lt;/#if&gt;</strong>
      </dd>
      <dd>
        (2)
        <strong>if - else</strong>
        {{ $t('term.alert.freemarkerifelse') }}
        <strong>&lt;#if condition&gt;</strong>
        {{ $t('term.alert.freemarkeroutput') }}
        <strong>&lt;#else&gt;</strong>
        {{ $t('term.alert.freemarkeroutput') }}
        <strong>&lt;/#if&gt;</strong>
      </dd>
      <dd>
        (3)
        <strong>if - elseif - else</strong>
        {{ $t('term.alert.freemarkermulticondition') }}
        <strong>&lt;#if age &gt; 18&gt;</strong>
        {{ $t('term.alert.freemarkeryouth') }}
        <strong>&lt;#elseif age == 18&gt;</strong>
        {{ $t('term.alert.freemarkeradult') }}
        <strong>&lt;#else&gt;</strong>
        {{ $t('term.alert.freemarkerteenager') }}
        <strong>&lt;/#if&gt;</strong>
      </dd>
      <dd>
        (4)
        <strong>switch</strong>
        {{ $t('term.alert.freemarkerswitch') }}
        <strong>&lt;#switch var&gt;</strong>
        <strong>&lt;#case condition1&gt;</strong>
        {{ $t('term.alert.freemarkeroutput') }}
        <strong>&lt;#break&gt;</strong>
        <strong>&lt;#case condition2&gt;</strong>
        {{ $t('term.alert.freemarkeroutput') }}
        <strong>&lt;#break&gt;</strong>
        <strong>&lt;#default&gt;</strong>
        {{ $t('term.alert.freemarkeroutput') }}
        <strong>&lt;/#switch&gt;</strong>
      </dd>
    </dl>
  </div>
</template>
<script>
export default {
  name: '',
  components: {},
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
.freemarker-help {
  dd {
    word-break: break-all;
    white-space: normal;
    padding-left: 10px;
  }
}
</style>
