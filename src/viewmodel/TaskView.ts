import { Moment } from 'moment'
import { Document, State, Task } from '@/model'

export default class TaskView {
  childs: TaskView[];

  constructor(
    readonly document: Document,
    readonly baseDate: Moment,
    readonly innerTask: Task,
    readonly level: number) {
    this.childs = [];
  }

  get name(): string | undefined {
    return this.innerTask.title;
  }

  get members(): string[] {
    return this.innerTask.members.map((member) => member.name);
  }

  get membersWithChilds(): string[] {
    const members = this.members;

    for (const subTask of this.childs) {
      const subMembers = subTask.membersWithChilds;
      for (const member of subMembers) {
        if (!members.includes(member)) {
          members.push(member);
        }
      }
    }

    return members;
  }

  get priority(): string | undefined {
    return this.innerTask.priority;
  }

  get scheduled(): string | undefined {
    const scheduled = this.innerTask.scheduledWithChilds;
    if (!scheduled) return undefined;

    var strDate = scheduled.calendar(this.baseDate);

    if (strDate) {
      const m = strDate.match(/^(.*)00:00(.*)$/);
      if (m) {
        strDate = `${m[1]}${m[2]}`;
      }
    }

    return strDate;
  }

  get state(): string | undefined {
    const s = this.innerTask.stateWithChilds;
    return s ? s.name : undefined;
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
    return this.innerTask.progress;
  }

  get category(): string | undefined {
    const c = this.innerTask.category;
    return c ? c.name : undefined;
  }

  get suggestOpen(): boolean {
    return this.innerTask.stateWithChilds == this.document.stateProcessDft;
  }
}
