import { Task } from '@/model'
import { formatDate } from '../utils'

export default class TaskView {
  childs: TaskView[];

  constructor(readonly baseDate: Date, readonly innerTask: Task) {
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
    return undefined;
  }

  get progress(): string | undefined {
    return undefined;
  }

  get category(): string | undefined {
    const c = this.innerTask.category;
    return c ? c.name : undefined;
  }
}
