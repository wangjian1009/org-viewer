<template>
  <div>
    <ul>
      <TreeMenuItem :node="node" :key="node.value.localId" v-for="node in nodes" />
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TreeMenuItem from './TreeMenuItem.vue'
import { ResultNode } from '../model'

@Component({
  components: {
    TreeMenuItem
  },
})

export default class TreeMenu extends Vue {
  @Prop() 
  private nodes!: ResultNode[];
}
</script>

<style lang="less">

ul {
  list-style: none;
  
  li {
    text-align: left;
    padding-left: 10px;
  }
}

</style>
