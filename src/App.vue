<template>
  <div id="app">
    <TreeMenu class="tree-menu" :menus="menus" />
    <textarea class="content-view" v-model="menuContent"></textarea>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TreeMenu from './components/TreeMenu.vue';
import Menu from './Menu';
import EventManger from './EventManger';

@Component({
  components: {
    TreeMenu,
  },
})

export default class App extends Vue {

  menuContent = ""

  mounted() {
    EventManger.$on("toggleItem", (content: string) => {
      this.menuContent = content
      console.log(content)
    })
  }

  menus: Menu[] = [
    {
      name: "节点1",
      content: "节点1的内容",
      children: [
        {
          name: "节点1-1",
          content: "节点1-1-1的内容",
          children: [
            {
              name: "节点1-1-1",
              content: "节点1-1-1的内容",
              children: []
            }
          ]
        }
      ]
    },
    {
      name: "节点2",
      content: "节点2的内容",
      children: [
        {
          name: "节点2-1",
          content: "节点2-1的内容",
          children: []
        },
        {
          name: "节点2-2",
          content: "节点2-2的内容",
          children: []
        }
      ]
    },
  ]
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.tree-menu {
  float: left;
}

.content-view {
  width: 400px;
  height: 300px;
  float: left;
  margin-left: 100px;
}
</style>
