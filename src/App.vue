<template>
  <div id="app">
    <!-- 
    <textarea class="content-view" v-model="menuContent"></textarea> -->
    <Divider class="title">Org Viewer</Divider>
    <Row class="search-bar">
      <Col span="4" offset="3">
        <Select placeholder="请选择areas" class="selector" multiple>
          <Option v-for="(area, index) in areas" :value="area" :key="index">{{ area }}</Option>
        </Select>
      </Col>
      <Col span="4">
        <Select placeholder="请选择标签" class="selector" multiple>
          <Option v-for="(tag, index) in tags" :value="tag" :key="index">{{ tag }}</Option>
        </Select>
      </Col>
      <Col span="4">
        <Select placeholder="请选择成员" class="selector" multiple>
          <Option v-for="(member, index) in members" :value="member" :key="index">{{ member }}</Option>
        </Select>
      </Col>
      <Col span="1" push="3">
        <Button type="success" shape="circle" icon="ios-search"></Button>
      </Col>
    </Row>
    <Row class="top-bar">
      <Col span="6" offset="3">列表</Col>
      <Col span="6">任务名</Col>
      <Col span="2">进度</Col>
      <Col span="2">人员</Col>
    </Row>
    <Row class="row">
      <Col span="6" offset="3">
        <TreeMenu class="tree-menu" :menus="menus"></TreeMenu>
      </Col>
      <Col span="6">-</Col>
      <Col span="2">-</Col>
      <Col span="2">-</Col>
    </Row>
  </div>
</template>

<script lang="ts">
import 'view-design/dist/styles/iview.css';

import { Component, Vue } from 'vue-property-decorator';
import TreeMenu from './components/TreeMenu.vue';
import Menu from './Menu';
import EventManger from './EventManger';
import OrgParser from './model/OrgParser';

@Component({
  components: {
    TreeMenu,
  },
})

export default class App extends Vue {

  menuContent = ""

  areas: string[] = ["待处理", "近期工作", "下一步", "将来/也许", "跟踪工作"]
  tags: string[] = ["TODO", "INPROGRESS", "DONE"]
  members: string[] = ["汪键", "肖少星", "陈冲", "张鑫"]

  mounted() {
    EventManger.$on("toggleItem", (content: string) => {
      this.menuContent = content
      console.log(content)
    })
  }

  async created() {
    let parser = new OrgParser("http://localhost:8080/SFOX项目工作.org")
    parser.parseOrgContent()
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

<style lang="less" scoped>
.title {
  color: #464c5b;
  font-size: 24px;
}

.top-bar {
  line-height: 40px;
  height: 40px;
  
  .ivu-col {
    background: #f8f8f9;
    border: 1px solid #dcdee2;
    border-radius: 4px;
  }
}

.search-bar {
  padding-bottom: 10px;

  .selector {
    padding-right: 10px;
  }
}

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
