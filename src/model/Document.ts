import { Node } from './Node';
import { State } from './State';
import { Tag, TagType } from './Tag';
import { Area } from './Area';
import { Task } from './Task';

export class Document extends Node {
    private _areas: Area[];
    private _states: State[];
    private _tags: Map<TagType, Tag[]>;
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
        this._tags = new Map();
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

        for (const tags of this._tags.values()) {
            for (const tag of tags) {
                tag.dispose();
            }
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

    _generateLocalId() {
        return (++this._localIdMax).toString();
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
    }

    _removeTask(task: Task) {
        this._localIdToTask.delete(task.localId);
    }
}
