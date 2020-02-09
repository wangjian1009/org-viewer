<template>
  <div>
    <ul>
      <TreeMenuItem :menu="item" :key="item.name" v-for="item in menus" />
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TreeMenuItem from './TreeMenuItem.vue'
import Menu from '../Menu'

@Component({
  components: {
    TreeMenuItem
  },
})

export default class TreeMenu extends Vue {
  @Prop() private menus!: Menu[];
}
</script>

<style lang="less" scoped>

ul {
  width: 400px;
  list-style: none;
  margin: 0px;
  
  li {
    text-align: left;
  }
}

</style>
