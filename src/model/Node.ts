import { ChangeableValue, createChangeableValue, getChangeableValue } from './ChangeableValue';

export abstract class Node {
    private _title: ChangeableValue<string> | undefined;
    private _persistentId: ChangeableValue<string> | undefined;

    constructor() {
    }

    get title(): string | undefined {
        return getChangeableValue(this._title);
    }

    set originTitle(title: string | undefined) {
        this._title = createChangeableValue(title);
    }

    get persistentId(): string | undefined {
        return getChangeableValue(this._persistentId);
    }

    set originPersistentId(persistentId: string | undefined) {
        this._persistentId = createChangeableValue(persistentId);
    }
}
