<template>
  <div id="app" v-if="!loading">
    <Row>
      <Col offset="3" span="18" class="container">
        <Affix>
          <div class="search-bar-top"></div>
          <Row class="search-bar">
            <Divider class="title">{{ page.title }}</Divider>
            <Col span="4" >
              <Select v-model="page.areaFilter" prefix="ios-bookmarks" placeholder="请选择areas" class="selector" multiple>
                <Option v-for="(area, index) in page.areas" :value="area" :key="index">{{ area }}</Option>
              </Select>
            </Col>
            <Col span="4">
              <Select v-model="page.tagFilter" prefix="md-pricetags" placeholder="请选择tag" class="selector" multiple>
                <Option v-for="(tag, index) in page.taskTags" :value="tag" :key="index">{{ tag }}</Option>
              </Select>
            </Col>
            <Col span="4">
              <Select v-model="page.categoryFilter" prefix="md-pricetags" placeholder="请选择category" class="selector" multiple>
                <Option v-for="(category, index) in page.categoryTags" :value="category" :key="index">{{ category }}</Option>
              </Select>
            </Col>
            <Col span="4">
              <Select v-model="page.memberFilter" prefix="ios-person" placeholder="请选择member" class="selector" multiple>
                <Option v-for="(member, index) in page.memberTags" :value="member" :key="index">{{ member }}</Option>
              </Select>
            </Col>
            <Col span="1">
              <Button type="success" icon="ios-search" @click="search">搜索</Button>
            </Col>
          </Row>
          <div class="search-bar-bottom"></div>
        </Affix>
        <TreeMenu class="tree-menu" :tasks="page.taskView.childs"></TreeMenu>
      </Col>
    </Row>
    
  </div>
</template>

<script lang="ts">
import "view-design/dist/styles/iview.css";

import moment from 'moment';
import { Component, Vue } from "vue-property-decorator";
import TreeMenu from "./components/TreeMenu.vue";
import Menu from "./Menu";
import EventManger from "./EventManger";
import OrgLoader from "./model/OrgLoader";
import { OrgParser } from "./model/OrgParser";
import { TagType, Tag, Area, Searcher, ResultNode } from './model';
import { PageView } from './viewmodel'

moment.locale("zh-cn");

@Component({
  components: {
    TreeMenu
  }
})

export default class App extends Vue {

  page!: PageView
  loading = true

  async beforeCreate() {
    let orgContent = await OrgLoader.load(
      "SFOX项目工作.org"
    );
    
    let document = OrgParser.parseNewDocument(orgContent);
    this.page = new PageView(document, new Date())
    this.loading = false

    console.log(document)
    console.log(this.page)
  }

  search() {
    this.loading = true
    this.page.search()
    this.loading = false
  }
}
</script>

<style lang="less">

html, body, #app {
  height: 100%;
  background-color: #eee;
}


.container {
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
    background: #fff;
    padding: 24px;
    padding-bottom: 16px;

    .selector {
      padding-right: 10px;
    }
  }

  .search-bar-top {
    background: #eee;
    width: 100%;
    height: 30px;
  }

  .search-bar-bottom {
    background: #eee;
    width: 100%;
    height: 28px;
    border-bottom: 10px solid #fff;
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
}

.tree-menu {
  float: left;
  width: 100%;
  background: #fff;
  padding: 24px;
  margin-bottom: 48px;
}

.content-view {
  width: 400px;
  height: 300px;
  float: left;
  margin-left: 100px;
}
</style>
