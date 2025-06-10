import { 
  projects, 
  partnerRecommendations,
  type Project, 
  type InsertProject,
  type PartnerRecommendation,
  type InsertPartnerRecommendation
} from "@shared/schema";

export interface IStorage {
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: number): Promise<Project | undefined>;
  updateProject(id: number, data: Partial<Project>): Promise<Project | undefined>;
  createPartnerRecommendations(recommendations: InsertPartnerRecommendation[]): Promise<PartnerRecommendation[]>;
  getPartnerRecommendationsByProjectId(projectId: number): Promise<PartnerRecommendation[]>;
}

export class MemStorage implements IStorage {
  private projects: Map<number, Project>;
  private partnerRecommendations: Map<number, PartnerRecommendation>;
  private currentProjectId: number;
  private currentRecommendationId: number;

  constructor() {
    this.projects = new Map();
    this.partnerRecommendations = new Map();
    this.currentProjectId = 1;
    this.currentRecommendationId = 1;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = {
      ...insertProject,
      id,
      analysisResults: insertProject.analysisResults || null,
      createdAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async updateProject(id: number, data: Partial<Project>): Promise<Project | undefined> {
    const existingProject = this.projects.get(id);
    if (!existingProject) {
      return undefined;
    }

    const updatedProject: Project = {
      ...existingProject,
      ...data,
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async createPartnerRecommendations(recommendations: InsertPartnerRecommendation[]): Promise<PartnerRecommendation[]> {
    const createdRecommendations: PartnerRecommendation[] = [];

    for (const insertRec of recommendations) {
      const id = this.currentRecommendationId++;
      const recommendation: PartnerRecommendation = {
        ...insertRec,
        id,
        community: insertRec.community ? insertRec.community : null,
        tvl: insertRec.tvl ? insertRec.tvl : null,
        createdAt: new Date(),
      };
      this.partnerRecommendations.set(id, recommendation);
      createdRecommendations.push(recommendation);
    }

    return createdRecommendations;
  }

  async getPartnerRecommendationsByProjectId(projectId: number): Promise<PartnerRecommendation[]> {
    return Array.from(this.partnerRecommendations.values()).filter(
      (rec) => rec.projectId === projectId
    );
  }
}

export const storage = new MemStorage();
