import TaskView from './TaskView'
import { ResultNode, Document, TagType, Area, Tag, Searcher, Task } from '@/model'

export default class PageView {
  areaFilter: string[] | undefined
  tagFilter: string[] | undefined
  memberFilter: string[] | undefined
  categoryFilter: string[]  | undefined

  title: string | undefined = ""
  areas: string[] = []
  taskTags: string[] = []
  memberTags: string[] = []
  categoryTags: string[] = []

  taskView?: TaskView
  searcher: Searcher

  constructor(document: Document) {
    this.title = document.title
    this.areas = this.transferAreas(document.areas)
    this.categoryTags = this.transferTags(document.tags(TagType.Category))
    this.memberTags = this.transferTags(document.tags(TagType.Member))
    this.taskTags = this.transferTags(document.tags(TagType.Other))

    document.tags(TagType.Category)

    this.searcher = new Searcher(document);
    this.searcher.includeArea = false;
    this.searcher.go();

    let rootNode = this.searcher.result
    this.taskView = this.generateTaskView(rootNode)
  }

  generateTaskView(node: ResultNode | undefined): TaskView | undefined {
    if (!node) {
      return
    }

    let value = <Task>node.value
    let name = value.title
    let priority = value.priority
    let members: string[] = []
    let scheduled
    let state
    let category

    if (value.scheduled) {
      scheduled = value.scheduled.toDateString()
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

    let tv: TaskView = {
      name, 
      priority, 
      members,
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

  search() {
    this.searcher.clearFilters()
    
    if (this.memberFilter && this.memberFilter.length > 0) {
      this.searcher.memberFilter = this.memberFilter
    }

    if (this.areaFilter && this.areaFilter.length > 0) {
      this.searcher.areaFilter = this.areaFilter
    }

    if (this.tagFilter && this.tagFilter.length > 0) {
      this.searcher.tagFilter = this.tagFilter
    }

    if (this.categoryFilter && this.categoryFilter.length > 0) {
      this.searcher.categoryFilter = this.categoryFilter
    }

    this.searcher.go()
    let rootNode = this.searcher.result
    this.taskView = this.generateTaskView(rootNode)
    console.log(rootNode)
    console.log(this.taskView)  
  }
}
