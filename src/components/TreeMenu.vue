<template>
  <div>
    <Row class="top-bar">
      <Col span="9">任务</Col>
      <Col span="2">优先级</Col>
      <Col span="2">开始时间</Col>
      <Col span="2">持续时间</Col>
      <Col span="3">状态</Col>
      <Col span="3">进度</Col>
      <Col span="3">人员</Col>
    </Row>
    <TreeMenuItem :class="{ odd: index % 2 == 0 }" :task="task" :key="task.name" v-for="(task, index) in tasks" />
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

.odd {
  background: #eee;
}

.even {
  background: #ddd;
}

</style>
