<template>
  <li>
    <span @click="toggle">
      <em v-if="hasChild" class="icon">{{isOpen ? '-' : '+'}}</em>
      <em v-if="!hasChild" class="icon file-text"></em>
      {{ menu.name }}
    </span>
    <transition name="fade">
      <ul v-show="isOpen" v-if="hasChild">
        <TreeMenuItem v-for="(item, index) in menu.children" :menu="item" :key="index" />
      </ul>
    </transition>
  </li>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Menu from "../Menu";
import EventManger from '../EventManger';

@Component({
  name: "TreeMenuItem",
})

export default class TreeMenuItem extends Vue {
  @Prop()
  menu!: Menu;

  isOpen: boolean = false;

  toggle(): void {
    this.isOpen = !this.isOpen;
    EventManger.$emit("toggleItem", this.menu.content)
  }

  get hasChild() {
    return this.menu.children && this.menu.children.length > 0;
  }
}
</script>


<style lang="less" scoped>
ul {
  list-style: none;

  li {
    text-align: left;
  }
}

span {
  padding: 6px;
  display: inline-block;
  width: 100%;
  margin-right: 5px;
  background-repeat: no-repeat;
  vertical-align: middle;
  border-top: 1px solid #eee;

  em {
    display: inline-block;
    width: 8px;
  }
}

span:hover {
  background: #eeeeee;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
