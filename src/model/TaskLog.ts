import { Moment } from 'moment';
import { State } from './State';

export class TaskStateChangeLog {
  constructor(readonly stateFrom: State, readonly stateTo: State, readonly date: Moment) {
  }
}

export type TaskLog = TaskStateChangeLog;

