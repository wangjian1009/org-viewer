import { Document } from './Document';
import { Area } from './Area';

export class Task {
    readonly localId: string;
    private _area: Area;
    private _persistentId: ChangeableValue<string> | undefined;
    private _parent: Task | undefined;
    private _subTasks: Task[];

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

    get persistentId(): string | undefined {
        return getChangeableValue(this._persistentId);
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
