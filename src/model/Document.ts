import { State } from './State';
import { Tag, TagType } from './Tag';
import { Area } from './Area';
import { Task } from './Task';
import { ChangeableValue, createChangeableValue, getChangeableValue } from './ChangeableValue';

export class Document {
    private _title: ChangeableValue<string> | undefined;
    private _areas: Area[];
    private _states: State[];
    private _stateDoneDft: State | undefined;
    private _stateProcessDft: State | undefined;
    private _tags: Map<TagType, Tag[]>;
    private _localIdMax: number;
    private _localIdToTask: Map<string, Task>;
    private _persistentIdToTask: Map<string, Task>;

    priorityMin: string;
    priorityMax: string;
    priorityDft: string;

    constructor() {
        this._localIdMax = 0;
        this._states = [];
        this._areas = [];
        this._tags = new Map();
        this._localIdToTask = new Map();
        this._persistentIdToTask = new Map();

        this.priorityMin = 'A';
        this.priorityMax = 'C';
        this.priorityDft = 'B';
    }

    dispose() {
        for (const area of this._areas) {
            area.dispose();
        }
        console.assert(this._localIdToTask.size == 0);

        for (const tags of this._tags.values()) {
            for (const tag of tags) {
                tag.dispose();
            }
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

    get stateDoneDft(): State | undefined {
        return this._stateDoneDft;
    }

    get stateProcessDft(): State | undefined {
        return this._stateProcessDft;
    }

    findState(stateName: string): State | undefined {
        return this._states.find((state) => state.name == stateName);
    }

    get areas(): Area[] {
        return Array.from(this._areas);
    }

    findArea(name: string): Area | undefined {
        return this._areas.find((area) => area.title == name);
    }

    tags(tagType: TagType): Tag[] {
        const tags = this._tags.get(tagType);
        if (tags) {
            return Array.from(tags.values());
        }
        else {
            return [];
        }
    }

    findTag(name: string): Tag | undefined {
        for (const tags of this._tags.values()) {
            const tag = tags.find((t) => t.name == name);
            if (tag) return tag;
        }

        return undefined;
    }

    findTaskByPersistentId(id: string): Task | undefined {
        return this._persistentIdToTask.get(id);
    }

    findTaskByLocalId(id: string): Task | undefined {
        return this._localIdToTask.get(id);
    }

    _generateLocalId() {
        return (++this._localIdMax).toString();
    }

    _addState(state: State) {
        this._states.push(state);

        if (state.isDone) {
            if (!this._stateDoneDft) {
                this._stateDoneDft = state;
            }
        }
        else {
            if (!this._stateProcessDft) {
                this._stateProcessDft = state;
            }
        }
    }

    _removeState(state: State) {
        const pos = this._states.findIndex((checkState) => checkState == state);
        if (pos >= 0) {
            this._states.slice(pos, 1);
        }

        if (this._stateDoneDft == state) {
            this._stateDoneDft = undefined;
        }

        if (this._stateProcessDft == state) {
            this._stateProcessDft = undefined;
        }
    }

    _addTag(tag: Tag) {
        var tags = this._tags.get(tag.type);
        if (!tags) {
            tags = [];
            this._tags.set(tag.type, tags);
        }
        tags.push(tag);
    }

    _removeTag(tag: Tag) {
        var tags = this._tags.get(tag.type);
        if (tags) {
            const pos = tags.findIndex((checkTag) => checkTag == tag);
            if (pos >= 0) {
                tags.slice(pos, 1);
                if (tags.length == 0) {
                    this._tags.delete(tag.type);
                }
            }
        }
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

        const persistentId = task.persistentId;
        if (persistentId) {
            this._updateTagPersistentId(task, undefined, persistentId);
        }
    }

    _removeTask(task: Task) {
        const persistentId = task.persistentId;
        if (persistentId) {
            this._updateTagPersistentId(task, persistentId, undefined);
        }

        this._localIdToTask.delete(task.localId);
    }

    _updateTagPersistentId(task: Task, fromId: string | undefined, toId: string | undefined) {
        if (fromId) {
            if (this._persistentIdToTask.get(fromId) == task) {
                this._persistentIdToTask.delete(fromId);
            }
        }

        if (toId) {
            if (!this._persistentIdToTask.has(toId)) {
                this._persistentIdToTask.set(toId, task);
            }
        }
    }
}
