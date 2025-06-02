<template>
  <div
    class="radius-md cc"
    :class="{
      'padding-md': isChild,
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <TsFormItem label="脚本" labelPosition="left">
      <div class="text-grey">帮助：编写javascript修改告警数据，仅支持ES5语法，</div>
      <Tabs :animated="false" value="script" name="main">
        <TabPane tab="main" label="脚本" name="script"><TsCodemirror v-model="configLocal.script" codeMode="javascript"></TsCodemirror></TabPane>
        <TabPane tab="main" label="范例" name="example">
          <dl>
            <dt>
              1.约束：转换前数据的变量为
              <strong>O</strong>
              ，转换后数据的变量为
              <strong>N</strong>
              。 如需打印变量，请使用print("xx")，打印只会在转换测试时启用。
            </dt>
            <dt>
              2.范例
              <div>数据：</div>
              <TsCodemirror :value="oldValue" codeMode="javascript" :isReadOnly="true"></TsCodemirror>
              <div>脚本：</div>
              <TsCodemirror :value="javascript" :isReadOnly="true" codeMode="javascript"></TsCodemirror>
              <div>结果：</div>
              <TsCodemirror :value="newValue" :isReadOnly="true" codeMode="javascript"></TsCodemirror>
            </dt>
          </dl>
        </TabPane>
        <TabPane tab="main" label="测试" name="test">
          <Tabs
            v-model="currentTestTab"
            type="card"
            :animated="false"
            name="testpanel"
          >
            <TabPane tab="testpanel" label="告警数据" name="testdata">
              <div class="padding-md bg-op"><TsCodemirror v-model="testContent" codeMode="json"></TsCodemirror></div>
            </TabPane>
            <TabPane
              v-if="result"
              tab="testpanel"
              label="转换结果"
              name="testresult"
            >
              <div class="padding-md bg-op">
                <JsonViewer v-if="resultObj" copyable :value="resultObj"></JsonViewer>
                <TsCodemirror
                  v-else
                  :value="result"
                  codeMode="json"
                  :isReadOnly="true"
                ></TsCodemirror>
              </div>
            </TabPane>
          </Tabs>
          <div v-if="errorList.length > 0" class="mt-md">
            <Alert type="error">
              异常
              <div slot="desc">
                <ul>
                  <li v-for="(error, index) in errorList" :key="index">{{ error }}</li>
                </ul>
              </div>
            </Alert>
          </div>
          <div class="mt-md"><Button type="primary" ghost @click="runTest()">测试</Button></div>
        </TabPane>
      </Tabs>
    </TsFormItem>
    <!--<TsFormItem label="唯一键" labelPosition="left">
      <TsFormSwitch
        v-model="configLocal.needRebuildUniqueKey"
        :trueValue="1"
        :falseValue="0"
        :showStatus="true"
        trueText="重新计算唯一键"
        falseText="重新计算唯一键"
      ></TsFormSwitch>
      <div v-if="configLocal.needRebuildUniqueKey">
        <div class="text-grey">帮助：唯一键值相同的告警将会收敛成一条告警</div>
        <TsFormCheckbox
          :dataList="attrList"
          valueName="name"
          textName="label"
          :value="configLocal.uniqueAttrList.map(d => d.name)"
          @on-change="selectAttr"
        ></TsFormCheckbox>
        <Divider v-if="configLocal.uniqueAttrList && configLocal.uniqueAttrList.length > 0" orientation="left">已选属性</Divider>
        <Tag v-for="(attr, index) in configLocal.uniqueAttrList" :key="index">{{ attr.label }}</Tag>
      </div>
    </TsFormItem>
    <TsFormItem v-if="configLocal.needRebuildUniqueKey && configLocal.uniqueAttrList && configLocal.uniqueAttrList.length > 0" label="告警特征" labelPosition="left">
      <TsFormSelect
        v-model="configLocal.ruleList"
        url="/api/rest/alert/rule/list"
        :params="{ isActive: 1 }"
        transfer
        border="border"
        valueName="id"
        textName="label"
        multiple
      ></TsFormSelect>
      <div class="text-grey">
        帮助：告警特征会对属性值进行正则替换，最后再组合成唯一键。可以选择多个告警特征，每个告警特征只会作用于其关联属性，如果其关联属性不属于唯一键成员，此告警特征将不生效。
      </div>
    </TsFormItem>-->
  </div>
</template>
<script>
import { AlertEventBase } from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-base.js';

export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    //TsFormSwitch: () => import('@/resources/plugins/TsForm/TsFormSwitch'),
    //TsFormCheckbox: () => import('@/resources/plugins/TsForm/TsFormCheckbox'),
    //TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect'),
    TsCodemirror: () => import('@/resources/plugins/TsCodemirror/TsCodemirror'),
    JsonViewer: () => import('vue-json-viewer')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {
      oldValue: '{\n"attrObj": {//自定义属性\n' + '"自定义属性唯一标识": "自定义属性值",\n' + '},\n' + '"userAccountList:[\n' + '"admin"//处理人账号列表列表\n' + '],\n' + '"teamNameList": [\n' + '"中间件组"//处理团队名称列表\n' + '],\n' + '"level": 2,//告警等级\n' + '"source": "ASM",//告警来源\n' + '"title": "测试告警",//告警标题\n' + '"alertTime": 1748501731000,//告警时间\n' + '}',
      javascript: 'N = O;\n' + 'N.level = 3;\n' + 'N.title = "测试告警（已修改）"',
      newValue: '{\n"attrObj": {//自定义属性\n' + '"自定义属性唯一标识": "自定义属性值",\n' + '},\n' + '"userAccountList:[\n' + '"admin"//处理人账号列表列表\n' + '],\n' + '"teamNameList": [\n' + '"中间件组"//处理团队名称列表\n' + '],\n' + '"level": 3,//告警等级\n' + '"source": "ASM",//告警来源\n' + '"title": "测试告警（已修改）",//告警标题\n' + '"alertTime": 1748501731000,//告警时间\n' + '}',
      errorList: [],
      testContent: '',
      result: '',
      attrList: [],
      currentTestTab: 'testdata'
    };
  },
  beforeCreate() {},
  created() {
    this.listAlertAttrList();
    if (this.$utils.isEmpty(this.configLocal)) {
      this.configLocal = { script: '', needRebuildUniqueKey: 0, uniqueAttrList: [], ruleList: []};
    } else {
      if (!this.configLocal.uniqueAttrList) {
        this.configLocal.uniqueAttrList = [];
      }
      if (!this.configLocal.ruleList) {
        this.configLocal.ruleList = [];
      }
    }
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    listAlertAttrList() {
      this.$api.alert.alert.listAlertAttrList().then(res => {
        this.attrList = res.Return;
      });
    },
    selectAttr(val, options) {
      this.$set(this.configLocal, 'uniqueAttrList', options);
    },
    runTest() {
      this.errorList = [];
      this.result = '';
      if (!this.configLocal.script) {
        this.errorList.push('请输入脚本');
      }
      let alertData;
      if (!this.testContent) {
        this.errorList.push('请输入告警数据');
      } else {
        try {
          alertData = JSON.parse(this.testContent);
        } catch (e) {
          this.errorList.push('告警数据不是合法的json数据');
        }
      }
      if (this.errorList.length === 0) {
        this.$api.alert.alertevent
          .testScriptPlugin({
            script: this.configLocal.script,
            alertData: alertData
          })
          .then(res => {
            this.result = res.Return.result;
            if (res.Return.error) {
              this.errorList.push(res.Return.error);
            }
            if (this.result) {
              this.currentTestTab = 'testresult';
            } else {
              this.currentTestTab = 'testdata';
            }
          });
      }
    }
  },
  filter: {},
  computed: {
    resultObj() {
      try {
        return JSON.parse(this.result);
      } catch (e) {
        return null;
      }
    }
  },
  watch: {}
};
</script>
<style lang="less"></style>
