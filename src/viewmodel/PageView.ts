import TaskView from './TaskView'
import { ResultNode, Document, TagType, Area, Tag, Searcher, Task } from '@/model'

export default class PageView {
  /*过滤条件 */
  hideCompleted: boolean;
  hideWaiting: boolean;

  dateFilter: Date | [Date, Date] | undefined;
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

  generateTaskView(node: ResultNode | undefined): TaskView | undefined {
    if (!node) {
      return
    }

    let value = <Task>node.value
    let name = value.title
    let priority = value.priority
    let members: string[] = []
    let membersWithChilds: string[] = []
    let scheduled
    let state
    let category

    if (value.scheduled) {
      scheduled = this.formatDate(value.scheduled, "yyyy-MM-dd")
    }

    if (value.state) {
      state = value.state.name
    }

    if (value.category) {
      category = value.category.name
    }

    if (value.members) {
      for (const member of value.members) {
        members.push(member.name)
      }
    }

    if (value.membersWithChilds) {
      for (const member of value.membersWithChilds) {
        membersWithChilds.push(member.name)
      }
    }

    let tv: TaskView = {
      name,
      priority,
      members,
      membersWithChilds,
      scheduled,
      state,
      category,
      childs: []
    }

    if (node.childs && node.childs.length > 0) {
      for (const child of node.childs) {
        let t = this.generateTaskView(child)

        if (t) {
          tv.childs.push(t)
        }
      }
    }

    return tv
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

  formatDate(date: Date, fmt: string) {
    var o: any = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
      "q+": Math.floor((date.getMonth() + 3) / 3),
      "S": date.getMilliseconds()
    }

    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }

    return fmt;
  }

  private setupToDoday() {
    this.resete();
    this.dateFilter = new Date();
  }

  private resete() {
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

        if (this.hideWaiting && state.name == "WAITING") {
          continue;
        }

        searcher.stateFilter.push(state);
      }
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
    this.taskView = this.generateTaskView(rootNode)
    console.log(rootNode)
    console.log(this.taskView)
  }
}
