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
        for (const task in this._rootTasks) {
            task.dispose();
        }
    }

    get name(): string {
        return this._name;
    }

    createTask(): Task {
        return new Task(this.docuent, this, undefined);
    }

    _addRootTask(task: Task) {
    }

    _removeRootTask(task: Task) {
    }
}
