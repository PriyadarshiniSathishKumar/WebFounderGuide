import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { analyzeProjectSchema, type AnalyzeProjectRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { 
  Network, 
  Edit, 
  WandSparkles, 
  ChartLine, 
  CheckCircle, 
  Sparkles, 
  ExternalLink,
  Download,
  Share,
  RefreshCw,
  Users,
  Coins,
  TrendingUp,
  Lightbulb,
  Menu,
  User
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface AnalysisResult {
  projectId: number;
  summary: string;
  isDemo?: boolean;
  partners: Array<{
    name: string;
    type: string;
    description: string;
    reasoning: string;
    matchScore: number;
    scores: {
      mission: number;
      technical: number;
      strategic: number;
    };
    community?: string;
    tvl?: string;
  }>;
}

const categories = [
  "DeFi",
  "NFT/Gaming", 
  "DAO/Governance",
  "Infrastructure",
  "Social/Creator",
  "Identity/Privacy"
];

const stages = [
  "Concept/Ideation",
  "MVP Development", 
  "Beta Testing",
  "Launch Ready",
  "Post-Launch"
];

const fundingStages = [
  "Pre-Seed",
  "Seed",
  "Series A", 
  "Series B+",
  "Bootstrapped"
];

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { toast } = useToast();

  const form = useForm<AnalyzeProjectRequest>({
    resolver: zodResolver(analyzeProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      stage: "",
      fundingStage: "",
      categories: [],
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async (data: AnalyzeProjectRequest) => {
      try {
        const endpoint = isDemoMode ? "/api/analyze-demo" : "/api/analyze";
        const response = await apiRequest("POST", endpoint, data);
        return await response.json();
      } catch (error: any) {
        // If API quota exceeded, automatically switch to demo mode
        if (error.message?.includes('402') || error.message?.includes('quota')) {
          setIsDemoMode(true);
          const response = await apiRequest("POST", "/api/analyze-demo", data);
          const result = await response.json();
          return { ...result, isDemo: true };
        }
        if (error.message?.includes('401') || error.message?.includes('Invalid')) {
          throw new Error("Invalid OpenAI API key. Please provide a valid API key in Settings to enable AI analysis.");
        }
        throw error;
      }
    },
    onSuccess: (data: AnalysisResult) => {
      setAnalysisResult(data);
      const title = data.isDemo ? "Demo Analysis Complete" : "Analysis Complete";
      const description = data.isDemo 
        ? `Demo analysis shows ${data.partners.length} potential partners. Enable OpenAI API for real-time analysis.`
        : `Found ${data.partners.length} potential partners for your project.`;
      toast({
        title,
        description,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
        action: error.message.includes('API key') ? (
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/settings'}>
            Go to Settings
          </Button>
        ) : undefined,
      });
    },
  });

  const onSubmit = (data: AnalyzeProjectRequest) => {
    analyzeMutation.mutate(data);
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Network className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Ecosync AI</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Web3 Partnership Intelligence</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Dashboard</a>
              <a href="/history" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">History</a>
              <a href="/settings" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Settings</a>
              <ThemeToggle />
              <Button className="bg-primary text-white hover:bg-indigo-700">
                <User className="mr-2 h-4 w-4" />
                Account
              </Button>
            </nav>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-hero py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Powered Partnership Discovery
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Find Perfect{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Web3 Partners</span>{" "}
            for Your Project
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Leverage AI to discover strategic partnerships based on mission alignment, technical synergy, and strategic value. 
            Connect with DAOs, protocols, and projects that accelerate your Web3 journey.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Input Form Section */}
          <div className="space-y-8">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <Edit className="text-primary h-4 w-4" />
                  </div>
                  Describe Your Project
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your project name"
                              className="focus-ring"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Description</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={6}
                              placeholder="Describe your project's mission, goals, target audience, and unique value proposition. Include technical details about blockchain, protocols, and technologies you're using."
                              className="focus-ring resize-none"
                              {...field}
                            />
                          </FormControl>
                          <p className="text-xs text-gray-500 flex items-center mt-2">
                            <Lightbulb className="mr-1 h-3 w-3" />
                            Tip: Include your tech stack, target audience, and partnership goals for better recommendations
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="stage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Stage</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="focus-ring">
                                  <SelectValue placeholder="Select stage" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {stages.map((stage) => (
                                  <SelectItem key={stage} value={stage}>
                                    {stage}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fundingStage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Funding Stage</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="focus-ring">
                                  <SelectValue placeholder="Select funding stage" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {fundingStages.map((stage) => (
                                  <SelectItem key={stage} value={stage}>
                                    {stage}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="categories"
                      render={() => (
                        <FormItem>
                          <FormLabel>Primary Categories</FormLabel>
                          <div className="grid grid-cols-2 gap-3">
                            {categories.map((category) => (
                              <FormField
                                key={category}
                                control={form.control}
                                name="categories"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={category}
                                      className="flex flex-row items-center space-x-3 space-y-0 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(category)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, category])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== category
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-medium cursor-pointer">
                                        {category}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <div>
                          <div className="text-amber-800 dark:text-amber-200 font-medium">Demo Mode</div>
                          <p className="text-xs text-amber-600 dark:text-amber-300">Use sample data when OpenAI API is unavailable</p>
                        </div>
                        <Button
                          type="button"
                          variant={isDemoMode ? "default" : "outline"}
                          size="sm"
                          onClick={() => setIsDemoMode(!isDemoMode)}
                          className={isDemoMode ? "bg-amber-600 hover:bg-amber-700" : "border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-900/30"}
                        >
                          {isDemoMode ? "Demo Active" : "Enable Demo"}
                        </Button>
                      </div>
                      
                      <Button
                        type="submit"
                        disabled={analyzeMutation.isPending}
                        className="w-full gradient-primary py-4 hover:opacity-90 transition-opacity"
                      >
                        {analyzeMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <WandSparkles className="mr-2 h-4 w-4" />
                            {isDemoMode ? "Run Demo Analysis" : "Analyze & Find Partners"}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Analysis Criteria Info */}
            <Card className="gradient-card border-blue-100">
              <CardContent className="pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ChartLine className="text-primary mr-3 h-5 w-5" />
                  AI Analysis Framework
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-white/60 rounded-lg">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <TrendingUp className="text-primary h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Mission Alignment</span>
                      <p className="text-sm text-gray-600 mt-1">Analyzes shared goals, philosophies, and target audiences to identify partners with complementary missions and values.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-white/60 rounded-lg">
                    <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Network className="text-secondary h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Technical Synergy</span>
                      <p className="text-sm text-gray-600 mt-1">Evaluates blockchain compatibility, shared protocols, and integration opportunities for seamless technical collaboration.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-white/60 rounded-lg">
                    <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Lightbulb className="text-green-600 h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Strategic Value</span>
                      <p className="text-sm text-gray-600 mt-1">Identifies mutual benefits for community growth, funding opportunities, user acquisition, and market expansion.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sample Projects */}
            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
              <CardContent className="pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Sparkles className="text-amber-600 mr-3 h-5 w-5" />
                  Try These Examples
                </h4>
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      form.setValue("name", "EcoCredit DAO");
                      form.setValue("description", "A decentralized autonomous organization focused on tokenizing and trading verified carbon credits on blockchain. We're building a transparent marketplace where environmental projects can mint carbon credit NFTs, and organizations can purchase them to offset their emissions. Our platform uses Polygon for low-cost transactions and integrates with IoT sensors for real-time environmental data verification.");
                      form.setValue("stage", "MVP Development");
                      form.setValue("fundingStage", "Seed");
                      form.setValue("categories", ["DeFi", "Infrastructure"]);
                    }}
                    className="w-full text-left p-3 rounded-lg border border-amber-200 hover:border-amber-300 hover:bg-amber-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">EcoCredit DAO</div>
                    <div className="text-sm text-gray-600">Carbon credit tokenization platform on Polygon</div>
                  </button>
                  <button 
                    onClick={() => {
                      form.setValue("name", "CreatorSync");
                      form.setValue("description", "A Web3 social platform that enables content creators to mint their work as NFTs, receive direct fan funding through crypto payments, and collaborate with other creators through smart contracts. Built on Ethereum with IPFS for decentralized storage, we're targeting the creator economy with tools for monetization, community building, and IP protection.");
                      form.setValue("stage", "Beta Testing");
                      form.setValue("fundingStage", "Series A");
                      form.setValue("categories", ["NFT/Gaming", "Social/Creator"]);
                    }}
                    className="w-full text-left p-3 rounded-lg border border-amber-200 hover:border-amber-300 hover:bg-amber-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">CreatorSync</div>
                    <div className="text-sm text-gray-600">Web3 social platform for content creators</div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            {/* Loading State */}
            {analyzeMutation.isPending && (
              <Card className="shadow-sm">
                <CardContent className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Your Project</h3>
                  <p className="text-gray-600 mb-4">Our AI is finding the perfect Web3 partners for you...</p>
                  <div className="bg-gray-100 rounded-full h-2 max-w-xs mx-auto">
                    <div className="gradient-primary h-2 rounded-full w-2/3 transition-all duration-1000"></div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Display */}
            {analysisResult && !analyzeMutation.isPending && (
              <Card className="shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <CheckCircle className="text-green-600 h-4 w-4" />
                      </div>
                      Partnership Recommendations
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      {analysisResult.isDemo && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-600">
                          Demo Mode
                        </Badge>
                      )}
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                        <Sparkles className="mr-2 h-3 w-3" />
                        {analysisResult.partners.length} Matches Found
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Analysis Summary */}
                  <div className="gradient-card rounded-xl p-6 mb-8">
                    <h4 className="font-semibold text-gray-900 mb-3">Analysis Summary</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {analysisResult.summary}
                    </p>
                  </div>

                  {/* Partner Recommendations */}
                  <div className="space-y-6">
                    {analysisResult.partners.map((partner, index) => (
                      <Card key={index} className="border hover:shadow-md transition-shadow duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                                <Network className="text-white text-lg" />
                              </div>
                              <div>
                                <h5 className="text-lg font-semibold text-gray-900">{partner.name}</h5>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs">
                                    {partner.type}
                                  </Badge>
                                  <span className="text-sm text-gray-500">{partner.description}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">Match Score</div>
                              <div className="text-lg font-bold text-green-600">{partner.matchScore}%</div>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                            {partner.reasoning}
                          </p>
                          
                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                              <div className="text-sm font-medium text-gray-900 mb-2">Mission Alignment</div>
                              <div className="text-lg font-bold text-green-600 mb-2">{partner.scores.mission}%</div>
                              <div className="w-full bg-green-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${partner.scores.mission}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                              <div className="text-sm font-medium text-gray-900 mb-2">Technical Synergy</div>
                              <div className="text-lg font-bold text-blue-600 mb-2">{partner.scores.technical}%</div>
                              <div className="w-full bg-blue-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${partner.scores.technical}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                              <div className="text-sm font-medium text-gray-900 mb-2">Strategic Value</div>
                              <div className="text-lg font-bold text-purple-600 mb-2">{partner.scores.strategic}%</div>
                              <div className="w-full bg-purple-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${partner.scores.strategic}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              {partner.community && (
                                <span className="flex items-center">
                                  <Users className="mr-1 h-3 w-3" />
                                  Community: {partner.community}
                                </span>
                              )}
                              {partner.tvl && (
                                <span className="flex items-center">
                                  <Coins className="mr-1 h-3 w-3" />
                                  TVL: {partner.tvl}
                                </span>
                              )}
                            </div>
                            <Button className="bg-primary text-white hover:bg-indigo-700">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Connect
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                      <Download className="mr-2 h-4 w-4" />
                      Export Report
                    </Button>
                    <div className="flex items-center space-x-3">
                      <Button variant="outline" onClick={handleNewAnalysis}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        New Analysis
                      </Button>
                      <Button className="gradient-primary">
                        <Share className="mr-2 h-4 w-4" />
                        Share Results
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommendation Insights */}
            {analysisResult && (
              <Card className="gradient-warning border-amber-100">
                <CardContent className="pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Lightbulb className="text-yellow-600 mr-3 h-5 w-5" />
                    Next Steps & Insights
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Start with the highest-scoring partners for maximum alignment potential</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Focus on technical integration opportunities to accelerate development</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Leverage funding platforms and grant opportunities for financial support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center">
                  <Network className="text-white text-sm" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ecosync AI</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md">
                Intelligent partnership discovery for Web3 founders. Find strategic partners that accelerate your project's growth through AI-powered analysis.
              </p>
              <div className="flex items-center space-x-4">
                <a href="https://twitter.com" className="text-gray-400 hover:text-primary transition-colors">
                  <TrendingUp className="h-5 w-5" />
                </a>
                <a href="https://discord.com" className="text-gray-400 hover:text-primary transition-colors">
                  <Network className="h-5 w-5" />
                </a>
                <a href="https://github.com" className="text-gray-400 hover:text-primary transition-colors">
                  <Users className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Features</a></li>
                <li><a href="/settings" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/settings" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">API</a></li>
                <li><a href="/settings" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="/settings" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Documentation</a></li>
                <li><a href="/settings" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/settings" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a></li>
                <li><a href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 dark:text-gray-300 text-sm">© 2024 Ecosync AI. All rights reserved.</p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <a href="/settings" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">Privacy</a>
                <a href="/settings" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">Terms</a>
                <a href="/settings" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">Security</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
