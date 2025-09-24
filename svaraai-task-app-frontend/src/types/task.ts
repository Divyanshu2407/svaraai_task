export interface Task {
  _id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  deadline: string;
  projectId: string;
  createdAt: string;
}
