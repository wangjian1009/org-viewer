export default interface TaskView {
  name?: string | undefined
  members?: string[] | undefined
  priority?: string | undefined
  scheduled?: string | undefined
  state?: string | undefined
  progress?: string
  category?: string
  childs: TaskView[]
}
