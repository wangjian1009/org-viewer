import { State } from './State';
import { Tag } from './Tag';
import { Member } from './Member';
import { Area } from './Area';
import { Task } from './Task';
import { ChangeableValue, createChangeableValue, getChangeableValue } from './ChangeableValue';

export class Document {
    private _title: ChangeableValue<string> | undefined;
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

    get title(): string | undefined {
        return getChangeableValue(this._title);
    }

    set originTitle(title: string | undefined) {
        this._title = createChangeableValue(title);
    }

    get states(): State[] {
        return Array.from(this._states);
    }

    get areas(): Area[] {
        return Array.from(this._areas);
    }

    createArea(name: string): Area {
        return new Area(this, name);
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

    _addTask(task: Task) {
        this._localIdToTask.set(task.localId, task);
    }

    _removeTask(task: Task) {
        this._localIdToTask.delete(task.localId);
    }
}
