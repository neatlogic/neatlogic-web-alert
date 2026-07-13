<template>
  <span v-if="value === true">{{ $t('page.yes') }}</span>
  <span v-else-if="value === false">{{ $t('page.no') }}</span>
  <span v-else class="text-grey">-</span>
</template>
<script>
import { AttrViewerBase } from '@/community-module/alert/pages/alert/alert-attr/alertattr-base.js';

export default {
  name: '',
  extends: AttrViewerBase
};
</script>
