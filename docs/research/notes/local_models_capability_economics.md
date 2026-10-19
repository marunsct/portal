# Local / Open-Weight AI Models for Software Engineering and Agentic Work: Capability and Economics (as of October 2026)

Research date: 2026-10-19. Thesis tested: "a software team can build, run and sell AI software on hardware it owns, using local models, without a hosted AI vendor."

Source-quality legend used below: [PRIMARY] = vendor/benchmark owner/analyst original; [AGG] = aggregator or secondary site; [VENDOR] = vendor-reported claim not independently verified; [ANEC] = community/anecdotal. Items older than 12 months (before Oct 2025) are marked (OLD: date).

Pages that could not be fetched (blocked or timed out): a16z original CIO survey (https://www.a16z.news/p/leaders-gainers-and-unexpected-winners), Hardware Corner M5 Max benchmarks (https://hardware-corner.net/m5-max-local-llm-benchmarks-20261233/), Ars Technica M5 Ultra review (https://arstechnica.com/gadgets/2026/09/review-apples-hyper-pricey-m5-ultra-mac-studio-made-me-into-a-vibe-coder), the live Terminal-Bench leaderboard (rendered with JavaScript, so the fetch came back empty: https://www.tbench.ai/leaderboard), and the GitHub API (blocked in this session, so star counts are secondary). The web-search budget also ran out before the Red Hat/IBM/Dell on-prem survey search.

---

## Q1. Which open-weight models are strongest for coding and agentic work, and how do they score against frontier hosted models?

### Takeaway
On the major coding and agent benchmarks, the best open-weight models (Kimi K3, GLM-5.3, MiMo-V2.6-Pro, DeepSeek V4/V4.1, Qwen3.8, MiniMax M3, Ornith/Beam) score roughly 5 to 15 points below the best closed models (Claude Opus 5/5.5, Fable 5, Mythos 5, GPT-5.5/6). The biggest open models now match or beat closed models from 6 to 12 months ago. Most published open-model scores are vendor self-reports run on different scaffolds, so independent like-for-like comparisons are scarce.

### Cited Findings
**SWE-bench Verified (BenchLM aggregate, verified 2026-10-17; 107 of 113 rows are provider self-reports, scaffolds differ)** — [BenchLM SWE-bench Verified](https://benchlm.ai/benchmarks/swe-bench-verified) [AGG]
- Closed leaders: Claude Opus 5 96%, Claude Mythos 5 95.5%, Claude Fable 5 95%, Claude Opus 4.8 88.6%, Claude Sonnet 5 85.2%, GPT-5.3 Codex 85%, GPT-5.2 80%.
- Open-weight leaders: Ornith-1.5-397B 86%, Ornith-1.0-397B 82.4%, Beam 1.0 501B-A23B (Reflection AI) 81.6% (NVFP4 80.7%, FP8 80.2%), DeepSeek V4 Pro 0813 80.6%, MiniMax M3 80.5%, Kimi K2.6 80.2%, Inkling-Small (Thinking Machines) 80.2%, DeepSeek V4 Flash 0731 79%, GLM-5 77.8%, Mistral Medium 3.5 128B 77.6%.
- Small open models that fit on a single box: Ornith-1.5-35B-A3B 79%, Qwen3.6-27B 77.2%, Muse Glimmer 30B (Meta) 76%, Qwen3.6-35B-A3B 73.4%, Qwen3.5-27B 72.4%, Ornith-1.5-9B 70.6%, GPT-OSS 120B 62.4%, GPT-OSS 20B 60.7%, Devstral Small 46.8%.
- Older reference points: Qwen3-Coder 480B-A35B 69.6%, DeepSeek V3.1 66%, Gemini 2.5 Pro 63.8%, Claude 3.7 Sonnet 62.3%, DeepSeek-R1 49.2%, DeepSeek V3 42%.
- The same page lists Claude Opus 4.6 at both 80.8% and 75.6% (an Arcee run on mini-swe-agent-v2). That 5-point spread shows how much the scaffold matters. The page also calls the benchmark saturated: the top three sit within 1 point of each other.

**Terminal-Bench 2.0 (Vals AI harness, mirrored by BenchLM, updated 2026-06-04; independent runs on one harness)** — [Vals Terminal-Bench 2.0 mirror](https://benchlm.ai/md/benchmarks/valsterminalbench2.md) [AGG of PRIMARY]
- Closed: GPT-5.5 (high) 73.2%, Claude Opus 4.8 70.0%, Claude Opus 4.7 68.5%, Gemini 3.5 Flash 67.4%, GPT-5.3 Codex 64.1%.
- Open: Kimi K2.6 57.3%, DeepSeek V4 Pro 0813 56.2%, GLM-5.1 53.9%, MiniMax M2.7 47.2%, MiniMax M3 46.1%, Qwen3.6-27B 44.9%, Gemma 4 31B 39.3%, GLM-4.7 38.2%, GPT-OSS 120B 19.1%, Llama 4 Maverick 2.25%.
- On this like-for-like harness in mid-2026, the open-closed gap is about 16 points (73.2 vs 57.3).

**Terminal-Bench 2.1 and other newer vendor claims**
- Kimi K3 88.3 (vendor), MiMo-V2.6-Pro 89.9 (vendor), DeepSeek V4.1-Flash 90.6 (vendor); GLM-5.3 41.8% on Terminal-Bench 4.0 — [Slash Digital, 2026-09-26](https://slash-digital.io/en/insights/open-weight-models-2026/) [AGG; VENDOR]
- Kimi K3 88.3 vs OpenAI "Sol" 88.8 on Terminal-Bench 2.1. FrontierSWE: K3 81.2 vs Fable 5 86.6. GDPval-AA v2: Fable 5 leads K3 by 92 Elo — [State of Open Source AI v1.1, Sept 2026](https://stateofopensource.ai/) [AGG; the report flags the Moonshot scores as vendor-harness]

**Artificial Analysis Intelligence Index (v4.3.2, open-weight page, fetched Oct 2026)** — [Artificial Analysis open-source models](https://artificialanalysis.ai/models/open-source) [PRIMARY]
- Open leaders: MiMo-V2.6-Pro 46, GLM-5.3 (Max) 45, Step 5 Preview 44, Kimi K3 (Max) 44, GLM-5.3-Flash 42, DeepSeek V4.1 Flash 39, Muse Spark Open 39, Qwen3.8 27B 34, MiniMax-M3 29.
- Output speed on hosted APIs: DeepSeek V4.1 Flash 227 t/s, GLM-5.3 93 t/s, Kimi K3 43 t/s.
- An earlier index version (19 Aug 2026) put best closed Claude Opus 5 at 63.1, Kimi K3 at 59.7, GLM 5.3 at 59.5 and Qwen3.8 Max at 58.1, a 3.4-point (5.4%) gap — [olud.ai](https://olud.ai/blog/open-vs-closed-llm-price-gap-2026/) [AGG]. These absolute numbers are not on the same scale as v4.3.2.

**Aider polyglot (225 exercises; leaderboard apparently not updated since 2025-10-03, so all figures are OLD)** — [Aider leaderboard](https://aider.chat/docs/leaderboards/) [PRIMARY]
- gpt-5 (high) 88.0%, o3-pro 84.9%, Gemini 2.5 Pro 83.1%. Open: DeepSeek-V3.2-Exp Reasoner 74.2% (run cost $1.30 vs $29.08 for gpt-5), DeepSeek R1-0528 71.4%, Qwen3 235B 59.6%, Kimi K2 59.1%, gpt-oss-120b 41.8%, Qwen3 32B 40.0%, Llama 4 Maverick 15.6%.
- At the time, the best open model (74.2%) roughly matched closed models from about 5 months earlier, at about 1/20 of the cost per run.

**tau2-bench (telecom)** — [BenchLM tau2-bench, verified 2026-10-17](https://benchlm.ai/benchmarks/tau2-bench) [AGG]
- Saturated. GLM-5.2 (open) 99.1%, GPT-5.4 98.9%, GLM-4.7-Flash (open) 98.8%, Claude Fable 5 98.5%. Open models lead, but the page says the setups are not comparable.

**Qwen3-Coder-Next (80B total / 3B active, built for local coding agents)** — [Qwen3-Coder-Next technical report, arXiv 2603.00729, Mar 2026](https://arxiv.org/abs/2603.00729) [PRIMARY; VENDOR]
- SWE-bench Verified 70.6 (SWE-Agent), 71.1 (mini-SWE-agent), 71.3 (OpenHands). SWE-bench Pro 42.7. Terminal-Bench 2.0 36.2 (Terminus2-json) and 30.9 inside Claude Code. Aider polyglot 66.2. LiveCodeBench v6 about 58.9. Context 262K.
- For comparison, Claude Opus 4.5 scores 79.0 on SWE-bench Verified (OpenHands) and 58.4 on Terminal-Bench.
- The authors admit "a gap in solving highly complex, large-scale software engineering tasks."

**Composite indices**
- BenchLM composite (July 2026): the gap from Claude Mythos 5 to the open-weight leader is 14.05 points, and "broad open-weight parity has not arrived". Agentic subscore: Claude Opus 5.5 90.3 vs GLM-5.3 70.2 — [BenchLM state of benchmarks](https://www.benchlm.ai/blog/posts/state-of-llm-benchmarks-2026) [AGG]
- BenchAlign (Aug 2026): Claude Mythos 5 83.04, Kimi K3 79.89, MiniMax M3 68.8 — [GMI Cloud](https://www.gmicloud.ai/en/blog/ai-model-benchmarks-august-2026-open-weight-models-catch-the-frontier) [AGG; published by a commercial host]

**Model specs and licences (vendor model cards via Slash Digital, 2026-09-26)** — [Slash Digital](https://slash-digital.io/en/insights/open-weight-models-2026/)
- Frontier-scale MoEs: Kimi K3 2.8T/104B active, 1M ctx, custom licence. Qwen3.8-2.4T-A95B, custom licence. MiMo-V2.6-Pro 1.02T/42B, MIT. DeepSeek V4-Pro 1.6T/49B, MIT, 1M. DeepSeek V4.1-Flash 552B/8–16B active, MIT, 1M. GLM-5.3 744B/40B, custom. MiniMax-M3 about 428B/23B, custom.
- Box-sized models: GLM-5.3-Flash 320B/18B, MIT, 300K. Qwen3.8-27B dense, Apache 2.0, 262K. Gemma 4 31B dense and 26B-A4B, Apache 2.0, 256K. Mistral Small 4 119B/about 6B, Apache 2.0. gpt-oss-120b 117B/5.1B and gpt-oss-20b, Apache 2.0, 128K (OLD: Aug 2025). Muse Glimmer 30B (Meta), Apache 2.0.
- Licence traps: Qwen3.8-Flash-Next needs a separate licence for model-as-a-service businesses. MiniMax M2.7 was non-commercial. Tencent Hy3-preview excludes the EU, UK and South Korea.

### Inferences
- For a self-hosting team, the models that matter most are those that fit on one box: Qwen3.8-27B, Qwen3.6-27B/35B-A3B, Ornith-1.5-35B-A3B, GLM-5.3-Flash, Qwen3.8-Flash-Next, gpt-oss-120b and Gemma 4. They self-report about 70–79% on SWE-bench Verified, roughly where Claude Sonnet 4.5 and Opus 4.1 were in late 2025. On independent Terminal-Bench 2.0, a 27B model scores about 45% against about 73% for the frontier.
- Licences have to be checked per model. "Open-weight" does not automatically allow selling the model as a service.

### Gaps
- No independent, same-scaffold SWE-bench Verified run comparing open and closed models at October 2026. Nearly all scores are self-reported.
- The Aider leaderboard is stale (last entry Oct 2025). I could not get current LiveCodeBench or the live Terminal-Bench 2.1 table, because the page renders with JavaScript.
- No up-to-date scores for Llama 4 or Devstral 2 beyond the old rows above.

---

## Q2. How has the open-vs-closed capability gap moved over the last 24 months, and what do analysts expect?

### Takeaway
On aggregate indices the gap has narrowed to about 3 to 8 points, or roughly 4 months of lag. On hard agentic, long-horizon and long-context tasks it is still clearly wider. The commercial gap runs the other way: closed models take about 96% of model revenue, and the open share of enterprise spend fell in 2025.

### Cited Findings
- Epoch AI: since January 2026, the best open models have trailed the closed frontier by an average of "four months, or 8 ECI points", about the distance from GPT-5 to GPT-5.5. Example scores: GPT-5.5 about 158.2, Claude Opus 4.7 about 156.2, Kimi K2.5 about 148.2, DeepSeek-V3.2 about 146.5 (published 2026-05-29) — [Epoch AI](https://epoch.ai/data-insights/open-closed-eci-gap) [PRIMARY]
- State of Open Source AI v1.1 (Sept 2026):
  - The best open model trails by 3 points on Artificial Analysis v4.1.1 at about 60% of the price. On Epoch's ECI the gap is 5 points.
  - A Mozilla fit on METR time-horizon data puts the lag at about 4.4 months. Open-model time horizons double every 3.9 months versus 5.5 months for closed, so open models are catching up.
  - An earlier comparison in the same report: best closed 60 vs best open 54 in spring 2026, when the leading open model a year earlier scored 22.
  - The gap is far wider at small deployment sizes: the best open model is about 10 index points below the top on one server and about 23 points below on one GPU.
  - Source: [stateofopensource.ai](https://stateofopensource.ai/) [AGG; useful compilation]
- Stanford AI Index 2026, Arena Elo for 2026: top closed 1,503 vs top open 1,454 (about 49 points); top US 1,503 vs top Chinese 1,464 — [Stanford HAI AI Index 2026, Technical Performance](https://hai.stanford.edu/ai-index/2026-ai-index-report/technical-performance) [PRIMARY]
- Linux Foundation / Nagle and Yue (Nov 2025): open models reach 90% or more of closed-model benchmark performance and close the gap within a few months of each closed release. Closed models are about 6 times more expensive on average, take about 80% of usage and 96% of revenue. Estimated $24.8B per year in unrealised savings — [Linux Foundation](https://www.linuxfoundation.org/blog/revealing-the-hidden-economics-of-open-models-in-the-ai-era) [PRIMARY working paper summary]
- Artificial Analysis-based (Aug 2026): intelligence gap 5.4%. Median output price $5.00/M tokens for closed vs $1.00/M for open; per index point, open is 3.1 times cheaper — [olud.ai](https://olud.ai/blog/open-vs-closed-llm-price-gap-2026/) [AGG]
- BenchLM (July 2026): composite gap of 14 points, "broad parity has not arrived" — [BenchLM](https://www.benchlm.ai/blog/posts/state-of-llm-benchmarks-2026)
- Inference prices: Epoch found that the price of reaching a fixed capability level falls 9 to 900 times per year, for example 40 times per year for GPT-4-level GPQA (OLD: 2025-03-12) — [Epoch AI price trends](https://epoch.ai/data-insights/llm-inference-price-trends). List-price inference fell about 60 times in 45 months, though DeepSeek raised output prices 2.3 to 4.6 times on 16 Aug 2026 — [stateofopensource.ai](https://stateofopensource.ai/)

### Inferences
- "Four months behind" is about the right planning assumption for the largest open models. For models a team can actually host on owned hardware, the lag is closer to 9 to 15 months, given the 10- and 23-point serving-tier gaps.
- If open time horizons keep doubling faster, the lag could narrow further. That is a trend extrapolation, not a measured result.

### Gaps
- I did not reach SemiAnalysis or Sequoia commentary on where the gap is heading. Of a16z, I only reached a secondary summary of the CIO survey.
- I found no single consistent 24-month time series of the gap. Epoch gives an average only since Jan 2026, and the other figures come from incompatible index versions.

---

## Q3. What does the hardware cost, and how fast does it run 30B-class, 70B-class and 200B+ MoE models?

### Takeaway
A box costing $2.5k to $16k runs 27–35B dense or small-active MoE models at 30–150 t/s, which is enough for one or a few developers. A 70B dense model is slow on unified-memory boxes. Frontier 1T+ MoEs need 512 GB Macs or clusters and run at about 20–30 t/s single-stream with slow prefill. Long-context prefill, not decode speed, is the main thing that limits agent workloads.

### Cited Findings
**Prices and specs (Sept 2026)** — [Context Studios hardware guide, 2026-09-24](https://www.contextstudios.ai/blog/local-ai-hardware-guide-2026) [AGG with cited primary reviews]
- DGX Spark (GB10): 128 GB, 273 GB/s, $4,699 (up from $3,999 in Feb 2026), about 160 W.
- Mac Studio M5 Ultra: up to 512 GB, 1.2 TB/s, from $5,499.
- RTX 5090: 32 GB, 1,792 GB/s, $1,999 MSRP but about $4,700 street, about 575 W.
- RTX PRO 6000 Blackwell: 96 GB, about 1.8 TB/s, about $16,000 (87% above launch MSRP), up to 600 W.
- Strix Halo (Ryzen AI Max+ 395): 128 GB (96–120 GB usable), about 256 GB/s, $3,449–3,650, about 112–120 W.

**Apple M5 Ultra** — [Implicator, 2026-08-26](https://www.implicator.ai/apple-mac-studio-m5-ultra-prompt-processing.md)
- Announced 25 Aug 2026 with up to 512 GB (512 GB configs from late October) and 1.2 TB/s.
- Apple claims up to 4 times the M3 Ultra on prompt processing [VENDOR].

**Other 128 GB boxes, Sept 2026** — [RunAIHome, 2026-08-22](https://runaihome.com/blog/best-local-llm-128gb-unified-memory-2026/)
- Framework Desktop 128 GB: $3,449 (was $1,999 at launch). Memory-supply inflation is pushing box prices up through 2026.
- Used RTX 3090: about $1,264.

**30B-class (27B dense / 35B-A3B MoE)**
- Qwen3.8-27B on RTX 5090: 75 t/s at Q4 (llama.cpp, 4k ctx), 77 to 155 t/s with MTP speculative decoding [community]; about 3,000 t/s prefill — [Context Studios](https://www.contextstudios.ai/blog/local-ai-hardware-guide-2026)
- Same model on DGX Spark: 12 t/s stock, 31–58 t/s tuned with NVFP4+MTP. On Strix Halo: 11 t/s, rising to 24–30 t/s with MTP — same source.
- MacStories, Qwen3.8-27B with a 6K prompt: RTX 5090 3,031 t/s prefill / 59 t/s write; M5 Ultra 1,701 / 48; M3 Ultra 414 / 31. At 256K context: 30, 24.3 and 15.0 t/s respectively. The 5090 needed an 8-bit KV cache to fit 256K, and spilling to system RAM dropped it to 1.5–4.6 t/s — [MacStories M5 Ultra review, Sept 2026](https://www.macstories.net/stories/m5-ultra-mac-studio-review-the-dream-mac-for-local-ai-agents/)
- 30B-A3B MoEs (GLM-4.7-Flash, Qwen3.6-35B-A3B) run at 70–100+ t/s on 128 GB boxes — [RunAIHome](https://runaihome.com/blog/best-local-llm-128gb-unified-memory-2026/)

**About 120B MoE (gpt-oss-120b, Qwen3.5-122B-A10B)**
- gpt-oss-120b (63.4 GB MXFP4): 34–56 t/s on Strix Halo, 38–52 t/s on DGX Spark — [RunAIHome](https://runaihome.com/blog/best-local-llm-128gb-unified-memory-2026/)
- gpt-oss-120b on DGX Spark (llama.cpp): 60.6 t/s at empty context falling to 40.6 t/s at 32K; prefill about 1,956 t/s — [Presenc compilation of the llama.cpp DGX Spark thread, 2026-10-02](https://presenc.ai/research/local-llm-tokens-per-second-benchmarks-2026)
- Qwen3.5-122B-A10B 4-bit on M5 Max 128 GB: 881 t/s prefill / 65.9 t/s generation at 4K; 1,068 / 54.9 at 32K. An RTX Pro 6000 was 2.3–3.5 times faster on prefill and 50–65% faster on generation — [Implicator, citing Hardware Corner, Mar 2026](https://www.implicator.ai/apple-mac-studio-m5-ultra-prompt-processing.md)

**70B dense**
- Llama 3.1 70B on DGX Spark (Ollama): 4.4 t/s. Dense 70B Q4 on Strix Halo: 4–5 t/s; M4 Max 15–22 t/s; M5 Max about 28 t/s; 2x RTX 5090 about 27 t/s; M5 Ultra 40–52 t/s (unverified) — [Presenc](https://presenc.ai/research/local-llm-tokens-per-second-benchmarks-2026); [RunAIHome](https://runaihome.com/blog/best-local-llm-128gb-unified-memory-2026/)

**200B+ MoE**
- Qwen3.8-Flash-Next on M5 Ultra 256 GB (oQ4e uses 155 GB): 108 t/s on short prompts and 60–90 t/s from 4K to 256K. Prefill about 2,500–2,900 t/s, but time to first token at 256K is 104 s (M3 Ultra: 246 s). Three concurrent requests give 81.5 t/s combined — [MacStories](https://www.macstories.net/stories/m5-ultra-mac-studio-review-the-dream-mac-for-local-ai-agents/)
- GLM-5.3-Flash with a 16K prompt: 41 t/s on M5 Ultra vs 26 t/s on M3 Ultra; first token in 12.8 s — same source.
- RTX PRO 6000 running Qwen3.8-Flash-Next (SGLang, FP8 KV + MTP): 252.9 t/s single stream, 819 t/s across 8 streams, 1,190 t/s across 16. Two cards on vLLM reach 1,610 t/s over 32 streams. Four cards run DeepSeek-V4.1-Flash at about 120 t/s, flat to 131K [community] — [Context Studios](https://www.contextstudios.ai/blog/local-ai-hardware-guide-2026)
- Frontier-size MoEs on clusters [community]: Kimi K3 (2.8T) at 29.8 t/s on 16 DGX Sparks; GLM-5.2 at 27.2 t/s on a 4-node GB10 cluster — same source.
- 512 GB M3 Ultra (July 2026): 4-bit DeepSeek R1 (351.7 GiB) at 20.3 t/s. OLD (Mar 2025): DeepSeek V3 4-bit generated 21 t/s on a short prompt but only 5.8 t/s after a 15.8K-token prompt, which took 227 s to process; peak memory 466 GB — [Implicator](https://www.implicator.ai/apple-mac-studio-m5-ultra-prompt-processing.md)
- Strix Halo needed 18 minutes to process a 1M-token prompt — [Context Studios](https://www.contextstudios.ai/blog/local-ai-hardware-guide-2026)

**Compute versus bandwidth** — [EXO Labs](https://blog.exolabs.net/nvidia-dgx-spark/)
- DGX Spark (about 100 TFLOPs FP16, 273 GB/s) prefills about 3.8 times faster than M3 Ultra (about 26 TFLOPs, 819 GB/s). M3 Ultra decodes about 3.4 times faster.
- Pairing the two (Spark for prefill, Mac for decode) gave 2.8 times end-to-end on Llama-3.1-8B.

**Power** — [SitePoint, 2026-08-06; prices dated June 2025](https://www.sitepoint.com/local-llms-vs-cloud-api-cost-analysis-2026/)
- RTX 5090 desktop: 120 W idle / 450 W load. A single box running 24/7 costs about $570 a year at $0.12/kWh. MacStories measured 567–577 W peak on a 5090 PC.

### Inferences
- Agent loops resend 30K–200K tokens of context on every turn, so prefill throughput, prefix caching and KV-cache memory decide usability more than decode speed does. Unified-memory boxes (Strix Halo, Spark, Mac) are slow at this. Discrete Blackwell GPUs are 2 to 3.5 times faster.
- Rough single-team sizing:
  - About $5–6k (M5 Ultra 256 GB, or Spark plus a 5090) serves 1–3 concurrent agent sessions on 27B–320B-A18B models.
  - About $16–35k (1–2 RTX Pro 6000) serves 8–32 streams.
  - Frontier-size open models need about $10k+ (512 GB Mac) for slow single-user use, or 4–16-node clusters.

### Gaps
- No primary, independent concurrency benchmarks (users at a given latency SLO) for Mac or Strix Halo agent workloads.
- No measured M5 Ultra wattage under LLM load.
- I could not verify AMD MI-series or small-server (8x GPU) throughput for current models.

---

## Q4. How does local cost per token compare with hosted APIs, and where is break-even?

### Takeaway
Against frontier APIs (Opus or Fable class at $20–50/M output), owned hardware breaks even at a modest 5–15M tokens per day, if it is well utilised and staffing costs are excluded. Against cheap hosted open-weight APIs ($0.1–2/M), owned hardware almost never wins on price. The case for owning hardware then has to rest on privacy, sovereignty and control, not cost.

### Cited Findings
**Frontier API prices, Oct 2026 (per 1M tokens, input/output)**
- Anthropic: Fable 5.1 $10/$50; Opus 5.5 $4/$20; Sonnet 5.5 $2/$10; Haiku 5.5 $0.10/$0.50 (≤100K prompt). Legacy Opus 4.x/5 $5/$25. Batch saves 50%; cache reads cost about 2.5–10% of base input — [Claude pricing](https://claude.com/pricing) [PRIMARY]
- OpenAI: gpt-6-astra $10/$50; gpt-6.1-sol $2/$10; gpt-6-luna $0.10/$0.50; gpt-5.3-codex $1.75/$14. Cached input is about 10% of base — [OpenAI API pricing](https://developers.openai.com/api/docs/pricing) [PRIMARY]
- Hosted open-weight per 1M tokens: MiMo-V2.6-Pro $0.2, GLM-5.3 $0.9, GLM-5.3-Flash $0.1, DeepSeek V4.1 Flash $0.2, Kimi K3 $2.3 (price unit not labelled on the page) — [Artificial Analysis](https://artificialanalysis.ai/models/open-source)
- Median output price: closed $5.00/M vs open $1.00/M — [olud.ai](https://olud.ai/blog/open-vs-closed-llm-price-gap-2026/)
- OpenRouter's median blended cost is $0.73/M (OLD-ish: data through Nov 2025) — [OpenRouter State of AI](https://openrouter.ai/state-of-ai)

**Break-even analyses**
- Rene Zander (prices "as of Sept 2026"; page header says Apr 2026):
  - Hardware: Hetzner GEX131 (RTX PRO 6000 96 GB) at €1,197/month; rented H100 at $2.89–4.29/hr.
  - Break-even per day vs Claude Opus 5: 5–10M tokens. Vs Sonnet: 10–15M. Vs Haiku: 25–45M. Double these figures if the API side uses batch or caching.
  - Below about 60% utilisation the economics look poor; engineering amortisation can add $4–6k/month.
  - Source: [renezander.com](https://renezander.com/guides/self-hosted-llm-vs-api/) [AGG]
- SitePoint (2026-08-06; API and hardware prices from June 2025, so OLD and internally inconsistent):
  - Effective local cost per million tokens: $35.37 (light consumer), $10.07 (medium consumer), $1.69 (heavy enterprise vLLM, 12-month).
  - Break-even per day: 2–3M tokens vs GPT-4.1 at 12 months, 15–20M vs hosted open-weight APIs.
  - Sensitivities: EU electricity raises break-even by 40–60%. Ops labour is 2–4 hrs/month (light), 8–15 (medium) and 30–60 (heavy), worth $1.8k–54k a year at $75/hr. Consumer GPUs keep 30–40% resale value.
  - Source: [SitePoint](https://www.sitepoint.com/local-llms-vs-cloud-api-cost-analysis-2026/) [AGG]
- Linux Foundation: closed models cost about 6 times more per call on average at about 90% performance parity — [LF](https://www.linuxfoundation.org/blog/revealing-the-hidden-economics-of-open-models-in-the-ai-era)
- Practitioner anecdote: a 24/7 local agent ran for about 99 days at roughly $0 marginal cost, while about $20 of cloud credits for Kimi K3 went in about 10 minutes — [MacStories](https://www.macstories.net/stories/m5-ultra-mac-studio-review-the-dream-mac-for-local-ai-agents/) [ANEC]

**Hidden costs** — [renezander.com](https://renezander.com/guides/self-hosted-llm-vs-api/); [SitePoint](https://www.sitepoint.com/local-llms-vs-cloud-api-cost-analysis-2026/)
- Idle GPU time costs as much as busy time.
- 2–4 weeks of senior engineering to reach production, then 10–20% of an engineer ongoing.
- A GPU ops hire costs €90–130k a year.
- About a week per model swap; observability, security and failover to build.
- Enterprise GPU lead times of 3–6 months; refresh every 24–30 months.
- Memory-driven price inflation: DGX Spark rose 17%, Framework Desktop 73% and RTX Pro 6000 87% over list — [RunAIHome](https://runaihome.com/blog/best-local-llm-128gb-unified-memory-2026/); [Context Studios](https://www.contextstudios.ai/blog/local-ai-hardware-guide-2026)

### Inferences (my arithmetic, labelled)
- **Derived:** A $5,500 M5 Ultra amortised over 36 months is about $153/month, plus about $30–50/month of power. At about 80 t/s single-stream running 24/7, it produces at most about 207M output tokens a month, roughly $0.9 per million output tokens at full use. Realistic utilisation (10–30%) puts this at about $3–9/M. That beats Opus/Fable output ($20–50/M), roughly ties Sonnet/Sol ($10/M), and loses to hosted open-weight APIs ($0.1–2/M).
- Agentic coding is input-heavy (SitePoint cites 8:1 to 15:1 input:output). Frontier providers' cache-read pricing ($0.10–1/M) shrinks the API bill, so break-even against cached frontier APIs comes later than headline comparisons suggest.

### Gaps
- No primary TCO study (for example from SemiAnalysis) for 2026 single-team local inference. The existing analyses are blog-grade and partly inconsistent.
- No measured utilisation figures for real small-team agent deployments.

---

## Q5. What does the inference-server landscape look like?

### Takeaway
llama.cpp, Ollama and LM Studio dominate single-user local use. vLLM and SGLang are the production servers for many concurrent users, and TensorRT-LLM is fastest on NVIDIA datacentre GPUs. MLX (and oMLX) is the Apple path, and exo is for clustering. All of them expose OpenAI-compatible APIs. The decisive difference is concurrency: Ollama degrades at a handful of simultaneous users, while vLLM and SGLang scale.

### Cited Findings
**Feature and adoption comparison** — [DEV Community guide, July 2026, updated 2026-10-18](https://dev.to/sreeraj-sreenivasan/the-complete-guide-to-local-llm-inference-tools-in-july-2026-llamacpp-ollama-vllm-sglang-and-4mh1) [AGG; star counts are the article's, not verified]
- llama.cpp: 85k+ stars; OpenAI-compatible llama-server; CUDA, ROCm, Metal, Vulkan and CPU backends; 10–25% faster than Ollama.
- Ollama: 130k+ stars; OpenAI API at :11434/v1; queues requests sequentially under load; uses MLX on Apple Silicon since v0.19 (Mar 2026).
- LM Studio: closed-source and single-user.
- vLLM: 50k+ stars; PagedAttention and continuous batching; 16 to 20 times Ollama's concurrent throughput at peak; needs CUDA (ROCm support "incomplete").
- SGLang: 18k+ stars; "400,000+ GPUs" claimed; RadixAttention prefix caching; claimed 29% faster than vLLM on H100 and up to 6 times faster for RAG [VENDOR-ish]; NVIDIA, AMD, TPU and Ascend.
- TensorRT-LLM: fastest at every concurrency level on H100/B200, but needs a 15–30 min compile per model.
- MLX: 21k+ stars, Apple only.

**Concurrency in practice**
- Ollama shipped to 40 internal users went from 3 s to more than a minute per response, with timeouts. The author describes it as collapsing at 5 concurrent users (Apr 2026) — [Towards AI](https://pub.towardsai.net/i-tested-ollama-vs-vllm-vs-llama-cpp-the-easiest-one-collapses-at-5-concurrent-users-d4f8e0e84886) [ANEC; full article paywalled]

**Speculative decoding (MTP / draft models) is now mainstream**
- On RTX 5090, Qwen3.8-27B goes from 77 to 155 t/s with MTP. DGX Spark goes from 12 to 31–58 t/s with NVFP4+MTP. EXL3 and SGLang with MTP are used on Spark and RTX Pro — [Context Studios](https://www.contextstudios.ai/blog/local-ai-hardware-guide-2026)

**Ecosystem signals (Sept 2026)** — [stateofopensource.ai](https://stateofopensource.ai/) [AGG; not independently verified]
- Nvidia agreed to buy Hugging Face for $12.93B (3 Sept 2026).
- Stripe agreed to buy OpenRouter for about $7.5B (19 Aug 2026).
- OpenRouter handles about 25T tokens a week.

**Current OpenRouter usage (token table through 2026-10-17)** — [OpenRouter rankings](https://openrouter.ai/rankings) [PRIMARY]
- By token volume: DeepSeek V4.1 Flash 35.9T leads, followed by Step 5 Preview, GLM 5.3 Flash, MiMo-V2.6-Flash and Hy4 preview, all open-weight Chinese models. Claude Opus 5.5 has 6.05T.
- Share of text requests, week of 5 Oct 2026: DeepSeek 24.5%, OpenAI 18.6%, Google 17.8%, Z.ai 13.4%.

### Inferences
- A product aimed at teams (more than 3 concurrent agent sessions) should standardise on vLLM or SGLang on NVIDIA, with llama.cpp or MLX for single-user and edge boxes. Ollama is fine for developer laptops but is not a multi-user backend.

### Gaps
- GitHub star counts could not be verified: the GitHub API was blocked in this session.
- No data on exo or LocalAI adoption, no download numbers, and no named enterprise customers for vLLM or SGLang beyond the claims above.

---

## Q6. What do practitioners report about agentic coding on local models?

### Takeaway
Local agentic coding now works for single developers on 27B–320B models with 256K contexts. Practitioners report qualitative success, but long-context prefill latency, KV-cache memory and harness token overhead are the recurring pain points. Published SWE-bench runs with local-sized models are vendor numbers (about 70–79% Verified); I found no independent results from consumer hardware.

### Cited Findings
- Qwen3-Coder-Next (3B active) reaches about 71% on SWE-bench Verified across SWE-Agent, mini-SWE-agent and OpenHands, but only 30.9% on Terminal-Bench 2.0 inside the Claude Code harness versus 36.2% in Terminus2. The harness choice matters by 5 or more points. RL raised average agent turns from 50 to 130 ("long-horizon ability emerged"). Training covered 21 tool-call templates for format robustness — [arXiv 2603.00729](https://arxiv.org/abs/2603.00729) [VENDOR]
- MacStories (Sept 2026):
  - Setup: local Qwen3.8-Flash-Next served via oMLX, used inside the Codex app (main thread and subagents, orchestrated by a GPT model) and Hermes Agent over Tailscale.
  - Results: all 24 code test answers passed. The author made it the default model and ran a 24/7 local agent for about 99 days.
  - Problems: at 128K–256K, answers found the target code but came out shorter than requested; time to first token at 256K was 104 s even on M5 Ultra.
  - Concurrency: three concurrent agent sessions with subagents fit in 256 GB.
  - Source: [MacStories](https://www.macstories.net/stories/m5-ultra-mac-studio-review-the-dream-mac-for-local-ai-agents/) [ANEC but detailed]
- OpenHands blog (June 2026): OpenCode has more than 185k stars, OpenHands about 91k. Aider is confirmed fully offline with Ollama or LM Studio, and Cline, Goose and OpenCode support local backends. Heavy MCP servers can cost 10K+ tokens per turn. Cline and Kilo Code freeze or stall in some cases. Small local models are weaker at complex reasoning — [OpenHands blog](https://www.openhands.dev/blog/open-source-ai-coding-agents) [VENDOR blog]
- Author claim, no methodology: local models "cover 70–80% of everyday coding tasks" (June 2026) — [Medium, Özdoğan](https://mehmetozgenozdogan.medium.com/locally-hosted-coding-agents-the-2026-landscape-ed652def5989) [ANEC]
- Mozilla/SlashData 2026 developer survey (n=1,411): 79% use open models and 71% closed; 50% use both. Open models reach production 12 points less often (n=954). Leavers cite operational issues. Top blockers: infrastructure cost 27%, security/compliance 26%, maintenance 24%, deployment complexity 23% — [stateofopensource.ai](https://stateofopensource.ai/)

### Inferences
- The realistic local pattern is a 27B–35B or Flash-class model for most turns, with aggressive prefix caching and context compaction. A frontier model, if one is allowed, plans or reviews.
- Tool-call template robustness is a training-time property. Choose models with documented multi-template training, and test tool-calling in your own harness.

### Gaps
- No independent published success rates, run times or tool-call failure rates for OpenHands, Aider, Cline, Roo or SWE-agent on consumer local hardware. This is the most important missing data for the thesis, and an in-house benchmark would fill it.

---

## Q7. Which capabilities are still frontier-only in 2026, and what workarounds exist?

### Takeaway
Long-horizon autonomous work, reliable very-long-context retrieval, and the hardest agentic/terminal tasks remain clearly frontier-led. That is even more true for models small enough to self-host.

### Cited Findings
- Multi-needle retrieval at 1M tokens: Gemini 3.1 Pro 89% vs DeepSeek V4-Pro 41% — [stateofopensource.ai](https://stateofopensource.ai/)
- Time horizon: Claude Opus 4.6 has a 50% time horizon of about 12 hours. Open models lag by about 4.4 months on the METR-style fit — same source.
- Agentic composite: Claude Opus 5.5 90.3 vs best open GLM-5.3 70.2 — [BenchLM](https://www.benchlm.ai/blog/posts/state-of-llm-benchmarks-2026)
- Independent Terminal-Bench 2.0: frontier 73.2% vs best open 57.3% vs Qwen3.6-27B 44.9% — [Vals mirror](https://benchlm.ai/md/benchmarks/valsterminalbench2.md)
- One-GPU serving tier sits about 23 index points below the top model — [stateofopensource.ai](https://stateofopensource.ai/)
- Qwen team acknowledges "a gap in solving highly complex, large-scale software engineering tasks" — [arXiv 2603.00729](https://arxiv.org/abs/2603.00729)
- Workaround seen in practice: a local model does the work while a frontier GPT model orchestrates (Codex app) — [MacStories](https://www.macstories.net/stories/m5-ultra-mac-studio-review-the-dream-mac-for-local-ai-agents/)
- Distillation: allegations that open labs distilled from Anthropic models remain unproven — [stateofopensource.ai](https://stateofopensource.ai/)
- Fine-tuning: DGX Spark is recommended for fine-tuning more than for inference — search result title only, [Kaitchup](https://kaitchup.substack.com/p/dgx-spark-use-it-for-fine-tuning) (not fetched)

### Inferences
- A strict "no hosted vendor" product should expect to give up roughly 15–30 points on hard agentic benchmarks and to struggle beyond about 128K context. Other workarounds — task decomposition, verification loops (tests as judge), a larger local model as judge on a shared server, and fine-tuning on the team's own repositories — are plausible design choices. I found no source quantifying their gains.

### Gaps
- No quantitative studies found on judge/escalation tiers, or on fine-tuning gains for local coding agents in 2026.
- Multimodal review (UI screenshots) comparisons between open and closed models were not found.

---

## Q8. What signals exist for privacy- and sovereignty-driven local adoption?

### Takeaway
Developer-level use of open models is high, but enterprise spend has moved toward closed APIs. Self-hosting and on-prem share figures are mostly low-quality aggregator statistics. Sovereignty and privacy are the most-cited reasons to self-host, and operational burden is the most-cited reason to abandon it.

### Cited Findings
- Menlo Ventures (Dec 2025, survey Nov 2025):
  - Open-source share of enterprise LLM use fell from 19% in 2024 to 11% in 2025. Chinese open models are about 1% of total API usage.
  - API spend share: Anthropic 40%, OpenAI 27%, Google 21%. Anthropic holds 54% of coding.
  - Enterprise generative-AI spend $37B, of which coding $4.0B. Only 16% of deployments are true agents. No on-prem figures.
  - Source: [Menlo Ventures](https://menlovc.com/perspective/2025-the-state-of-generative-ai-in-the-enterprise/) [PRIMARY]
- a16z CIO survey (100 Global 2000 CIOs, Jan 2026), via secondary summaries:
  - OpenAI used in production by 78%, Anthropic by 44%. About 80% are comfortable hosting directly with closed providers.
  - 36% prefer closed models and 30% open. Average LLM spend is $7M, with about $11.6M expected in 2026.
  - Open-source share of spend moved from 19% to 11%.
  - Sources: [GitHub summary](https://github.com/danielithomas/AI-Articles/blob/main/articles/enterprise-ai-arms-race-cio-survey-a16z-20260203.md); [24/7 Wall St via Yahoo, 2026-07-12](https://finance.yahoo.com/technology/ai/articles/open-source-ai-boom-may-151616256.html) (original blocked: https://www.a16z.news/p/leaders-gainers-and-unexpected-winners). The 19%-to-11% figure may be Menlo's, misattributed.
- OpenRouter (Dec 2025 report): open-weight models were about one-third of tokens by late 2025, settling near 30%. Chinese open models averaged 13% and peaked near 30% of weekly share — [OpenRouter State of AI](https://openrouter.ai/state-of-ai) [PRIMARY]. By August 2026, 8 of the top 10 models by tokens were open-weight (7 of them Chinese) — [stateofopensource.ai](https://stateofopensource.ai/)
- Stanford AI Index 2026: 70% of organisations use AI in at least one function; autonomous-agent deployment is in single digits — [DataCamp summary](https://dcthemedian.substack.com/p/20-takeaways-from-stanfords-2026)
- On-prem statistics compiled by DreamFactory, a vendor (treat with caution):
  - 55% of enterprise AI inference runs on-prem or at the edge, up from 12% in 2023 (renewator.com).
  - 71% of AI infrastructure runs outside public cloud (ESG via a Dell paper).
  - On-prem share of the LLM market: about 60% (Roots Analysis), 51.85% (Mordor, 2025).
  - Security is the top adoption barrier at 44%.
  - Source: [DreamFactory](https://www.dreamfactory.com/hub/on-premise-llm-deployment-statistics/) [AGG/VENDOR; weak sourcing, different bases]
- Developer survey blockers: infrastructure cost 27%, security/compliance 26% — [stateofopensource.ai](https://stateofopensource.ai/)
- Licence and regional restrictions are adoption barriers in their own right: Hy3-preview excludes the EU/UK, and the Qwen3.8-Flash-Next MaaS clause restricts commercial use — [Slash Digital](https://slash-digital.io/en/insights/open-weight-models-2026/)

### Inferences
- The market signal is mixed. Developers use open models widely, but enterprises paying for production work mostly buy closed APIs. A local-first company's buyer is likely a regulated or sovereignty-constrained segment (finance, health, government, EU), or a cost-sensitive high-volume workload, not the median enterprise.

### Gaps
- No primary 2026 survey from Red Hat, IBM, Dell, McKinsey, Bain, Gartner or IDC on on-prem LLM share was retrieved. The search budget ran out, and the aggregator figures are not reliable.
- No 2026 Menlo update was found; the Dec 2025 report is the latest.
