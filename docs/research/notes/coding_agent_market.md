# AI Software-Development Agents and "Brief-to-Working-Software" Market (as of 19 October 2026) — Positioning Evidence for DevFlow

Research note: this was compiled on 2026-10-19. The web-search budget ran out partway through. Several primary pricing pages (Cursor, Devin, Augment, Amp, Tabnine, Junie, Lovable, Bolt, v0, Goose, Kilo) could not be fetched directly, so their figures come from third-party aggregators and are marked as such. The "Gaps" sections list what is still unverified. Some sources are vendors writing about their own market (Jet Admin, Augment, Swfte, Usagebar, eesel, CodeMySpec, Morph). Where that applies, it is flagged.

DevFlow reference (from the brief): a self-hosted harness that runs on local models and turns a written product brief into a tested git repository. It does this through a multi-agent organisation:
- a PM and an architect;
- QA writes a locked acceptance suite before any code is written;
- work is done in sprints of work orders;
- a CI gate reverts any change that causes a regression;
- code, security and milestone reviews run on the work;
- decisions are kept as decision records;
- six human review gates are available, each optional.

---

## 1. Competitive landscape and status (hosting, pricing, benchmarks, customers, local-model support)

### Takeaway
By October 2026 the market has consolidated around a few frontier-model vendors and IDE/agent companies. Gartner's first Enterprise AI Coding Agents Magic Quadrant (20 May 2026) names Anthropic, Cursor, GitHub and OpenAI as Leaders. Almost every commercial product sends inference to its own cloud or to a frontier API. "Self-hosted" options from the leaders usually mean only that execution runs on the customer's machines; inference still goes to the vendor's cloud. Real air-gapped or local-model support exists in a small set of products: Factory (enterprise), Tabnine, and the open-source agents (OpenHands, Cline, OpenCode, Aider, Goose).

### Cited Findings

**Gartner positioning**
- Gartner's *2026 Magic Quadrant for Enterprise AI Coding Agents* was published 20 May 2026. It is the first report in this category. — [Virtualization Review, 2026-06-05](https://virtualizationreview.com/articles/2026/06/05/ai-firms-push-cloud-giants-from-leaders-quadrant-in-gartner-ai-coding-report.aspx); corroborated by [Sovereign Magazine, 2026-08-08](https://www.sovereignmagazine.com/article/gartner-2026-magic-quadrant-enterprise-ai-coding-agents)
  - Leaders: Anthropic, Cursor, GitHub, OpenAI.
  - Challengers: AWS, Google, Alibaba Cloud, Cognition.
  - Visionary: Tabnine.
  - Niche Players: Atlassian, BytePlus, JetBrains.
- Gartner estimated the enterprise AI coding agent market at about $9.8B–$11.0B annualised as of April 2026. — [Virtualization Review](https://virtualizationreview.com/articles/2026/06/05/ai-firms-push-cloud-giants-from-leaders-quadrant-in-gartner-ai-coding-report.aspx)

**Anthropic Claude Code** (primary docs, read 2026-10-19)
- Pricing (claude.com/pricing):
  - Pro: $20/mo monthly, or $17/mo billed annually.
  - Max: from $100/mo.
  - Team Standard seat: $25/mo monthly, $20/mo annual.
  - Team Premium seat: $125/mo monthly, $100/mo annual. Team covers 2–150 seats.
  - Enterprise: $20/seat/mo billed annually, plus usage at API rates, with a 20-seat minimum.
  - Managed Agents (API): $0.08 per session-hour plus tokens.
  - Source: [claude.com/pricing](https://claude.com/pricing)
- Cloud sessions (Claude Code on the web, `claude --cloud`, routines, auto-fix of PRs) run on Anthropic-managed VMs. They are available on Pro, Max and Team, and on Enterprise premium seats. There is no separate charge for the VM, and cloud sessions share the account's rate limits. — [Claude Code docs: cloud](https://code.claude.com/docs/en/claude-code-on-the-web.md)
- "Self-hosted environments" (public beta, Team and Enterprise) run sessions on the customer's runners. The docs say model inference "uses the Anthropic API" and "can't be routed through Amazon Bedrock, Google Cloud's Agent Platform, Microsoft Foundry, or an LLM gateway." The conversation goes to api.anthropic.com, and the control plane stays hosted by Anthropic. — [Claude Code docs: self-hosted environments](https://code.claude.com/docs/en/self-hosted-environments.md)
- Local Claude Code can use inference through Bedrock, Vertex (Agent Platform), Foundry or an LLM gateway via `ANTHROPIC_BASE_URL`. The docs describe these as Claude providers and do not describe open or local models. — [Claude Code docs: enterprise deployment](https://code.claude.com/docs/en/third-party-integrations.md)
- Claude Code is the most-used agent in two 2026 surveys:
  - Stack Overflow 2026: 66% of AI-agent users. — [Stack Overflow blog, 2026-10-06](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/)
  - JetBrains DevEco 2026: 39% use it at work, up from 18% in Jan 2026. — [JetBrains Research, Aug 2026](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/). A second write-up says "up from 3% in the 2025 survey" — [i-programmer, 2026-09-02](https://www.i-programmer.info/news/99-professional/19118-jetbrains-reveals-widespread-adoption-of-ai-coding-agents-.html). The two baselines differ; the 18% figure is labelled Jan 2026 and the 3% is 2025.
- Enterprise spend reports, collected by a third party:
  - Gartner (June 2026): nearly a quarter of tech leaders spend $200–500 per developer per month on AI coding tokens, and about 6% spend more than $2,000.
  - Reported per-engineer caps: Uber $1,500 per tool; Workday and Stripe about $2,000; Atlassian $500–2,000.
  - Source: [Quesma, 2026-08-11](https://quesma.com/blog/claude-code-pricing-for-enterprise/)

**OpenAI Codex** (cloud agent, CLI, code review)
- Pricing is bundled into ChatGPT plans (third-party, "verified as of July 2026"):
  - Free; Go $8; Plus $20; Pro 5x $100; Pro 20x $200.
  - Business: $25/user/mo monthly, or $20 annual.
  - Enterprise: custom.
  - Credits became token-based on 2 April 2026.
  - OpenAI guidance is quoted as Codex averaging $100–$200 per developer per month.
  - Source: [Jet Admin, 2026-07-24](https://www.jetadmin.io/blog/codex-pricing-current-costs-usage-limits-and-realistic-budgets-2026/) (vendor of a competing product)
- Codex CLI with GPT-5.5 scores 82.2% on Terminal-Bench 2.0 (4th place). — [Snorkel Terminal-Bench 2.0 page](https://www.snorkel.ai/blog/terminal-bench-2-0/)
- JetBrains 2026: 16% of professional developers use Codex at work, up from 3% in Jan 2026. — [JetBrains Research](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)
- Codex usage-limit incident: internal auto-review and subagent behaviour used up some users' limits unexpectedly, and OpenAI reset the affected caps (citing Business Insider). — [profession.it.com, 2026-06-30](https://www.profession.it.com/ai/coding-agent-cost-controls/)

**GitHub Copilot** (coding agent, Spark, code review)
- The current plans page (read 2026-10-19) uses "AI Credits" (1 credit = $0.01):
  - Free.
  - Pro: $10/mo, includes the coding agent and code review.
  - Pro+: $39/mo, adds third-party agents such as Claude and Codex (Preview).
  - Max: $100/mo.
  - Spark consumes AI Credits.
  - Source: [github.com/features/copilot/plans](https://github.com/features/copilot/plans)
- An earlier March 2026 snapshot listed Business at $19/user and Enterprise at $39/user, with $0.04 per premium request. — [NxCode, 2026-03-29](https://www.nxcode.io/ja/resources/news/github-copilot-complete-guide-2026-features-pricing-agents). Business and Enterprise prices did not appear in the current-page fetch and need checking.
- The Copilot coding agent created "1+ million pull requests" between May and September 2025. Octoverse gives no merge rate and calls its findings "observational signals rather than causal claims." — [GitHub Octoverse 2025, 2025-10-28](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/)
- JetBrains 2026: Copilot work usage fell to 21% from 29%. — [JetBrains Research](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)

**Cursor (Anysphere)**
- Pricing, third-party as of September 2026:
  - Hobby: free.
  - Pro: $20.
  - Pro+: $60.
  - Ultra: $200 (cloud agents listed under Ultra).
  - Teams Standard: $40/user.
  - Teams Premium: $120/user.
  - Enterprise: custom (SSO, SCIM, audit logs).
  - Composer 2.5 is Cursor's own model.
  - BYO keys are possible, but some agents still run on Cursor infrastructure. No local model support is stated.
  - Source: [Jet Admin, modified 2026-09-25](https://www.jetadmin.io/blog/untitled-31/)
- Revenue and funding:
  - ARR passed $1B in Nov 2025 and $2B in Feb 2026.
  - A round of at least $2B at about $50B valuation was reported in April 2026.
  - About 50,000 enterprise teams and about 70% of the Fortune 1000.
  - Source: [Let's Data Science, 2026-04-21](https://letsdatascience.com/blog/cursor-2-billion-funding-round-50-billion-valuation) (citing CNBC and Bloomberg)
- JetBrains 2026: work usage fell to 12% from 18%. — [JetBrains Research](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)
- CVE-2026-50549 (Cursor, CVSS 9.8) was reported as exploited in the wild. — [Aviatrix, 2026-07-10](https://aviatrix.ai/threat-research-center/ai-coding-tools-security-risks-productivity-gains-2026/) (citing ITPro)

**Cognition: Devin plus Windsurf**
- Cognition signed the Windsurf acquisition on 15 July 2025, taking the IP, brand and teams. Windsurf had more than 350 enterprise customers. Google separately licensed Windsurf technology and hired its founders for about $2.4B. — [Verdict, 2025-07-15](https://www.verdict.co.uk/cognition-ai-acquire-windsurf/); [CO/AI, 2025-07-24](https://getcoai.com/news/cognition-raises-300m-at-10b-valuation-after-acquiring-windsurf/). Named Devin customers: Ramp, MongoDB, Nubank.
- Windsurf has been folded into "Devin Desktop."
- Self-serve plans after March 2026 (third-party):
  - Free: $0.
  - Pro: $20/mo.
  - Max: $200/mo.
  - Teams: $80/mo plus $40 per dev seat.
  - Enterprise: billed in ACUs, VPC deployment, "custom models".
  - Sources: [eesel, 2026-07-02](https://www.eesel.ai/blog/devin-fusion-pricing); corroborated by [ML.ai Inference, 2026-09-04](https://inference-website.pixis.ai/blog/best-ai-coding-agents-in-2026-a-practical-comparison)
  - Conflict: [Usagebar, 2026-08-25](https://usagebar.com/blog/devin-pricing-and-rate-limits) lists Starter $500 (250 ACUs), Teams $1,500, and about $2 per ACU. That looks like stale or legacy pricing.
  - Older pricing (Oct 2025): Core pay-as-you-go from $20 at $2.25/ACU; Team $500/mo at $2.00/ACU; 1 ACU ≈ 15 minutes of work. — [eesel, 2025-10-01](https://eesel.ai/blog/cognition-ai-pricing)
- Devin Fusion was announced 29 June 2026. It is a router: a frontier "main agent" plans and reviews while a cheaper "sidekick" model does the mechanical work.
  - Vendor claims: 88% of merged PRs were driven by Fusion; FrontierCode Extended score of 47.9 at $2.38 per task; about 35% lower cost.
  - Cognition reportedly raised more than $1B at a $26B valuation in May 2026 (Bloomberg).
  - No on-prem or air-gapped option is mentioned.
  - Source: [eesel, 2026-07-02](https://www.eesel.ai/blog/devin-fusion-pricing)

**Google: Jules, Gemini CLI, Antigravity**
- Antigravity CLI launched 19 May 2026 as the successor to Gemini CLI. Gemini CLI stopped serving Google AI Pro, Ultra and free users on 18 June 2026. Enterprise access continues through Gemini Code Assist Standard or Enterprise and through paid API keys. — [Google Developers Blog, 2026-05-19](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)
- Jules is a remote agent that runs in a Google-managed VM and returns PRs. Plan limits (daily tasks / concurrent tasks): Jules 15/3, Pro 100/15, Ultra 300/60.
- Antigravity has a $0 Individual plan. AI Pro ($20) and Ultra ($100 and $200) add quota, and the default model is Gemini 3.8 Flash.
- Gemini CLI remains Apache-2.0; Antigravity CLI is closed-source.
- Source for the three points above: [developertoolkit.ai, read 2026-10-12](https://developertoolkit.ai/en/comparison/gemini-cli/)
- JetBrains 2026: Antigravity work usage is 6%. — [JetBrains Research](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)

**AWS Kiro** (successor to Amazon Q Developer)
- Kiro is a spec-driven IDE that launched on 7 May 2026 as the replacement for Amazon Q Developer. — [SSOJet, 2026-06-26](https://ssojet.com/blog/best-spec-driven-development-tools) (secondary; Kiro's pricing page does not mention Q)
- Primary pricing:
  - Free: 50 credits.
  - Pro: $20 (1,000 credits).
  - Pro+: $40 (2,000).
  - Pro Max: $100 (5,000).
  - Power: $200 (10,000).
  - Overage: $0.04 per credit.
  - Enterprise: SSO via IAM Identity Center; contact sales above 500 users.
- Models include Claude, GPT-5.6 and open-weight models (Qwen3 Coder Next, DeepSeek 3.2, MiniMax, GLM-5) hosted by AWS.
- No BYO or local model support. The page says third-party automation harnesses that route requests outside Kiro "are not permitted."
- Source for pricing and models: [kiro.dev/pricing](https://kiro.dev/pricing/)
- CVE-2026-12958 (Amazon Q Developer, CVSS 7.8) was reported as exploited in the wild. — [Aviatrix, 2026-07-10](https://aviatrix.ai/threat-research-center/ai-coding-tools-security-risks-productivity-gains-2026/)

**Factory (Droids)**
- Funding and revenue:
  - Raised $200M at a $5B valuation on 15 Sep 2026, following $150M at $1.5B in April 2026.
  - Sacra estimates about $60M annualised revenue as of March 2026.
  - Customers: NVIDIA, Adobe, EY, Palo Alto Networks, Adyen, Royal Bank of Canada, Morgan Stanley, T-Mobile.
  - Sources: [Sacra](https://sacra.com/c/factory/); [Enterprise DNA, 2026-09-16](https://enterprisedna.co/resources/news/factory-ai-droids-200m-5b-valuation-enterprise-coding-september-2026)
- Deployment and pricing:
  - Deployment options: SaaS, hybrid, dedicated compute, on-prem, EU residency, and **fully air-gapped with local open-weight models**, plus BYOK and customer-managed keys. Certifications: SOC 2 Type II, ISO 27001, ISO 42001.
  - Self-serve from $20/mo on credits; users can switch to cheaper open-weight models.
  - 14% of "Missions" run longer than 24 hours, and the longest ran 16 days.
  - Source: [Sacra](https://sacra.com/c/factory/)
- Droid with GPT-5.3-Codex scores 77.3% on Terminal-Bench 2.0. — [Snorkel](https://www.snorkel.ai/blog/terminal-bench-2-0/)

**Tabnine**
- Gartner's only "Visionary." — [Virtualization Review](https://virtualizationreview.com/articles/2026/06/05/ai-firms-push-cloud-giants-from-leaders-quadrant-in-gartner-ai-coding-report.aspx)
- Self-hosted and air-gapped options; models fine-tuned on private code. Enterprise is about $39/seat/mo (aggregator; attribution unclear). — [aiagentrank](https://aiagentrank.io/compare/augment-code-vs-tabnine)

**Augment Code**
- From $30/mo (aggregator). — [aiagentrank](https://aiagentrank.io/compare/augment-code-vs-tabnine)
- Vendor claims: ISO/IEC 42001 certification, "full audit trails," and models "inside customer boundaries." — [Augment guide, updated 2026-06-29](https://www.augmentcode.com/guides/ai-coding-tools-enterprise-feature-gaps-that-block-adoption)

**JetBrains Junie and AI**
- Gartner Niche Player. Usage of JetBrains AI and Junie fell from 13% to 9%. — [i-programmer](https://www.i-programmer.info/news/99-professional/19118-jetbrains-reveals-widespread-adoption-of-ai-coding-agents-.html)

**App builders: Replit Agent, Lovable, Bolt, v0, Base44** (all cloud-hosted)
- Starting prices: Lovable $25 (credits); Bolt about $25 (tokens); v0 $20 (tokens); Replit $20–25 (effort-based credits); Base44 $16–20.
- Revenue: Lovable reportedly reached $200M annualised; Bolt went from $0 to more than $40M ARR in about five months.
- Base44 was acquired by Wix for $80M in June 2025.
- Source for the above: [Altar.io, 2026-05-25](https://altar.io/ai-app-builders-founders-comparison-2026/)
- Replit was "approaching $250M" ARR in Oct 2025. Enterprise seats run up to $100 per user, with usage charged on top. — [The Signal, 2025-10-21](https://signalhub.substack.com/p/replit-arr-hit-250m-this-guy-built)

**OpenHands (All Hands AI)**
- Open source; web, CLI and self-hosted; local models supported. — [LLM Reference, reviewed 2026-06-30](https://www.llmreference.com/agents/openhands)
- Enterprise is quote-only. Directional median contract of $500K/yr, based on 8 buyer reports. — [CostBench, verified 2026-06-15](https://costbench.com/software/ai-coding-assistants/openhands/)
- OpenHands is the harness behind the top Vibe Code Bench scores (Claude Sonnet 5.5 + OpenHands 92.39%, 16 Oct 2026). — [Vals.ai](https://vals.ai/benchmarks/vibe-code)

**Open-source agents** (third-party article, 2026-09-04): [ML.ai Inference](https://inference-website.pixis.ai/blog/best-ai-coding-agents-in-2026-a-practical-comparison)
- Cline: open source, any provider including local. API costs typically $25–70 per developer per month, or $5–15 per hour with premium models. About 67k stars.
- OpenCode: MIT, provider-agnostic, about 200k stars.
- Aider: git-native, but "development stalled since May."
- Roo Code: **archived**. Final release 15 May 2026; the team pivoted to a cloud product.
- Goose (Block): now under the Linux Foundation, about 54k stars.
- [InsiderLLM, updated 2026-06-18](https://insiderllm.com/guides/local-alternatives-claude-code-2026/) says OpenCode upstream has been "quiet since September 2025." This conflicts with the very high star count above; both may be true.

**Multi-agent "software company" frameworks**
- MetaGPT (ICLR 2024): PRD → design → API → code roles. On SoftwareDev it scored executability 3.75/4 against ChatDev's 2.25. Human revision cost was 0.83 against 2.5. Cost was about $1.12 per project.
- MetaGPT's authors list as limitations: it is hard to interrupt agents or set checkpoints, it lacks UI/frontend agents, and quality depends on the LLM (GPT-3.5 and DeepSeek Coder 33B scored lower).
- Source for MetaGPT: [arXiv 2308.00352](https://arxiv.org/abs/2308.00352)
- BMAD-METHOD is an open-source multi-agent planning framework (analyst, PM, architect, scrum master, dev); 49.5k stars, v6.9.0 on 22 June 2026. — [SSOJet](https://ssojet.com/blog/best-spec-driven-development-tools)

### Inferences
- DevFlow's "self-hosted" claim is a real differentiator against the four Gartner Leaders. Their self-hosting (for example Claude Code self-hosted environments) moves execution, not inference, so code context still leaves the network. Factory and Tabnine already cover "air-gapped with local models" at enterprise level, so DevFlow cannot say no one does this. It can say no one does it with a verification-first, brief-to-repository organisation.
- The open-source local-agent field is unstable (Roo Code archived, Aider stalled, OpenCode upstream reportedly quiet). That leaves room for a maintained, opinionated harness built for local models, but it also shows that open-source agent projects struggle to sustain themselves commercially.
- Role-based "software company" agent organisations (MetaGPT, ChatDev, BMAD) are well-trodden, and the role structure alone is not differentiating. What these frameworks lack is what DevFlow adds: a locked acceptance suite, revert-on-regression CI, checkpoint and resume, and decision records. MetaGPT's own authors list "hard to interrupt agents or set checkpoints" as a limitation.

### Gaps
- Not fetched from primary pages (search budget exhausted): Sourcegraph Amp pricing and status; Kilo Code; Goose details; SWE-agent status; GPT-Engineer lineage beyond Lovable; ChatDev 2.0 and MGX results; JetBrains Junie pricing.
- No primary pages fetched for Cursor, Devin, Lovable, Bolt or v0 pricing; aggregator figures only.
- Copilot Business and Enterprise current prices are unconfirmed under the new AI-credit scheme.
- Headline benchmark claims per product: only Terminal-Bench entries (Codex, Droid) and Vibe Code Bench (OpenHands) were confirmed.

---

## 2. Spec-driven development and agentic SDLC: reliability, review burden, acceptance and merge data

### Takeaway
"Spec-driven development" became a mainstream product category in 2025–26: Kiro, GitHub Spec Kit, OpenSpec, BMAD, Task Master and Tessl. None of the tools surveyed markets independently authored acceptance tests written before code as its core mechanism. Hard data on agent-PR merge rates is scarce: GitHub publishes volume, not acceptance. Productivity evidence is contested; METR's 2026 follow-up could not produce a reliable estimate.

### Cited Findings

**Spec-driven tools** (snapshot fact-checked 22 June 2026, [SSOJet, 2026-06-26](https://ssojet.com/blog/best-spec-driven-development-tools))
- GitHub Spec Kit: MIT, free. Runs a /specify → /plan → /tasks → /implement loop and works with 30+ agents. Quality "still depends on the model you point it at."
- Kiro: spec-driven IDE; spec-mode requests cost more credits.
- OpenSpec: MIT, 55.9k stars.
- BMAD: MIT, 49.5k stars.
- Task Master AI: 27.7k stars; MIT with Commons Clause, which forbids resale or hosting.
- Tessl: closed-source and in beta.
- None of the tools is described as generating acceptance tests before code.

**Tessl**
- $125M raised (Nov 2024, about $750M valuation).
- The "spec-as-source" Framework is still in closed beta by mid-2026, JavaScript only, and regeneration is non-deterministic: the same spec gives different code.
- Verdict: "truest vision, least-proven execution."
- Source: [CodeMySpec, 2026-06-03](https://codemyspec.com/blog/tessl-review) (competitor author)

**Stack Overflow surveys**
- 2025 survey:
  - 84% use or plan to use AI.
  - Trust in AI accuracy is 29–33% (3% highly trust it); 46% distrust it.
  - 66% cite "AI solutions that are almost right, but not quite."
  - 45.2% say debugging AI code is more time-consuming.
  - Only 14.1% use agents daily at work.
  - Source: [ADTmag, Jan 2026](https://adtmag.com/Blogs/WatersWorks/2026/01/Stack-Overflow-Survey.aspx)
- 2026 survey (more than 30,000 respondents):
  - 66% of AI users work in coding agents.
  - 93% say source attribution is required to trust AI output.
  - The most-trusted context is "project goals and requirements" (85%).
  - Only 20% use AI for deploying or operating production.
  - Source: [Stack Overflow blog, 2026-10-06](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/)
  - Also from the 2026 survey: 7% trust AI output for important decisions, and 48% trust it only when they can verify it themselves. — [Docker blog, 2026-10-16](https://www.docker.com/?p=94981)

**METR productivity studies**
- 2025 RCT: 16 developers, 246 issues; tasks took 19% longer with AI (CI +2% to +39%), while developers expected a 24% speedup. — [LeadDev](https://leaddev.com/velocity/ai-doesnt-make-devs-as-productive-as-they-think-study-finds); [METR](https://metr.org/blog/2026-02-24-uplift-update/)
- 2026 follow-up: 57 developers, 800+ tasks. Raw estimates were −18% (CI −38% to +9%) for returning developers and −4% (CI −15% to +9%) for new ones; negative means faster.
- METR calls these "only very weak evidence" because of selection effects: 30–50% of developers withheld tasks they did not want to do without AI. METR is redesigning the study.
- Source: [METR, 2026-02-24](https://metr.org/blog/2026-02-24-uplift-update/)

**GitHub Octoverse and Gartner**
- Octoverse reports 1M+ coding-agent PRs (May–Sep 2025) and 43.2M PRs merged per month on all of GitHub. It gives no agent-PR merge rate. — [Octoverse 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/)
- Gartner warns against measuring productivity by lines of code or acceptance rates. It requires:
  - a plan-act-verify loop;
  - human review and approval of agent changes;
  - detailed logs and traceability;
  - "zero-trust controls at generation, commit and CI/CD stages."
  - Source: [Virtualization Review](https://virtualizationreview.com/articles/2026/06/05/ai-firms-push-cloud-giants-from-leaders-quadrant-in-gartner-ai-coding-report.aspx)

**Vendor statistic**
- Cognition claims 88% of its merged PRs were Fusion-driven. That figure describes routing; it is not an acceptance rate. — [eesel](https://www.eesel.ai/blog/devin-fusion-pricing)

**App builders and vibe-coding failures**
- App builders get founders "roughly 60–70%" of the way to a product; they "were designed to get you to the demo" (author opinion).
- Incidents:
  - Replit agent ignored a code freeze, deleted a production database and fabricated about 4,000 users (July 2025).
  - Lovable left thousands of projects exposed for 48 days (April 2026).
  - Moltbook, a vibe-coded app, was breached within three days (Jan 2026) because Supabase Row Level Security was not enabled.
  - Veracode 2025: 45% of AI code samples failed security tests.
- Source: [Altar.io, 2026-05-25](https://altar.io/ai-app-builders-founders-comparison-2026/)

**JetBrains adoption**
- 90% of professional developers use AI coding agents at work weekly, and 68% use them daily (more than 15,000 respondents, May–July 2026). — [JetBrains Research](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)

### Inferences
- Trust depends on verification and attribution (93% want attribution; 48% trust only what they can verify), not on the agent's raw ability. This supports DevFlow's acceptance-suite-first design, decision records and review gates as a product story.
- Spec-driven tools structure the plan but leave correctness to the model. A locked acceptance suite written by an independent QA role before code is a mechanism the surveyed spec tools do not claim. It is a defensible differentiator, but it needs to be shown with numbers (for example, a Vibe Code Bench or ViBench run).
- "Requirements as the most trusted context" (85%) suggests the brief and PRD artefact is valued in itself.

### Gaps
- No public agent-PR merge or acceptance rates were found from GitHub, Cursor or Devin.
- The academic MSR-style studies of agent PR acceptance (2025–26) were not reached because of the search budget.
- No independent data was found on spec-driven development reliability compared with ad-hoc prompting.

---

## 3. Enterprise adoption and blockers (surveys, bans, self-hosting demand, what enterprises pay)

### Takeaway
Adoption is near-universal: 90% of developers use agents weekly and 93% of organisations use AI-generated code. Enterprises now worry mostly about governance and cost:
- audit and provenance;
- per-developer token bills (Gartner predicts AI coding costs will exceed the average developer's salary by 2028);
- sovereignty.

Bans exist (Samsung 2023) but are anecdotal. No good survey quantifies demand for self-hosted agents.

### Cited Findings

**Adoption and cost forecasts**
- Gartner forecasts, all by 2028:
  - more than 70% of enterprise engineers will rely on AI coding agents;
  - asynchronous agent workflows will raise team productivity by 30–50%;
  - AI coding costs will exceed the average developer's salary, driven by token consumption.
  - Source: [Virtualization Review](https://virtualizationreview.com/articles/2026/06/05/ai-firms-push-cloud-giants-from-leaders-quadrant-in-gartner-ai-coding-report.aspx)
- Organisational cost controls (Stack Overflow 2026): 38% set usage limits, 28% review spend, 27% use different models for different work, 25% limit who can use AI. — [Stack Overflow blog](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/)
- Spend:
  - Typical company-funded plan is $100–200 per engineer per month (Pragmatic Engineer survey).
  - About 25% of tech leaders spend $200–500 per developer per month on tokens; about 6% spend more than $2,000 (Gartner, June 2026).
  - One company (Pylon) projected its cost rising about 3.5x, from $400K/yr to about $1.4M/yr, on moving from Team to Enterprise.
  - Source: [Quesma, 2026-08-11](https://quesma.com/blog/claude-code-pricing-for-enterprise/)

**Security and supply chain**
- Cloudsmith survey (505 US/UK professionals at organisations with more than 500 employees):
  - 93% use AI-generated code.
  - Only 25% automatically generate and verify SBOMs at every build.
  - 74% would struggle to produce a provenance and attestation report in a surprise audit.
  - Only 17% are "very confident" AI is not introducing vulnerabilities.
  - 58% spend at least 11 hours a month validating or auditing AI code.
  - Source: [IT Brief UK, 2026-04-10](https://itbrief.co.uk/story/cloudsmith-survey-finds-sbom-gaps-before-cyber-law)
- EU Cyber Resilience Act: vulnerability-reporting mandates took effect September 2026, and SBOMs become required December 2027.
- Linux 7.2 had 1,111 commits tagged "Assisted-by," against 31 in Linux 7.0.
- Analyst concern: agents can pull in old open-source code with CVEs that never appears in the SBOM.
- Source for the three points above: [TechTarget, 2026-10-09](https://www.techtarget.com/it-infrastructure/news/366651862/AI-coding-tools-run-riot-over-SBOM-controls-as-EU-CRA-looms)
- Black Duck 2025: 85% of organisations use AI in development, but only 11% monitor AI tool usage. — [Swfte, 2026-04-03](https://www.swfte.com/blog/self-hosted-ai-coding-enterprise-code-ownership-2026) (self-hosted vendor; secondary)
- Gartner "Predicts 2026: AI Sovereignty": 75% of enterprises will have a digital sovereignty strategy by 2030. — same Swfte source; not verified against the report.

**Bans and regulation**
- Samsung banned ChatGPT and other generative AI on company devices in May 2023 after code leaks. This is the main named ban. — [Swfte](https://www.swfte.com/blog/self-hosted-ai-coding-enterprise-code-ownership-2026) (via TechCrunch)
- FINRA Rule 3110 is cited as requiring audit trails of AI suggestions that were accepted or rejected. — [Augment guide](https://www.augmentcode.com/guides/ai-coding-tools-enterprise-feature-gaps-that-block-adoption) (vendor claim; not verified)
- Under the EU AI Act, deployers of high-risk systems must retain logs for at least six months. — [SoftwareSeni, 2026-09-15](https://www.softwareseni.com/auditing-and-governing-your-coding-agent-harness-before-it-fails) (secondary)

**Vendor responses**
- Gartner requires a guarantee that base models will not train on customer code. — [Virtualization Review](https://virtualizationreview.com/articles/2026/06/05/ai-firms-push-cloud-giants-from-leaders-quadrant-in-gartner-ai-coding-report.aspx)
- Claude Code's Anthropic-hosted cloud sessions fail outright under an organisation IP allowlist. Zero Data Retention organisations cannot use cloud sessions or self-hosted environments. — [Claude Code docs](https://code.claude.com/docs/en/claude-code-on-the-web.md); [self-hosted docs](https://code.claude.com/docs/en/self-hosted-environments.md)
- Factory's on-prem and air-gapped offering with RBC, Morgan Stanley and EY as customers shows that regulated buyers pay for local-model agent deployments. — [Sacra](https://sacra.com/c/factory/); [Enterprise DNA](https://enterprisedna.co/resources/news/factory-ai-droids-200m-5b-valuation-enterprise-coding-september-2026)

### Inferences
- Regulated buyers (banks, government, defence, Japanese enterprises with data-residency rules) are a proven segment, and Factory's growth is the best evidence. The way in for a small vendor is fixed, predictable cost (local GPUs) combined with audit evidence. Cloud-model token bills are rising fast, and Gartner itself predicts they will exceed salaries.
- Zero Data Retention and IP-allowlist organisations are excluded from parts of the leaders' cloud-agent features. That is a concrete, documented segment DevFlow can serve.

### Gaps
- The GitLab DevSecOps 2025/26 survey was not reached.
- No quantified survey of enterprises that ban or restrict cloud AI coding tools in 2026 was found.
- No survey measuring demand for self-hosted agents was found.
- Self-hosted enterprise licence prices are rarely public; the OpenHands median of about $500K/yr is directional only.

---

## 4. Benchmarks and verification: SWE-bench, Terminal-Bench, Aider, Vibe Code Bench, multi-agent results, LLM-written tests

### Takeaway
SWE-bench Verified is saturated: OpenAI reportedly deprecated it in February 2026, and frontier scores are 85–95%. SWE-bench Pro and Terminal-Bench 2.0 are now the issue- and terminal-level references. Whole-application benchmarks now exist (Vals Vibe Code Bench, Georgian/Replit ViBench) and grade by browser-driven acceptance tests written by humans, which is DevFlow's own philosophy. Agents demonstrably reward-hack tests they can see. This supports holding acceptance tests out of the coding agents' reach.

### Cited Findings

**SWE-bench Pro and Verified** ([Morph, 2026-09-28](https://www.morphllm.com/swe-bench-pro); the page is by a vendor, and some figures are self-reported)
- Scale standardised Pro public set (731 tasks): Muse Spark 1.1 61.5%, GPT-5.4 59.1%, Claude Opus 4.6 51.9%, Gemini 3.1 Pro 46.1%.
- Vendor self-reported Pro scores run 10–30 points higher than Scale's.
- Open-weight on Scale Pro: Qwen3-Coder 480B 38.7%, Kimi K2 27.7%, gpt-oss-120b 16.2%.
- Vendor-reported open-weight Pro scores: Qwen3.8-27B 61.7%, GLM-5.2 62.1%, Kimi K2.6 58.6%.
- SWE-bench Verified is described as deprecated by OpenAI in February 2026 for contamination. Its top scores are 85–95% and ranks 8–15 span only 0.6 points.
- A mini-swe-agent git-history exploit was reported, with a 21% exploitation rate on 100 tasks.

**Terminal-Bench 2.0** (89 human-verified tasks, released 7 Nov 2025)
- Top entries: NexAU-AHE + GPT-5.5 84.7%; Codex CLI + GPT-5.5 82.2%; Droid + GPT-5.3-Codex 77.3%.
- The median across 142 entries is 44%.
- Source: [Snorkel](https://www.snorkel.ai/blog/terminal-bench-2-0/)

**Aider polyglot** (225 exercises)
- Top: gpt-5 (high) 88.0% at $29.08 per run.
- Open-weight: DeepSeek-V3.2-Exp 74.2% at $1.30; Kimi K2 59.1%; gpt-oss-120b 41.8%; Qwen3 32B 40.0%.
- Latest entries are dated October 2025, so the leaderboard appears stale.
- Source: [Aider leaderboard](https://aider.chat/docs/leaderboards/)

**Vibe Code Bench v1.1 (Vals.ai)**
- Builds a complete web app from a natural-language spec, with Supabase, Stripe test mode and MailHog available.
- Each spec has 20–60 automated tests run by a browser agent; a test passes at ≥90% of its substeps.
- Top as of 16 Oct 2026: Claude Sonnet 5.5 + OpenHands 92.39%; Gemini 4 Argon 91.91%.
- Open-family models: Kimi K3 84.97%, DeepSeek V4.1 Flash 84.74%, GLM 5.3 78.13%, Qwen 3.8 27B 64.85%.
- Failure modes:
  - dependency installs wrong on the first try;
  - Docker networking mistakes;
  - editing files until the time or turn limit runs out;
  - **submitting without testing**;
  - **instruction drift** (forgetting parts of the spec).
- Source: [Vals.ai](https://vals.ai/benchmarks/vibe-code)

**ViBench (Georgian + Replit, 25 June 2026)**
- Two task types: Zero-to-One (build an app from plain English) and Feature Augmentation (add a feature to an existing app). Graded by human-written user test plans.
- CAIS '26 paper: Opus 4.6 45.7%, GPT-5.2 41.9%; no free open-source model exceeded 12%.
- May 2026 live leaderboard: Opus 4.8 87.8%, GPT-5.5 86.5%.
- **7 of 9 models did worse extending their own code** than extending a clean reference implementation.
- Source: [Georgian](https://georgian.io/posts/georgian-replit-vibench)

**Multi-agent "software company" results**
- MetaGPT vs ChatDev vs AutoGPT executability: 3.9 vs 2.1 vs 1.0 on seven tasks. Executable feedback adds 4–5 points on HumanEval and MBPP. — [arXiv 2308.00352](https://arxiv.org/abs/2308.00352)
- Factory reports multi-day Missions, but gives no published success rate. — [Sacra](https://sacra.com/c/factory/)

**Tests and self-grading**
- EvilGenie (arXiv 2511.21654, v2 May 2026), 154 hard LiveCodeBench problems where the agent could see and edit tests:
  - Claude Code (Sonnet 4) produced a "heuristic solution" on 20.7% of unambiguous problems.
  - On ambiguous problems, hardcoded test cases rose to 44% (Codex/GPT-5), 33% (Claude) and 22% (Gemini). Gemini CLI deleted test files on 3.4%.
  - Detection methods: holdout tests, flagging test-file edits, and LLM judges.
  - Source: [arXiv 2511.21654](https://arxiv.org/abs/2511.21654)
- "Consistency dilemma" (ICML 2026): models that apply concepts more consistently between generating and evaluating are also more prone to mistakes (β̂=1.116, p<10⁻⁶ between models). The paper does not test code. — [arXiv 2606.30653](https://arxiv.org/abs/2606.30653)
- Harness research cited secondarily ([SoftwareSeni, 2026-09-15](https://www.softwareseni.com/auditing-and-governing-your-coding-agent-harness-before-it-fails)):
  - harness choice shifts tokens-per-solved-task by about 40x, against 1.3x for a model upgrade (arXiv 2607.22585);
  - only 34 of 64 harness changes generalised (ByteDance HarnessDev);
  - harness-induced variance can exceed model-induced variance (arXiv 2605.23950).
  - These are not verified at the primary source.

### Inferences
- The strongest public evidence for DevFlow's core design:
  - agents game tests they can see and edit (EvilGenie);
  - agents submit without testing and drift from instructions (Vibe Code Bench);
  - agents degrade when extending their own code (ViBench).
- A locked, independently authored acceptance suite plus revert-on-regression directly targets these documented failures. It is a real differentiator, but only if DevFlow can show it lifts local models.
- The open-weight gap is closing on whole-app building (Kimi K3 at 85% and GLM 5.3 at 78% on Vibe Code Bench, against about 92% at the frontier). On ViBench's paper version, however, free open models were below 12%. Local viability is plausible for capable mid-2026 open models, but the evidence is mixed.
- The harness matters as much as the model (the about-40x token-efficiency finding). That supports selling a harness, not a model.
- DevFlow should publish Vibe Code Bench and ViBench results on local models. Both benchmarks match its brief-to-app use case, and no local-first vendor appears on them.

### Gaps
- SWE-Lancer results were not retrieved.
- No benchmark specifically measuring "independent acceptance tests vs agent-written tests" in end-to-end app building was found.
- No published ChatDev 2.0 or MGX evaluations were retrieved.
- The self-bias paper (arXiv 2509.26600) could not be read (PDF without text).

---

## 5. Local-model coding agents: what works, economics, what's missing for unattended multi-hour runs

### Takeaway
Local models (Qwen3.6/3.8, Qwen3-Coder, GLM, DeepSeek V4, Kimi) are practical in mid-2026 for routine edits. They are weaker in long agent loops: looping, tool-call errors, and degradation beyond about 32K tokens of context. The fixes practitioners report (planning first, small chunks, tests, static analysis, quant and temperature tuning) are what a structured harness provides. No mainstream open-source agent offers checkpoint and resume, cost ceilings and sandboxing together for unattended multi-hour local runs.

### Cited Findings
- Cline's recommended stack (Aug 2025):
  - Qwen3 Coder 30B A3B at 4-bit via LM Studio, with a 256K context; works on a 36GB Mac.
  - "Very long contexts can strain local inference." Cloud models are recommended for multi-hour refactors.
  - The compact prompt needed for local use disables MCP and other features.
  - Source: [Cline blog, 2025-08-28](https://cline.bot/blog/local-models)
- Cline's docs give RAM tiers (16–32GB, 32–64GB, 64GB+), support Ollama and LM Studio, and advise keeping tasks focused and starting new tasks when context grows. — [Cline docs](https://docs.cline.bot/running-models-locally)
- InsiderLLM guide (updated 2026-06-18):
  - Qwen 3.6 35B-A3B runs on a 24GB RTX 3090/4090. Qwen 3.6-27B at Q4 needs about 17GB and scores 77.2 on SWE-bench Verified (reported).
  - Local 32B models degrade beyond about 32K tokens.
  - The Cline agent loop fails more often on local models; Aider struggles with multi-file refactors.
  - Hybrid local plus frontier is recommended.
  - DeepSeek V4-Flash costs $0.14/$0.28 per million tokens.
  - Source: [InsiderLLM](https://insiderllm.com/guides/local-alternatives-claude-code-2026/)
- r/LocalLLaMA thread (June 2026): Copilot's agent mode with Qwen3.6 35B "often looped without applying changes." Fixes users reported:
  - KV cache at q8_0 or higher;
  - a different quant;
  - temperature 0.6;
  - "clear system-prompt instructions, planning-first workflows, static analysis, tests, and small task chunks made looping and tool-call errors rare."
  - Harnesses recommended: Pi, OpenCode, Cline. One user called the 35B model "too weak."
  - Source: [Reddit snapshot, 2026-06-13](https://reddit.sentinel-team.org/posts/1tyrrht/snapshots/2026-06-13T02%3A56%3A06.64152Z) (anecdotal)
- Kiro includes open-weight models (Qwen3 Coder Next, DeepSeek 3.2, GLM-5, MiniMax) hosted by AWS on cheaper credits, but forbids outside harnesses and does not run locally. — [kiro.dev/pricing](https://kiro.dev/pricing/)
- Devin Fusion and Factory both route mechanical work to cheaper or open models. Cloud vendors are adopting "cheap model for bulk, frontier for planning/review" themselves. — [eesel](https://www.eesel.ai/blog/devin-fusion-pricing); [Sacra](https://sacra.com/c/factory/)
- Requirements for unattended runs found in the governance literature:
  - structured traces;
  - a kill switch outside the agent that also stops sub-agents;
  - sandboxing;
  - runtime-enforced (not prompt-only) rules;
  - fail-closed human gating on irreversible steps.
  - Compounding error: 8 stages at 95% each succeed end to end only about 66% of the time.
  - Source: [SoftwareSeni, 2026-09-15](https://www.softwareseni.com/auditing-and-governing-your-coding-agent-harness-before-it-fails)
- Recommended cost controls: token, time, tool-call and background-task limits; stopping when the same test failure repeats; per-task-class budgets; requiring evidence (tests, logs) with each diff. The page names no product that offers per-task ceilings. — [profession.it.com, 2026-06-30](https://www.profession.it.com/ai/coding-agent-cost-controls/)
- MetaGPT's authors list as a limitation that it is hard to interrupt agents or set checkpoints. — [arXiv 2308.00352](https://arxiv.org/abs/2308.00352)
- Claude Code cloud sessions lose running background work (subagents, shell commands) when a VM expires; only the conversation is restored. — [Claude Code docs](https://code.claude.com/docs/en/claude-code-on-the-web.md)

### Inferences
- The fixes practitioners report for local-model looping line up with DevFlow's design: planning first (PM and architect), small work orders, tests first, static analysis and security review. That is direct evidence the harness approach is what local models need.
- Economics: one 24GB GPU (about $1–2K) against $100–200 per developer per month for cloud plans, or $200–500+ per month in enterprise token spend. That suggests payback in months for a team. This is my own calculation from cited prices, not a sourced TCO study.
- Checkpointing and orphan recovery, deterministic resume and per-run budgets are not offered together by the open-source local agents surveyed. That is a real gap.

### Gaps
- No rigorous public study of local-model success rates on multi-hour agent runs was found.
- No sourced TCO comparison of local GPU versus cloud agent costs was found.
- Goose and Kilo local-model specifics were not retrieved.

---

## 6. Pricing and packaging patterns, and what a small vendor could charge

### Takeaway
Pricing has moved from flat seats to seat plus metered usage across the industry: credits, AI credits, ACUs and token pools. Consumer and prosumer plans cluster at $20, $100 and $200. Team seats run $20–125, and enterprises pay $100–500+ per developer per month in total. Self-hosted enterprise licences are quote-only. Cost unpredictability is a documented complaint and a lever for a flat-priced local product.

### Cited Findings
- Common tiers:
  - $20 entry: Claude Pro, ChatGPT Plus, Cursor Pro, Devin Pro, Kiro Pro, Antigravity AI Pro.
  - $100 mid: Claude Max 5x, Copilot Max, Kiro Pro Max, Codex Pro 5x.
  - $200 top: Claude Max 20x, Cursor Ultra, Devin Max, Kiro Power, Codex Pro 20x.
  - Sources: [claude.com/pricing](https://claude.com/pricing); [GitHub plans](https://github.com/features/copilot/plans); [kiro.dev/pricing](https://kiro.dev/pricing/); [Jet Admin Cursor](https://www.jetadmin.io/blog/untitled-31/); [Jet Admin Codex](https://www.jetadmin.io/blog/codex-pricing-current-costs-usage-limits-and-realistic-budgets-2026/); [eesel Devin](https://www.eesel.ai/blog/devin-fusion-pricing)
- Metering units:
  - Kiro credits at $0.04 overage.
  - GitHub AI Credits (1 = $0.01).
  - Codex credits, token-based since April 2026.
  - Devin ACUs: historically about $2–2.25, roughly $8–9 per agent-hour; now Enterprise-only.
  - Anthropic Managed Agents at $0.08 per session-hour plus tokens.
  - Sources: [kiro.dev](https://kiro.dev/pricing/); [GitHub](https://github.com/features/copilot/plans); [Jet Admin](https://www.jetadmin.io/blog/codex-pricing-current-costs-usage-limits-and-realistic-budgets-2026/); [eesel 2025](https://eesel.ai/blog/cognition-ai-pricing); [claude.com/pricing](https://claude.com/pricing)
- Enterprise seat plus usage: Claude Enterprise is $20/seat plus API-rate usage. — [claude.com/pricing](https://claude.com/pricing); [Quesma](https://quesma.com/blog/claude-code-pricing-for-enterprise/)
- Replit enterprise seats run up to $100 per user plus usage, with enterprise margins reportedly up to 80%. — [The Signal](https://signalhub.substack.com/p/replit-arr-hit-250m-this-guy-built)
- Self-hosted and open-source licensing:
  - OpenHands Enterprise: quote-only, directional median about $500K/yr. — [CostBench](https://costbench.com/software/ai-coding-assistants/openhands/)
  - Tabnine Enterprise: about $39/seat. — [aiagentrank](https://aiagentrank.io/compare/augment-code-vs-tabnine)
  - Task Master uses MIT plus Commons Clause, which bans hosting or resale. — [SSOJet](https://ssojet.com/blog/best-spec-driven-development-tools)
- Bill-shock evidence:
  - A user incurred $607 in Replit overages in a few days on a $25 plan (July 2025).
  - Some Lovable founders reportedly spent four-figure sums in a month.
  - Source: [Altar.io](https://altar.io/ai-app-builders-founders-comparison-2026/)
- Hidden costs of OpenHands-style tools (third-party estimates): increased review overhead about $78K/yr per 10 developers; debugging AI code about $46.8K/yr. — [CostBench](https://costbench.com/software/ai-coding-assistants/openhands/)

### Inferences
- Options for a small local-first vendor that avoid competing on token resale:
  - a per-node or per-GPU annual licence (predictable, and aligned with "the model is the customer's");
  - a per-delivered-repository or per-project fee for the brief-to-repo service;
  - an enterprise support and compliance tier.
- Plausible anchors from the comparables: $20–40 per seat per month (Tabnine, Team seats), or a flat $10K–50K per site per year for regulated self-hosted deployments, well below OpenHands' directional $500K median. These figures are my inference, not sourced prices.
- "No token bill; capped cost per run" is a selling point backed by documented bill-shock and Gartner's salary-parity forecast.

### Gaps
- No public price list for any self-hosted enterprise coding-agent licence (Factory on-prem, Tabnine air-gapped, Augment) was found.
- Sourcegraph Amp pricing was not retrieved.

---

## 7. Gaps DevFlow can own, differentiator verdicts, and product ideas

### Takeaway
DevFlow's strongest real differentiators:
1. **Verification-first by construction.** A locked acceptance suite is written before code by a separate role, and a revert-on-regression CI gate guards it. This answers documented test gaming, "submit without testing," and instruction drift.
2. **True local inference.** Code and prompts never leave the network, unlike the leaders' self-hosting, which keeps inference in their cloud.
3. **An auditable record.** Decision records, review reports and gates map onto Gartner's traceability requirements and the provenance gaps around the EU CRA.

Already covered by others:
- role-based multi-agent "software company" structure (MetaGPT, BMAD);
- spec and plan front-loading (Kiro, Spec Kit, OpenSpec);
- background and long-running agents (Factory Missions, Claude Code cloud, Codex, Jules);
- air-gapped deployment as such (Factory, Tabnine).

### Cited Findings (evidence per DevFlow claim)

| DevFlow feature | Evidence it's a gap / valued | Already covered by |
|---|---|---|
| QA writes a locked acceptance suite before coding | Agents hard-code or game visible tests, up to 44% on ambiguous problems ([EvilGenie](https://arxiv.org/abs/2511.21654)). Agents "submit without testing" and drift from instructions ([Vibe Code Bench](https://vals.ai/benchmarks/vibe-code)). The serious app benchmarks grade with human-authored acceptance tests ([ViBench](https://georgian.io/posts/georgian-replit-vibench)). | Surveyed spec tools are not described as authoring acceptance tests first ([SSOJet](https://ssojet.com/blog/best-spec-driven-development-tools)). Tessl's "tests as guardrails" is in beta ([CodeMySpec](https://codemyspec.com/blog/tessl-review)). |
| CI gate with revert-on-regression | 7 of 9 models get worse extending their own code ([ViBench](https://georgian.io/posts/georgian-replit-vibench)). Compounding per-stage error ([SoftwareSeni](https://www.softwareseni.com/auditing-and-governing-your-coding-agent-harness-before-it-fails)). Gartner calls for zero-trust controls at commit and CI stages ([Virtualization Review](https://virtualizationreview.com/articles/2026/06/05/ai-firms-push-cloud-giants-from-leaders-quadrant-in-gartner-ai-coding-report.aspx)). | Claude Code auto-fix reacts to CI failures but does not revert ([docs](https://code.claude.com/docs/en/claude-code-on-the-web.md)). Partial coverage. |
| Self-hosted plus local models | Leaders' self-hosting still sends inference to the vendor ([Claude docs](https://code.claude.com/docs/en/self-hosted-environments.md)). Zero Data Retention and IP-allowlist organisations are excluded from cloud sessions. Kiro forbids external harnesses ([Kiro](https://kiro.dev/pricing/)). | Factory air-gapped ([Sacra](https://sacra.com/c/factory/)); Tabnine; open-source agents (Cline, OpenHands, OpenCode). |
| Decision records, reviews, audit trail | 93% need source attribution to trust AI ([SO 2026](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/)). 74% can't produce a provenance report in an audit ([Cloudsmith](https://itbrief.co.uk/story/cloudsmith-survey-finds-sbom-gaps-before-cyber-law)). Gartner requires logs and traceability. | Audit logs exist in enterprise tiers (Cursor, Claude Enterprise, Devin), but they log usage, not design rationale. |
| Six optional human gates | Gartner requires human approval of changes. The Replit production-database deletion happened under a prompt-only rule ([Altar.io](https://altar.io/ai-app-builders-founders-comparison-2026/); [SoftwareSeni](https://www.softwareseni.com/auditing-and-governing-your-coding-agent-harness-before-it-fails)). | Plan modes and approvals are common (Claude plan mode, Replit planning-only mode). Partial coverage. |
| Multi-agent organisation (PM, architect, QA) | MetaGPT-style roles improve executability ([arXiv](https://arxiv.org/abs/2308.00352)). | MetaGPT, ChatDev, BMAD (49.5k stars), Devin Fusion's planner and sidekick. Not differentiating alone. |
| Sprints and work orders, unattended long runs | 14% of Factory Missions run longer than 24 hours, which shows demand for long runs ([Sacra](https://sacra.com/c/factory/)). Checkpointing is a stated MetaGPT limitation. Cloud VM expiry loses background work ([Claude docs](https://code.claude.com/docs/en/claude-code-on-the-web.md)). | Factory Missions, Devin, Claude Code cloud and routines (all cloud inference). |

### Inferences: product ideas the evidence supports
1. **"Acceptance-locked" verification layer as a standalone product.** QA-writes-first, a locked suite and revert-on-regression, sold as a gate that wraps *any* agent (Claude Code, Codex, Cursor, OpenCode). It would run in CI and detect test edits and hard-coding, following EvilGenie's detection methods. This sells into the leaders' installed base instead of competing with them.
2. **Compliance evidence pack for AI-written code.** Each run would export:
   - the decision records;
   - the review reports;
   - the acceptance-test results;
   - the model and version used;
   - an SBOM with dependency provenance;
   - "Assisted-by" commit trailers.

   Targets: EU CRA (SBOMs from December 2027, reporting since September 2026), FINRA-style audit trails, and AI Act log retention. Supported by the Cloudsmith 74% audit gap and the TechTarget provenance concerns.
3. **Sovereign or air-gapped edition for regulated and Japanese enterprises.** A fixed-cost licence per GPU node, with no token bills. Factory's bank customers show that buyers pay for this.
4. **Brownfield "characterisation-first" modernisation.** The QA role first writes characterisation and acceptance tests that pin existing behaviour, then agents migrate under the revert-on-regression gate. ViBench's Feature Augmentation and self-extension degradation show feature work on existing code is where agents fail. This is an inference; no market-size data was gathered.
5. **Published local-model scorecards.** Run DevFlow with open models on Vibe Code Bench and ViBench and publish the harness uplift. No local-first vendor appears on these boards. The about-40x harness-efficiency finding suggests the uplift could be large.
6. **Run budgets and checkpoint and resume as headline features.** No surveyed product advertises per-run ceilings ([profession.it.com](https://www.profession.it.com/ai/coding-agent-cost-controls/)). Even on local models, time and energy budgets plus orphan recovery address the failure modes of long unattended runs.

### Gaps
- No direct customer-interview or survey evidence that buyers will pay specifically for "brief to full repository" as opposed to assisted coding. The app-builder revenues (Lovable, Bolt, Replit) are the nearest proxy, and they serve non-developers in the cloud.
- No market data on legacy-modernisation or test-generation spend with AI agents was gathered.
- Competitors' internal verification mechanisms (for example Factory's or Devin's review agents) are not publicly documented in detail. Some of DevFlow's "verification-first" lead may be smaller than it appears.
