<template>
  <div>
    <Row class="top-bar">
      <Col span="9">任务</Col>
      <Col span="3">优先级</Col>
      <Col span="3">开始时间</Col>
      <Col span="3">状态</Col>
      <Col span="3">进度</Col>
      <Col span="3">人员</Col>
    </Row>
    <TreeMenuItem :task="task" :key="index" v-for="(task, index) in tasks" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TreeMenuItem from './TreeMenuItem.vue'
import { ResultNode } from '../model'
import { TaskView } from '../viewmodel'

@Component({
  components: {
    TreeMenuItem
  },
})

export default class TreeMenu extends Vue {
  @Prop() 
  private tasks!:  TaskView[];
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
