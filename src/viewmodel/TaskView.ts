import { Document, State, Task } from '@/model'
import { formatDate } from '../utils'

export default class TaskView {
  childs: TaskView[];

  constructor(readonly document: Document, readonly baseDate: Date, readonly innerTask: Task) {
    this.childs = [];
  }

  get name(): string | undefined {
    return this.innerTask.title;
  }

  get members(): string[] {
    return this.innerTask.members.map((member) => member.name);
  }

  get membersWithChilds(): string[] {
    return this.innerTask.membersWithChilds.map((member) => member.name);
  }

  get priority(): string | undefined {
    return this.innerTask.priority;
  }

  get scheduled(): string | undefined {
    const scheduled = this.innerTask.scheduled;
    if (!scheduled) return undefined;
    return formatDate(scheduled, this.baseDate);
  }

  get state(): string | undefined {
    if (this.innerTask.state) {
      return this.innerTask.state.name;
    }

    const taskCont = this.innerTask.taskCount;

    if (taskCont[1] == 0) {
      return undefined;
    }

    var state: State | undefined;

    if (taskCont[0] == 0) {
      state = this.document.stateTodoDft;
    }
    else if (taskCont[0] == taskCont[1]) {
      state = this.document.stateDoneDft;
    }
    else {
      state = this.document.stateProcessDft;
    }

    if (state) {
      return state.name;
    }
    else {
      return undefined;
    }
  }

  get taskCount(): [number, number] | undefined {
    const taskCont = this.innerTask.taskCount;

    if (taskCont[1] == 0) {
      return undefined;
    }
    else {
      return taskCont;
    }
  }

  get progress(): number | undefined {
    const taskCont = this.innerTask.taskCount;

    if (taskCont[1] == 0) {
      return undefined;
    }
    else {
      return taskCont[0] / taskCont[1];
    }
  }

  get category(): string | undefined {
    const c = this.innerTask.category;
    return c ? c.name : undefined;
  }
}
