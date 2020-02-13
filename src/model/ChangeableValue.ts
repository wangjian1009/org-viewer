class ChangeableValue<T> {
    private _isChanged: boolean;
    private _changed: T | undefined;

    get value(): T | undefined {
        return this._isChanged ? this._changed : this._origin;
    }

    constructor(readonly _origin: T) {
        this._isChanged = false;
    }
}

function getChangeableValue<T>(o: ChangeableValue<T> | undefined): T | undefined {
    if (o) {
        return o.value;
    }
    else {
        return undefined;
    }
}
