import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeProjectSchema, type AnalyzeProjectRequest } from "@shared/schema";
import { analyzeProjectForPartners } from "./openai";
import { generateDemoAnalysis } from "./demo";

export async function registerRoutes(app: Express): Promise<Server> {
  // Analyze project and get partner recommendations
  app.post("/api/analyze", async (req, res) => {
    try {
      // Validate request body
      const validationResult = analyzeProjectSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validationResult.error.errors,
        });
      }

      const projectData: AnalyzeProjectRequest = validationResult.data;

      // Create project record
      const project = await storage.createProject({
        name: projectData.name,
        description: projectData.description,
        stage: projectData.stage,
        fundingStage: projectData.fundingStage,
        categories: projectData.categories,
        analysisResults: null,
      });

      // Try analyzing project using OpenAI, fallback to asking user for proper API key
      let analysisResult;
      try {
        analysisResult = await analyzeProjectForPartners(projectData);
      } catch (error) {
        // If API quota exceeded or key invalid, return specific error for user to address
        if (error instanceof Error && (error.message.includes('429') || error.message.includes('quota'))) {
          return res.status(402).json({
            message: "OpenAI API quota exceeded",
            error: "Please check your OpenAI API billing and ensure you have available credits. You can update your API key in Settings or contact OpenAI support.",
            needsApiKey: true
          });
        }
        
        if (error instanceof Error && error.message.includes('401')) {
          return res.status(401).json({
            message: "Invalid OpenAI API key",
            error: "Please provide a valid OpenAI API key in the Settings page to enable AI-powered analysis.",
            needsApiKey: true
          });
        }
        
        throw error; // Re-throw other errors
      }

      // Create partner recommendations
      const partnerRecommendations = await storage.createPartnerRecommendations(
        analysisResult.partners.map((partner) => ({
          projectId: project.id,
          name: partner.name,
          type: partner.type,
          description: partner.description,
          reasoning: partner.reasoning,
          matchScore: partner.matchScore,
          missionScore: partner.missionScore,
          technicalScore: partner.technicalScore,
          strategicScore: partner.strategicScore,
          community: partner.community || undefined,
          tvl: partner.tvl || undefined,
        }))
      );

      // Update project with analysis results
      const updatedProject = await storage.updateProject(project.id, {
        analysisResults: {
          summary: analysisResult.summary,
          partnersCount: partnerRecommendations.length,
        },
      });

      // Return analysis results
      res.json({
        projectId: project.id,
        summary: analysisResult.summary,
        partners: partnerRecommendations.map((rec) => ({
          name: rec.name,
          type: rec.type,
          description: rec.description,
          reasoning: rec.reasoning,
          matchScore: rec.matchScore,
          scores: {
            mission: rec.missionScore,
            technical: rec.technicalScore,
            strategic: rec.strategicScore,
          },
          community: rec.community,
          tvl: rec.tvl,
        })),
      });
    } catch (error) {
      console.error("Error analyzing project:", error);
      res.status(500).json({
        message: "Failed to analyze project",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Get project and its recommendations
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }

      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const recommendations = await storage.getPartnerRecommendationsByProjectId(projectId);

      res.json({
        project,
        recommendations,
      });
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({
        message: "Failed to fetch project",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Demo analysis endpoint
  app.post("/api/analyze-demo", async (req, res) => {
    try {
      // Validate request body
      const validationResult = analyzeProjectSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validationResult.error.errors,
        });
      }

      const projectData: AnalyzeProjectRequest = validationResult.data;

      // Create project record
      const project = await storage.createProject({
        name: projectData.name,
        description: projectData.description,
        stage: projectData.stage,
        fundingStage: projectData.fundingStage,
        categories: projectData.categories,
        analysisResults: null,
      });

      // Generate demo analysis
      const analysisResult = generateDemoAnalysis(projectData);

      // Create partner recommendations
      const partnerRecommendations = await storage.createPartnerRecommendations(
        analysisResult.partners.map((partner) => ({
          projectId: project.id,
          name: partner.name,
          type: partner.type,
          description: partner.description,
          reasoning: partner.reasoning,
          matchScore: partner.matchScore,
          missionScore: partner.missionScore,
          technicalScore: partner.technicalScore,
          strategicScore: partner.strategicScore,
          community: partner.community || undefined,
          tvl: partner.tvl || undefined,
        }))
      );

      // Update project with analysis results
      const updatedProject = await storage.updateProject(project.id, {
        analysisResults: {
          summary: analysisResult.summary,
          partnersCount: partnerRecommendations.length,
          isDemo: true,
        },
      });

      // Return analysis results
      res.json({
        projectId: project.id,
        summary: analysisResult.summary,
        isDemo: true,
        partners: partnerRecommendations.map((rec) => ({
          name: rec.name,
          type: rec.type,
          description: rec.description,
          reasoning: rec.reasoning,
          matchScore: rec.matchScore,
          scores: {
            mission: rec.missionScore,
            technical: rec.technicalScore,
            strategic: rec.strategicScore,
          },
          community: rec.community,
          tvl: rec.tvl,
        })),
      });
    } catch (error) {
      console.error("Error in demo analysis:", error);
      res.status(500).json({
        message: "Failed to generate demo analysis",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
