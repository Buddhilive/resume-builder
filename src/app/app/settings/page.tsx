"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, ExternalLink, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { 
  isLanguageDetectorAvailable,
  isTranslatorAvailable,
  isWriterAvailable,
  isSummarizerAvailable
} from "@/lib/provider";

interface APIStatus {
  name: string;
  status: "available" | "unavailable" | "downloading" | "checking";
  description: string;
  documentation: string;
}

export default function SettingsPage() {
  const [apiStatuses, setApiStatuses] = useState<APIStatus[]>([
    {
      name: "Language Detection API",
      status: "checking",
      description: "Detects the language of text content in your documents",
      documentation: "https://developer.chrome.com/docs/ai/language-detection"
    },
    {
      name: "Translator API", 
      status: "checking",
      description: "Translates content between different languages",
      documentation: "https://developer.chrome.com/docs/ai/translator-api"
    },
    {
      name: "Summarizer API",
      status: "checking", 
      description: "Creates summaries of long text content",
      documentation: "https://developer.chrome.com/docs/ai/summarizer-api"
    },
    {
      name: "Writer API",
      status: "checking",
      description: "Generates professional content like cover letters",
      documentation: "https://developer.chrome.com/docs/ai/writer-api"
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkAPIAvailability = async () => {
    setIsRefreshing(true);
    
    const updatedStatuses = [...apiStatuses];
    
    try {
      // Check Language Detection API
      const langDetectorAvailable = await isLanguageDetectorAvailable();
      updatedStatuses[0].status = langDetectorAvailable ? "available" : "unavailable";

      // Check Translator API (test with common language pair)
      const translatorAvailable = await isTranslatorAvailable("en", "es");
      updatedStatuses[1].status = translatorAvailable ? "available" : "unavailable";

      // Check Summarizer API
      const summarizerAvailable = await isSummarizerAvailable();
      updatedStatuses[2].status = summarizerAvailable ? "available" : "unavailable";

      // Check Writer API
      const writerAvailable = await isWriterAvailable();
      updatedStatuses[3].status = writerAvailable ? "available" : "unavailable";

    } catch (error) {
      console.error("Error checking API availability:", error);
      // Mark all as unavailable on error
      updatedStatuses.forEach(status => {
        if (status.status === "checking") {
          status.status = "unavailable";
        }
      });
    }

    setApiStatuses(updatedStatuses);
    setIsRefreshing(false);
  };

  useEffect(() => {
    checkAPIAvailability();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case "unavailable":
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case "downloading":
        return <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case "checking":
        return <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Available";
      case "unavailable":
        return "Unavailable";
      case "downloading":
        return "Downloading";
      case "checking":
        return "Checking...";
      default:
        return "Unknown";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-green-600 dark:text-green-400";
      case "unavailable":
        return "text-red-600 dark:text-red-400";
      case "downloading":
        return "text-yellow-600 dark:text-yellow-400";
      case "checking":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8 h-[calc(100vh-4rem)] overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Configure AI features and manage your application settings
        </p>
      </div>

      {/* Chrome Built-in AI Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Chrome Built-in AI
          </CardTitle>
          <CardDescription>
            This application uses Chrome's experimental Built-in AI APIs to provide advanced AI features.
            These APIs are currently in preview and require Chrome Canary or Dev channel with experimental features enabled.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              How to Enable Chrome Built-in AI
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li>Download and install <strong>Chrome Canary</strong> or <strong>Chrome Dev</strong></li>
              <li>Navigate to <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">chrome://flags</code></li>
              <li>Search for and enable the following flags:
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">Prompt API for Gemini Nano</code></li>
                  <li><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">Summarization API for Gemini Nano</code></li>
                  <li><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">Writer API for Gemini Nano</code></li>
                  <li><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">Language Detection API</code></li>
                  <li><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">Translation API</code></li>
                </ul>
              </li>
              <li>Restart Chrome</li>
              <li>Visit <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">chrome://components</code> and click "Check for update" on Optimization Guide On Device Model</li>
              <li>Refresh this page to check API availability</li>
            </ol>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">API Availability Status</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Check which AI features are currently available in your browser
              </p>
            </div>
            <Button 
              onClick={checkAPIAvailability} 
              disabled={isRefreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Status
            </Button>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                  <TableHead className="font-semibold">API Name</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="font-semibold text-right">Documentation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiStatuses.map((api, index) => (
                  <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                      {api.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(api.status)}
                        <span className={`text-sm font-medium ${getStatusTextColor(api.status)}`}>
                          {getStatusText(api.status)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400 text-sm">
                      {api.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <a
                          href={api.documentation}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Docs
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                  Experimental Features Notice
                </h4>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Chrome Built-in AI APIs are experimental and may change or be removed in future versions. 
                  Some features may require model downloads which can take time and use bandwidth.
                  For the best experience, ensure you have a stable internet connection when first using these features.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">What You Can Do</h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Generate professional cover letters</li>
                <li>• Translate resumes to different languages</li>
                <li>• Detect language of existing content</li>
                <li>• Summarize long text sections</li>
              </ul>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Requirements</h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Chrome Canary or Chrome Dev</li>
                <li>• Experimental flags enabled</li>
                <li>• On-device AI model downloaded</li>
                <li>• Stable internet connection (initial setup)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}