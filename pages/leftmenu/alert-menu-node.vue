<template>
  <div>
    <div class="link alert-menu-link" style="height: auto" :style="rowStyle">
      <a class="alert-menu-a pt-sm pb-sm" style="height: auto; line-height: 1" @click="toggleCatalog(catalog)">
        <span :class="toggleClass" class="ml-sm">
          {{ catalog.name }}
        </span>
      </a>
    </div>
    <div v-if="!catalog._hideview">
      <AlertMenuNode
        v-for="child in catalog.children"
        :key="child.id"
        :catalog="child"
        :level="level + 1"
        @go-to="$emit('go-to', $event)"
      ></AlertMenuNode>
      <div
        v-for="view in catalog.viewList"
        :key="view.id"
        class="link alert-menu-link"
        style="height: auto"
        :style="viewRowStyle"
        :class="{ active: $isMenuActive('/alert-manage/' + view.name) }"
      >
        <a class="alert-menu-a pt-sm pb-sm" style="height: auto; padding-right: 0px; line-height: 1.1" @click="$emit('go-to', '/alert-manage/' + view.name)">
          <span class="alert-name">{{ view.label }}</span>
          <span v-if="view.alertCount > 0" class="text-error ml-xs superscript">
            <b>{{ view.alertCount }}</b>
          </span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlertMenuNode',
  components: {
    AlertMenuNode: () => import('./alert-menu-node.vue')
  },
  props: {
    catalog: { type: Object, required: true },
    level: { type: Number, default: 0 }
  },
  methods: {
    toggleCatalog(catalog) {
      this.$set(catalog, '_hideview', !catalog._hideview);
    }
  },
  computed: {
    rowStyle() {
      return {
        paddingLeft: this.level * 12 + 'px'
      };
    },
    viewRowStyle() {
      return {
        paddingLeft: (this.level + 1) * 12 + 'px'
      };
    },
    toggleClass() {
      if ((this.catalog.children && this.catalog.children.length > 0) || (this.catalog.viewList && this.catalog.viewList.length > 0)) {
        return this.catalog._hideview ? 'tsfont-drop-right' : 'tsfont-drop-down';
      }
      return 'tsfont-dot';
    }
  }
};
</script>
