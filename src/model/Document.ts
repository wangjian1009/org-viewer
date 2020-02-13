import { Tag } from './Tag';
import { Member } from './Member';
import { Area } from './Area';
import { Task } from './Task';

export class Document {
    private _areas: Area[];
    private _tags: Tag[];
    private _localIdMax: number;
    private _localIdToTask: Map<string, Task>;

    constructor(public source: string) {
        this._localIdMax = 0;
        this._areas = [];
        this._tags = [];
        this._localIdToTask = new Map();
    }

    dispose() {
        for (const area in this._areas) {
            area.dispose();
        }
    }

    get areas() { return this._areas.values(); }

    createArea(name: string): Area {
        return new Area(this, name);
    }

    get tags() { return this._tags.values(); }

    findTag(name: string): Tag | undefined {
        return this._tags.find((tag) => tag.name == name);
    }

    _generateLocalId() {
        return (++this._localIdMax).toString();
    }

    _addTask(task: Task) {
        this._localIdToTask.set(task.localId, task);
    }

    _removeTask(task: Task) {
        this._localIdToTask.delete(task.localId);
    }
}
