import { Document } from './Document'

export enum TagType {
    Member,
    Task,
    Other,
}

export class Tag {
    private _name: string;

    get name(): string {
        return this._name;
    }

    constructor(readonly document: Document, readonly type: TagType, name: string) {
        this._name = name;
        this.document._addTag(this);
    }

    dispose() {
        this.document._removeTag(this);
    }
}
