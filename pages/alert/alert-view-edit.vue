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
              @click.native="toggleAttr(attr)"
            >
              <span>{{ attr.text }}</span>
            </Tag>
            <Divider v-if="selectAttrList && selectAttrList.length > 0" orientation="left">已选属性</Divider>
            <draggable v-if="selectAttrList && selectAttrList.length > 0" handle=".tsfont-option-vertical" :list="alertViewData.config.attrList">
              <Tag
                v-for="(attr, index) in selectAttrList"
                :key="index"
                closable
                @on-close="toggleAttr(attr)"
              >
                <span style="cursor: move" class="tsfont-option-vertical"></span>
                <span>{{ attr.text }}</span>
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
      alertViewData: { isActive: 1, config: { attrList: [], rule: {} } },
      attrList: [],
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
          validateList: ['required', 'unique_ident']
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
  created() {
    this.listAlertAttrList();
    this.getViewById();
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
    getViewById() {
      if (this.id) {
        this.$api.alert.alert.getAlertViewById(this.id).then(res => {
          this.alertViewData = res.Return;
          this.isReady = true;
        });
      } else {
        this.isReady = true;
      }
    },
    isAttrSelected(attr) {
      return this.alertViewData.config.attrList.some(item => item === attr.value);
    },
    toggleAttr(attr) {
      if (this.isAttrSelected(attr)) {
        this.alertViewData.config.attrList = this.alertViewData.config.attrList.filter(item => item !== attr.value);
      } else {
        this.alertViewData.config.attrList = [...this.alertViewData.config.attrList, attr.value];
      }
    },
    listAlertAttrList() {
      this.$api.alert.alert.listAlertAttrList().then(res => {
        this.attrList = res.Return;
      });
    },
    close() {
      this.$emit('close');
    },
    saveAlertView() {
      const form = this.$refs.form;
      if (form && form.valid()) {
        console.log(JSON.stringify(this.alertViewData, null, 2));
        this.$api.alert.alert.saveAlertView(this.alertViewData).then(res => {
          if (res.Status === 'OK') {
            this.close();
          }
        });
      }
    }
  },
  filter: {},
  computed: {
    unSelectAttrList() {
      return this.attrList.filter(item => !this.isAttrSelected(item));
    },
    selectAttrList() {
      const attrList = [];
      if (this.alertViewData.config.attrList) {
        this.alertViewData.config.attrList.forEach(item => {
          const attr = this.attrList.find(i => i.value === item);
          if (attr) {
            attrList.push(attr);
          }
        });
      }
      return attrList;
    },
    conditionAttrList() {
      const attrList = [];
      this.selectAttrList &&
        this.selectAttrList.forEach(item => {
          attrList.push({
            name: item.value,
            label: item.text,
            expressionList: ['equal', 'notequal', 'like', 'notlike', 'is-null', 'is-not-null']
          });
        });
      return attrList;
    }
  },
  watch: {}
};
</script>
<style lang="less"></style>
