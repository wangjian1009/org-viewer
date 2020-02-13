import { Document } from './Document';
import { Area } from './Area';

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
        if (this._parent) {
            this._parent._removeSubTask(this);
        }
        else {
            this.area._removeRootTask(this);
        }

        for (const subTask in this._subTasks) {
            subTask.dispose();
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

    subTasks(): Task[] {
        return new Array(this._subTasks.values());
    }

    _addSubTask(task: Task) {
        this._subTasks.push(task);
    }

    _removeSubTask(task: Task) {
        //this._subTasks.pop
    }
}
