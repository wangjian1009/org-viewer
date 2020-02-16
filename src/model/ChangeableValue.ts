export class ChangeableValue<T> {
  private _isChanged: boolean;
  private _changed: T;

  get value(): T {
    return this._isChanged ? this._changed : this._origin;
  }

  constructor(readonly _origin: T) {
    this._isChanged = false;
    this._changed = _origin;
  }
}

export function getChangeableValue<T>(o: ChangeableValue<T> | undefined): T | undefined {
  if (o) {
    return o.value;
  }
  else {
    return undefined;
  }
}

export function createChangeableValue<T>(o: T | undefined) {
  if (o) {
    return new ChangeableValue<T>(o);
  }
  else {
    return undefined;
  }
}
