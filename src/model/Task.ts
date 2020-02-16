import { Moment } from 'moment';
import { Document } from './Document';
import { Area } from './Area';
import { State } from './State';
import { Tag } from './Tag';
import { StateLog } from './StateLog';
import { ChangeableValue, createChangeableValue, getChangeableValue } from './ChangeableValue';

export enum TaskType {
  Task,
  Project,
  Requirement,
}

export class Task {
  readonly localId: string;
  private _area: Area;
  private _parent: Task | undefined;
  private _subTasks: Task[];
  private _title: ChangeableValue<string> | undefined;
  private _persistentId: ChangeableValue<string> | undefined;
  private _state: ChangeableValue<State> | undefined;
  private _content: ChangeableValue<string> | undefined;
  private _scheduled: ChangeableValue<Moment> | undefined;
  private _deadline: ChangeableValue<Moment> | undefined;
  private _priority: ChangeableValue<string> | undefined;
  private _category: ChangeableValue<Tag> | undefined;
  private _tags: ChangeableValue<Tag[]> | undefined;
  private _members: ChangeableValue<Tag[]> | undefined;
  private _stateLogs: ChangeableValue<StateLog[]> | undefined;

  constructor(readonly document: Document, area: Area, parent: Task | undefined) {
    this.localId = document._generateLocalId();
    this._area = area;
    this._subTasks = [];
    this._parent = parent;

    this.document._addTask(this);

    if (parent) {
      parent._addSubTask(this);
    }
    else {
      area._addRootTask(this);
    }
  }

  dispose() {
    for (const subTask of this._subTasks) {
      subTask.dispose();
    }

    if (this._parent) {
      this._parent._removeSubTask(this);
    }
    else {
      this.area._removeRootTask(this);
    }

    this.document._removeTask(this);
  }

  get area(): Area {
    return this._area;
  }

  get title(): string | undefined {
    return getChangeableValue(this._title);
  }

  set originTitle(title: string | undefined) {
    this._title = createChangeableValue(title);
  }

  get persistentId(): string | undefined {
    return getChangeableValue(this._persistentId);
  }

  set originPersistentId(persistentId: string | undefined) {
    const fromId = getChangeableValue(this._persistentId);
    this._persistentId = createChangeableValue(persistentId);
    this.document._updateTagPersistentId(this, fromId, persistentId);
  }

  get state(): State | undefined {
    const s = getChangeableValue(this._state);
    if (s) return s;

    return undefined;
  }

  get isDone(): boolean {
    const s = this.state;
    return s ? s.isDone : false;
  }

  get stateWithChilds(): State | undefined {
    const s = getChangeableValue(this._state);
    if (s) return s;

    var waiting_count = 0;
    var processing_count = 0;
    var done_count = 0;
    var todo_count = 0;

    for (const subTask of this._subTasks) {
      const subState = subTask.stateWithChilds;
      if (subState) {
        if (subState.isDone) {
          done_count++;
        }
        else if (subState == this.document.stateProcessDft) {
          processing_count++;
        }
        else if (subState == this.document.stateWaitingDft) {
          waiting_count++;
        }
        else {
          todo_count++;
        }
      }
    }

    if (processing_count > 0) {
      return this.document.stateProcessDft;
    }
    else if (todo_count > 0) {
      return this.document.stateTodoDft;
    }
    else if (waiting_count > 0) {
      return this.document.stateWaitingDft;
    }
    else if (done_count > 0) {
      return this.document.stateDoneDft;
    }
    else {
      return undefined;
    }
  }

  get taskCount(): [number, number] {
    const summary: [number, number] = [0, 0];

    for (const subTask of this._subTasks) {
      const subSummary = subTask.taskCount;
      summary[0] += subSummary[0];
      summary[1] += subSummary[1];
    }

    const s = getChangeableValue(this._state);
    if (s) {
      summary[1]++;
      if (s.isDone) {
        summary[0]++;
      }
    }

    return summary;
  }

  set originState(state: State | undefined) {
    this._state = createChangeableValue(state);
  }

  get scheduled(): Moment | undefined {
    return getChangeableValue(this._scheduled);
  }

  set originScheduled(date: Moment | undefined) {
    this._scheduled = createChangeableValue(date);
  }

  get deadline(): Moment | undefined {
    return getChangeableValue(this._deadline);
  }

  set originDeadline(date: Moment | undefined) {
    this._deadline = createChangeableValue(date);
  }

  get done(): Moment | undefined {
    const s = this.state;
    if (!s || !s.isDone) return undefined;

    return this.scheduled;
  }

  get parent(): Task | undefined {
    return this._parent;
  }

  get priority(): string | undefined {
    const selfPriority = getChangeableValue(this._priority);
    if (selfPriority) return selfPriority;

    if (this._parent) {
      return this._parent.priority;
    }
    else {
      return this.document.priorityDft;
    }
  }

  set originPriority(priority: string | undefined) {
    this._priority = createChangeableValue(priority);
  }

  get category(): Tag | undefined {
    return getChangeableValue(this._category);
  }

  set originCategory(category: Tag | undefined) {
    this._category = createChangeableValue(category);
  }

  get content(): string | undefined {
    return getChangeableValue(this._content);
  }

  set originContent(content: string | undefined) {
    this._content = createChangeableValue(content);
  }

  get tags(): Tag[] {
    const selfTags = getChangeableValue(this._tags);
    if (selfTags) return Array.from(selfTags);
    return [];
  }

  set originTags(tags: Tag[] | undefined) {
    this._tags = createChangeableValue(tags);
  }

  hasTag(tag: Tag): boolean {
    const selfTags = getChangeableValue(this._tags);
    if (selfTags) {
      return selfTags.includes(tag);
    }

    return false;
  }

  get members(): Tag[] {
    const selfMembers = getChangeableValue(this._members);
    if (selfMembers) return Array.from(selfMembers);

    if (this.parent) return this.parent.members;

    return [];
  }

  get membersWithChilds(): Tag[] {
    const members = this.members;

    for (const subTask of this.subTasks) {
      const subMembers = subTask.membersWithChilds;
      for (const member of subMembers) {
        if (!members.includes(member)) {
          members.push(member);
        }
      }
    }

    return members;
  }

  set originMembers(members: Tag[] | undefined) {
    this._members = createChangeableValue(members);
  }

  get selfMembers(): Tag[] | undefined {
    return getChangeableValue(this._members);
  }

  hasMember(member: Tag): boolean {
    const selfMembers = getChangeableValue(this._members);
    if (selfMembers) {
      return selfMembers.includes(member);
    }

    if (this.parent) return this.parent.hasMember(member);

    return false;
  }

  get subTasks(): Task[] {
    return Array.from(this._subTasks);
  }

  get stateLogs(): StateLog[] {
    const selfStateLogs = getChangeableValue(this._stateLogs);
    if (selfStateLogs) {
      return Array.from(selfStateLogs);
    }

    return [];
  }

  _addSubTask(task: Task) {
    this._subTasks.push(task);
  }

  _removeSubTask(task: Task) {
    const pos = this._subTasks.indexOf(task);
    if (pos >= 0) {
      this._subTasks.splice(pos, 1);
    }
  }
}
