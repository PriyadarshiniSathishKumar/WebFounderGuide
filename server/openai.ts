import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || ""
});

export interface ProjectAnalysisInput {
  name: string;
  description: string;
  stage: string;
  fundingStage: string;
  categories: string[];
}

export interface PartnerRecommendation {
  name: string;
  type: string;
  description: string;
  reasoning: string;
  matchScore: number;
  missionScore: number;
  technicalScore: number;
  strategicScore: number;
  community?: string;
  tvl?: string;
}

export interface AnalysisResult {
  summary: string;
  partners: PartnerRecommendation[];
}

export async function analyzeProjectForPartners(projectData: ProjectAnalysisInput): Promise<AnalysisResult> {
  const prompt = `You are Ecosync AI, an intelligent and specialized AI agent built to assist Web3 founders in finding the most suitable ecosystem partners for their decentralized projects. Your primary goal is to analyze a project's description, its goals, and the technologies it uses, and then recommend potential partner DAOs, protocols, or Web3 projects that align with it.

These recommendations should be strategically selected based on three main criteria:

1. **Mission Alignment** - How closely the goals and philosophies of the partner project match the goals of the founder's project. For example, a DAO focused on decentralized education would align with another protocol or DAO working on credential verification or education funding.

2. **Technical Synergy** - Whether the technologies of the two projects complement each other, such as integrations with the same decentralized identity standards, shared token ecosystems, or mutual use of similar blockchain infrastructure that could facilitate partnerships or technical collaborations.

3. **Strategic Value** - The potential for mutual benefit in terms of community growth, funding opportunities, user acquisition, or market expansion. This includes access to each other's user bases, cross-promotional opportunities, or strategic funding connections.

You have extensive knowledge of the Web3 ecosystem, including but not limited to DAOs, DeFi protocols, NFT platforms, decentralized social networks, decentralized storage, identity protocols, and funding mechanisms. Use this knowledge to connect the dots intelligently for the founder's benefit.

**Project to Analyze:**
- Name: ${projectData.name}
- Description: ${projectData.description}
- Development Stage: ${projectData.stage}
- Funding Stage: ${projectData.fundingStage}
- Primary Categories: ${projectData.categories.join(", ")}

**Analysis Requirements:**
- Recommend exactly 5 strategic partners that are real, established Web3 projects
- Focus on practical, actionable partnerships that will advance the project's success in fundraising, community growth, and technical development
- Prioritize partners that have demonstrated traction and active communities
- Consider the project's current stage and funding needs when selecting partners

For each recommended partner, provide:
- name: Real partner project name (must be an actual Web3 project)
- type: Specific type (DAO, DeFi Protocol, Infrastructure, Funding Platform, Social Platform, NFT Platform, Identity Protocol, etc.)
- description: Concise explanation of what they do (2-3 sentences max)
- reasoning: Clear explanation of why this partnership makes strategic sense (2-3 sentences focusing on concrete benefits)
- matchScore: Overall compatibility score (1-100, be realistic - perfect matches are rare)
- missionScore: Mission alignment score (1-100)
- technicalScore: Technical synergy potential (1-100)
- strategicScore: Strategic partnership value (1-100)
- community: Approximate community size if known (e.g., "25K+ Discord", "180K+ Twitter")
- tvl: TVL, funding raised, or market metrics if relevant (e.g., "$180M TVL", "$50M Series A")

Also provide a comprehensive summary paragraph that:
- Analyzes the project's partnership potential and strategic positioning
- Highlights the most promising partnership opportunities
- Suggests next steps for engaging with recommended partners
- Notes any potential challenges or considerations

Respond with valid JSON in this exact format:
{
  "summary": "string",
  "partners": [
    {
      "name": "string",
      "type": "string", 
      "description": "string",
      "reasoning": "string",
      "matchScore": number,
      "missionScore": number,
      "technicalScore": number,
      "strategicScore": number,
      "community": "string",
      "tvl": "string"
    }
  ]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are Ecosync AI, a Web3 partnership recommendation expert. Analyze projects and suggest strategic partners based on mission alignment, technical synergy, and strategic value. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 3000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Validate the response structure
    if (!result.summary || !Array.isArray(result.partners)) {
      throw new Error("Invalid response format from OpenAI");
    }

    // Ensure all partners have required fields
    result.partners = result.partners.map((partner: any) => ({
      name: partner.name || "Unknown Partner",
      type: partner.type || "Unknown",
      description: partner.description || "",
      reasoning: partner.reasoning || "",
      matchScore: Math.max(1, Math.min(100, partner.matchScore || 50)),
      missionScore: Math.max(1, Math.min(100, partner.missionScore || 50)),
      technicalScore: Math.max(1, Math.min(100, partner.technicalScore || 50)),
      strategicScore: Math.max(1, Math.min(100, partner.strategicScore || 50)),
      community: partner.community || "",
      tvl: partner.tvl || "",
    }));

    return result;
  } catch (error) {
    console.error("Error analyzing project:", error);
    
    // If OpenAI API fails, provide a fallback response indicating the service is temporarily unavailable
    if (error instanceof Error && error.message.includes('429')) {
      throw new Error("AI analysis service is temporarily unavailable due to quota limits. Please check your OpenAI API billing or try again later.");
    }
    
    throw new Error("Failed to analyze project: " + (error as Error).message);
  }
}
