# Agent Builder, Framework, Protocol and Evaluation Market (as of October 2026), for AgentCanvas Positioning

Research date: 2026-10-19. Every claim is dated where the source gives a date. "(marketing)" marks a vendor's own claim. "(3rd-party vendor)" marks a source with a commercial interest. Method limits: the web-search budget ran out partway through, and the GitHub, PyPI and npm APIs were blocked by the sandbox proxy. Star and download counts therefore come from secondary pages and are approximate.

## 1. Landscape and status of visual / low-code agent builders

### Takeaway
2026 has been a year of shakeout for visual builders. OpenAI is shutting down Agent Builder and Evals (30 Nov 2026). Flowise was sunset (EOL 31 Aug 2026). DataStax shut down hosted Langflow (9 Apr 2026). Meanwhile n8n (valued at $5.2B, May 2026) and Dify ($30M, Mar 2026) grew as self-hostable platforms, and the hyperscalers (Google, AWS, Microsoft) moved toward code-first SDKs plus managed runtimes, with visual designers as on-ramps. Vendors and users both say "visual canvas, no code ownership" is the weak spot. Exportable code and self-hosting are what survived.

### Cited Findings

**OpenAI AgentKit / Agent Builder**
- AgentKit was announced at DevDay on 6 Oct 2025: Agent Builder (visual canvas, beta), Connector Registry (beta), ChatKit (GA), and new Evals capabilities (GA). It was included in standard API pricing — [OpenAI](https://openai.com/index/introducing-agentkit/)
- Update dated 3 Jun 2026 on the same page: "OpenAI is winding down Agent Builder and Evals… no longer available on the platform from November 30, 2026". The recommended replacements are the Agents SDK for code and Workspace Agents in ChatGPT — [OpenAI](https://openai.com/index/introducing-agentkit/)
- Existing evals become read-only on 31 Oct 2026. On 30 Nov 2026, Agent Builder, the Evals dashboard and API, reusable prompt objects and the `v1/prompts` API all shut down. ChatKit stays — [SpotDev](https://www.spotdev.co.uk/blog/agent-builder-wind-down-what-to-do); [mcp.directory (3rd-party)](https://mcp.directory/blog/openai-agentkit-deprecation-2026)
- Agent Builder has a "Code" option that emits Agents SDK code. One migration guide calls it "a starting point rather than a migration": the exported code still needs hosting, monitoring and an owner — [SpotDev](https://www.spotdev.co.uk/blog/agent-builder-wind-down-what-to-do)
- Pre-deprecation critiques of AgentKit: the hosted runtime is OpenAI-only at the model layer, canvas versioning and diffing are "fragile", it has no Sydney data residency, and it times out on tool calls longer than about 30s — [Osher Digital](https://osher.com.au/blog/openai-agentkit/)
- Customer claims at launch (marketing): Ramp cut iteration cycles by 70%; LY Corporation built a multi-agent assistant in under 2 hours — [OpenAI](https://openai.com/index/introducing-agentkit/)

**Flowise (Workday)**
- CB Insights lists Workday acquiring FlowiseAI on 14 Aug 2025. Total disclosed funding before that was about $500K (YC-backed) — [CB Insights](https://www.cbinsights.com/company/flowiseai/financials)
- The official sunset was announced 29 Jul 2026 with an immediate code freeze. The repo moved to public archive on 10 Aug 2026, and EOL was 31 Aug 2026. The code stays under Apache 2.0. The stated reason: developers rely on coding agents (Claude Code, OpenClaw), and "rigid, low-code workflows reach their complexity limits" — [Flowise sunset page](https://flowiseai.com/sunset)
- At sunset Flowise had about 55K GitHub stars and 24.8K forks, with clients including AWS, Accenture and Priceline. Self-hosted instances keep running but get no security patches — [byteiota](https://byteiota.com/flowise-shutdown-august-31-migrate-your-ai-pipelines-now/)
- Only managed Flowise can import flows as-is. Moving to Langflow, Dify or n8n means rebuilding the flows — [Elestio (3rd-party)](https://landing.elest.io/flowise-alternatives); a Langflow review also notes "no automated Flowise-to-Langflow import tool" — [PromptQuorum](https://www.promptquorum.com/power-local-llm/langflow-visual-ai-orchestration-review)
- Pricing before the sunset: Free, Starter $35/mo, Pro $65/mo, and Enterprise custom (on-prem or air-gapped, SSO, RBAC, audit logs) — [Lindy (competitor)](https://www.lindy.ai/blog/flowise-pricing)

**Langflow (IBM / DataStax)**
- IBM's acquisition of DataStax was announced 25 Feb 2025 and closed 28 May 2025 — [Langflow blog](https://www.langflow.org/blog/big-news-for-langflow); [PromptQuorum](https://www.promptquorum.com/power-local-llm/langflow-visual-ai-orchestration-review)
- Hosted Langflow was deprecated 9 Mar 2026 and shut down 9 Apr 2026 ("Removed DataStax Langflow from Astra"). There was no migration tool, and unexported data was deleted — [DataStax changelog](https://docs.datastax.com/en/langflow/changelog.html); [BetterClaw (3rd-party)](https://www.betterclaw.io/blog/langflow-alternative-2026)
- Star counts conflict across sources: about 138K (Jun 2026, [MakerStack](https://makerstack.co/reviews/langflow-review/)), more than 150K (Sep 2026, [PromptQuorum](https://www.promptquorum.com/power-local-llm/langflow-visual-ai-orchestration-review)), and about 153–155K ([langflow.org nav](https://www.langflow.org/blog/big-news-for-langflow); [AutomationAtlas](https://automationatlas.io/rankings/best-llm-app-platforms-2026/))
- Langflow is MIT-licensed. It has an Ollama bundle, JSON flow export, flows deployable as an API or MCP server, and a desktop app. 1.12 (Sep 2026) added OpenTelemetry — [PromptQuorum](https://www.promptquorum.com/power-local-llm/langflow-visual-ai-orchestration-review); [Langflow blog](https://www.langflow.org/blog/big-news-for-langflow)
- Code export is disputed. AutomationAtlas says flows "export as runnable Python" — [AutomationAtlas](https://automationatlas.io/rankings/best-llm-app-platforms-2026/). PromptQuorum mentions only JSON export plus raw-Python component editing — [PromptQuorum](https://www.promptquorum.com/power-local-llm/langflow-visual-ai-orchestration-review). Treat it as unverified.
- Weaknesses users report: upgrades break flows, complex canvases are hard to debug, canvases get unwieldy past about 30 nodes, and there are no production SLAs — [MakerStack](https://makerstack.co/reviews/langflow-review/)
- Security: CVE-2025-3248 (unauthenticated RCE through `exec()`, CVSS 9.8, added to CISA KEV in May 2025). Then CVE-2026-33017 (CVSS 9.8, unauthenticated RCE via the public flow endpoint, the same `exec()` path) was exploited within about 20h of its 17 Mar 2026 advisory and added to KEV on 25 Mar 2026 — [CSA research note](https://labs.cloudsecurityalliance.org/wp-content/uploads/2026/03/CSA_research_note_langflow-CVE-2026-33017-rce_20260330-csa-styled.pdf)

**n8n**
- Series C: $180M at a $2.5B valuation, led by Accel, with NVentures (NVIDIA) participating, 9 Oct 2025. Total funding reached $240M. In 2025 n8n reported 6x users and 10x revenue (no absolute figures). It added Evaluations and Data Tables — [Pulse 2.0](https://pulse2.com/n8n-180-million-series-c-at-2-5-billion-valuation-raised-for-expanding-ai-orchestration-platform/)
- 12 May 2026: SAP made a strategic investment that doubled the valuation to about $5.2B, with plans to embed n8n in SAP Joule Studio (reported via Bloomberg). The amount was not disclosed — [Odaily](https://www.odaily.news/en/newsflash/480846); [Bolsamania PR](https://www.bolsamania.com/nota-de-prensa_email/mercados/n8n-valuation-doubles-to-52bn-as-sap-makes-strategic-investment-and-plans-to-embed-the-ai-platform-into-joule-studio--22470787.html)
- Official pricing as fetched Oct 2026, annual billing: Starter €20/mo (2.5K executions), Pro €50/mo (10K), Business €667/mo (40K, self-hosted, with SSO, Git version control and environments), Enterprise by contact (hosted or self-hosted). The free Community Edition is self-hosted. Self-hosted Business and Enterprise use a license key that pings a license server daily — [n8n pricing](https://n8n.io/pricing/)
- The pricing page shows 207,681 GitHub stars and 170K+ forum members. AI features include the AI Agent node, MCP Server Trigger and Client, human approval for tool calls, metric-based evaluations, and OpenTelemetry tracing (preview) — [n8n pricing](https://n8n.io/pricing/)
- The license is the fair-code Sustainable Use License, not OSI open source — [Arahi](https://arahi.ai/blog/n8n-pricing-explained-2026). Enterprise self-hosted is estimated (not official) at €2K–6K/mo — [Arahi (3rd-party)](https://arahi.ai/blog/n8n-pricing-explained-2026)

**Dify**
- $30M pre-Series A led by HSG, about 10 Mar 2026, with Mizuho Leaguer Investment among the investors. Dify reports 1.4M+ machines, 175+ countries, 2,000+ teams and 280 enterprises. Offices are in the SF Bay Area, Tokyo, Shanghai and Suzhou (marketing) — [IT Brief](https://itbrief.co.uk/story/dify-raises-usd-30m-to-scale-open-source-ai-workflows). Reported valuation about $180M; named users include Volvo Cars, Maersk, Ricoh and ETS — [NeuronFeed](https://neuronfeed.com/startups/dify)
- Cloud: Professional $59/mo and Team $159/mo; annual $590 and $1,590 (Jul 2026) — [UsagePricing](https://usagepricing.com/blueprint/activity/dify-2026-07-14-cloud-self-hosted-annual-pricing). The self-hosted Community edition is free. Enterprise is licence-key-based with custom pricing, multi-workspace, SAML/OIDC SSO, audit logs and unlimited log history (Community keeps 30 days) — [Dify Enterprise](https://dify.ai/pricing/dify-enterprise)
- Ollama is a first-class model provider: Settings → Model Provider → Ollama — [ML Journey](https://mljourney.com/flowise-vs-dify-with-ollama-no-code-local-ai-app-builders-compared/)

**Hyperscalers**
- Google: Vertex AI was rebranded at Cloud Next in April 2026 as the Gemini Enterprise Agent Platform, merged with Agentspace. Its parts are ADK (stable 1.0), Agent Studio and Agent Designer (low-code, preview), Agent Garden, Agent Engine, Memory Bank, Agent Identity, Agent Gateway and online evaluation. Agent Engine costs $0.0864/vCPU-hr. Google says ADK has "7 million" downloads (marketing). The designer → ADK path is described as moving to code, with no formal code export documented — [UI Bakery](https://uibakery.io/blog/vertex-ai-agent-builder)
- AWS Bedrock AgentCore is consumption-priced. Runtime starts at $0.0895/vCPU-hr. Gateway is $0.005/1K calls. Policy (Cedar) is $0.025/1K authorisation requests. Evaluations: built-in $0.0024/1K input tokens, custom $1.50/1K evaluations — [AWS pricing](https://aws.amazon.com/bedrock/agentcore/pricing/). Policy went GA 3 Mar 2026 and Evaluations 31 Mar 2026. AgentCore is framework-agnostic (LangGraph, CrewAI, AutoGen, custom) and reports 2M+ SDK downloads in 5 months — [DEV](https://dev.to/akaranjkar08/amazon-bedrock-agentcore-guide-production-ai-agents-2026-2gl)
- Microsoft: Copilot Studio is priced in Copilot Credits: $200 per 25K credits per month, or $0.01 PAYG (credits replaced messages on 1 Sep 2025). Internal use by M365 Copilot-licensed users doesn't consume credits. Agent pre-purchase plans run $19K, $90K or $425K a year, shared across Copilot Studio and Foundry — [Macha (competitor)](https://www.getmacha.com/blog/copilot-studio-pricing-explained); [CloudZero](https://www.cloudzero.com/blog/copilot-studio-pricing/). Foundry Agent Service is the managed runtime for Microsoft Agent Framework. Hosted and Workflow agents were still in preview — [FutureAGI (3rd-party)](https://futureagi.com/blog/what-is-microsoft-agent-framework-2026/)

**Salesforce Agentforce**
- Agentforce plus Data 360 ARR was about $1.4B (+114% YoY), with 9,500+ paid Agentforce deals (Q3 FY26, Dec 2025) — [Futurum](https://futurumgroup.com/insights/salesforce-q3-fy-2026-ai-agents-data-360-lift-bookings-and-fy26-outlook). Agentforce ARR was reported at $1.2B as of 30 Apr 2026. Pricing is $2 per conversation (legacy), Flex Credits at $500/100K (roughly $0.10 per action), or $125–550 per user per month — [11x (competitor)](https://www.11x.ai/guides/agentforce-pricing)

**LangChain (LangGraph Studio / LangSmith)**
- LangChain raised a $125M Series B at a $1.25B valuation (20 Oct 2025). LangGraph reached 1.0 on 22 Oct 2025 — [DevToolLab](https://devtoollab.com/blog/best-ai-agent-frameworks-2026)
- On 19 Mar 2026, LangSmith Agent Builder was renamed LangSmith Fleet: a no-code enterprise agent workspace with Can-clone, Can-run and Can-edit permissions, an Inbox for human approval, and agent identity. It says nothing about exporting to LangGraph code — [LangChain blog](https://www.langchain.com/blog/introducing-langsmith-fleet)
- LangSmith pricing: Developer $0 (5K traces), Plus $39/seat (10K traces, 1 free deployment), Enterprise custom. Self-hosted and hybrid are Enterprise-only. Developer and Plus are cloud-only (US or EU) — [LangChain pricing](https://www.langchain.com/pricing)

**CrewAI**
- $18M total (inception round plus a Series A led by Insight Partners, Oct 2024). About 47.8K stars (Apr 2026). CrewAI says it ran about 2B agentic executions in the 12 months to roughly Jan 2026 and claims "nearly half of the Fortune 500" (marketing). Plans: Free, $25/mo Professional, Enterprise. Third-party revenue estimates are about $2–3M — [Panto](https://www.getpanto.ai/blog/crewai-platform-statistics)

**Others**
- Gumloop: $50M Series B led by Benchmark (12 Mar 2026). Customers include Shopify, Ramp and Instacart — [Raising.fi](https://raising.fi/news/gumloop-series-b-march-2026). Pro is $37/mo. Enterprise adds VPC deployment, with no self-hosted or code export documented — [AutomationAtlas](https://automationatlas.io/tools/gumloop/)
- Mastra (TypeScript): $13M seed (Oct 2025) and $22M Series A led by Spark Capital (Apr 2026). About 25K stars (Jun 2026). The platform (Studio, Server, Memory Gateway) launched Apr 2026, with Teams at $250/mo and Enterprise self-hosted at a flat annual fee — [Ry Walker](https://rywalker.com/research/mastra)
- Relevance AI runs on a managed runtime, and "agents are not portable to other runtimes". Vellum reportedly pivoted to a personal AI assistant in May 2026 (one source; conflicting descriptions) — [AutomationAtlas](https://automationatlas.io/rankings/best-llm-app-platforms-2026/)

### Inferences
- Users and vendors now see hosted, proprietary visual canvases as a liability. Three major exits in 2026 (OpenAI Agent Builder, Flowise, hosted Langflow) each left users rebuilding by hand. This is the strongest evidence for AgentCanvas's "you own idiomatic code" and "importer" pitch.
- Flowise's sunset reason ("coding agents beat rigid low-code") is a direct threat to any canvas. AgentCanvas should position the canvas as a review, observability and governance surface over code that coding agents can also edit. It shouldn't be pitched as a no-code replacement for code.
- The survivors (n8n, Dify) win on self-hosting, breadth of integrations and a commercial self-hosted Enterprise tier. That is the business model to copy.

### Gaps
- Funding and pricing were not verified for Botpress, Voiceflow, Lindy, Stack AI, Relevance AI, Zapier Agents, Make, Rivet, AutoGen Studio, Pipecat, LlamaIndex Cloud and ServiceNow (the search budget ran out).
- I couldn't get primary GitHub star counts because the API was blocked.
- I found no OpenAI statement explaining why Agent Builder was deprecated.
- I couldn't confirm whether Google Agent Designer exports ADK code.

## 2. Framework landscape and the value of multi-framework export

### Takeaway
No single framework dominates. LangGraph leads on Python downloads (38M+ a month, Mar 2026), followed by CrewAI and the OpenAI Agents SDK. Every hyperscaler now ships its own 1.0 SDK (ADK, Microsoft Agent Framework, Strands). Consolidation is happening inside vendors (AutoGen and Semantic Kernel → MAF; Swarm → Agents SDK), not across the market. Commentators say MCP and A2A have reduced framework lock-in. I found no survey data on how buyers value multi-framework code export.

### Cited Findings
- As of Mar 2026, approximate figures: LangGraph 24.6K stars and 38M+ PyPI downloads a month; CrewAI 44.6K stars and 12M+ a month; OpenAI Agents SDK 19K stars and 10.3M a month; Google ADK about 18K stars; MAF about 15K (release candidate on 19 Feb 2026); Claude Agent SDK about 8K — [Let's Data Science](https://letsdatascience.com/blog/ai-agent-frameworks-compared)
- CrewAI had 5M PyPI downloads in the last month (ClickPy, about Apr 2026). This conflicts with the "12M+ monthly" figure above — [Panto](https://www.getpanto.ai/blog/crewai-platform-statistics)
- Agno has about 39K stars and AgentOS, a FastAPI runtime. Pydantic AI has about 16.5K stars (Apr 2026) — [Respan](https://www.respan.ai/market-map/compare/agno-vs-pydantic-ai). Strands is used in production by Amazon Q and AWS Glue (marketing) — [Respan](https://www.respan.ai/market-map/compare/pydantic-ai-vs-strands)
- MAF is the "unified successor" to AutoGen and Semantic Kernel, which are now in maintenance mode. Its Python and .NET 1.x releases were stable by May 2026. It has graph workflows with superstep checkpointing, MCP client and server support, and Ollama support — [FutureAGI (3rd-party)](https://futureagi.com/blog/what-is-microsoft-agent-framework-2026/); [DevToolLab](https://devtoollab.com/blog/best-ai-agent-frameworks-2026)
- ADK reached 1.0 and GA in Python, Go, Java and TypeScript around Cloud Next in Apr 2026. Mastra reached 1.0 in Jan 2026. LangGraph 1.1 shipped 10 Mar 2026 — [dev.to field guide](https://dev.to/moksh/picking-an-ai-agent-framework-in-2026-a-python-and-typescript-field-guide-20o8); [LangChain newsletter](https://www.langchain.com/blog/march-2026-langchain-newsletter)
- "There is no best agent framework in 2026." The article advises choosing by language and cloud, because protocols have reduced lock-in — [dev.to field guide](https://dev.to/moksh/picking-an-ai-agent-framework-in-2026-a-python-and-typescript-field-guide-20o8). "Framework lock-in is fading," and "every major framework now ships a TypeScript path" — [DevToolLab](https://devtoollab.com/blog/best-ai-agent-frameworks-2026)
- Datadog telemetry shows agent-framework adoption among its LLM customers roughly doubled, from about 9% (early 2025) to about 18% (early 2026) — [The Agent Report](https://the-agent-report.com/2026/05/state-of-agent-engineering-2026-langchain-datadog/)
- The LangChain survey reports multi-model use (more than 75%) but not multi-framework use — [LangChain](https://langchain.com/state-of-agent-engineering)

### Inferences
- Large enterprises tend to align with their cloud: ADK on GCP, MAF on Azure, Strands and AgentCore on AWS. Multi-framework export is therefore most valuable to buyers who are multi-cloud, hedging a migration, or ISVs and consultancies shipping into each client's chosen stack. That is narrower than "every buyer".
- "Ten frameworks" is a maintenance liability: each framework releases fast (LangGraph 1.0 → 1.1 in about 5 months). The defensible claim is semantic portability (one IR with tested round-trip parity), not raw count. Lead with LangGraph, the OpenAI Agents SDK, ADK and MAF, and treat the rest as long-tail.
- OpenAI's own Agent Builder → Agents SDK "Code" export shows that single-framework export exists. Exporting to many frameworks from one canvas does appear to be unclaimed among the products I looked at.

### Gaps
- I found no forum or survey evidence quantifying buyer demand for multi-framework export.
- Tessl and Composio positioning were not researched (search budget).
- I couldn't fetch October 2026 download counts (PyPI and npm stats were blocked).
- Vercel AI SDK, LlamaIndex and Claude Agent SDK adoption figures are missing.

## 3. Protocols: MCP, A2A, AG-UI, registries

### Takeaway
MCP is now table stakes. It's governed by the Linux Foundation's Agentic AI Foundation, is native in every major framework, and procurement teams increasingly require it. A2A reached v1.0 with 150+ organisations and moved into AAIF (Aug 2026). AG-UI is the emerging agent-to-UI standard. Security is MCP's weak point: 30–82% of public servers had exploitable flaws in scans, and many CVEs are filed. Exposing deployments as an MCP server and an A2A agent is expected, not a differentiator. Secure, governed exposure (auth, allowlists, audit) is where a product can differentiate.

### Cited Findings
- On 9 Dec 2025 Anthropic donated MCP to the new Agentic AI Foundation (Linux Foundation). By then MCP had 97M+ monthly SDK downloads and 10K+ active public servers — [Practical DevSecOps](https://www.practical-devsecops.com/mcp-security-statistics-2026-report/). AAIF founding projects were MCP, Block's goose and OpenAI's AGENTS.md. Google donated A2A to AAIF on 20 Aug 2026, and AAIF passed 250 members by Aug 2026 — [FlowHunt (3rd-party)](https://www.flowhunt.io/blog/agentic-ai-foundation-a2a-mcp-standards/)
- The current MCP spec revision is 2026-07-28. It adds extensions: Tasks (async, durable handles), Skills over MCP, and MCP Apps (inline UI) — [MCP spec](https://modelcontextprotocol.io/specification/latest)
- The official MCP Registry held 9,652 latest server records (24 May 2026). 15,926 repos are tagged mcp-server. 86% of MCP servers run locally on developer machines; 5% run in production — [Practical DevSecOps](https://www.practical-devsecops.com/mcp-security-statistics-2026-report/)
- Security, from scans in the same compilation: 43% of tested servers vulnerable to command injection (Equixly); 36.7% to SSRF (BlueRock); 53% use static keys or PATs and only 8.5% use OAuth (Astrix, Oct 2025); 492 exposed servers with no auth (Trend Micro, Jul 2025); 30+ CVEs in 60 days in early 2026; CVE-2025-6514 in mcp-remote (CVSS 9.6, 437K+ downloads); the postmark-mcp malicious package (Sept 2025) — [Practical DevSecOps](https://www.practical-devsecops.com/mcp-security-statistics-2026-report/)
- CSA/Strata (Feb 2026): 23% of organisations have a formal agent identity strategy — [Practical DevSecOps](https://www.practical-devsecops.com/mcp-security-statistics-2026-report/)
- "MCP compliance is now a procurement baseline" (vendor view) — [CData](https://www.cdata.com/blog/enterprise-mcp-use-cases-roadmap-2026)
- A2A on 9 Apr 2026: 150+ organisations (up from 50+), v1.0 with Signed Agent Cards and multi-tenancy, integrated in Azure AI Foundry, Copilot Studio and Bedrock AgentCore, 22K+ stars, and SDKs in 5 languages. The roadmap includes registry consolidation — [Linux Foundation](https://linuxfoundation.org/press/a2a-protocol-surpasses-150-organizations-lands-in-major-cloud-platforms-and-sees-enterprise-production-use-in-first-year)
- AG-UI (CopilotKit): CopilotKit raised a $27M Series A on 5 May 2026. AG-UI is supported by Google, Microsoft, Amazon and Oracle, and by LangChain, Mastra, PydanticAI and Agno. CopilotKit claims "millions of installs per week" (marketing). Quote: "enterprises want optionality and they want self-hosting" — [TechCrunch](https://techcrunch.com/2026/05/05/copilotkit-raises-27m-to-help-devs-deploy-app-native-ai-agents/). The "protocol triangle" framing: MCP connects agents to tools, A2A connects agents to agents, and AG-UI connects agents to users — [CopilotKit](https://www.copilotkit.ai/blog/ag-ui-is-redefining-the-agent-user-interaction-layer)
- Enterprise MCP registries need private or hybrid catalogues, approval workflows, tool-level RBAC, audit and default-deny — [MintMCP (vendor)](https://www.mintmcp.com/blog/enterprise-mcp-registry). Google's Cloud API Registry and AWS Agent Registry ($0.40 per 1K records beyond the free tier) are hyperscaler registries — [UI Bakery](https://uibakery.io/blog/vertex-ai-agent-builder); [AWS](https://aws.amazon.com/bedrock/agentcore/pricing/)

### Inferences
- Table stakes in Oct 2026: an MCP client and server, A2A agent cards, and OpenTelemetry. AG-UI is close behind. n8n, Langflow, MAF and AgentCore already expose MCP, so AgentCanvas's "every deployment as an API, MCP server and A2A agent" matches the market rather than beating it.
- The differentiator is a self-hosted, governed private MCP and A2A registry: signed agent cards, allowlists, per-tool policy, audit, and security scanning of imported MCP servers. Every security statistic above points there.

### Gaps
- Open Agent Spec (Oracle) and AGNTCY (Cisco) were not researched (search budget).
- I didn't verify the official MCP registry's GA status or enterprise-managed auth details.

## 4. Evaluation and observability market

### Takeaway
Evals and observability are a funded, crowded category: Braintrust at $800M, Langfuse acquired by ClickHouse, LangSmith, Arize Phoenix and others. Buyers adopt observability far more than evals (89% vs 52% offline and 37% online). CI gating exists in Braintrust, Promptfoo, DeepEval and Langfuse (since May 2026). OpenAI's exit from Evals leaves users of hosted eval tools stranded. Release gates alone aren't a gap. An eval studio built into the builder, self-hosted and local-judge-capable, is a gap.

### Cited Findings
- Braintrust: $80M Series B led by ICONIQ at an $800M post-money valuation, 17 Feb 2026 — [Axios](https://www.axios.com/pro/enterprise-software-deals/2026/02/17/ai-observability-braintrust-80-million-800-million). Pricing: Starter $0, Pro $249/mo, Enterprise with self-host or hybrid; "first-class" CI integration — [FutureAGI (3rd-party)](https://futureagi.com/blog/best-llm-evaluation-tools-2026/); [benchmarkingagents](https://benchmarkingagents.com/tools-compared)
- ClickHouse acquired Langfuse on 16 Jan 2026. Core stays MIT, and self-hosted is unchanged. At the time: 20K+ stars, 23.1M SDK installs a month, 6M+ Docker pulls, and 19 of the Fortune 50 (marketing) — [ClickHouse](https://clickhouse.com/blog/clickhouse-acquires-langfuse-open-source-llm-observability). The Langfuse press page later shows 33.6K stars, 50M+ SDK installs a month, 50K+ companies, and 129 of the Fortune 500. Before the acquisition, Langfuse raised a $4M seed (Nov 2023) — [Langfuse press](https://langfuse.com/press/press)
- Langfuse Cloud: Hobby free, Core $29, Pro $199, Enterprise $2,499/mo, plus a Teams add-on at $300/mo (SSO, RBAC) — [Langfuse pricing](https://langfuse.com/pricing). Self-hosted, LLM-as-judge evaluators, annotation queues and the playground need a paid licence — [CostBench](https://costbench.com/software/ai-observability/langfuse/). Langfuse shipped CI/CD experiment gating in May 2026 — [FutureAGI](https://futureagi.com/blog/best-llm-evaluation-tools-2026/)
- Arize Phoenix: free self-hosted under Elastic License 2.0; AX Pro $50/mo. Galileo: Pro $100/mo, with VPC or on-prem on Enterprise. DeepEval: Apache 2.0, 15K+ stars, pytest-style CI gating; Confident AI from $19.99/user — [FutureAGI (3rd-party)](https://futureagi.com/blog/best-llm-evaluation-tools-2026/). Promptfoo: MIT, local or CI, and can "block a bad deploy in CI" — [benchmarkingagents](https://benchmarkingagents.com/tools-compared). OpenAI's deprecation guidance points Evals users to Promptfoo — [mcp.directory](https://mcp.directory/blog/openai-agentkit-deprecation-2026)
- Hyperscaler evals: AgentCore Evaluations went GA 31 Mar 2026 — [DEV](https://dev.to/akaranjkar08/amazon-bedrock-agentcore-guide-production-ai-agents-2026-2gl). Google's platform includes online evaluation and auto-raters — [UI Bakery](https://uibakery.io/blog/vertex-ai-agent-builder). n8n includes metric-based evaluations — [n8n pricing](https://n8n.io/pricing/)
- Buyer behaviour (LangChain survey, n=1,340, fielded Nov–Dec 2025, published 12 Jun 2026): 89% have observability (94% in production); 62% have detailed tracing; offline evals 52.4%; online evals 37.3% (44.8% of production teams); human review 59.8%; LLM-as-judge 53.3%; 29.5% don't evaluate at all. Quality is the top barrier at 32% — [LangChain](https://langchain.com/state-of-agent-engineering)
- Datadog (Feb 2026): 5% of LLM spans error, and 60% of those errors are rate limits. Over 70% of organisations use 3+ models — [The Agent Report](https://the-agent-report.com/2026/05/state-of-agent-engineering-2026-langchain-datadog/)

### Inferences
- The gap between observability (89%) and evals (52%) is the opening: evals are still drudgery. A builder that auto-generates eval datasets from traces and time-travel runs, then enforces gates at publish, removes work buyers currently skip.
- Release gates are already offered by Braintrust, Promptfoo, DeepEval and Langfuse, so they aren't unique. What's rarer is gates that are native to the deploy pipeline of the same product that built the agent, fully self-hosted, using local judge models. Of the products I checked, only n8n is close, and it is lighter-weight.

### Gaps
- Patronus, W&B Weave and Datadog LLM Observability pricing were not retrieved.
- Braintrust and Promptfoo official pricing pages hit a session rate limit and weren't fetched.

## 5. Enterprise requirements, adoption and failure

### Takeaway
Enterprises are piloting widely but scaling slowly. About 2 in 10 organisations scale agents (McKinsey 2026), and only 21% have mature agent governance (Deloitte). Gartner predicts over 40% of agentic projects will be cancelled by 2027, citing cost, unclear value and weak risk controls. Unauthorised agent actions and agent identity are the top agent-specific risks. Governance, identity, cost controls and auditability are the buying criteria for platforms.

### Cited Findings
- Gartner (25 Jun 2025): over 40% of agentic AI projects will be cancelled by end-2027, due to "rising costs, unclear business value, inadequate risk controls". Only about 130 of "thousands" of agentic vendors are genuine ("agent washing"). By 2028, 33% of enterprise apps will include agentic AI and 15% of daily decisions will be made autonomously — [Gartner](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027)
- MIT NANDA "The GenAI Divide" (Aug 2025; 150 interviews, 350 employees surveyed, 300 deployments analysed): about 95% of pilots show no measurable P&L impact. Purchased or partnered solutions succeed about 67% of the time, versus about a third of that for internal builds. The cause is a "learning gap" and poor workflow integration, not model quality — [Fortune](https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/)
- McKinsey State of AI 2026 (n=1,719, fielded May–Jun 2026, published Aug 2026): 89% use AI; about 2 in 10 scale agents; 40% of $1B+ firms scale agents in at least one function; 37% see any EBIT impact (flat); 20% say token and operating costs constrain use. High performers mitigate "unauthorized or unintended AI actions" more often (45% vs 33%) — [Digital Strategy AI summary](https://digitalstrategy-ai.com/mckinsey-state-of-ai-2026). McKinsey's 2025 edition reported 23% scaling an agentic system — [SQ Magazine](https://sqmagazine.co.uk/statistics/agentic-ai-statistics)
- Deloitte State of AI in the Enterprise 2026: 25% moved 40%+ of agent pilots into production, and 21% report mature agentic governance. KPMG Q4 2025: 72% plan to deploy agents from trusted providers — [SQ Magazine](https://sqmagazine.co.uk/statistics/agentic-ai-statistics)
- In the LangChain survey, security is the #2 blocker for enterprises with 2,000+ employees (24.9%) — [LangChain](https://langchain.com/state-of-agent-engineering)
- Platforms are shipping governance primitives: AgentCore Policy (Cedar) and Identity — [AWS](https://aws.amazon.com/bedrock/agentcore/pricing/); Google Agent Identity, Gateway and Model Armor — [UI Bakery](https://uibakery.io/blog/vertex-ai-agent-builder); LangSmith ABAC and audit logs queryable by API — [LangChain newsletter](https://www.langchain.com/blog/march-2026-langchain-newsletter); Copilot Studio per-agent usage caps with alerts at 80% and shutoff at 100% — [Macha](https://www.getmacha.com/blog/copilot-studio-pricing-explained)
- The OpenAI shutdown exposed "shadow agents": no codebase, no register of agents, agents on personal accounts. The recommended fix is an agent register with a named owner for each agent — [SpotDev](https://www.spotdev.co.uk/blog/agent-builder-wind-down-what-to-do)
- The EU AI Act obligations applicable 2 Aug 2026 carry fines up to €35M or 7% of revenue — [MintMCP](https://www.mintmcp.com/blog/enterprise-mcp-registry)

### Inferences
- MIT's "buy beats build" finding and Gartner's "risk controls" finding together favour a governed platform over DIY frameworks. AgentCanvas's roles, policies, audit and RLS map directly to the stated cancellation causes. Its weak spot is "unclear business value", which calls for built-in cost and ROI telemetry per agent.
- An agent register or inventory with an owner per agent is a cheap, high-value governance feature that the 2026 shutdowns made concrete.

### Gaps
- I didn't access Capgemini data. Deloitte and KPMG figures come via an aggregator, not the primary reports.
- I found no data on data-residency or sandbox requirements specifically.

## 6. Local-first signals

### Takeaway
Local-model support is common among self-hostable builders: Dify, n8n, Flowise and Langflow all integrate with Ollama, and MAF supports Ollama. It isn't a differentiator by itself. Hosted products (n8n Cloud, AgentKit, Gumloop) can't reach local models. Self-hosted enterprise editions command real premiums: Langfuse Enterprise is $2,499/mo, n8n Business self-hosted is €667/mo, and Dify, n8n and Mastra all offer custom-priced Enterprise self-hosted tiers. Closed models dominate enterprise usage (87%), so "local-first" must mean "local-capable and hybrid", not "local-only".

### Cited Findings
- Dify configures Ollama via Settings → Model Provider. Flowise uses an Ollama node plus Ollama embeddings. Both are fully self-hosted. Ollama runs one worker by default, so `OLLAMA_NUM_PARALLEL` is needed for concurrency — [ML Journey](https://mljourney.com/flowise-vs-dify-with-ollama-no-code-local-ai-app-builders-compared/)
- n8n self-hosted connects to Ollama, but "no local LLM integration in cloud version" — [GrowwStacks](https://growwstacks.com/blog/n8n-explained-cloud-vs-self-hosted-local-llm-ollama/)
- MAF has stable Ollama and OpenAI-compatible endpoint support — [FutureAGI](https://futureagi.com/blog/what-is-microsoft-agent-framework-2026/). Vellum supports self-hosted open-weight endpoints — [AutomationAtlas](https://automationatlas.io/rankings/best-llm-app-platforms-2026/)
- Menlo Ventures (Aug 2025): closed models power 87% of enterprise workloads, and open-source share fell from 19% to 13% in six months — [HPCwire/BigDATAwire](https://www.hpcwire.com/bigdatawire/this-just-in/menlo-ventures-report-enterprise-llm-spend-reaches-8-4b-as-anthropic-overtakes-openai/). Yet about a third of organisations invest in deploying their own models — [LangChain](https://langchain.com/state-of-agent-engineering)
- Flowise Enterprise advertised on-prem or air-gapped deployment — [Lindy](https://www.lindy.ai/blog/flowise-pricing). Dify Enterprise doesn't mention air-gapped deployment — [Dify](https://dify.ai/pricing/dify-enterprise). n8n's self-hosted licence pings a license server daily — [n8n](https://n8n.io/pricing/)
- Self-hosted premiums: Langfuse Enterprise is $2,499/mo, and self-hosted advanced eval features need a licence — [Langfuse](https://langfuse.com/pricing); [CostBench](https://costbench.com/software/ai-observability/langfuse/). LangSmith self-hosted is Enterprise-only — [LangChain pricing](https://www.langchain.com/pricing). Mastra Enterprise self-hosted is a flat annual fee — [Ry Walker](https://rywalker.com/research/mastra)

### Inferences
- A licence that phones home daily (n8n) creates an opening for truly offline or air-gapped licensing: signed offline licence files and air-gapped agent packs. This matters to Japanese regulated industries (finance, healthcare, government).
- Local-model operations are where builders fall short: concurrency and queueing for Ollama, vLLM, LM Studio; model-fit warnings for the hardware; local judge models for evals. A "local-first model catalogue" with hardware-aware routing is plausibly unmatched among the products reviewed.

### Gaps
- I found no r/LocalLLaMA or Hacker News threads (search budget); community complaints are thinly sourced.
- I found no LM Studio or vLLM-specific integration comparisons.

## 7. Gaps, complaints and product ideas; which AgentCanvas differentiators are real

### Takeaway
The real gaps AgentCanvas can own: (1) a canvas that compiles to owned, idiomatic code in several frameworks, which the 2026 shutdowns showed is needed; (2) importers for the stranded Flowise, hosted-Langflow and OpenAI Agent Builder users, with timely demand; (3) self-hosted, offline-licensed evaluation with release gates built into deployment; (4) a governed private MCP and A2A registry. Commodity features that competitors already cover: API, MCP and A2A publishing, Ollama support, durable checkpointing, tracing, RBAC, SSO and audit, and CI eval gates.

### Cited Findings (user complaints and lock-in evidence)
- Hosted shutdowns left nothing to migrate from: hosted Langflow deleted data at shutdown without a migration tool — [BetterClaw](https://www.betterclaw.io/blog/langflow-alternative-2026). OpenAI's hosted builders leave "no codebase" — [SpotDev](https://www.spotdev.co.uk/blog/agent-builder-wind-down-what-to-do). Flowise flows must be rebuilt elsewhere — [Elestio](https://landing.elest.io/flowise-alternatives)
- Canvas pain points: hard to debug complex canvases, breakage on upgrades, unwieldy past 30+ nodes — [MakerStack](https://makerstack.co/reviews/langflow-review/); version control and diffing are "fragile" — [Osher](https://osher.com.au/blog/openai-agentkit/); debugging complex loops is hard in Flowise, and Dify's opinionated model "hits walls" — [fast.io](https://fast.io/resources/best-self-hosted-ai-agent-platforms.md)
- Governance gaps in OSS builders: Flowise has limited RBAC and audit; Langflow OSS has little auth or observability; n8n's SSO and audit sit behind the enterprise licence — [Hugging Face blog](https://huggingface.co/blog/daya-shankar/n8n-vs-flowise-vs-langflow-enterprises)
- Security of builders: Langflow has had two KEV-listed unauthenticated RCEs via `exec()` (2025 and 2026) — [CSA](https://labs.cloudsecurityalliance.org/wp-content/uploads/2026/03/CSA_research_note_langflow-CVE-2026-33017-rce_20260330-csa-styled.pdf)
- Datadog's "LLM tech debt": teams adopt models fast but retire them slowly — [The Agent Report](https://the-agent-report.com/2026/05/state-of-agent-engineering-2026-langchain-datadog/)

### Differentiator scorecard (inference, based on the findings above)
| AgentCanvas claim | Verdict | Who already covers it |
|---|---|---|
| Graph IR → idiomatic code for 10 frameworks | **Real gap** (multi-framework). Single-framework export exists | OpenAI Agent Builder "Code" → Agents SDK (being shut down); Langflow export disputed; Google designer → ADK path |
| Importers for Langflow, Flowise, n8n | **Real and timely gap**. No automated cross-tool importer found | Only managed-Flowise hosts (Elestio) import Flowise as-is. Add an OpenAI Agent Builder importer before 30 Nov 2026 |
| Durable runs and time-travel debugging | Partly covered | LangGraph checkpoints and LangSmith; MAF superstep checkpoints. A visual time-travel view across frameworks is less common |
| Eval studio with release gates | Partly covered. The integrated, self-hosted, local-judge version is the gap | Braintrust, Promptfoo, DeepEval, Langfuse CI gates; AgentCore and Google online eval; n8n evaluations |
| Versioning | Commodity, but canvas diffing is weak across rivals | n8n Git, Agent Builder versioning, Dify prompt versions |
| Publish as API, MCP server, A2A agent | **Table stakes** | n8n, Langflow, MAF, AgentCore, Foundry, Copilot Studio |
| Local-first model catalogue | Partly covered. Ollama connectivity is common; hardware-aware catalogue, routing and local ops are a gap | Dify, n8n, Flowise, Langflow, MAF support Ollama |
| Governance (roles, policies, audit, RLS) | Expected for enterprise; usually paywalled | Dify, n8n, LangSmith, Langfuse Enterprise; AgentCore Policy; Fleet permissions |
| Self-hosted | Expected. Offline or air-gapped licensing is a gap | n8n phones home daily; Flowise Enterprise advertised air-gapped but is now EOL |

### Product ideas (inferences)
1. **"Rescue" importers as a launch wedge:** OpenAI Agent Builder (deadline 30 Nov 2026), Flowise (EOL), and hosted-Langflow JSON. Each produces owned LangGraph or Agents SDK code plus an auto-generated regression eval set, so the migrated flow is proven equivalent.
2. **Round-trip with coding agents:** keep the canvas and code in sync so Claude Code or Cursor can edit the generated code and the canvas re-reads it. This answers Flowise's "coding agents beat low-code" reason for shutting down.
3. **Agent register and ownership:** an inventory of every agent with its owner, data touched and cost, plus change approvals. This directly addresses the shadow-agent lesson and Gartner's risk-control cause.
4. **Governed private MCP and A2A registry:** signed agent cards, tool allowlists, MCP server security scanning, and default-deny per-tool policy.
5. **Air-gapped agent packs:** signed offline licences plus bundled model, eval and agent packages for regulated Japanese customers. Dify has a Tokyo office and Japanese investors, so expect competition there.
6. **Japanese business workflow templates** (ringi approval, invoice auditing, compliance review) with approval-flow nodes and Japanese-language eval sets. Dify cites invoice auditing as a use case, so these are adjacent.
7. **Cost and ROI telemetry per agent**, with budget caps like Copilot Studio's, aimed at Gartner's "rising costs" and McKinsey's 20% cost-constrained respondents.
8. **Secure-by-default execution:** no unsandboxed `exec()` of user code, which is a pointed contrast with Langflow's CVE history.

### Gaps
- Agent marketplaces (Agent Garden, AWS Marketplace agents) were not researched in depth.
- No primary community threads (HN, Reddit) were retrieved; the complaint evidence comes from reviews and vendor blogs.
- Japanese-market competitors (local builders, NTT, Fujitsu offerings) were not researched.
