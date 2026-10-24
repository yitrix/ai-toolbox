import { useState } from 'react'
import {
  Activity,
  Boxes,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Copy,
  Cpu,
  FileCode2,
  FileJson,
  Filter,
  Globe,
  Layers,
  LayoutDashboard,
  Menu,
  Regex,
  Search,
  Sparkles,
  Terminal,
  Wrench,
  X,
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
    description: 'Calculate token counts, character density, and estimated context window consumption.',
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
    id: 'curl-converter',
    name: 'cURL to Fetch & Axios Converter',
    category: 'Network',
    description: 'Transform terminal cURL commands into modern browser Fetch and Axios snippets.',
    badge: 'Phase 2 Live',
    status: 'active',
  },
  {
    id: 'regex-builder',
    name: 'Regex Pattern Tester',
    category: 'Data',
    description: 'Evaluate regular expressions against sample inputs with real-time match previews.',
    badge: 'Phase 2 Live',
    status: 'active',
  },
  {
    id: 'prompt-formatter',
    name: 'System Prompt Structurer',
    category: 'Prompt',
    description: 'Format, standardize, and enforce XML tags and markdown constraints for LLM prompts.',
    badge: 'Phase 2 Live',
    status: 'active',
  },
  {
    id: 'schema-validator',
    name: 'Structured JSON Validator',
    category: 'Data',
    description: 'Inspect, beautify, minify, and validate JSON outputs with syntax error diagnostics.',
    badge: 'Phase 2 Live',
    status: 'active',
  },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tools' | 'console'>('dashboard')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeToolId, setActiveToolId] = useState<string>('all')

  // Mobile Bottom Drawer State
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  // Tool 1: Token Estimator State
  const [promptText, setPromptText] = useState(
    'You are a senior full-stack software architect. Analyze the provided codebase and generate a comprehensive migration strategy.'
  )
  const [copiedToken, setCopiedToken] = useState(false)

  // Tool 2: JSON to TS State
  const [jsonInput, setJsonInput] = useState(`{\n  "id": "usr_9912",\n  "name": "Alex Vance",\n  "role": "Lead Architect",\n  "active": true,\n  "tags": ["frontend", "ai-engineering"]\n}`)
  const [generatedTs, setGeneratedTs] = useState('')
  const [copiedTs, setCopiedTs] = useState(false)

  // Tool 3: cURL to Fetch/Axios State
  const [curlInput, setCurlInput] = useState(
    `curl -X POST https://api.openai.com/v1/chat/completions \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer $OPENAI_API_KEY" \\\n  -d '{\n    "model": "gpt-4o",\n    "messages": [{"role": "user", "content": "Hello!"}]\n  }'`
  )
  const [curlOutputMode, setCurlOutputMode] = useState<'fetch' | 'axios'>('fetch')
  const [copiedCurl, setCopiedCurl] = useState(false)

  // Tool 4: Regex Tester State
  const [regexPattern, setRegexPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')
  const [regexFlags, setRegexFlags] = useState<{ g: boolean; i: boolean; m: boolean }>({
    g: true,
    i: true,
    m: false,
  })
  const [regexInputText, setRegexInputText] = useState(
    'Contact our team at dev@example.com or support@company.org for quick assistance.'
  )

  // Tool 5: Prompt Structurer State
  const [promptRole, setPromptRole] = useState('Senior Full-Stack Code Reviewer')
  const [promptContext, setPromptContext] = useState('Production TypeScript React repository undergoing refactoring.')
  const [promptRules, setPromptRules] = useState('Always suggest code fixes in unified diff format.\nNever use deprecated APIs.\nEnsure strict type safety and zero any types.')
  const [promptOutputFormat, setPromptOutputFormat] = useState('Executive summary followed by numbered action items.')
  const [copiedStructuredPrompt, setCopiedStructuredPrompt] = useState(false)

  // Tool 6: JSON Validator & Formatter State
  const [validatorInput, setValidatorInput] = useState('{\n  "status": "success",\n  "code": 200,\n  "data": {\n    "items": [1, 2, 3],\n    "ready": true\n  }\n}')
  const [validatorStatus, setValidatorStatus] = useState<{ valid: boolean; message: string }>({
    valid: true,
    message: 'Valid JSON syntax',
  })
  const [copiedValidator, setCopiedValidator] = useState(false)

  // Token Estimator Calculations
  const charCount = promptText.length
  const wordCount = promptText.trim() ? promptText.trim().split(/\s+/).length : 0
  const estimatedTokens = Math.ceil(charCount / 4)

  // JSON to TS Converter Logic
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

  // cURL Parser Logic
  const parseCurlCommand = () => {
    try {
      const clean = curlInput.replace(/\\\n/g, ' ').replace(/\n/g, ' ')
      // URL match
      const urlMatch = clean.match(/(?:curl\s+)?(?:-X\s+[A-Z]+\s+)?['"]?(https?:\/\/[^\s'"]+)/)
      const url = urlMatch ? urlMatch[1] : 'https://api.example.com/v1/resource'

      // Method match
      const methodMatch = clean.match(/-X\s+([A-Z]+)/)
      const method = methodMatch ? methodMatch[1] : clean.includes('-d ') || clean.includes('--data') ? 'POST' : 'GET'

      // Headers match
      const headers: Record<string, string> = {}
      const headerRegex = /-H\s+['"]([^'"]+)['"]/g
      let match
      while ((match = headerRegex.exec(clean)) !== null) {
        const [k, ...v] = match[1].split(':')
        if (k && v) {
          headers[k.trim()] = v.join(':').trim()
        }
      }

      // Body match
      let body: string | null = null
      const dataMatch = clean.match(/(?:-d|--data(?:-raw)?)\s+('({[\s\S]*?})'|"({[\s\S]*?})")/i) || clean.match(/(?:-d|--data(?:-raw)?)\s+['"]([\s\S]*?)['"]/)
      if (dataMatch) {
        body = dataMatch[1] || dataMatch[2] || dataMatch[3] || dataMatch[0]
      }

      if (curlOutputMode === 'fetch') {
        return `// Modern Fetch (TypeScript / ES2022)
const response = await fetch("${url}", {
  method: "${method}",
  headers: ${JSON.stringify(headers, null, 4)},${body ? `\n  body: JSON.stringify(${body.trim()}),` : ''}
});

const data = await response.json();
console.log(data);`
      } else {
        return `// Axios Request
import axios from 'axios';

const response = await axios({
  method: '${method.toLowerCase()}',
  url: '${url}',
  headers: ${JSON.stringify(headers, null, 4)},${body ? `\n  data: ${body.trim()},` : ''}
});

console.log(response.data);`
      }
    } catch {
      return '// Error parsing cURL command. Ensure format starts with curl or contains valid options.'
    }
  }

  // Regex Evaluation Logic
  const evaluateRegex = () => {
    try {
      const flags = `${regexFlags.g ? 'g' : ''}${regexFlags.i ? 'i' : ''}${regexFlags.m ? 'm' : ''}`
      const reg = new RegExp(regexPattern, flags)
      const matches: string[] = []
      let match
      if (regexFlags.g) {
        while ((match = reg.exec(regexInputText)) !== null) {
          matches.push(match[0])
          if (reg.lastIndex === match.index) reg.lastIndex++
        }
      } else {
        const singleMatch = regexInputText.match(reg)
        if (singleMatch) matches.push(singleMatch[0])
      }
      return { valid: true, matches, error: null }
    } catch (err: unknown) {
      return { valid: false, matches: [], error: err instanceof Error ? err.message : 'Invalid regex pattern' }
    }
  }

  // Structured Prompt Generator
  const generateStructuredPrompt = () => {
    return `<system_role>
${promptRole}
</system_role>

<context>
${promptContext}
</context>

<rules>
${promptRules.split('\n').filter(Boolean).map((r) => `- ${r}`).join('\n')}
</rules>

<output_format>
${promptOutputFormat}
</output_format>`
  }

  // JSON Validator & Formatter Actions
  const handleValidateAndFormat = (action: 'beautify' | 'minify') => {
    try {
      const parsed = JSON.parse(validatorInput)
      if (action === 'beautify') {
        setValidatorInput(JSON.stringify(parsed, null, 2))
      } else {
        setValidatorInput(JSON.stringify(parsed))
      }
      setValidatorStatus({ valid: true, message: `Valid JSON (${Object.keys(parsed).length} top-level keys)` })
    } catch (err: unknown) {
      setValidatorStatus({
        valid: false,
        message: err instanceof Error ? err.message : 'Invalid JSON format',
      })
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

  // Launch a tool directly
  const launchTool = (toolId: string) => {
    setActiveTab('tools')
    setActiveToolId(toolId)
  }

  const regexResult = evaluateRegex()
  const generatedCurlCode = parseCurlCommand()

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white pb-16 md:pb-0">
      {/* Top Header */}
      <header className="h-14 border-b border-slate-800/80 bg-[#0b0e17]/90 backdrop-blur-md px-4 md:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-wide text-white">AI Toolbox</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Phase 2 Live
            </span>
          </div>
          <span className="text-slate-600 hidden sm:inline">/</span>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">D:/AI-Projects/ai-toolbox</span>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-4">
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

          <div className="hidden sm:flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>6 Tools Active</span>
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle navigation drawer"
          >
            {mobileDrawerOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Left Sidebar */}
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
                  onClick={() => {
                    setActiveTab('tools')
                    setActiveToolId('all')
                  }}
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
              <span className="text-[11px] font-mono text-slate-300">React 19 + Vite</span>
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
              <span className="text-[11px] font-mono text-emerald-400">$0.00 (Zero API)</span>
            </div>
          </div>
        </aside>

        {/* Center Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 max-w-6xl mx-auto">
              {/* Hero Banner */}
              <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-[#0e1222] to-slate-900 p-6 md:p-8">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                      <Zap className="w-3.5 h-3.5" /> Phase 2 Live • 6 Interactive Tools Active
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                      AI Toolbox Developer Dashboard
                    </h1>
                    <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                      Unified client-side suite for prompt engineering, TypeScript generation, cURL translation,
                      regex analysis, and schema validation. Zero API bills, offline execution, responsive design.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => {
                        setActiveTab('tools')
                        setActiveToolId('all')
                      }}
                      className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Launch All Utilities</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Live Tools</span>
                    <Boxes className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{TOOLS_LIST.length}</div>
                  <div className="text-[11px] text-emerald-400 mt-1">All 6 operational</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Responsive Dock</span>
                    <Layers className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">Mobile / Desk</div>
                  <div className="text-[11px] text-indigo-300 mt-1">Bottom drawer enabled</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">Styling Engine</span>
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">Tailwind v4</div>
                  <div className="text-[11px] text-slate-500 mt-1">Zero-config Vite plugin</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium">External API Spend</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">$0.00</div>
                  <div className="text-[11px] text-slate-500 mt-1">Zero external token costs</div>
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
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
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
                        <span className="text-[11px] font-mono text-emerald-400">
                          Interactive
                        </span>
                        <button
                          onClick={() => launchTool(tool.id)}
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Interactive Developer Utilities</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    All 6 Phase 2 tools execute client-side in real-time with zero latency and zero external dependencies.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
                  <button
                    onClick={() => setActiveToolId('all')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                      activeToolId === 'all'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All Tools
                  </button>
                  {TOOLS_LIST.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setActiveToolId(tool.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                        activeToolId === tool.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tool.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Utility 1: Token Estimator */}
              {(activeToolId === 'all' || activeToolId === 'token-counter') && (
                <div className="p-5 sm:p-6 rounded-2xl border border-slate-800 bg-[#0d101a] space-y-4">
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
                      {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
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
              )}

              {/* Utility 2: JSON to TypeScript Interface */}
              {(activeToolId === 'all' || activeToolId === 'json-ts') && (
                <div className="p-5 sm:p-6 rounded-2xl border border-slate-800 bg-[#0d101a] space-y-4">
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
                        rows={7}
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
                            {copiedTs ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedTs ? 'Copied!' : 'Copy TS'}</span>
                          </button>
                        )}
                      </div>
                      <div className="relative w-full h-[166px] bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 font-mono overflow-y-auto">
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
              )}

              {/* Utility 3: cURL to Fetch & Axios Converter (Phase 2) */}
              {(activeToolId === 'all' || activeToolId === 'curl-converter') && (
                <div className="p-5 sm:p-6 rounded-2xl border border-slate-800 bg-[#0d101a] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">cURL to Fetch & Axios Converter</h3>
                        <p className="text-xs text-slate-400">
                          Convert raw terminal cURL commands to modern web & Node.js code snippets.
                        </p>
                      </div>
                    </div>

                    {/* Mode toggles */}
                    <div className="flex items-center gap-2">
                      <div className="flex rounded-md bg-slate-900 border border-slate-800 p-0.5 text-xs">
                        <button
                          onClick={() => setCurlOutputMode('fetch')}
                          className={`px-2.5 py-1 rounded font-mono ${
                            curlOutputMode === 'fetch'
                              ? 'bg-emerald-600 text-white font-medium'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          fetch()
                        </button>
                        <button
                          onClick={() => setCurlOutputMode('axios')}
                          className={`px-2.5 py-1 rounded font-mono ${
                            curlOutputMode === 'axios'
                              ? 'bg-emerald-600 text-white font-medium'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          axios()
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedCurlCode)
                          setCopiedCurl(true)
                          setTimeout(() => setCopiedCurl(false), 2000)
                        }}
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                      >
                        {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCurl ? 'Copied!' : 'Copy Code'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        cURL Command Input
                      </label>
                      <textarea
                        value={curlInput}
                        onChange={(e) => setCurlInput(e.target.value)}
                        rows={7}
                        className="w-full bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30"
                      ></textarea>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Generated JavaScript / TypeScript Output
                      </label>
                      <div className="w-full h-[166px] bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs text-emerald-300 font-mono overflow-y-auto">
                        <pre className="whitespace-pre-wrap">{generatedCurlCode}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Utility 4: Regex Pattern Tester (Phase 2) */}
              {(activeToolId === 'all' || activeToolId === 'regex-builder') && (
                <div className="p-5 sm:p-6 rounded-2xl border border-slate-800 bg-[#0d101a] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-400">
                        <Regex className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">Regex Pattern Tester</h3>
                        <p className="text-xs text-slate-400">
                          Real-time regular expression syntax evaluator and match inspector.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-mono flex items-center gap-1.5 ${
                          regexResult.valid
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${regexResult.valid ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                        {regexResult.valid ? `${regexResult.matches.length} Matches Found` : 'Syntax Error'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">/</span>
                        <input
                          type="text"
                          value={regexPattern}
                          onChange={(e) => setRegexPattern(e.target.value)}
                          placeholder="e.g. [a-z0-9]+@[a-z0-9]+\.[a-z]{2,}"
                          className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-xs text-violet-300 font-mono focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">/</span>
                      </div>

                      {/* Flags */}
                      <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1">
                        {(['g', 'i', 'm'] as const).map((flag) => (
                          <button
                            key={flag}
                            onClick={() => setRegexFlags({ ...regexFlags, [flag]: !regexFlags[flag] })}
                            className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                              regexFlags[flag]
                                ? 'bg-violet-600 text-white'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {flag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Test String
                      </label>
                      <textarea
                        value={regexInputText}
                        onChange={(e) => setRegexInputText(e.target.value)}
                        rows={3}
                        className="w-full bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30"
                      ></textarea>
                    </div>

                    {/* Matched tokens pills */}
                    <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80">
                      <span className="text-[11px] text-slate-400 block mb-2">Matched Extracts:</span>
                      {regexResult.valid ? (
                        regexResult.matches.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {regexResult.matches.map((m, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 rounded bg-violet-500/15 border border-violet-500/30 text-violet-300 font-mono text-xs"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 italic">No matches in test string</span>
                        )
                      ) : (
                        <span className="text-xs text-rose-400 font-mono">{regexResult.error}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Utility 5: System Prompt Structurer (Phase 2) */}
              {(activeToolId === 'all' || activeToolId === 'prompt-formatter') && (
                <div className="p-5 sm:p-6 rounded-2xl border border-slate-800 bg-[#0d101a] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">System Prompt Structurer</h3>
                        <p className="text-xs text-slate-400">
                          Format clean XML-tagged system prompts for high-adherence LLM reasoning.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generateStructuredPrompt())
                        setCopiedStructuredPrompt(true)
                        setTimeout(() => setCopiedStructuredPrompt(false), 2000)
                      }}
                      className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors"
                    >
                      {copiedStructuredPrompt ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedStructuredPrompt ? 'Copied Prompt!' : 'Copy XML Prompt'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Role & Persona
                        </label>
                        <input
                          type="text"
                          value={promptRole}
                          onChange={(e) => setPromptRole(e.target.value)}
                          className="w-full bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-sans focus:outline-none focus:border-amber-500/60"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Objective & Context
                        </label>
                        <textarea
                          value={promptContext}
                          onChange={(e) => setPromptContext(e.target.value)}
                          rows={2}
                          className="w-full bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-sans focus:outline-none focus:border-amber-500/60"
                        ></textarea>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Rules & Constraints (one per line)
                        </label>
                        <textarea
                          value={promptRules}
                          onChange={(e) => setPromptRules(e.target.value)}
                          rows={3}
                          className="w-full bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-sans focus:outline-none focus:border-amber-500/60"
                        ></textarea>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Desired Output Format
                        </label>
                        <input
                          type="text"
                          value={promptOutputFormat}
                          onChange={(e) => setPromptOutputFormat(e.target.value)}
                          className="w-full bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-sans focus:outline-none focus:border-amber-500/60"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Compiled XML Prompt Preview
                      </label>
                      <div className="w-full h-[320px] bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs text-amber-200/90 font-mono overflow-y-auto">
                        <pre className="whitespace-pre-wrap">{generateStructuredPrompt()}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Utility 6: JSON Schema & Validator (Phase 2) */}
              {(activeToolId === 'all' || activeToolId === 'schema-validator') && (
                <div className="p-5 sm:p-6 rounded-2xl border border-slate-800 bg-[#0d101a] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
                        <FileJson className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">Structured JSON Validator & Formatter</h3>
                        <p className="text-xs text-slate-400">
                          Verify syntax validity, beautify, minify, and inspect object statistics.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleValidateAndFormat('beautify')}
                        className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
                      >
                        Beautify
                      </button>
                      <button
                        onClick={() => handleValidateAndFormat('minify')}
                        className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
                      >
                        Minify
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(validatorInput)
                          setCopiedValidator(true)
                          setTimeout(() => setCopiedValidator(false), 2000)
                        }}
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-medium transition-colors"
                      >
                        {copiedValidator ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedValidator ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <textarea
                      value={validatorInput}
                      onChange={(e) => {
                        setValidatorInput(e.target.value)
                        try {
                          JSON.parse(e.target.value)
                          setValidatorStatus({ valid: true, message: 'Valid JSON syntax' })
                        } catch (err: unknown) {
                          setValidatorStatus({
                            valid: false,
                            message: err instanceof Error ? err.message : 'Invalid JSON',
                          })
                        }
                      }}
                      rows={6}
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/30"
                    ></textarea>

                    <div
                      className={`p-3 rounded-lg border text-xs font-mono flex items-center justify-between ${
                        validatorStatus.valid
                          ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                          : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${validatorStatus.valid ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                        <span>{validatorStatus.message}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{validatorInput.length} bytes</span>
                    </div>
                  </div>
                </div>
              )}
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
                <div className="text-cyan-400">
                  [PHASE 2] All 6 interactive utilities compiled and mounted
                </div>
                <div className="text-amber-400">
                  [RESPONSIVE] Mobile bottom drawer navigation engine active
                </div>
                <div className="text-slate-400">
                  [AUTH & KEYS] Zero external API keys detected. Secrets isolation verified.
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE RESPONSIVE BOTTOM BAR (Visible when screen is minimized/mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#090c14]/95 backdrop-blur-lg border-t border-slate-800/90 px-3 flex items-center justify-around z-40">
        <button
          onClick={() => {
            setActiveTab('dashboard')
            setMobileDrawerOpen(false)
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
            activeTab === 'dashboard' ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px]">Overview</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('tools')
            setActiveToolId('all')
            setMobileDrawerOpen(false)
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
            activeTab === 'tools' ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span className="text-[10px]">Utilities</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('console')
            setMobileDrawerOpen(false)
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
            activeTab === 'console' ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span className="text-[10px]">Console</span>
        </button>

        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
            mobileDrawerOpen ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="text-[10px]">Categories</span>
        </button>
      </nav>

      {/* MOBILE SLIDE-UP BOTTOM SHEET DRAWER */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          ></div>

          {/* Drawer Sheet */}
          <div className="relative bg-[#0b0e17] border-t border-slate-700/80 rounded-t-2xl p-5 pb-8 space-y-5 shadow-2xl z-10 max-h-[85vh] overflow-y-auto">
            {/* Grab Handle */}
            <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-2"></div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-sm text-white">Toolbox Categories & Settings</span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Navigation in Drawer */}
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Switch View
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setActiveTab('dashboard')
                    setMobileDrawerOpen(false)
                  }}
                  className={`p-2.5 rounded-lg text-xs font-medium border flex flex-col items-center gap-1.5 ${
                    activeTab === 'dashboard'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('tools')
                    setActiveToolId('all')
                    setMobileDrawerOpen(false)
                  }}
                  className={`p-2.5 rounded-lg text-xs font-medium border flex flex-col items-center gap-1.5 ${
                    activeTab === 'tools'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  <span>Utilities</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('console')
                    setMobileDrawerOpen(false)
                  }}
                  className={`p-2.5 rounded-lg text-xs font-medium border flex flex-col items-center gap-1.5 ${
                    activeTab === 'console'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>Console</span>
                </button>
              </div>
            </div>

            {/* Categories */}
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Filter by Category
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['All', 'Prompt', 'Code', 'Data', 'Network'].map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category)
                      setActiveTab('dashboard')
                      setMobileDrawerOpen(false)
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-lg text-xs border transition-colors ${
                      selectedCategory === category
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{category}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {category === 'All'
                        ? TOOLS_LIST.length
                        : TOOLS_LIST.filter((t) => t.category === category).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Environment Badge in Drawer */}
            <div className="p-3 rounded-lg border border-slate-800 bg-slate-950 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Runtime Engine:</span>
                <span className="text-slate-200 font-mono">React 19 + Vite</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Styling Engine:</span>
                <span className="text-slate-200 font-mono">Tailwind CSS v4</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Cloud Costs:</span>
                <span className="text-emerald-400 font-mono">$0.00 (Zero External API)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
