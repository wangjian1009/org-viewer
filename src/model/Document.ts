import { Node } from './Node';
import { State } from './State';
import { Tag } from './Tag';
import { Member } from './Member';
import { Area } from './Area';
import { Task } from './Task';

export class Document extends Node {
    private _areas: Area[];
    private _states: State[];
    private _tags: Tag[];
    private _members: Member[];
    private _localIdMax: number;
    private _localIdToTask: Map<string, Task>;

    priorityMin: string;
    priorityMax: string;
    priorityDft: string;

    constructor() {
        super();

        this._localIdMax = 0;
        this._states = [];
        this._areas = [];
        this._tags = [];
        this._members = [];
        this._localIdToTask = new Map();

        this.priorityMin = 'A';
        this.priorityMax = 'C';
        this.priorityDft = 'B';
    }

    dispose() {
        for (const area of this._areas) {
            area.dispose();
        }
        console.assert(this._localIdToTask.size == 0);
    }

    get states(): State[] {
        return Array.from(this._states);
    }

    get areas(): Area[] {
        return Array.from(this._areas);
    }

    findArea(name: string): Area | undefined {
        return this._areas.find((area) => area.title == name);
    }

    get tags(): Tag[] {
        return Array.from(this._tags.values());
    }

    findTag(name: string): Tag | undefined {
        return this._tags.find((tag) => tag.name == name);
    }

    get member(): Member[] {
        return Array.from(this._members.values());
    }

    _generateLocalId() {
        return (++this._localIdMax).toString();
    }

    _addArea(area: Area) {
        this._areas.push(area);
    }

    _removeArea(area: Area) {
        const pos = this._areas.findIndex((checkArea) => checkArea == area);
        if (pos >= 0) {
            this._areas.slice(pos, 1);
        }
    }

    _addTask(task: Task) {
        this._localIdToTask.set(task.localId, task);
    }

    _removeTask(task: Task) {
        this._localIdToTask.delete(task.localId);
    }
}
