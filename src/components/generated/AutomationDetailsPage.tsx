import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Settings, Bot, Clock, CheckCircle2, AlertTriangle, XCircle, TrendingUp, Activity, Sparkles, ChevronRight, RefreshCw, Database, Zap, Calendar, BarChart3, Eye, Wrench, Filter, Download, PlayCircle, PauseCircle, Search } from 'lucide-react';
export interface AutomationDetailsPageProps {
  automationId: string;
  automationTitle: string;
  automationIcon: React.ReactNode;
  onBack: () => void;
}
type Tab = 'overview' | 'bots' | 'history' | 'issues' | 'ai-insights' | 'fix-optimize';
interface BotData {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  lastRun: string;
  successRate: number;
  avgTime: string;
  failures7d: number;
}
interface RunHistoryItem {
  timestamp: string;
  botName: string;
  result: 'success' | 'failure';
  runtime: string;
  error?: string;
}
interface IssueCluster {
  id: string;
  severity: 'critical' | 'warning' | 'minor';
  title: string;
  botsImpacted: string[];
  failureCount: number;
  timeWindow: string;
  aiExplanation: string;
}
interface AIInsight {
  id: string;
  type: 'root-cause' | 'prediction' | 'optimization';
  severity: 'high' | 'medium' | 'low';
  confidence: number;
  title: string;
  description: string;
  evidence: string;
  proposedFix: string[];
}
interface SuggestedFix {
  id: string;
  botName: string;
  changes: string[];
  expectedImprovement: string;
  applied: boolean;
}

// Mock Data
const mockBots: BotData[] = [{
  id: '1',
  name: 'OrderSubmitBot01',
  status: 'healthy',
  lastRun: '10:03 AM',
  successRate: 94,
  avgTime: '18s',
  failures7d: 1
}, {
  id: '2',
  name: 'AddressCheckBot',
  status: 'healthy',
  lastRun: '9:42 AM',
  successRate: 100,
  avgTime: '5s',
  failures7d: 0
}, {
  id: '3',
  name: 'ERPUpdateBot',
  status: 'critical',
  lastRun: '8:21 AM',
  successRate: 75,
  avgTime: '32s',
  failures7d: 3
}, {
  id: '4',
  name: 'ConfirmOrderBot',
  status: 'healthy',
  lastRun: '10:10 AM',
  successRate: 99,
  avgTime: '4s',
  failures7d: 0
}, {
  id: '5',
  name: 'ReprocessFailedOrdersBot',
  status: 'warning',
  lastRun: '7:50 AM',
  successRate: 88,
  avgTime: '40s',
  failures7d: 2
}];
const mockRunHistory: RunHistoryItem[] = [{
  timestamp: '10:03 AM',
  botName: 'OrderSubmitBot',
  result: 'success',
  runtime: '18s'
}, {
  timestamp: '09:42 AM',
  botName: 'AddressCheckBot',
  result: 'success',
  runtime: '5s'
}, {
  timestamp: '08:21 AM',
  botName: 'ERPUpdateBot',
  result: 'failure',
  runtime: '32s',
  error: 'SAP API Timeout (504)'
}, {
  timestamp: '08:19 AM',
  botName: 'ConfirmOrderBot',
  result: 'success',
  runtime: '4s'
}, {
  timestamp: '07:50 AM',
  botName: 'ReprocessFailedOrdersBot',
  result: 'failure',
  runtime: '40s',
  error: 'Invalid record format'
}];
const mockIssueClusters: IssueCluster[] = [{
  id: '1',
  severity: 'critical',
  title: 'SAP Latency',
  botsImpacted: ['ERPUpdateBot', 'ReprocessFailedOrdersBot'],
  failureCount: 4,
  timeWindow: '1:00–4:00 AM',
  aiExplanation: 'SAP batch maintenance window overlaps with your bot run schedule.'
}, {
  id: '2',
  severity: 'warning',
  title: 'Vendor Data Quality',
  botsImpacted: ['AddressCheckBot'],
  failureCount: 14,
  timeWindow: 'Ongoing',
  aiExplanation: '14 records with invalid ZIP codes. Source: VendorFeed API'
}, {
  id: '3',
  severity: 'minor',
  title: 'Retry Threshold Reached',
  botsImpacted: ['OrderSubmitBot'],
  failureCount: 2,
  timeWindow: '11:12 PM',
  aiExplanation: '2 retries exceeded at 11:12 PM'
}];
const mockAIInsights: AIInsight[] = [{
  id: '1',
  type: 'root-cause',
  severity: 'high',
  confidence: 92,
  title: 'SAP Latency Issue',
  description: 'Failures spike during 2–4 AM ET',
  evidence: '12 logs analyzed',
  proposedFix: ['Move schedule to 5:30 AM', 'Add exponential retry', 'Add API health check pre-run']
}, {
  id: '2',
  type: 'prediction',
  severity: 'high',
  confidence: 63,
  title: 'ERPUpdateBot Predicted Failure',
  description: 'Predicted failure probability in next 24 hours: 63%',
  evidence: 'Historical pattern analysis',
  proposedFix: ['Enable proactive monitoring', 'Schedule preventive maintenance']
}, {
  id: '3',
  type: 'optimization',
  severity: 'medium',
  confidence: 85,
  title: 'OrderSubmitBot Runtime Optimization',
  description: 'OrderSubmitBot could save 12% runtime by caching product metadata',
  evidence: 'Performance profiling',
  proposedFix: ['Implement metadata caching', 'Add cache invalidation logic']
}];
const mockSuggestedFixes: SuggestedFix[] = [{
  id: '1',
  botName: 'ERPUpdateBot',
  changes: ['Change schedule from 3:00 AM → 5:30 AM', 'Add 3-retry policy', 'Add pre-run SAP health call', 'Add 2-second exponential backoff'],
  expectedImprovement: '~85% reduction in failures',
  applied: false
}, {
  id: '2',
  botName: 'AddressCheckBot',
  changes: ['Add ZIP code validation regex', 'Implement data quality logging'],
  expectedImprovement: '100% data quality coverage',
  applied: false
}];
export const AutomationDetailsPage: React.FC<AutomationDetailsPageProps> = ({
  automationId,
  automationTitle,
  automationIcon,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedBot, setSelectedBot] = useState<BotData | null>(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [appliedFixes, setAppliedFixes] = useState<Set<string>>(new Set());
  const tabs: {
    id: Tab;
    label: string;
  }[] = [{
    id: 'overview',
    label: 'Overview'
  }, {
    id: 'bots',
    label: 'Bots'
  }, {
    id: 'history',
    label: 'Run History'
  }, {
    id: 'issues',
    label: 'Issues'
  }, {
    id: 'ai-insights',
    label: 'AI Insights'
  }, {
    id: 'fix-optimize',
    label: 'Fix & Optimize'
  }];
  const overallStatus = mockBots.some(b => b.status === 'critical') ? 'critical' : mockBots.some(b => b.status === 'warning') ? 'warning' : 'healthy';
  const applyFix = (fixId: string) => {
    setAppliedFixes(prev => new Set(prev).add(fixId));
  };
  return <div className="flex flex-col flex-1">
      {/* Sticky Sub-Header with Breadcrumb */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#b7282e]/10 rounded-lg text-[#b7282e]">
                  {automationIcon}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <span>Dashboard</span>
                    <ChevronRight className="w-3 h-3" />
                    <span>{automationTitle}</span>
                  </div>
                  <h1 className="text-xl font-bold text-[#333333]">{automationTitle} Automation</h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${overallStatus === 'healthy' ? 'bg-green-100 text-green-700' : overallStatus === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                {overallStatus === 'healthy' ? <CheckCircle2 className="w-4 h-4" /> : overallStatus === 'warning' ? <AlertTriangle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {overallStatus === 'healthy' ? 'Healthy' : overallStatus === 'warning' ? 'Warning' : 'Critical'}
              </div>
              <div className="text-xs text-gray-500">
                Last sync: 10:45 AM ET
              </div>
              <button className="flex items-center gap-2 bg-[#005587] hover:bg-[#004570] text-white px-4 py-2 rounded-lg transition-colors font-medium">
                <Play className="w-4 h-4" />
                Run Now
              </button>
              <button onClick={() => setAiPanelOpen(!aiPanelOpen)} className="flex items-center gap-2 bg-[#f7d117] hover:bg-[#e5c115] text-[#333333] px-4 py-2 rounded-lg transition-colors font-medium">
                <Sparkles className="w-4 h-4" />
                AI Diagnose
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 flex gap-1 bg-gray-50 border-t border-gray-200">
          {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-3 font-medium transition-all ${activeTab === tab.id ? 'bg-white text-[#b7282e] border-t-2 border-[#b7282e]' : 'text-gray-600 hover:text-[#333333] hover:bg-gray-100'}`}>
              {tab.label}
            </button>)}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex relative bg-[#f5f5f5]">
        <main className="flex-1 p-8 overflow-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && <motion.div key="overview" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} className="space-y-6">
                {/* Summary Panel */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-[#333333] mb-6">Automation Summary</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Bots</p>
                      <p className="text-2xl font-bold text-[#333333]">{mockBots.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Success Rate (7d)</p>
                      <p className="text-2xl font-bold text-green-600">94%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Failures (7d)</p>
                      <p className="text-2xl font-bold text-red-600">3</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Avg Runtime</p>
                      <p className="text-2xl font-bold text-[#333333]">18s</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Hours Saved (MTD)</p>
                      <p className="text-2xl font-bold text-[#005587]">312</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Next Run</p>
                      <p className="text-sm font-semibold text-[#333333]">11:30 AM ET</p>
                    </div>
                  </div>
                </div>

                {/* Workflow Diagram */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-[#333333] mb-6">Functional Workflow</h2>
                  <div className="flex items-center gap-3 overflow-x-auto pb-4">
                    {mockBots.map((bot, index) => <React.Fragment key={bot.id}>
                        <motion.div initial={{
                    scale: 0.9,
                    opacity: 0
                  }} animate={{
                    scale: 1,
                    opacity: 1
                  }} transition={{
                    delay: index * 0.1
                  }} className="flex flex-col items-center gap-2 min-w-[140px] cursor-pointer group" onClick={() => setSelectedBot(bot)}>
                          <div className={`w-full p-4 rounded-lg border-2 transition-all group-hover:shadow-md ${bot.status === 'healthy' ? 'border-green-300 bg-green-50' : bot.status === 'warning' ? 'border-yellow-300 bg-yellow-50' : 'border-red-300 bg-red-50'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className={`w-3 h-3 rounded-full ${bot.status === 'healthy' ? 'bg-green-500' : bot.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                              <Bot className="w-4 h-4 text-gray-400" />
                            </div>
                            <p className="text-xs font-medium text-[#333333] mb-1">{bot.name}</p>
                            <p className="text-xs text-gray-500">{bot.lastRun}</p>
                            {bot.failures7d > 0 && <p className="text-xs text-red-600 mt-1">{bot.failures7d} errors</p>}
                          </div>
                        </motion.div>
                        {index < mockBots.length - 1 && <ChevronRight className="w-6 h-6 text-gray-300 flex-shrink-0" />}
                      </React.Fragment>)}
                  </div>
                </div>

                {/* Recent AI Observations */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-[#333333] mb-6">Recent AI Observations</h2>
                  <div className="space-y-4">
                    {mockAIInsights.slice(0, 3).map(insight => <div key={insight.id} className={`p-4 rounded-lg border-l-4 ${insight.severity === 'high' ? 'border-red-500 bg-red-50' : insight.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' : 'border-blue-500 bg-blue-50'}`}>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-[#333333]">{insight.title}</h3>
                          <span className="text-xs bg-white px-2 py-1 rounded">
                            Confidence: {insight.confidence}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
                        <button className="text-sm text-[#005587] hover:text-[#004570] font-medium flex items-center gap-1">
                          View Suggested Fix
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>)}
                  </div>
                </div>
              </motion.div>}

            {activeTab === 'bots' && <motion.div key="bots" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-[#333333]">Bots Overview</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bot Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Run
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Success Rate
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Avg Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Failures (7d)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mockBots.map(bot => <tr key={bot.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Bot className="w-4 h-4 text-gray-400" />
                                <span className="font-medium text-[#333333]">{bot.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bot.status === 'healthy' ? 'bg-green-100 text-green-700' : bot.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                {bot.status === 'healthy' ? '🟢' : bot.status === 'warning' ? '🟠' : '🔴'}
                                {bot.status === 'healthy' ? 'Healthy' : bot.status === 'warning' ? 'Warning' : 'Critical'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{bot.lastRun}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#333333]">
                              {bot.successRate}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{bot.avgTime}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{bot.failures7d}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button onClick={() => setSelectedBot(bot)} className="text-[#005587] hover:text-[#004570] font-medium text-sm flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                View
                              </button>
                            </td>
                          </tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>}

            {activeTab === 'history' && <motion.div key="history" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} className="space-y-6">
                {/* Run Analytics Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-[#333333] mb-6">Run Analytics (7 Days)</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Runs</p>
                      <p className="text-2xl font-bold text-[#333333]">312</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Success Rate</p>
                      <p className="text-2xl font-bold text-green-600">94%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Peak Failure Hours</p>
                      <p className="text-xl font-semibold text-[#333333]">1–4 AM</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Top Failing Bot</p>
                      <p className="text-sm font-semibold text-red-600">ERPUpdateBot</p>
                    </div>
                  </div>
                </div>

                {/* Timeline Chart Placeholder */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-[#333333]">Success/Failure Timeline</h2>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                        7 Days
                      </button>
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                        30 Days
                      </button>
                    </div>
                  </div>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Timeline chart visualization</p>
                    </div>
                  </div>
                </div>

                {/* Run History Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-[#333333]">Recent Runs</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Timestamp
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bot
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Result
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Runtime
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Error
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mockRunHistory.map((run, index) => <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{run.timestamp}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#333333]">
                              {run.botName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${run.result === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {run.result === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                {run.result === 'success' ? 'Success' : 'Fail'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{run.runtime}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                              {run.error || '-'}
                            </td>
                          </tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>}

            {activeTab === 'issues' && <motion.div key="issues" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-[#333333]">Issue Clusters</h2>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Filter className="w-4 h-4" />
                        Filter
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {mockIssueClusters.map(cluster => <div key={cluster.id} className={`p-5 rounded-lg border-l-4 ${cluster.severity === 'critical' ? 'border-red-500 bg-red-50' : cluster.severity === 'warning' ? 'border-yellow-500 bg-yellow-50' : 'border-blue-500 bg-blue-50'}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className={`text-2xl ${cluster.severity === 'critical' ? '🟥' : cluster.severity === 'warning' ? '🟧' : '🟩'}`}>
                              {cluster.severity === 'critical' ? '🟥' : cluster.severity === 'warning' ? '🟧' : '🟩'}
                            </span>
                            <div>
                              <h3 className="font-semibold text-[#333333]">{cluster.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {cluster.failureCount} failures · {cluster.timeWindow}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Bots Impacted:</p>
                          <div className="flex flex-wrap gap-2">
                            {cluster.botsImpacted.map(bot => <span key={bot} className="px-2 py-1 bg-white rounded text-xs font-medium text-[#333333]">
                                {bot}
                              </span>)}
                          </div>
                        </div>
                        <div className="p-3 bg-white/50 rounded mb-3">
                          <p className="text-sm text-gray-700">
                            <strong>AI Explanation:</strong> {cluster.aiExplanation}
                          </p>
                        </div>
                        <button className="text-sm text-[#005587] hover:text-[#004570] font-medium flex items-center gap-1">
                          View Resolution Steps
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>)}
                  </div>
                </div>
              </motion.div>}

            {activeTab === 'ai-insights' && <motion.div key="ai-insights" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} className="space-y-6">
                <div className="bg-gradient-to-r from-[#b7282e] to-[#005587] rounded-xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-6 h-6" />
                    <h2 className="text-xl font-bold">AI Insights Engine</h2>
                  </div>
                  <p className="text-white/90">
                    Advanced pattern recognition and predictive analytics for your automation
                  </p>
                </div>

                {mockAIInsights.map(insight => <div key={insight.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${insight.type === 'root-cause' ? 'bg-red-100 text-red-600' : insight.type === 'prediction' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                          {insight.type === 'root-cause' ? <AlertTriangle className="w-5 h-5" /> : insight.type === 'prediction' ? <TrendingUp className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#333333]">{insight.title}</h3>
                          <p className="text-sm text-gray-500">
                            {insight.type === 'root-cause' ? 'Root Cause Analysis' : insight.type === 'prediction' ? 'Predictive Analysis' : 'Optimization Opportunity'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Confidence</p>
                          <p className="text-lg font-bold text-[#005587]">{insight.confidence}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Severity</p>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${insight.severity === 'high' ? 'bg-red-100 text-red-700' : insight.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                            {insight.severity}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Pattern Detected:</p>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Evidence:</p>
                        <p className="text-sm text-gray-600">{insight.evidence}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Proposed Fix:</p>
                        <ul className="space-y-1">
                          {insight.proposedFix.map((fix, index) => <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {fix}
                            </li>)}
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button className="flex items-center gap-2 bg-[#005587] hover:bg-[#004570] text-white px-4 py-2 rounded-lg transition-colors font-medium">
                        <PlayCircle className="w-4 h-4" />
                        Apply Fix
                      </button>
                      <button className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-[#333333] px-4 py-2 rounded-lg transition-colors font-medium">
                        <Activity className="w-4 h-4" />
                        Simulate Impact
                      </button>
                    </div>
                  </div>)}
              </motion.div>}

            {activeTab === 'fix-optimize' && <motion.div key="fix-optimize" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Wrench className="w-6 h-6 text-[#b7282e]" />
                    <h2 className="text-lg font-semibold text-[#333333]">Suggested Fixes</h2>
                  </div>

                  <div className="space-y-6">
                    {mockSuggestedFixes.map(fix => <div key={fix.id} className={`p-5 rounded-lg border-2 transition-all ${appliedFixes.has(fix.id) ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-[#333333] mb-1">{fix.botName}</h3>
                            <p className="text-sm text-gray-600">Expected Improvement: {fix.expectedImprovement}</p>
                          </div>
                          {appliedFixes.has(fix.id) && <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                              <CheckCircle2 className="w-4 h-4" />
                              Applied
                            </span>}
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-3">Proposed Changes:</p>
                          <div className="space-y-2">
                            {fix.changes.map((change, index) => <div key={index} className="flex items-start gap-2">
                                <input type="checkbox" defaultChecked className="mt-1" disabled={appliedFixes.has(fix.id)} />
                                <span className="text-sm text-gray-600">{change}</span>
                              </div>)}
                          </div>
                        </div>

                        {!appliedFixes.has(fix.id) && <div className="flex gap-3">
                            <button onClick={() => applyFix(fix.id)} className="flex items-center gap-2 bg-[#005587] hover:bg-[#004570] text-white px-4 py-2 rounded-lg transition-colors font-medium">
                              <PlayCircle className="w-4 h-4" />
                              Apply Fix
                            </button>
                            <button className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-[#333333] px-4 py-2 rounded-lg transition-colors font-medium">
                              <Search className="w-4 h-4" />
                              Test in Sandbox
                            </button>
                          </div>}
                      </div>)}
                  </div>
                </div>

                {/* AI Rewrite Logic Panel */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-6 h-6 text-[#f7d117]" />
                    <h2 className="text-lg font-semibold text-[#333333]">AI Rewrite Logic</h2>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Ask AI to rewrite bot logic to handle specific scenarios
                  </p>
                  <div className="space-y-3">
                    <textarea placeholder='Example: "Rewrite the SAP update step to handle 504 errors gracefully with retry logic"' className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005587] resize-none" rows={3} />
                    <button className="flex items-center gap-2 bg-[#f7d117] hover:bg-[#e5c115] text-[#333333] px-4 py-2 rounded-lg transition-colors font-medium">
                      <Sparkles className="w-4 h-4" />
                      Generate Solution
                    </button>
                  </div>
                </div>
              </motion.div>}
          </AnimatePresence>
        </main>

        {/* AI Panel (Right Side) */}
        <AnimatePresence>
          {aiPanelOpen && <motion.aside initial={{
          x: 400,
          opacity: 0
        }} animate={{
          x: 0,
          opacity: 1
        }} exit={{
          x: 400,
          opacity: 0
        }} className="w-96 bg-white border-l border-gray-200 shadow-lg overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[#333333]">AI Diagnosis</h2>
                  <button onClick={() => setAiPanelOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-[#f7d117]/20 to-[#005587]/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-[#b7282e]" />
                      <p className="font-semibold text-[#333333]">Mars Rover AI</p>
                    </div>
                    <p className="text-sm text-gray-700">
                      I've analyzed {mockBots.length} bots and identified {mockIssueClusters.length} issue clusters.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#333333] mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <button className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left text-sm transition-colors">
                        🔍 Diagnose ERPUpdateBot failures
                      </button>
                      <button className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left text-sm transition-colors">
                        📊 Generate performance report
                      </button>
                      <button className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left text-sm transition-colors">
                        ⚡ Suggest optimizations
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#333333] mb-3">Recent Insights</h3>
                    <div className="space-y-2">
                      {mockAIInsights.slice(0, 2).map(insight => <div key={insight.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                          <p className="font-medium text-[#333333] mb-1">{insight.title}</p>
                          <p className="text-xs text-gray-600">{insight.description}</p>
                        </div>)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>}
        </AnimatePresence>
      </div>

      {/* Bot Detail Modal */}
      <AnimatePresence>
        {selectedBot && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBot(null)}>
            <motion.div initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#333333]">{selectedBot.name}</h2>
                  <button onClick={() => setSelectedBot(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-[#333333] mb-3">Bot Metadata</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Bot ID</p>
                      <p className="font-medium text-[#333333]">{selectedBot.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${selectedBot.status === 'healthy' ? 'bg-green-100 text-green-700' : selectedBot.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {selectedBot.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Run</p>
                      <p className="font-medium text-[#333333]">{selectedBot.lastRun}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Success Rate</p>
                      <p className="font-medium text-[#333333]">{selectedBot.successRate}%</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-[#333333] mb-3">Connected Systems</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">SAP</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">CRM</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">VendorFeed API</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-[#333333] mb-3">Recent Errors</h3>
                  {selectedBot.failures7d > 0 ? <div className="space-y-2">
                      <div className="p-3 bg-red-50 rounded-lg">
                        <p className="text-sm font-medium text-red-700">SAP API Timeout (504)</p>
                        <p className="text-xs text-red-600 mt-1">2025-03-03 03:12 AM</p>
                      </div>
                    </div> : <p className="text-sm text-gray-500">No errors in the last 7 days</p>}
                </div>

                <div>
                  <h3 className="font-semibold text-[#333333] mb-3">AI Diagnostics</h3>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {selectedBot.status === 'critical' ? 'Pattern detected: Failures occur during SAP maintenance window (2-4 AM). Recommend schedule adjustment.' : selectedBot.status === 'warning' ? 'Minor performance degradation detected. Consider optimizing database queries.' : 'Bot is performing optimally. No issues detected.'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </div>;
};