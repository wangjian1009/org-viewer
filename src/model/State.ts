import { Document } from './Document'

export class State {
    constructor(readonly docuent: Document, readonly name: string, readonly isDone: boolean) {
    }
}
