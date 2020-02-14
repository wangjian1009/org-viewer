<template>
  <li>
    <span class="line" @click="toggle">
      <em v-if="hasChild" class="icon">
        <Icon v-if="!isOpen" type="ios-arrow-forward" />
        <Icon v-if="isOpen" type="ios-arrow-down" />
      </em>
      <em v-if="!hasChild">
        <!-- <Icon type="ios-leaf-outline" /> -->
      </em>
      <span class="sub-title">{{ node.value.title }}</span>
    </span>
    <transition name="fade">
      <ul v-show="isOpen" v-if="hasChild">
        <TreeMenuItem v-for="(item, index) in node.childs" :node="item" :key="index" />
      </ul>
    </transition>
  </li>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ResultNode } from '../model'
import EventManger from '../EventManger';

@Component({
  name: "TreeMenuItem",
})

export default class TreeMenuItem extends Vue {
  @Prop()
  node!: ResultNode

  isOpen: boolean = false

  toggle(): void {
    this.isOpen = !this.isOpen
  }

  get hasChild() {
    return this.node.childs && this.node.childs.length > 0
  }
}
</script>


<style lang="less" scoped>
ul {
  list-style: none;

  li {
    text-align: left;
    height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    width: 100%;
  }
}

.line {
  display: inline-block;
  width: 100%;
  margin-right: 5px;
  background-repeat: no-repeat;
  vertical-align: middle;
  border-top: 1px solid #c7c7c7;
  height: 50px;
  line-height: 50px;

  em {
    display: inline-block;
    width: 24px;
  }
}

span:hover {
  background: #eeeeee;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .1s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
