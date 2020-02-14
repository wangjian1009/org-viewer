import { Node } from './Node';
import { Document } from './Document'
import { Task } from './Task'

export class Area extends Node {
    private _rootTasks: Task[];

    constructor(readonly document: Document) {
        super();

        this._rootTasks = [];

        document._addArea(this);
    }

    dispose() {
        for (const task of this._rootTasks) {
            task.dispose();
        }

        this.document._removeArea(this);
    }

    createTask(): Task {
        return new Task(this.document, this, undefined);
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
