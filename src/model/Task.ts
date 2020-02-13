import { Document } from './Document';
import { Area } from './Area';
import { Tag } from './Tag';
import { Member } from './Member';

export enum TaskType {
    Task,
    Project,
    Requirement,
};

export class Task {
    readonly localId: string;
    private _area: Area;
    private _parent: Task | undefined;
    private _subTasks: Task[];
    private _persistentId: ChangeableValue<string> | undefined;
    private _description: ChangeableValue<string> | undefined;
    private _priority: ChangeableValue<string> | undefined;
    private _tags: ChangeableValue<Tag[]> | undefined;
    private _members: ChangeableValue<Member[]> | undefined;

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

    get persistentId(): string | undefined {
        return getChangeableValue(this._persistentId);
    }

    get description(): string | undefined {
        return getChangeableValue(this._description);
    }

    get members(): Member[] {
        const selfMembers = getChangeableValue(this._members);
        if (selfMembers) return Array.from(selfMembers);

        if (this.parent) return this.parent.members;

        return [];
    }

    get selfMembers(): Member[] | undefined {
        return getChangeableValue(this._members);
    }

    subTasks(): Task[] {
        return Array.from(this._subTasks.values());
    }

    _addSubTask(task: Task) {
        this._subTasks.push(task);
    }

    _removeSubTask(task: Task) {
        //this._subTasks.pop
    }
}
