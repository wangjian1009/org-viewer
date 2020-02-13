
export class Task {
    private _persistentId: ChangeableValue<string> | undefined;
    private _subTasks: Array<Task>;

    get persistentId(): string | undefined {
        return getChangeableValue(this._persistentId);
    }

    constructor(readonly localId: number) {
        this._subTasks = new Array<Task>();
    }
}
