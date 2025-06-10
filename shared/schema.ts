import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  stage: text("stage").notNull(),
  fundingStage: text("funding_stage").notNull(),
  categories: text("categories").array().notNull(),
  analysisResults: jsonb("analysis_results"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const partnerRecommendations = pgTable("partner_recommendations", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  reasoning: text("reasoning").notNull(),
  matchScore: integer("match_score").notNull(),
  missionScore: integer("mission_score").notNull(),
  technicalScore: integer("technical_score").notNull(),
  strategicScore: integer("strategic_score").notNull(),
  community: text("community"),
  tvl: text("tvl"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertPartnerRecommendationSchema = createInsertSchema(partnerRecommendations).omit({
  id: true,
  createdAt: true,
}).extend({
  community: z.string().optional(),
  tvl: z.string().optional(),
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertPartnerRecommendation = z.infer<typeof insertPartnerRecommendationSchema>;
export type PartnerRecommendation = typeof partnerRecommendations.$inferSelect;

// API request/response schemas
export const analyzeProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(50, "Project description must be at least 50 characters"),
  stage: z.string().min(1, "Project stage is required"),
  fundingStage: z.string().min(1, "Funding stage is required"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
});

export type AnalyzeProjectRequest = z.infer<typeof analyzeProjectSchema>;

export interface AnalysisResult {
  summary: string;
  partners: PartnerRecommendation[];
}
