<template>
  <div>
    <Row class="task-row">
      <Col span="9" class="name">
        <span class="sub-title" @click="toggle">
          <em v-if="hasChild" class="icon">
            <Icon v-if="!isOpen" type="ios-arrow-forward" />
            <Icon v-if="isOpen" type="ios-arrow-down" />
          </em>
          <em v-if="!hasChild"></em>
          <Tooltip :content="task.name" :transfer="true" max-width="400">
            <Icon type="md-folder-open" v-if="task.category == 'PROJECT'" />
            <Icon type="md-people" v-if="task.category == 'REQUIREMENT'" />
            <Icon type="md-git-branch" v-if="task.category == 'VERSION'" />
            <Icon type="md-bug" v-if="task.category == 'BUG'" />
            <Icon type="ios-list-box-outline" v-if="!task.category" />
          </Tooltip>
          {{ task.name ? task.name : "-" }}
        </span>
      </Col>
      <Col span="3">{{ task.priority ? task.priority : "-" }} 
      </Col>
      <Col span="3">{{ task.scheduled ? task.scheduled : "-" }}</Col>
      <Col span="3">{{ task.state ? task.state : "-" }}</Col>
      <Col span="3">{{ task.progress ? task.progress : "-" }}</Col>
      <Col span="3">
      <Tag color="success" v-for="(member, index) in isOpen ? (task.members || []) : (task.membersWithChilds || []) " :key="index">{{ member }}</Tag>
      </Col>
    </Row>
    <transition name="fade">
      <div v-if="hasChild" v-show="isOpen" class="sub-task">
        <TreeMenuItem
          v-for="(item, index) in task.childs"
          :task="item"
          :key="index"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TaskView } from "../viewmodel";

@Component({
  name: "TreeMenuItem"
})
export default class TreeMenuItem extends Vue {
  @Prop()
  task!: TaskView;

  isOpen: boolean = false;

  toggle(): void {
    console.log(this.isOpen);
    this.isOpen = !this.isOpen;
  }

  get hasChild() {
    return this.task.childs && this.task.childs.length > 0;
  }
}
</script>
<style lang="less" scoped>
.task-row {
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

  .name {
    text-align: left;
    height: 100%;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
  }
}

.sub-task {
  .sub-title {
    width: 95%;
    margin-left: 20px;
    display: block;
    height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
  }
}

.task-row:hover {
  background: #eeeeee;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
