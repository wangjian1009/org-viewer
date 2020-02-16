import TaskView from './TaskView'
import { ResultNode, Document, TagType, Area, Tag, Searcher, Task } from '@/model'

export enum DateRangeType {
  Day,
  Week,
  Monty,
}

export default class PageView {
  /*过滤条件 */
  hideCompleted: boolean;
  hideWaiting: boolean;

  dateFilterType: DateRangeType | undefined;
  dateFilter: [Date, Date] | undefined;
  areaFilter: string[] | undefined
  tagFilter: string[] | undefined
  memberFilter: string[] | undefined
  categoryFilter: string[] | undefined

  /*基础数据*/
  title: string | undefined = ""
  areas: string[] = []
  taskTags: string[] = []
  memberTags: string[] = []
  categoryTags: string[] = []

  /*控件 */
  taskView?: TaskView

  constructor(readonly document: Document, readonly baseDate: Date) {
    this.title = document.title
    this.areas = this.transferAreas(document.areas)
    this.categoryTags = this.transferTags(document.tags(TagType.Category))
    this.memberTags = this.transferTags(document.tags(TagType.Member))
    this.taskTags = this.transferTags(document.tags(TagType.Other))
    this.hideCompleted = true;
    this.hideWaiting = true;

    document.tags(TagType.Category)

    this.setupToDoday();
    this.search();
  }

  generateTaskView(node: ResultNode | undefined, level: number): TaskView | undefined {
    if (!node) return;

    let task = <Task>node.value
    if (!task) return;

    let taskView = new TaskView(this.document, this.baseDate, task, level);

    if (node.childs && node.childs.length > 0) {
      for (const child of node.childs) {
        let childTaskView = this.generateTaskView(child, level + 1)
        if (childTaskView) {
          taskView.childs.push(childTaskView);
        }
      }
    }

    return taskView;
  }

  transferAreas(areas: Area[]) {
    let _areas: string[] = []

    for (const area of areas) {
      if (area.title) {
        _areas.push(area.title)
      }
    }

    return _areas
  }

  transferTags(tags: Tag[]) {
    let _tags: string[] = []

    for (const tag of tags) {
      if (tag.name) {
        _tags.push(tag.name)
      }
    }

    return _tags
  }

  private setupToDoday() {
    this.reset();
    this.dateFilterType = DateRangeType.Day;
    this.dateFilter = [new Date(Date.now()), new Date(Date.now())];
  }

  private reset() {
    this.dateFilterType = undefined;
    this.areaFilter = undefined;
    this.tagFilter = undefined;
    this.memberFilter = undefined;
    this.categoryFilter = undefined;
  }

  search() {
    const searcher = new Searcher(this.document);
    searcher.includeArea = false;

    if (this.hideCompleted || this.hideWaiting) {
      searcher.stateFilter = [];

      for (const state of this.document.states) {
        if (this.hideCompleted && state.isDone) {
          continue;
        }

        if (this.hideWaiting && state == this.document.stateWaitingDft) {
          continue;
        }

        searcher.stateFilter.push(state);
      }
    }

    if (this.dateFilterType && this.dateFilter) {
      searcher.dateRangeBegin = this.dateFilter[0];
      searcher.dateRangeEnd = this.dateFilter[1];
    }

    if (this.memberFilter && this.memberFilter.length > 0) {
      searcher.memberFilter = this.memberFilter
    }

    if (this.areaFilter && this.areaFilter.length > 0) {
      searcher.areaFilter = this.areaFilter
    }

    if (this.tagFilter && this.tagFilter.length > 0) {
      searcher.tagFilter = this.tagFilter
    }

    if (this.categoryFilter && this.categoryFilter.length > 0) {
      searcher.categoryFilter = this.categoryFilter
    }

    searcher.go()
    let rootNode = searcher.result
    this.taskView = this.generateTaskView(rootNode, 0)
    console.log(rootNode)
    console.log(this.taskView)
  }
}
