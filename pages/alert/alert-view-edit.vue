<template>
  <TsDialog v-bind="dialogConfig" @on-close="close()">
    <template v-slot>
      <TsForm ref="form" v-model="alertViewData" :item-list="formConfig">
        <template v-slot:attrList>
          <div>
            <Tag
              v-for="(attr, index) in unSelectAttrList"
              :key="index"
              class="cursor"
              @click.native="selectAttr(attr)"
            >
              <span>{{ attr.label }}</span>
            </Tag>
            <Divider v-if="alertViewData.config.attrList && alertViewData.config.attrList.length > 0" orientation="left">已选属性</Divider>
            <draggable
              v-if="alertViewData.config.attrList && alertViewData.config.attrList.length > 0"
              handle=".tsfont-option-vertical"
              :list="alertViewData.config.attrList"
              :move="onMove"
            >
              <Tag
                v-for="(attr, index) in alertViewData.config.attrList"
                :key="index"
                :closable="attr !== 'const_title'"
                @on-close="remoteAttr(attr)"
              >
                <span style="cursor: move" :class="{ 'tsfont-option-vertical': attr !== 'const_title' }"></span>
                <span>{{ getAttrByName(attr).label }}</span>
              </Tag>
            </draggable>
          </div>
        </template>
        <template v-slot:condition>
          <ConditionGroup v-if="isReady" v-model="alertViewData.config.rule" :attrList="conditionAttrList"></ConditionGroup>
        </template>
      </TsForm>
    </template>
    <template v-slot:footer>
      <Button @click="close()">{{ $t('page.cancel') }}</Button>
      <Button type="primary" @click="saveAlertView()">{{ $t('page.confirm') }}</Button>
    </template>
  </TsDialog>
</template>
<script>
import draggable from 'vuedraggable';
export default {
  name: '',
  components: {
    draggable,
    TsForm: () => import('@/resources/plugins/TsForm/TsForm'),
    ConditionGroup: () => import('@/resources/components/Condition/condition-group.vue')
  },
  props: {
    id: { type: Number }
  },
  data() {
    return {
      isReady: false,
      alertViewData: { isActive: 1, config: { attrList: ['const_title'], rule: {} } }, //默认必须选择标题，而且不能调整位置
      attrList: [],
      conditionAttrList: [],
      dialogConfig: {
        title: this.id
          ? this.$t('dialog.title.edittarget', {
            target: this.$t('term.cmdb.view')
          })
          : this.$t('dialog.title.addtarget', { target: this.$t('term.cmdb.view') }),
        type: 'modal',
        isShow: true,
        width: 'medium'
      },
      formConfig: {
        name: {
          type: 'text',
          label: '唯一标识',
          maxlength: 50,
          readonly: !!this.id,
          validateList: ['required', 'unique_ident'],
          desc: '保存后不能修改'
        },
        label: {
          type: 'text',
          label: '名称',
          maxlength: 50,
          validateList: ['required']
        },
        isActive: {
          type: 'switch',
          label: '是否激活',
          trueValue: 1,
          falseValue: 0
        },
        catalogId: {
          type: 'select',
          label: '目录',
          dynamicUrl: '/api/rest/alert/catalog/search',
          params: { isActive: 1, needView: 0 },
          rootName: 'tbodyList',
          valueName: 'id',
          textName: 'name',
          validateList: ['required']
        },
        authList: {
          type: 'userselect',
          label: '授权',
          groupList: ['common', 'user', 'role', 'team'],
          transfer: true
        },
        attrList: {
          type: 'slot',
          label: '显示属性'
        },
        condition: {
          type: 'slot',
          label: '条件'
        }
      }
    };
  },
  beforeCreate() {},
  async created() {
    await this.getViewById();
    await this.listAlertAttrList();
    await this.listAlertConditionAttrList();
    this.isReady = true;
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
    onMove(e, originalEvent) {
      if (e.relatedContext.index === 0) {
        return false;
      }
      return true;
    },
    getAttrByName(name) {
      return this.attrList.find(item => item.name === name) || {};
    },
    async getViewById() {
      if (this.id) {
        await this.$api.alert.alert.getAlertViewById(this.id).then(res => {
          this.alertViewData = res.Return;
        });
      }
    },
    isAttrSelected(attr) {
      return this.alertViewData.config.attrList.some(item => item === attr.name);
    },
    selectAttr(attr) {
      this.alertViewData.config.attrList.push(attr.name);
    },
    remoteAttr(attrName) {
      const index = this.alertViewData.config.attrList.findIndex(d => d === attrName);
      if (index > -1) {
        this.alertViewData.config.attrList.splice(index, 1);
      }
    },
    async listAlertConditionAttrList() {
      await this.$api.alert.alert.listAlertAttrList({ isCondition: 1 }).then(res => {
        this.conditionAttrList = res.Return;
      });
    },
    async listAlertAttrList() {
      await this.$api.alert.alert.listAlertAttrList({ isColumn: 1 }).then(res => {
        this.attrList = res.Return;
        //删除已经不存在的属性
        if (this.alertViewData.config.attrList && this.alertViewData.config.attrList.length > 0) {
          for (let i = this.alertViewData.config.attrList.length - 1; i >= 0; i--) {
            const att = this.alertViewData.config.attrList[i];
            if (!this.attrList.find(d => d.name === att)) {
              this.$delete(this.alertViewData.config.attrList, i);
            }
          }
        }
      });
    },
    close(needRefresh) {
      this.$emit('close', needRefresh);
    },
    saveAlertView() {
      const form = this.$refs.form;
      if (form && form.valid()) {
        this.$api.alert.alert.saveAlertView(this.alertViewData).then(res => {
          if (res.Status === 'OK') {
            this.$Message.success(this.$t('message.updatesuccess'));
            this.close(true);
          }
        });
      }
    }
  },
  filter: {},
  computed: {
    unSelectAttrList() {
      return this.attrList.filter(item => !this.isAttrSelected(item));
    }
  },
  watch: {}
};
</script>
<style lang="less"></style>
