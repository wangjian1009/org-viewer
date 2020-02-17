<template>
  <div id="app" v-if="!loading">
    <Row>
      <Col span="3" push="1" class="container">
        <Divider class="title">过滤条件</Divider>
        <Row class="filter">
          <Col span="22" push="1">
            <Card class="who-card">
              <span>我是</span>
              <Select v-model="whoami" @on-change="changeWhoami">
                <Option v-for="(member, index) in page.memberTags" :value="member" :key="index">{{ member }}</Option>
              </Select>
            </Card>
          </Col>
        </Row>
        <Row class="filter">
          <Col span="22" push="1">
            <Card>
              <Checkbox v-model="page.dateFilter">
                <ButtonGroup>
                  <Button size="small" @click="previewDate">
                    <Icon type="md-arrow-dropleft"></Icon>
                  </Button>
                  <Button size="small" disabled>今天</Button>
                  <Button size="small" @click="nextDate">
                    <Icon type="md-arrow-dropright"></Icon>
                  </Button>
                </ButtonGroup>
              </Checkbox>
            </Card>
          </Col>
        </Row>
        <Row class="filter">
          <Col span="22" push="1">
            <Card class="hide-condition">
                <Checkbox v-model="page.hideCompleted" @on-change="changeFilter">隐藏已完成</Checkbox>
                <Checkbox v-model="page.hideWaiting" @on-change="changeFilter">隐藏等待中</Checkbox>
            </Card>
          </Col>
        </Row>
        <Row class="filter">
          <Col span="22" push="1">
            <Card>
              <p slot="title">重置为</p>
              <ButtonGroup>
                <Button @click="resetToToday">当日</Button>
                <Button>未分配</Button>
              </ButtonGroup>
            </Card>
          </Col>
        </Row>
        <Row class="filter">
          <Col span="22" push="1">
            <Card>
              <p slot="title">人员</p>
              <CheckboxGroup v-model="memberFilter" @on-change="changeFilter">
                <Checkbox v-for="(member, index) in page.memberTags" :label="member" :key="index">
                </Checkbox>
              </CheckboxGroup>
            </Card>
          </Col>
        </Row>
        <Row class="filter">
          <Col span="22" push="1">
            <Card>
              <p slot="title">范围</p>
              <CheckboxGroup v-model="areaFilter" @on-change="changeFilter">
                <Checkbox v-for="(area, index) in page.areas" :label="area" :key="index">
                </Checkbox>
              </CheckboxGroup>
            </Card>
          </Col>
        </Row>
        <Row class="filter">
          <Col span="22" push="1">
            <Card>
              <p slot="title">类型</p>
              <CheckboxGroup v-model="categoryFilter" @on-change="changeFilter">
                <Checkbox v-for="(category, index) in page.categoryTags" :label="category" :key="index">
                  <Icon type="md-folder-open" v-if="category == 'PROJECT'"></Icon>
                  <Icon type="md-people" v-if="category == 'REQUIREMENT'" />
                  <Icon type="md-git-branch" v-if="category == 'VERSION'" />
                  <Icon type="md-bug" v-if="category == 'BUG'" />
                  <Icon type="ios-book" v-if="!category" />
                  <span>{{ category }}</span>
                </Checkbox>
              </CheckboxGroup>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span="19" push="1" class="container">
        <Divider class="title">{{ page.title }}</Divider>
        <TreeMenu class="tree-menu" :tasks="page.taskView.childs"></TreeMenu>
      </Col>
    </Row>
    
  </div>
</template>

<script lang="ts">
import "view-design/dist/styles/iview.css";

import moment from 'moment';
import { Component, Vue, Watch } from "vue-property-decorator";
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
  whoami = ""

  // 页面上直接绑定page.memberFilter会有bug，暂未查明原因
  memberFilter: string[] = [];
  categoryFilter: string[] = [];
  areaFilter: string[] = [];

  async beforeCreate() {
    let orgContent = await OrgLoader.loadFromGitlab(
      "/gitlab/api/v4/projects/335/repository/files/SFOX项目工作.org?private_token=t_qdgdriLGRp3hpPrtqz&ref=master"
    )

    let document = OrgParser.parseNewDocument(orgContent);
    this.page = new PageView(document, moment(moment.now()))
    this.loading = false

    let _whoami = localStorage.getItem("whoami")
  
    if (_whoami) {
      this.whoami = _whoami
    }
  }

  changeFilter() {
    this.page.memberFilter = this.memberFilter
    this.page.categoryFilter = this.categoryFilter
    this.page.areaFilter = this.areaFilter

    this.search()
  }

  search() {
    this.page.search()
  }

  resetToToday() {
    console.log("resetToToday");
    this.page.setupToDoday();
    this.memberFilter = this.page.memberFilter || [];
    this.categoryFilter = this.page.categoryFilter || [];
    this.areaFilter = this.page.areaFilter || [];
    this.search();
  }

  previewDate() {
    console.log("previewDate")
  }

  nextDate() {
    console.log("nextDate")
  }

  changeWhoami(data: any) {
    localStorage.setItem("whoami", data)
    this.search()
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

  .filter {
    margin-bottom: 16px;

    .hide-condition {
      .ivu-card-body {
        padding: 6px;
      }
    }
  }

  .who-card {
    text-align: left;

    .ivu-select {
      width: 60%;
      margin-left: 12px;
    }
  }
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-top: 24px;
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

.ivu-checkbox-group-item {
  display: block;
  text-align: left;
  line-height: 32px;
  height: 32px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;

  span {
    margin-right: 2px;
  }

  i {
    margin-right: 6px;
  }
}

.ivu-card-head {
  padding: 6px 16px 0px 16px;
}

.ivu-card-body {
  padding: 8px 16px;

  .ivu-btn {
    padding: 4px;
  }
}
</style>
