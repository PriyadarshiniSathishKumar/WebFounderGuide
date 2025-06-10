import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Network, 
  Search,
  Calendar,
  Users,
  TrendingUp,
  Filter,
  Download,
  Eye
} from "lucide-react";

const mockHistory = [
  {
    id: 1,
    projectName: "EcoCredit DAO",
    analysisDate: "2024-06-08",
    partnersFound: 5,
    avgMatchScore: 87,
    status: "Completed"
  },
  {
    id: 2,
    projectName: "CreatorSync Platform",
    analysisDate: "2024-06-07",
    partnersFound: 7,
    avgMatchScore: 92,
    status: "Completed"
  },
  {
    id: 3,
    projectName: "DeFi Bridge Protocol",
    analysisDate: "2024-06-05",
    partnersFound: 4,
    avgMatchScore: 78,
    status: "Completed"
  },
  {
    id: 4,
    projectName: "NFT Marketplace Hub",
    analysisDate: "2024-06-03",
    partnersFound: 6,
    avgMatchScore: 84,
    status: "Archived"
  },
  {
    id: 5,
    projectName: "Social DAO Platform",
    analysisDate: "2024-06-01",
    partnersFound: 8,
    avgMatchScore: 90,
    status: "Completed"
  }
];

export default function History() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analysis History</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">View and manage your past partnership analyses</p>
        </div>

        {/* Search and Filter */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search projects..." 
                  className="pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <Button variant="outline" className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History Table */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center">
              <Calendar className="mr-3 h-5 w-5" />
              Analysis History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                      <Network className="text-white h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{item.projectName}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(item.analysisDate).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Users className="mr-1 h-3 w-3" />
                          {item.partnersFound} partners
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          {item.avgMatchScore}% avg match
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={item.status === 'Completed' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
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