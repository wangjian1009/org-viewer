import { Document } from './Document';
import { Area } from './Area';
import { State } from './State';
import { Tag } from './Tag';
import { Member } from './Member';
import { StateLog } from './StateLog';

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
    private _persistentId: ChangeableValue<string> | undefined;
    private _state: ChangeableValue<State> | undefined;
    private _title: ChangeableValue<string> | undefined;
    private _content: ChangeableValue<string> | undefined;
    private _scheduled: ChangeableValue<Date> | undefined;
    private _deadline: ChangeableValue<Date> | undefined;
    private _priority: ChangeableValue<string> | undefined;
    private _tags: ChangeableValue<Tag[]> | undefined;
    private _members: ChangeableValue<Member[]> | undefined;
    private _stateLogs: ChangeableValue<StateLog[]> | undefined;

    constructor(readonly docuent: Document, area: Area, parent: Task | undefined) {
        this.localId = docuent._generateLocalId();
        this._area = area;
        this._subTasks = [];
        this._parent = parent;

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
    }

    get area(): Area {
        return this._area;
    }

    get sate(): State | undefined {
        return getChangeableValue(this._state);
    }

    set originState(state: State | undefined) {
        this._state = createChangeableValue(state);
    }

    get scheduled(): Date | undefined {
        return getChangeableValue(this._scheduled);
    }

    set originScheduled(date: Date | undefined) {
        this._scheduled = createChangeableValue(date);
    }

    get deadline(): Date | undefined {
        return getChangeableValue(this._deadline);
    }

    set originDeadline(date: Date | undefined) {
        this._deadline = createChangeableValue(date);
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
            return this.docuent.priorityDft;
        }
    }

    set originPriority(priority: string | undefined) {
        this._priority = createChangeableValue(priority);
    }

    get persistentId(): string | undefined {
        return getChangeableValue(this._persistentId);
    }

    get title(): string | undefined {
        return getChangeableValue(this._title);
    }

    set originTitle(title: string | undefined) {
        this._title = createChangeableValue(title);
    }

    get content(): string | undefined {
        return getChangeableValue(this._content);
    }

    set originContent(content: string | undefined) {
        this._title = createChangeableValue(content);
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

    get members(): Member[] {
        const selfMembers = getChangeableValue(this._members);
        if (selfMembers) return Array.from(selfMembers);

        if (this.parent) return this.parent.members;

        return [];
    }

    set originMembers(members: Member[] | undefined) {
        this._members = createChangeableValue(members);
    }

    get selfMembers(): Member[] | undefined {
        return getChangeableValue(this._members);
    }

    hasMember(member: Member): boolean {
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
