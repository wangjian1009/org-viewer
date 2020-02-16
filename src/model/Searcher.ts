import moment, { Moment } from 'moment';
import { Document } from './Document';
import { TagType } from './Tag';
import { Area } from './Area';
import { Task } from './Task';
import { State } from './State';

type Node = Document | Area | Task;

export class ResultNode {
  childs: ResultNode[];

  constructor(readonly parent: ResultNode | undefined, readonly value: Node) {
    this.childs = [];
  }
}

export class Searcher {
  memberFilter: string[] | undefined;
  tagFilter: string[] | undefined;
  categoryFilter: string[] | undefined;
  areaFilter: string[] | undefined;
  dateRangeBegin: Moment | undefined;
  dateRangeEnd: Moment | undefined;
  stateFilter: State[] | undefined;
  includeArea: boolean | undefined;
  _result: ResultNode | undefined;

  constructor(readonly document: Document) {
  }

  get result(): ResultNode | undefined {
    return this._result;
  }

  go() {
    const rootNode = new ResultNode(undefined, this.document);

    for (const area of this.document.areas) {
      var areaNode = rootNode;
      if (this.includeArea) {
        areaNode = new ResultNode(rootNode, area);
        rootNode.childs.push(areaNode);
      }

      for (const task of area.rootTasks) {
        this._process(areaNode, task);
      }
    }

    this._result = rootNode;
  }

  private _process(parentNode: ResultNode, task: Task) {
    const taskNode = new ResultNode(parentNode, task);

    for (const subTask of task.subTasks) {
      this._process(taskNode, subTask);
    }

    if (taskNode.childs.length > 0 || this._taskNeedProxes(task)) {
      parentNode.childs.push(taskNode);
    }
  }

  private _taskNeedProxes(task: Task): boolean {
    if (this.areaFilter) {
      var areaFound = false;
      for (const areaName of this.areaFilter) {
        if (task.area.title != areaName) {
          areaFound = true;
          break;
        }
      }
      if (!areaFound) return false;
    }

    if (this.tagFilter) {
      var tagFound = false;
      for (const tagName of this.tagFilter) {
        const tag = this.document.findTag(TagType.Other, tagName);
        if (tag && task.hasTag(tag)) {
          tagFound = true;
          break;
        }
      }
      if (!tagFound) return false;
    }

    if (this.memberFilter) {
      var memberFound = false;
      for (const memberName of this.memberFilter) {
        const member = this.document.findTag(TagType.Member, memberName);
        if (member && task.hasMember(member)) {
          memberFound = true;
          break;
        }
      }
      if (!memberFound) return false;
    }

    if (this.categoryFilter) {
      var categoryFound = false;
      for (const categoryName of this.categoryFilter) {
        const category = task.category;
        if (category && category.name == categoryName) {
          categoryFound = true;
          break;
        }
      }
      if (!categoryFound) return false;
    }

    if (this.stateFilter) {
      const state = task.state;
      if (!state || !this.stateFilter.includes(state)) {
        return false;
      }
    }

    if (this.dateRangeBegin || this.dateRangeEnd) {
      var checked = false;
      const rangeBegin = this.dateRangeBegin ? moment(this.dateRangeBegin) : moment(this.dateRangeEnd);
      const rangeEnd = this.dateRangeEnd ? moment(this.dateRangeEnd) : moment(this.dateRangeBegin);

      const taskBegin = task.scheduled;
      if (taskBegin) {
        if (taskBegin.isAfter(rangeEnd, 'day')) return false;
        checked = true;
      }

      var taskEnd: moment.Moment | undefined;
      const state = task.state;
      if (state) {
        if (state.isDone) {
          taskEnd = task.done ? moment(task.done) : undefined;
          if (taskEnd) {
            if (taskEnd.isBefore(rangeBegin, 'day')) return false;
          }
          checked = true;
        }
      }

      if (!checked) return false;
    }

    return true;
  }

  reset() {
    this.dateRangeBegin = undefined;
    this.dateRangeEnd = undefined;
    this.includeArea = undefined;
    this.memberFilter = undefined;
    this.tagFilter = undefined;
    this.areaFilter = undefined;
    this.categoryFilter = undefined;
    this._result = undefined;
  }
}
