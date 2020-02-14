<template>
  <div id="app">
    <!-- 
    <textarea class="content-view" v-model="menuContent"></textarea>-->
    <Row>
      <Col offset="3" span="18" class="container">
        <Divider class="title">{{ title }}</Divider>
        <Row class="search-bar">
          <Col span="4" >
            <Select prefix="ios-bookmarks" placeholder="请选择areas" class="selector" multiple>
              <Option v-for="(area, index) in areas" :value="area" :key="index">{{ area }}</Option>
            </Select>
          </Col>
          <Col span="4">
            <Select prefix="md-pricetags" placeholder="请选择标签" class="selector" multiple>
              <Option v-for="(tag, index) in taskTags" :value="tag" :key="index">{{ tag }}</Option>
            </Select>
          </Col>
          <Col span="4">
            <Select prefix="ios-person" placeholder="请选择成员" class="selector" multiple>
              <Option v-for="(member, index) in memberTags" :value="member" :key="index">{{ member }}</Option>
            </Select>
          </Col>
          <Col span="1">
            <Button type="success" icon="ios-search">搜索</Button>
          </Col>
        </Row>
        <Divider></Divider>
        <Row class="top-bar">
          <Col span="6">列表</Col>
          <Col span="6" push="1">任务名</Col>
          <Col span="3" push="1">进度</Col>
          <Col span="5" push="1">人员</Col>
        </Row>
        <Row class="content">
          <Col span="6">
            <TreeMenu class="tree-menu" :nodes="nodes"></TreeMenu>
          </Col>
          <Col span="14" push="1">
            <Row class="task" v-for="(task, index) in tasks" :value="task" :key="index">
              <Col span="10" class="task-name">
              <b>{{ task.name }}</b>
              </Col>
              <Col span="6">
                <Tag color="success">{{ task.progress }}</Tag>
              </Col>
              <Col span="8  ">
                <span v-for="(member, index) in task.members" :key="index" :value="member" >
                  <Tag>{{ member }}</Tag>
                </span>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
    
  </div>
</template>

<script lang="ts">
import "view-design/dist/styles/iview.css";

import { Component, Vue } from "vue-property-decorator";
import TreeMenu from "./components/TreeMenu.vue";
import Menu from "./Menu";
import EventManger from "./EventManger";
import OrgLoader from "./model/OrgLoader";
import { OrgParser } from "./model/OrgParser";
import { Task } from './viewmodel/ViewModel'
import { TagType, Tag, Area, Searcher, ResultNode } from './model';

@Component({
  components: {
    TreeMenu
  }
})

export default class App extends Vue {

  title: string | undefined = ""
  areas: string[] = []
  taskTags: string[] = []
  memberTags: string[] = []
  nodes: ResultNode[] = []

  tasks: Task[] = [
    {
      name: "出一个windows矿机版本",
      members: ["陈冲"],
      progress: "Done"
    },
    {
      name: "生成Windows安装包并正常启动",
      members: ["陈冲"],
      progress: "Done"
    },
    {
      name: "测试测试",
      members: ["汪键", "肖少星", "陈冲", "张鑫"],
      progress: "Done"
    },
    {
      name: "开发OrgViewer",
      members: ["汪键", "肖少星"],
      progress: "Done"
    },
  ]

  mounted() {
  }

  transferAreas(areas: Area[]) {
    let _areas: string[] = []

    for (const area of areas) {
      if (area.title) {
        _areas.push(area.title)
      }
    }

    return _areas
  }

  transferTags(tags: Tag[]) {
    let _tags: string[] = []

    for (const tag of tags) {
      if (tag.name) {
        _tags.push(tag.name)
      }
    }

    return _tags
  }

  async created() {
    let orgContent = await OrgLoader.load(
      "http://localhost:8080/SFOX项目工作.org"
    );
    let document = OrgParser.parseNewDocument(orgContent);

    this.title = document.title
    this.areas = this.transferAreas(document.areas)
    this.taskTags = this.transferTags(document.tags(TagType.Task))
    this.memberTags = this.transferTags(document.tags(TagType.Member))

    let searcher = new Searcher(document);
    searcher.includeArea = false;
    searcher.go();

    let rootNode = searcher.result

    if (rootNode) {
      this.nodes = rootNode.childs
      console.log(this.nodes)
    }
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
    }
  ];
}
</script>

<style lang="less">

html, body, #app {
  height: 100%;
  background-color: #eee;
}


.container {
  background: #fff;
  padding: 24px;
  min-height: 800px;

  .title {
    color: #464c5b;
    font-size: 24px;
  }

  .top-bar {
    line-height: 40px;
    height: 40px;
  }

  .search-bar {
    padding-bottom: 16px;

    .selector {
      padding-right: 10px;
    }
  }

  .content {
    .task {
      height: 50px;
      line-height: 50px;
      border-top: 1px solid #c7c7c7;
    }

    .task:hover {
      background: #eeeeee;
    }
  }
}



#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.tree-menu {
  float: left;
  width: 100%;
}

.content-view {
  width: 400px;
  height: 300px;
  float: left;
  margin-left: 100px;
}
</style>
