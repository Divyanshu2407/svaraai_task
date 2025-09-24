import axios from "axios";
import { Project } from "@/types/project";

const BASE_URL = "http://localhost:4000/api/projects";

export const getProjects = (token: string) =>
  axios.get<Project[]>(BASE_URL, { headers: { Authorization: `Bearer ${token}` } });

export const createProject = (token: string, data: { name: string; description: string }) =>
  axios.post(BASE_URL, data, { headers: { Authorization: `Bearer ${token}` } });
