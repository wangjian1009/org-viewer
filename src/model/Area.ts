import { Document } from './Document'
import { Task } from './Task'
import { ChangeableValue, createChangeableValue, getChangeableValue } from './ChangeableValue';

export class Area {
    private _title: ChangeableValue<string> | undefined;
    private _rootTasks: Task[];

    constructor(readonly document: Document) {
        this._rootTasks = [];
        document._addArea(this);
    }

    dispose() {
        for (const task of this._rootTasks) {
            task.dispose();
        }

        this.document._removeArea(this);
    }

    get title(): string | undefined {
        return getChangeableValue(this._title);
    }

    set originTitle(title: string | undefined) {
        this._title = createChangeableValue(title);
    }

    get rootTasks(): Task[] {
        return Array.from(this._rootTasks);
    }

    _addRootTask(task: Task) {
        this._rootTasks.push(task);
    }

    _removeRootTask(task: Task) {
        const pos = this._rootTasks.indexOf(task);
        if (pos >= 0) {
            this._rootTasks.splice(pos, 1);
        }
    }
}
