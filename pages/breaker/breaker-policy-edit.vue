<template>
  <TsDialog v-bind="dialogConfig" @on-close="close()">
    <template v-slot>
      <TsForm ref="form" v-model="policyData" :item-list="formConfig">
        <template v-slot:config>
          <div>
            <component
              :is="handlerComponent"
              v-if="handlerComponent"
              ref="handlerConfig"
              v-model="policyData.config"
            ></component>
            <Divider orientation="left">{{ $t('term.alert.breakeraction') }}</Divider>
            <BreakerActionEdit ref="actionConfig" v-model="policyData.config"></BreakerActionEdit>
          </div>
        </template>
      </TsForm>
    </template>
    <template v-slot:footer>
      <Button @click="close()">{{ $t('page.cancel') }}</Button>
      <Button type="primary" @click="save()">{{ $t('page.confirm') }}</Button>
    </template>
  </TsDialog>
</template>
<script>
import handlerComponentMap from './components/edit/index.js';
export default {
  name: '',
  components: {
    TsForm: () => import('@/resources/plugins/TsForm/TsForm'),
    BreakerActionEdit: () => import('./action/breaker-action-edit.vue')
  },
  props: {
    id: { type: Number }
  },
  data() {
    return {
      policyData: {
        isActive: 1,
        config: {}
      },
      handlerList: [],
      dialogConfig: {
        title: this.id ? this.$t('term.alert.editbreakerpolicy') : this.$t('term.alert.addbreakerpolicy'),
        type: 'modal',
        width: 'medium',
        maskClose: false,
        isShow: true
      }
    };
  },
  created() {
    this.listHandler();
    if (this.id) {
      this.getPolicy();
    }
  },
  methods: {
    listHandler() {
      this.$api.alert.breaker.listHandler().then(res => {
        this.handlerList = res.Return || [];
      });
    },
    getPolicy() {
      this.$api.alert.breaker.getPolicy(this.id).then(res => {
        if (res.Return) {
          this.policyData = res.Return;
          if (!this.policyData.config) {
            this.$set(this.policyData, 'config', {});
          }
        }
      });
    },
    async save() {
      const formValid = this.$refs.form && this.$refs.form.valid();
      const configValid = !this.$refs.handlerConfig || this.$refs.handlerConfig.valid();
      const actionValid = !this.$refs.actionConfig || await this.$refs.actionConfig.valid();
      if (formValid && configValid && actionValid) {
        if (this.$refs.handlerConfig) {
          this.policyData.config = { ...this.policyData.config, ...this.$refs.handlerConfig.getConfig() };
        }
        if (this.$refs.actionConfig) {
          this.policyData.config = { ...this.policyData.config, ...this.$refs.actionConfig.getConfig() };
        }
        this.$api.alert.breaker.savePolicy(this.policyData).then(res => {
          if (res.Status === 'OK') {
            this.$Message.success(this.$t('message.savesuccess'));
            this.close(true);
          }
        });
      }
    },
    close(needRefresh) {
      this.$emit('close', needRefresh);
    }
  },
  computed: {
    handlerComponent() {
      return this.policyData.handler ? handlerComponentMap[this.policyData.handler.toLowerCase()] : null;
    },
    formConfig() {
      return {
        name: {
          type: 'text',
          label: this.$t('page.name'),
          maxlength: 255,
          validateList: ['required']
        },
        handler: {
          type: 'select',
          label: this.$t('term.alert.breakerplugin'),
          transfer: true,
          validateList: ['required'],
          valueName: 'name',
          textName: 'label',
          dataList: this.handlerList
        },
        isActive: {
          type: 'radio',
          label: this.$t('page.isactive'),
          dataList: [
            { value: 1, text: this.$t('page.yes') },
            { value: 0, text: this.$t('page.no') }
          ]
        },
        description: {
          type: 'textarea',
          label: this.$t('page.description'),
          maxlength: 500
        },
        config: {
          type: 'slot',
          hideLabel: true,
          label: this.$t('page.config')
        }
      };
    }
  },
  watch: {
    'policyData.handler'(handler, oldHandler) {
      if (oldHandler && handler !== oldHandler) {
        this.$set(this.policyData, 'config', {});
      }
    }
  }
};
</script>
<style lang="less"></style>
