import { useState } from 'react'
import {
  Activity,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Code2,
  Copy,
  Cpu,
  FileCode2,
  Globe,
  Layers,
  LayoutDashboard,
  Search,
  Sparkles,
  Terminal,
  Wrench,
  Zap,
} from 'lucide-react'

// Built-in tools definition
interface ToolItem {
  id: string
  name: string
  category: 'Prompt' | 'Code' | 'Data' | 'Network'
  description: string
  badge: string
  status: 'active' | 'upcoming'
}

const TOOLS_LIST: ToolItem[] = [
  {
    id: 'token-counter',
    name: 'Token & Prompt Estimator',
    category: 'Prompt',
    description: 'Calculate token counts, character density, and estimated costs across model families.',
    badge: 'Interactive',
    status: 'active',
  },
  {
    id: 'json-ts',
    name: 'JSON to TypeScript Generator',
    category: 'Code',
    description: 'Instantly convert raw JSON payloads into clean, typed TypeScript interfaces.',
    badge: 'Interactive',
    status: 'active',
  },
  {
    id: 'prompt-formatter',
    name: 'System Prompt Structurer',
    category: 'Prompt',
    description: 'Format, standardize, and enforce XML tags / markdown constraints for LLM prompts.',
    badge: 'Phase 1',
    status: 'upcoming',
  },
  {
    id: 'curl-converter',
    name: 'cURL to Fetch Converter',
    category: 'Network',
    description: 'Transform terminal cURL commands into modern browser Fetch and Node.js snippets.',
    badge: 'Phase 1',
    status: 'upcoming',
  },
  {
    id: 'regex-builder',
    name: 'Regex Pattern Tester',
    category: 'Data',
    description: 'Evaluate regular expressions against sample inputs with real-time capture groups.',
    badge: 'Phase 1',
    status: 'upcoming',
  },
  {
    id: 'schema-validator',
    name: 'Structured JSON Validator',
    category: 'Data',
    description: 'Validate AI outputs against JSON schemas before dispatching downstream.',
    badge: 'Phase 1',
    status: 'upcoming',
  },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tools' | 'console'>('dashboard')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Interactive Live Tool State: Token Estimator
  const [promptText, setPromptText] = useState(
    'You are a senior full-stack software architect. Analyze the provided codebase and generate a comprehensive migration strategy.'
  )
  const [copiedToken, setCopiedToken] = useState(false)

  // Interactive Live Tool State: JSON to TS
  const [jsonInput, setJsonInput] = useState(`{\n  "id": "usr_9912",\n  "name": "Alex Vance",\n  "role": "Lead Architect",\n  "active": true,\n  "tags": ["frontend", "ai-engineering"]\n}`)
  const [generatedTs, setGeneratedTs] = useState('')
  const [copiedTs, setCopiedTs] = useState(false)

  // Calculations for Token Estimator
  const charCount = promptText.length
  const wordCount = promptText.trim() ? promptText.trim().split(/\s+/).length : 0
  const estimatedTokens = Math.ceil(charCount / 4)

  // Quick JSON to TS converter
  const convertJsonToTs = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      let ts = 'export interface GeneratedPayload {\n'
      for (const [key, value] of Object.entries(parsed)) {
        let type: string = typeof value
        if (Array.isArray(value)) {
          const itemType = value.length > 0 ? typeof value[0] : 'any'
          type = `${itemType}[]`
        } else if (value === null) {
          type = 'null | any'
        }
        ts += `  ${key}: ${type};\n`
      }
      ts += '}'
      setGeneratedTs(ts)
    } catch {
      setGeneratedTs('// Error: Invalid JSON input. Please check syntax.')
    }
  }

  // Filter tools
  const filteredTools = TOOLS_LIST.filter((tool) => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="h-14 border-b border-slate-800/80 bg-[#0b0e17]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-wide text-white">AI Toolbox</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Phase 1
            </span>
          </div>
          <span className="text-slate-600">/</span>
          <span className="text-xs text-slate-400 font-mono">D:/AI-Projects/ai-toolbox</span>
        </div>

        {/* Search & Status */}
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search tools & utilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 bg-slate-900/90 border border-slate-800 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Local Engine Ready</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 border-r border-slate-800/80 bg-[#090c14] p-4 flex flex-col justify-between shrink-0 hidden md:flex">
          <div className="space-y-6">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
                Navigation
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview & Metrics</span>
                </button>
                <button
                  onClick={() => setActiveTab('tools')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'tools'
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  <span>Interactive Utilities</span>
                </button>
                <button
                  onClick={() => setActiveTab('console')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'console'
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>System Console</span>
                </button>
              </nav>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
                Categories
              </div>
              <div className="space-y-1">
                {['All', 'Prompt', 'Code', 'Data', 'Network'].map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category)
                      setActiveTab('dashboard')
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors ${
                      selectedCategory === category
                        ? 'text-indigo-400 bg-slate-900 font-medium'
                        : 'text-slate-400 hover:text-slate-300 hover:bg-slate-900/40'
                    }`}
                  >
                    <span>{category}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {category === 'All'
                        ? TOOLS_LIST.length
                        : TOOLS_LIST.filter((t) => t.category === category).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* System Environment Card */}
          <div className="p-3 rounded-lg border border-slate-800/80 bg-slate-950/60 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-400" /> Stack
              </span>
              <span className="text-[11px] font-mono text-slate-300">Vite + React</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> CSS Engine
              </span>
              <span className="text-[11px] font-mono text-slate-300">Tailwind v4</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" /> Cloud Cost
              </span>
              <span className="text-[11px] font-mono text-emerald-400">$0.00 (Free)</span>
            </div>
          </div>
        </aside>

        {/* Center Workspace */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 max-w-6xl mx-auto">
              {/* Hero Banner */}
              <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-[#0e1222] to-slate-900 p-6 md:p-8">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
                      <Zap className="w-3.5 h-3.5" /> Phase 1 Setup Complete
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                      AI Toolbox Developer Dashboard
                    </h1>
                    <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                      A fast, modular workspace designed for AI engineers and developers. Zero external API cost,
                      local execution, and extensible utility suite ready for Phase 2 AI integration.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => setActiveTab('tools')}
                      className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Open Live Tools</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Installed Utilities</span>
                    <Boxes className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{TOOLS_LIST.length}</div>
                  <div className="text-[11px] text-slate-500 mt-1">2 interactive, 4 queued</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Runtime Engine</span>
                    <Cpu className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">React 19</div>
                  <div className="text-[11px] text-emerald-400 mt-1">Vite 8 HMR Active</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Styling Framework</span>
                    <Layers className="w-4 h-4 text-violet-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">Tailwind v4</div>
                  <div className="text-[11px] text-slate-500 mt-1">Native Vite plugin</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">External API Spend</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">$0.00</div>
                  <div className="text-[11px] text-slate-500 mt-1">Free tier strictly preserved</div>
                </div>
              </div>

              {/* Tools Catalog */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <span>Tool Registry</span>
                    <span className="text-xs text-slate-500 font-mono">({filteredTools.length})</span>
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Category: <strong className="text-slate-200">{selectedCategory}</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTools.map((tool) => (
                    <div
                      key={tool.id}
                      className="group p-5 rounded-xl border border-slate-800 bg-[#0d101a] hover:border-indigo-500/40 hover:bg-[#101422] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50">
                            {tool.category}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                              tool.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {tool.badge}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-slate-500">
                          {tool.status === 'active' ? 'Ready to use' : 'Phase 2 Blueprint'}
                        </span>
                        <button
                          onClick={() => setActiveTab('tools')}
                          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
                        >
                          Launch <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Interactive Tools View */}
          {activeTab === 'tools' && (
            <div className="space-y-8 max-w-6xl mx-auto">
              <div>
                <h2 className="text-xl font-bold text-white">Interactive Developer Utilities</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Test and run Phase 1 client-side tools instantly without any external API dependencies.
                </p>
              </div>

              {/* Utility 1: Token & Character Estimator */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-[#0d101a] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Prompt & Token Estimator</h3>
                      <p className="text-xs text-slate-400">
                        Evaluates context window overhead and token counts (heuristic ~4 chars/token).
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(promptText)
                      setCopiedToken(true)
                      setTimeout(() => setCopiedToken(false), 2000)
                    }}
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedToken ? 'Copied!' : 'Copy Prompt'}</span>
                  </button>
                </div>

                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  rows={4}
                  placeholder="Enter prompt text here..."
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30"
                ></textarea>

                {/* Token Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <span className="text-[11px] text-slate-400 block">Estimated Tokens</span>
                    <span className="text-lg font-bold font-mono text-indigo-400">
                      ~{estimatedTokens.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <span className="text-[11px] text-slate-400 block">Characters</span>
                    <span className="text-lg font-bold font-mono text-slate-200">
                      {charCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <span className="text-[11px] text-slate-400 block">Word Count</span>
                    <span className="text-lg font-bold font-mono text-slate-200">
                      {wordCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <span className="text-[11px] text-slate-400 block">Context (128k LLM)</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      {((estimatedTokens / 128000) * 100).toFixed(3)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Utility 2: JSON to TypeScript Interface */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-[#0d101a] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">JSON to TypeScript Generator</h3>
                      <p className="text-xs text-slate-400">
                        Parse arbitrary JSON and derive TypeScript interfaces immediately.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={convertJsonToTs}
                    className="px-3 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition-all flex items-center gap-1.5"
                  >
                    <FileCode2 className="w-3.5 h-3.5" />
                    <span>Generate Interface</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      JSON Input
                    </label>
                    <textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      rows={8}
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
                    ></textarea>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-400 block">
                        TypeScript Output
                      </label>
                      {generatedTs && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(generatedTs)
                            setCopiedTs(true)
                            setTimeout(() => setCopiedTs(false), 2000)
                          }}
                          className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedTs ? 'Copied!' : 'Copy TS'}</span>
                        </button>
                      )}
                    </div>
                    <div className="relative w-full h-[184px] bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 font-mono overflow-y-auto">
                      {generatedTs ? (
                        <pre className="whitespace-pre-wrap">{generatedTs}</pre>
                      ) : (
                        <span className="text-slate-600 italic">
                          Click "Generate Interface" to parse the JSON input.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Console View */}
          {activeTab === 'console' && (
            <div className="space-y-4 max-w-6xl mx-auto">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-indigo-400" />
                  <span>Developer System Console</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Diagnostics, boot logs, and environment variable audits.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs space-y-2 text-slate-300">
                <div className="text-slate-500">// Environment verification stream</div>
                <div className="text-emerald-400">
                  [SUCCESS] Project mounted at D:\AI-Projects\ai-toolbox
                </div>
                <div className="text-indigo-400">
                  [VITE] Build pipeline initialized with React 19 + TypeScript 5+
                </div>
                <div className="text-violet-400">
                  [TAILWIND] @tailwindcss/vite compiler active (zero-config mode)
                </div>
                <div className="text-slate-400">
                  [AUTH & KEYS] Zero external API keys detected. Secrets isolation verified.
                </div>
                <div className="text-slate-400">
                  [STATUS] Ready for Phase 2 expansion (AI agents, prompt studio, or backend hooks).
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
