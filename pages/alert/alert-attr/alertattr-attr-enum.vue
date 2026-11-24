<template>
  <div v-if="valueList.length">
    <span v-for="(item, index) in valueList" :key="index" class="mr-xs">{{ item }}</span>
  </div>
  <div v-else class="text-grey">-</div>
</template>
<script>
import { AttrViewerBase } from './alertattr-base.js';

export default {
  extends: AttrViewerBase,
  computed: {
    valueList() {
      const values = Array.isArray(this.value) ? this.value : [this.value];
      return values.filter(value => value != null && value !== '');
    }
  }
};
</script>
