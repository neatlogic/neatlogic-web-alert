<template>
  <div
    v-if="isVisible"
    v-click-outside:false="onClickOutside"
    v-click-outside:false.mousedown="onClickOutside"
    v-click-outside:false.touchstart="onClickOutside"
    class="right-click-menu-box block-border shadow radius-sm bg-grey"
    :style="{
      left: `${x}px`,
      top: `${y}px`
    }"
  >
    <ul>
      <li
        v-for="(item, index) in menuList"
        :key="index"
        class="cursor-pointer menu-li"
        :class="getGroupDividerClass(item, index)"
        @click.stop="handleMenuClick(item)"
      >
        <div>
          <span v-show="item.selected" class="tsfont-check"></span>
          {{ item.text }}</div>
        <div v-show="item.hotkey">
          <span class="text-grey">{{ item.hotkey }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { directive as ClickOutside } from '@/resources/directives/v-click-outside-x.js';
export default {
  directives: { ClickOutside },
  props: {
    isVisible: Boolean,
    x: Number,
    y: Number,
    menuList: Array
  },
  methods: {
    handleMenuClick(item) {
      this.menuList.forEach(item => {
        item.selected = false;
      });
      item.selected = !item.selected;
      this.$emit('menu-click', item);
    },
    onClickOutside(event) {
      this.menuList.forEach(item => {
        item.selected = false;
      });
      this.$emit('menu-click', '');
    }
  },
  computed: {
    getGroupDividerClass() {
      let result = {};
      this.menuList.forEach((item, index) => {
        result[item.groupName] = index;
      });
      return (item, index) => {
        const currentGroupName = item.groupName;
        // 如果当前元素是分组的最后一个元素，返回 'menu-type'
        if (index === result[currentGroupName]) {
          return 'menu-type';
        }
        return '';
      };
    }
  }
};
</script>
<style lang="less" scoped>
@import (reference) '~@/resources/assets/css/variable.less';
.theme(@primary-hover-color, @border-color) {
  .right-click-menu-box {
    position: absolute;
    width: 200px;
    max-height: 310px;
    overflow-y: hidden;
    z-index: 1000;
    .menu-li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 20px;
      &.menu-type {
        border-bottom: 1px solid var(--border-color, @border-color);
      }
      &:hover {
        background: var(--primary-hover-color, @primary-hover-color);
        color: @default-op;
      }
    }
  }
}
html {
  .theme(@default-primary-hover-color, @default-border);
  &.theme-dark {
    .theme(@dark-primary-hover-color, @dark-border);
  }
}
</style>
