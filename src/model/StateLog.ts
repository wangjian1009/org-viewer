import { State } from './State';

export class StateLog {
  constructor(readonly stateFrom: State, readonly stateTo: State, readonly date: Date) {
  }
}
