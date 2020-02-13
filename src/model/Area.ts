import { Document } from './Document'
import { Task } from './Task'

export class Area {
    private _name: string;
    private _rootTasks: Task[];

    constructor(readonly docuent: Document, name: string) {
        this._name = name;
        this._rootTasks = [];
    }

    dispose() {
        for (const task of this._rootTasks) {
            task.dispose();
        }
    }

    get name(): string {
        return this._name;
    }

    createTask(): Task {
        return new Task(this.docuent, this, undefined);
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
