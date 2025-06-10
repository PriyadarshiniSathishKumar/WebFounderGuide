import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Network, 
  TrendingUp, 
  Users, 
  Coins,
  ChartLine,
  Calendar,
  Target,
  ArrowUpRight
} from "lucide-react";

const mockProjects = [
  {
    id: 1,
    name: "EcoCredit DAO",
    status: "Active",
    partners: 5,
    lastAnalysis: "2 days ago",
    matchScore: 87
  },
  {
    id: 2,
    name: "CreatorSync",
    status: "In Review",
    partners: 3,
    lastAnalysis: "1 week ago",
    matchScore: 92
  },
  {
    id: 3,
    name: "DeFi Bridge Protocol",
    status: "Completed",
    partners: 8,
    lastAnalysis: "3 days ago",
    matchScore: 78
  }
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Monitor your Web3 partnership analysis and recommendations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Network className="text-primary h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Partners Found</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">64</p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Users className="text-green-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Match Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">85%</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-blue-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total TVL</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">$2.8B</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Coins className="text-purple-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center">
              <ChartLine className="mr-3 h-5 w-5" />
              Recent Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                      <Network className="text-white h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{project.name}</h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <Badge variant={project.status === 'Active' ? 'default' : project.status === 'Completed' ? 'secondary' : 'outline'}>
                          {project.status}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Users className="mr-1 h-3 w-3" />
                          {project.partners} partners
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {project.lastAnalysis}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Match Score</div>
                      <div className="text-lg font-bold text-green-600">{project.matchScore}%</div>
                    </div>
                    <Button variant="outline" size="sm">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}