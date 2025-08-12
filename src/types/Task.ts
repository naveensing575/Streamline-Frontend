export interface Task {
  subTasks: string[] | undefined
  _id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'done'
  dueDate?: string
}
