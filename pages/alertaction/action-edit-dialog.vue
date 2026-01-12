<template>
  <div>
    <TsDialog v-bind="dialogConfig" @on-ok="ok()" @on-close="close()">
      <template v-slot>
        <div>
          <TsForm ref="form" v-model="actionData" :item-list="formConfig">
            <template v-slot:icon>
              <div class="logo bg-block border-color text-primary radius-sm" @click="isIconDialogShow = true">
                <i class="logo-icon" :class="actionData.icon"></i>
              </div>
            </template>
            <template v-slot:script>
              <TsCodemirror
                v-model="actionData.script"
                codeMode="js"
                :validateList="['required']"
                placeholder="function(alertData){}"
                @change="scriptError = '';"
              ></TsCodemirror>
              <div v-if="scriptError" class="mt-md text-error">{{ scriptError }}</div>
            </template>
          </TsForm>
        </div>
      </template>
      <template v-slot:footer>
        <Button @click="close()">{{ $t('page.cancel') }}</Button>
        <Button type="primary" @click="save()">{{ $t('page.confirm') }}</Button>
      </template>
    </TsDialog>
    <IconDialog
      v-if="isIconDialogShow"
      :currentIcon="actionData.icon"
      @cancel="isIconDialogShow = false"
      @confirm="selectIcon"
    ></IconDialog>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsForm: () => import('@/resources/plugins/TsForm/TsForm'),
    IconDialog: () => import('@/views/pages/common/icon-dialog.vue'),
    TsCodemirror: () => import('@/resources/plugins/TsCodemirror/TsCodemirror')
  },
  props: {
    id: { type: Number }
  },
  data() {
    return {
      dialogConfig: {
        title: this.id ? this.$t('dialog.title.edittarget', { target: this.$t('page.action') }) : this.$t('dialog.title.addtarget', { target: this.$t('page.action') }),
        type: 'modal',
        maskClose: false,
        isShow: true,
        width: 'medium'
      },
      scriptError: '',
      isIconDialogShow: false,
      actionData: { isActive: 1 },
      formConfig: [
        {
          type: 'text',
          name: 'name',
          label: this.$t('page.uniquekey'),
          maxlength: 50,
          disabled: !!this.id,
          validateList: ['required', 'enchar'],
          desc: this.$t('message.cmdb.noedit')
        },
        {
          type: 'text',
          name: 'label',
          label: this.$t('page.name'),
          maxlength: 50,
          validateList: ['required']
        },
        {
          type: 'slot',
          name: 'icon',
          label: this.$t('page.icon')
        },
        {
          type: 'radio',
          name: 'isActive',
          label: this.$t('term.report.isactive'),
          dataList: [
            { value: 1, text: this.$t('page.yes') },
            { value: 0, text: this.$t('page.no') }
          ]
        },
        {
          type: 'slot',
          name: 'script',
          label: '点击事件'
        },
        {
          type: 'textarea',
          name: 'description',
          maxlength: 500,
          label: this.$t('page.explain')
        }
      ]
    };
  },
  beforeCreate() {},
  created() {
    this.getActionById();
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
    getActionById() {
      if (this.id) {
        this.$api.alert.action.getActionById(this.id).then(res => {
          this.actionData = res.Return;
        });
      }
    },
    selectIcon(icon) {
      this.isIconDialogShow = false;
      this.$set(this.actionData, 'icon', icon);
    },
    close(needRefresh) {
      this.$emit('close', needRefresh);
    },
    save() {
      const form = this.$refs.form;
      if (!form || !form.valid()) {
        return;
      }
      const result = this.validateScript(this.actionData.script);
      if (!result.ok) {
        this.scriptError = result.msg;
        return;
      }
      this.$api.alert.action.saveAction(this.actionData).then(res => {
        if (res.Status === 'OK') {
          this.$Message.success(this.$t('message.savesuccess'));
          this.close(true);
        }
      });
    },
    validateScript(script) {
      try {
        new Function(`return (${script})`);
        return { ok: true };
      } catch (e) {
        return {
          ok: false,
          msg: e.message || '脚本语法错误'
        };
      }
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less" scoped>
.logo {
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: inline-block;
  position: relative;
  border: 1px solid;
  top: -5px;
  text-align: center;
  line-height: 40px;
  .logo-icon {
    font-size: 20px;
  }
  &::after {
    content: '更换';
    left: 44px;
    width: 40px;
    position: absolute;
    top: 2px;
  }
}
</style>
