import { create } from 'zustand'
import type { Project } from '../types'

interface ProjectsStore {
  projects: Project[]
  setProjects: (projects: Project[]) => void
  getProjectById: (id: string) => Project | undefined
}

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
  getProjectById: (id) => get().projects.find((p) => p.id === id),
}))