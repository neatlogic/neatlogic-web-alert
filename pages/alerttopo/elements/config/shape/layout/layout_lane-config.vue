<template>
  <TsForm v-model="data" :item-list="form" labelPosition="top">
    <template v-slot:lanes>
      <div>
        <div v-for="(lane, index) in data.lanes" :key="index">
          <div>
            <Divider orientation="center" style="margin-top: 0px">
              <span class="mr-xs text-grey">{{ $t('term.diagram.lane') }}#{{ index + 1 }}</span>
              <span class="tsfont-trash-o cursor text-grey" @click="deleteLane(lane)">
              </span>
            </Divider>
          </div>
          <TsForm :item-list="formConfig" :labelWidth="70" :labelPosition="'left'">
            <template v-slot:name>
              <TsFormInput v-model="lane.name" border="border"></TsFormInput>
            </template>
            <template v-slot:borderStyle>
              <TsFormRadio v-model="lane.borderStyle" :dataList="styleList"></TsFormRadio>
            </template>
            <template v-slot:nameBgColor>
              <ColorPicker
                :transfer="true"
                :value="lane.nameBgColor"
                alpha
                recommend
                class="colorPicker"
                transfer-class-name="color-picker-transfer-class"
                @on-change="
                  val => {
                    $set(lane, 'nameBgColor', val);
                  }
                "
              />
            </template>
            <template v-slot:nameFontColor>
              <ColorPicker
                :transfer="true"
                :value="lane.nameFontColor"
                alpha
                recommend
                class="colorPicker"
                transfer-class-name="color-picker-transfer-class"
                @on-change="
                  val => {
                    $set(lane, 'nameFontColor', val);
                  }
                "
              />
            </template>
            <template v-slot:borderColor>
              <ColorPicker
                :transfer="true"
                :value="lane.borderColor"
                alpha
                recommend
                class="colorPicker"
                transfer-class-name="color-picker-transfer-class"
                @on-change="
                  val => {
                    $set(lane, 'borderColor', val);
                  }
                "
              />
            </template>
            <template v-slot:bgColor>
              <ColorPicker
                :transfer="true"
                :value="lane.bgColor"
                alpha
                recommend
                class="colorPicker"
                transfer-class-name="color-picker-transfer-class"
                @on-change="
                  val => {
                    $set(lane, 'bgColor', val);
                  }
                "
              />
            </template>
            <template v-slot:borderWidth>
              <div class="pl-sm pr-sm"><Slider v-model="lane.borderWidth" :min="1" :max="20"></Slider></div>
            </template>
          </TsForm>
        </div>
        <div>
          <a class="tsfont-plus" @click="addLane()">{{ $t('dialog.title.addtarget', { target: $t('term.diagram.lane') }) }}</a>
        </div>
      </div>
    </template>
  </TsForm>
</template>
<script>
import { ConfigBase } from '@/community-module/alert/pages/alerttopo/elements/config/config-base.js';

export default {
  name: '',
  components: {
    TsForm: () => import('@/resources/plugins/TsForm/TsForm'),
    TsFormInput: () => import('@/resources/plugins/TsForm/TsFormInput'),
    TsFormRadio: () => import('@/resources/plugins/TsForm/TsFormRadio')
  },
  extends: ConfigBase,
  props: {},
  data() {
    return {
      styleList: [
        { value: 'none', text: '无' },
        { value: 'solid', text: '实线' },
        { value: 'double', text: '双线' },
        { value: 'dotted', text: '点线' },
        { value: 'dashed', text: '虚线' }
      ],
      formConfig: [
        {
          name: 'name',
          label: '名称',
          type: 'slot'
        },
        {
          name: 'nameBgColor',
          label: '背景颜色',
          type: 'slot'
        },
        {
          name: 'nameFontColor',
          label: '字体颜色',
          type: 'slot'
        },
        {
          name: 'bgColor',
          label: '主题颜色',
          type: 'slot'
        },
        {
          name: 'borderStyle',
          label: '边框风格',
          type: 'slot'
        },
        {
          name: 'borderColor',
          label: '边框颜色',
          type: 'slot'
        },
        {
          name: 'borderWidth',
          label: '边框宽度',
          type: 'slot'
        }
      ]
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
    deleteLane(lane) {
      const index = this.data.lanes.findIndex(d => d === lane);
      if (index > -1) {
        this.data.lanes.splice(index, 1);
      }
    },
    addLane() {
      const lane = {
        name: '',
        borderWidth: 1,
        borderStyle: 'none',
        bgColor: '',
        borderColor: '',
        nameBgColor: '',
        nameFontColor: ''
      };
      this.data.lanes.push(lane);
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less" scoped></style>
