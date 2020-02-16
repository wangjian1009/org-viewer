import { Document } from './Document'

export class State {
  constructor(readonly document: Document, readonly name: string, readonly isDone: boolean) {
    this.document._addState(this);
  }

  dispose() {
    this.document._removeState(this);
  }
}
