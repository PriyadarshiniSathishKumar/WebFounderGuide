import { ProjectAnalysisInput, AnalysisResult } from "./openai";

export function generateDemoAnalysis(projectData: ProjectAnalysisInput): AnalysisResult {
  // Generate realistic demo data based on project categories and description
  const isDeFi = projectData.categories.includes("DeFi");
  const isNFT = projectData.categories.includes("NFT/Gaming");
  const isDAO = projectData.categories.includes("DAO/Governance");
  const isSocial = projectData.categories.includes("Social/Creator");
  
  let partners = [];
  
  if (isDeFi) {
    partners.push({
      name: "Aave",
      type: "DeFi Protocol",
      description: "Decentralized lending protocol with over $6B in total value locked across multiple blockchain networks.",
      reasoning: "Strong alignment for DeFi integration opportunities. Their lending infrastructure could complement your project's financial mechanisms and provide liquidity solutions.",
      matchScore: 89,
      missionScore: 85,
      technicalScore: 92,
      strategicScore: 90,
      community: "450K+ Discord",
      tvl: "$6.2B"
    });
    
    partners.push({
      name: "Chainlink",
      type: "Infrastructure",
      description: "Decentralized oracle network providing real-world data to smart contracts across multiple blockchains.",
      reasoning: "Essential infrastructure for reliable price feeds and external data integration. Their oracle services are critical for DeFi applications requiring accurate market data.",
      matchScore: 82,
      missionScore: 78,
      technicalScore: 88,
      strategicScore: 80,
      community: "280K+ Twitter",
      tvl: "Secures $75B+"
    });
  }
  
  if (isNFT || isSocial) {
    partners.push({
      name: "OpenSea",
      type: "NFT Platform",
      description: "Leading NFT marketplace enabling users to buy, sell, and discover unique digital items across multiple blockchains.",
      reasoning: "Perfect partnership for NFT distribution and marketplace integration. Their established user base and infrastructure could accelerate your platform's adoption.",
      matchScore: 87,
      missionScore: 90,
      technicalScore: 84,
      strategicScore: 88,
      community: "1.2M+ Discord",
      tvl: "$24B+ Volume"
    });
  }
  
  if (isDAO) {
    partners.push({
      name: "Snapshot",
      type: "DAO Tooling",
      description: "Decentralized voting platform used by major DAOs for governance decisions and community polling.",
      reasoning: "Ideal for implementing robust governance mechanisms. Their proven voting infrastructure and DAO expertise align perfectly with your governance requirements.",
      matchScore: 91,
      missionScore: 95,
      technicalScore: 86,
      strategicScore: 92,
      community: "80K+ Users",
      tvl: "Powers 15K+ DAOs"
    });
  }
  
  // Add universal partners that work with any project
  partners.push({
    name: "Polygon",
    type: "Infrastructure",
    description: "Ethereum scaling solution providing faster and cheaper transactions for decentralized applications.",
    reasoning: "Excellent technical fit for reducing transaction costs and improving user experience. Their ecosystem support and developer tools could accelerate your development timeline.",
    matchScore: 85,
    missionScore: 82,
    technicalScore: 89,
    strategicScore: 84,
    community: "180K+ Discord",
    tvl: "$1.2B+ TVL"
  });
  
  partners.push({
    name: "Gitcoin",
    type: "Funding Platform",
    description: "Web3 funding platform connecting projects with contributors through grants and bounties for public goods.",
    reasoning: "Strategic funding opportunity through their grants program. Their focus on public goods and Web3 innovation aligns with your project's mission and growth needs.",
    matchScore: 78,
    missionScore: 85,
    technicalScore: 70,
    strategicScore: 82,
    community: "65K+ Twitter",
    tvl: "$50M+ Distributed"
  });
  
  // Ensure we have exactly 5 partners
  partners = partners.slice(0, 5);
  
  const summary = `Based on the analysis of ${projectData.name}, we've identified ${partners.length} strategic partnership opportunities that align with your ${projectData.categories.join(", ")} focus. The partners show strong technical compatibility with your ${projectData.stage} stage project and complement your ${projectData.fundingStage} funding requirements. Key opportunities include infrastructure partnerships for technical scaling, marketplace integrations for user acquisition, and funding platform connections for financial growth. The average match score of ${Math.round(partners.reduce((sum, p) => sum + p.matchScore, 0) / partners.length)}% indicates high potential for successful collaborations. We recommend prioritizing discussions with the highest-scoring partners and focusing on technical integration possibilities to accelerate your development timeline.`;
  
  return {
    summary,
    partners
  };
}