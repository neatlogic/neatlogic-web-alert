<template>
  <div>
    <TsContain>
      <template v-slot:navigation></template>
      <template v-slot:topRight>
        <TsFormSelect
          v-model="nameList"
          transfer
          dynamicUrl="/api/rest/alert/mark/search"
          border="border"
          valueName="name"
          textName="name"
        ></TsFormSelect>
      </template>
      <template v-slot:content>
        <div class="grid">
          <div
            v-for="(mark, index) in markList"
            :key="index"
            class="padding-sm radius-sm bg-op item"
            :color="mark.style"
          >
            <div>
              <Tag v-if="mark.style" :color="mark.style">{{ mark.name }}</Tag>
              <Tag v-else>{{ mark.name }}</Tag>
            </div>
            <div class="ml-xs">
              <ColorPicker
                v-model="mark.style"
                recommend
                transfer
                class="colorPicker"
                transfer-class-name="color-picker-transfer-class"
                @on-change="
                  val => {
                    mark.style = val;
                    saveMarkStyle(mark);
                  }
                "
              />
            </div>
            <div class="ml-xs">
              <TsFormSwitch
                v-model="mark.isShow"
                :trueValue="1"
                :falseValue="0"
                :showStatus="true"
                trueText="显示"
                falseText="隐藏"
                @on-change="saveMark(mark)"
              ></TsFormSwitch>
            </div>
            <div class="ml-xs tsfont-trash-o cursor" @click="deleteTag(mark)"></div>
          </div>
        </div>
      </template>
    </TsContain>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect'),
    TsFormSwitch: () => import('@/resources/plugins/TsForm/TsFormSwitch')
  },
  props: {},
  data() {
    return {
      nameList: [],
      markList: []
    };
  },
  beforeCreate() {},
  created() {
    this.searchAlertMark();
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
    searchAlertMark() {
      this.$api.alert.alertmark.getMarkByNameList(this.nameList).then(res => {
        this.markList = (res.Return || []).map(mark => {
          if (mark.isShow == null) {
            this.$set(mark, 'isShow', 1);
          }
          return mark;
        });
      });
    },
    saveMarkStyle(mark) {
      this.saveMark(mark);
    },
    saveMark(mark) {
      this.$api.alert.alertmark.saveMark(mark).then(res => {
        this.$Message.success(this.$t('message.savesuccess'));
      });
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less" scoped>
.grid {
  display: grid;
  gap: 10px;
  grid-template-columns: 20% 20% 20% 20% 20%;
  .item {
    line-height: 52px;
    display: grid;
    grid-template-columns: auto 80px 100px 20px;
  }
}
</style>
