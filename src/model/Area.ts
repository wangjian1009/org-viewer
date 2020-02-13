
export class Area {
    private _name: string;

    get name(): string {
        return this._name;
    }

    constructor(name: string) {
        this._name = name;
    }
}
