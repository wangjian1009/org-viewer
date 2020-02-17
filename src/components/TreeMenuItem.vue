<template>
  <div class="item-container">
    <Row class="task-row" >
      <Col span="9" class="name">
        <span class="sub-title" :style="{marginLeft: (task.level * 24) + 'px'}" @click="toggle">
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
            <Icon type="ios-book" v-if="!task.category" />
          </Tooltip>
          {{ task.name || "-" }}
        </span>
      </Col>
      <Col span="2">{{ task.priority || "-" }} 
      </Col>
      <Col span="2">{{ task.scheduled || "-" }}</Col>
      <Col span="2">{{ task.duration || "-" }}</Col>
      <Col span="3">
        <Tag :class="lineStyle">{{ task.state || "-" }}</Tag>
      </Col>
      <Col span="3">{{ task.progress ? task.progress : "-" }}</Col>
      <Col span="3">
      <Tag v-for="(member, index) in isOpen ? (task.members || []) : (task.membersWithChilds || []) " :key="index">{{ member }}</Tag>
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

  isOpen: boolean = this.task.suggestOpen;

  toggle(): void {
    console.log(this.isOpen);
    this.isOpen = !this.isOpen;
  }

  get lineStyle() {
    let lineStyle = ""

    if (this.task.state) {
      switch(this.task.state) {
        case "TODO":
          lineStyle = "todo"
          break
        case "NEXT":
          lineStyle = "next"
          break
        case "SOMEDAY":
          lineStyle = "someday"
          break
        case "INPROGRESS":
          lineStyle = "inprogress"
          break
        case "WAITTING":
          lineStyle = "waiting"
          break
        case "DONE":
          lineStyle = "done"
          break
        case "ABORT":
          lineStyle = "abort"
          break
      }
    }

    return lineStyle
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

.todo {
  background: #02C874;
  color: #fff;
}

.next {
  background: #A8D695;
  color: #fff;
}

.someday {
  background: #BBFFBB;
  color: #fff;
}

.inprogress {
  background: #FFE153;
  color: #fff;
}

.waiting {
  background: #c5c8ce;
}

.done {
  background: #c5c8ce;
} 

.abort {
  background: #c5c8ce;
}

.sub-task {
  .sub-title {
    width: 95%;
    display: block;
    height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
  }
}

.ivu-tooltip {
  margin-right: 8px;
}

.task-row:hover {
  background: #eeeeee;
  color: #515a6e;
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
