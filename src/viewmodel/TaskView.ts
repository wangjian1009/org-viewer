export default interface TaskView {
  name?: string | undefined
  members?: string[]
  membersWithChilds?: string[]
  priority?: string | undefined
  scheduled?: string | undefined
  state?: string | undefined
  progress?: string
  category?: string
  childs: TaskView[]
}
