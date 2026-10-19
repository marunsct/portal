# Demand for self-hosted, data-sovereign ("local-first") AI software: Japan, regulated industries, EU, US (as of October 2026)

Research note compiled 2026-10-19. Survey dates are marked. Many figures come through secondary write-ups (flagged). The web-search budget ran out partway through, so some named surveys could not be checked (see the Gaps sections). Japanese-language sources carry an English gloss.

---

## 1. What share of enterprises run, or plan to run, generative AI on-premises or in private cloud, and why?

### Takeaway
Private and on-prem inference is now a mainstream plan for large enterprises, not a fringe one. Broadcom's 2026 survey has 56% running or planning production AI inference on private cloud. ETR (Sept 2026) finds 42% of open-weight production users on-prem. Hosted frontier APIs still carry most enterprise tokens and spend, though, and IDC data disputes any "tipping point". The stated drivers, in order, are cost and control, then security and compliance and sovereignty. Model quality is rarely the blocker for open-weight models. In Japan the leading stated concern is information leakage, but Japanese firms have so far leaned toward public cloud.

### Cited Findings
**Global / US**
- Broadcom *Private Cloud Outlook 2026*: n=1,800 senior IT decision-makers (Americas, Europe, APAC). 56% are running or planning to run production AI inference on private cloud. Public cloud as the place for those workloads fell from 56% to 41% year on year. 83% are considering or have done repatriation (69% in 2025), and 50% have already repatriated some workloads (35% in 2025). 43% of those repatriating are moving AI training, LLMs or inference. Cost overtook security as the top public-cloud concern (31%, up from 26%) — [Campus Technology, 1 Jul 2026](https://campustechnology.com/articles/2026/07/01/research-enterprise-ai-workloads-are-tipping-toward-private-cloud.aspx). Fieldwork: Radius Tech, Feb–Mar 2026, firms with 1,000+ employees in 8 countries — [LLM Configurator stats page](https://llmconfigurator.com/en/enterprise/on-prem-ai-statistics). Note that the sponsor (Broadcom/VMware) sells private cloud.
- Counter-data from IDC (Dec 2025, n=304 application-platform decision makers): current AI app deployments split 49.9% private and 50.1% public. 63.6% expect a shift *toward public cloud*, and 21.6% expect no change. TechTarget notes that this contradicts Broadcom's "tipping point" claim — [TechTarget](https://www.techtarget.com/it-infrastructure/news/366649924/Enterprises-make-strides-with-private-AI-on-premises).
- Enterprise Technology Research (fielded Sept 2026, n=200):
  - Open-weight models handle 34% of enterprise AI tokens, up from 23% a year earlier, and respondents expect 41% in 12 months.
  - 42% have open-weight models in production (31% in July) and 43% are piloting.
  - Production hosting: self-managed cloud 46%, on-premises 42%, hyperscaler-native 29%, managed inference 27% (multi-select).
  - Cost savings are the driver for 69% of production users. Model quality accounts for only 10% of concerns.
  - The top pilot obstacle is incomplete security and compliance reviews (62%). Concern about self-hosting cost rose from 40% to 50%.
  - Export-control and sanctions exposure became "three times more common" as a production consideration.
  - 93% of production adopters say their proprietary-model usage is *still growing*.
  - [Techstrong.ai, 22 Sept 2026](https://techstrong.ai/articles/open-weight-ai-models-expected-to-capture-41-of-enterprise-token-usage/)
- Tokenomics Foundation (Sept 2026, n=472 organisations): deployment is 29% private hardware, 31% rented GPU, 32% edge/local inference. 51% describe a frontier-weighted model mix, and only 24% expect to stay that way — [Constellation Research blog (secondary)](https://www.constellationr.com/research/blog/evidence-shows-enterprises-use-open-weight-models-mainstream).
- Cloudian (Mar 2026, vendor-commissioned, methodology unpublished): 93% have repatriated, are repatriating or are evaluating repatriation of AI workloads. 52% cite keeping training data on-prem for security or compliance, and 55% cite public-cloud latency for inference — [LLM Configurator](https://llmconfigurator.com/en/enterprise/on-prem-ai-statistics). Low reliability.
- Deloitte *State of AI in the Enterprise* (2026 ed., fielded Aug–Sept 2025, n=3,235, 24 countries): 77% factor an AI vendor's country of origin into selection, and nearly 3 in 5 build AI stacks primarily with local vendors — [LLM Configurator (secondary)](https://llmconfigurator.com/en/enterprise/on-prem-ai-statistics). Not verified against Deloitte's original.
- Nutanix 2026 Enterprise Cloud Index (Wakefield, 13–23 Nov 2025, n=1,600, 500+ employee firms, 14 markets including Japan): 80% rate data sovereignty a high priority in infrastructure decisions. 57% feel a need to run infrastructure within a single country (on-prem or a local cloud region). 82% say their on-prem infrastructure is not fully ready for AI. 79% see shadow AI, and 87% say it creates risk — [The Source Code](https://www.the-sourcecode.com/business-tech/nutanix-eci-2026-enterprise-ai-readiness-gap-shadow-ai); [Nutanix ECI hub](https://www.nutanix.com/enterprise-cloud-index-hub).
- Menlo Ventures *2025 State of GenAI in the Enterprise* (n=495 US enterprise decision-makers, 7–25 Nov 2025):
  - Enterprise genAI spend was $37B in 2025, up from $11.5B.
  - Coding is the largest departmental category at $4.0B (about 55% of departmental spend).
  - Open-source models are 11% of enterprise LLM API usage, down from 19%. Anthropic, OpenAI and Google hold 88%.
  - 76% of AI use cases are purchased rather than built.
  - [Menlo Ventures](https://menlovc.com/2025-the-state-of-generative-ai-in-the-enterprise/)
- a16z CIO survey (100 Global-2000 CIOs, published Feb 2026): 81% use 3 or more model families. Projected 2026 spend share: OpenAI 53%, Anthropic 18%, Google 18% — [eMarketer](https://www.emarketer.com/content/openai-leads--anthropic-surges-enterprise-ai-shifts-multi-model-reality). The earlier a16z 2025 CIO survey (100+ CIOs) reported AI spend up 75% YoY and more enterprises hosting directly with OpenAI and Anthropic instead of via clouds — [CO/AI](https://getcoai.com/news/enterprise-ai-spending-surges-75-as-companies-shift-from-pilots-to-production/).
- Gartner (14 Nov 2025): "By 2027, 35% of countries will be locked into region-specific AI platforms using proprietary contextual data" — [Gartner strategic predictions 2026](https://gcom.pdo.aws.gartner.com/en/articles/strategic-predictions-for-2026).
- Cisco 2024 Data Privacy Benchmark: 27% of organisations had (temporarily) banned genAI and 63% limit the data entered. Concerns were IP and legal rights (69%) and disclosure to the public or competitors (68%) — [Technology Magazine, Jan 2024](https://technologymagazine.com/articles/cisco-more-than-1-in-4-organisations-have-banned-gen-ai-use).

**Japan**
- IDC Japan (Mar 2025, n=548): 70.9% prefer public cloud for genAI training. 29.5% intend to use dedicated infrastructure for fine-tuning. Dedicated infrastructure and edge each draw just under 20% for inference. Reasons for dedicated or edge: cost control, predictable spend, handling large data, and **not moving data outside the organisation** — [Cloud Watch, 16 Apr 2025](https://cloud.watch.impress.co.jp/docs/news/2006962.html) (IDC Japan domestic IT infrastructure survey).
- Lenovo CIO Playbook 2024: Japanese firms rely more on cloud vendors than APAC peers to meet AI requirements, and 27% are building new hybrid cloud for AI — [@IT, Aug 2024](https://atmarkit.itmedia.co.jp/ait/spv/2408/20/news063.html).
- MIC *令和8年版情報通信白書* (2026 ICT White Paper, published 24 Jul 2026; gloss: the government's annual ICT white paper): "leakage of company information, i.e. security risk" is Japan's **top** genAI risk concern at 46.4%, followed by output accuracy and copyright. The paper notes this concern is comparatively *lower* in the other three countries — [MIC PDF](https://www.soumu.go.jp/johotsusintokei/whitepaper/ja/r08/pdf/n1210000.pdf); [MIC text](https://www.soumu.go.jp/johotsusintokei/whitepaper/ja/r08/text/nd121140.txt).

### Inferences
- Demand for self-hosting is real and rising among large enterprises, but it is mostly hybrid: open-weight or private models for sensitive or high-volume work, with frontier APIs kept alongside. A product that **lets the customer switch between local and hosted models** fits how buyers actually behave better than a "local-only" pitch.
- Cost (token bills) has become as strong a motive as privacy, which helps a local-model productivity pitch in 2026.
- Japan's distinctive signal is the strong leakage concern combined with a cloud-first infrastructure habit. Japanese buyers want leakage guarantees but may accept domestic cloud regions rather than insisting on on-prem.

### Gaps
- McKinsey, Gartner deployment-split, IDC worldwide, Bain, Cloudera, Red Hat, Dell, HPE and Databricks 2025–26 survey figures were not retrieved (search budget exhausted).
- No primary Japan survey found that measures the share of firms running LLMs on-prem or in private cloud.

---

## 2. Regulated-industry requirements, and what blocks hosted AI coding tools

### Takeaway
No major Japanese, EU or US regulator *mandates* on-prem AI. Rules require leakage controls, no training on inputs, logging, vendor due diligence and knowing where data is processed. Those requirements make self-hosted or domestically processed options the low-friction path for sensitive data in finance, healthcare and government. Corporate bans after the Samsung leak (2023) established source-code exfiltration as the canonical worry.

### Cited Findings
**Japan: finance**
- FSA *AI Discussion Paper* v1.1 (3 Mar 2026; v1.0 Mar 2025) is non-binding.
  - Risks it names: data leakage over external connections; vendor selection difficulty (over 40% of institutions cite it); FSB concerns about concentration among a few providers.
  - It warns against the "risk of not taking on challenges".
  - Practices it describes: some firms run **open-source LLMs on-premises**, some use proprietary services over **dedicated lines in closed networks**, and others use SaaS or multi-cloud.
  - Survey (2024, n=130): over 90% use AI in some form. Among AI users, 71.1% allow broad employee genAI use, and coding support is a listed use case.
  - [FSA PDF](https://www.fsa.go.jp/news/r7/sonota/20260303/aidp_version1.1.pdf)
- On whether a personal-data transfer is "to a foreign company", the FSA paper says this is judged by the AI provider's country, not the server location — [AI Revolution (vendor blog, secondary)](https://ai-revolution.co.jp/media/regulated-industry-ai/).
- Daiwa Institute of Research (15 Apr 2026): the FSA is consistently supportive of AI adoption, but AI risks and legal obligations are not yet clearly defined — [DIR](https://www.dir.co.jp/report/research/capital-mkt/it/20260415_025698.html).
- Nikkei (7 May 2026), as reported: the FSA and FDUA plan to provide a customer-service genAI foundation model to regional banks for free — [AI Revolution (secondary)](https://ai-revolution.co.jp/media/regulated-industry-ai/).

**Japan: healthcare**
- 3省2ガイドライン (gloss: the joint MHLW/METI/MIC medical-information security guidelines). Version 7.0 (Jun 2026) does not uniformly require domestic storage. It requires confirming and recording storage country, processing country, subcontractors and foreign-law exposure. The Q&A (25 Sept 2026, Q18) says domestic-law servers are not mandatory *if* the contract guarantees inputs are not stored for training — [AI Revolution (secondary; verify against MHLW)](https://ai-revolution.co.jp/media/regulated-industry-ai/).
- Example: JCHO Hokkaido Hospital (announced 19 Jan 2026) runs an **on-premises** genAI server inside the hospital network for EHR voice entry. No data goes to external cloud. Partners are Precision, CSI and NTT Docomo Business, and the model is an LLM developed under the Cabinet Office SIP programme — [IT Leaders / Impress](https://it.impress.co.jp/articles/-/28877).

**Japan: public sector**
- Digital Agency DS-920 (gloss: the generative-AI procurement and use guideline for government). First edition 27 May 2025, revised 12 Jun 2026, effective 1 Sept 2026.
  - It binds national officials, and local governments refer to it.
  - Cloud genAI used under standard terms only ("type A") must not handle confidential information.
  - Services handling confidential data should come from ISMAP or equivalent lists.
  - It names overseas servers as a risk (foreign authorities may seize data).
  - The contract checklist covers input purpose, whether inputs may train models, rights, input/output/access logging, audit cooperation, model name and version disclosure, the provider's home-country law, bias evaluations, migration design (loose coupling, abstraction layer) and export of chat history.
  - Domestic models are not mandated.
  - [Timewell](https://timewell.jp/en/columns/digital-agency-generative-ai-procurement-guideline-2026); [Classmethod summary of 2025 edition](https://dev.classmethod.jp/articles/ai_digital_guidelines/); [Digital Policy Alert](https://digitalpolicyalert.org/event/40635-digital-society-promotion-council-adopted-digital-society-promotion-standard-guideline-ds-920)
- DS-920's Appendix 3 checklist (21 points) becomes a contract condition once it is written into specifications. Vendors must deliver technical documentation and logs and explain where AI was used in development — [Hakky](https://book.st-hakky.com/en/column/japan-ai-policy-procurement-requirement).
- ISMAP (gloss: the government cloud security registration scheme, since Jun 2020) and ISMAP-LIU (low-impact SaaS, since Nov 2022):
  - Agencies select from the list "in principle".
  - Unsourced estimates: full ISMAP costs about 12–18 months and tens of millions of yen; LIU about 6–9 months and ¥10–20M.
  - Local governments are not bound, but several designated cities put ISMAP-equivalent requirements in RFPs.
  - The article frames ISMAP around cloud services and does not cover on-prem software.
  - [Timewell](https://timewell.jp/en/columns/ismap-government-cloud-security-explained-2026)
- For a platform within ISMAP scope (e.g. Amazon Bedrock), individual models need not be registered — [AWS Japan blog](https://aws.amazon.com/jp/blogs/news/amazon-bedrock-ismap/).
- Osaka City: genAI on a cloud environment reached via a dedicated line that bypasses the internet, permitting up to 1,000 people's personal data per operation (excluding My Number) — [AI Revolution (secondary)](https://ai-revolution.co.jp/media/regulated-industry-ai/).

**Domestic-processing availability (Japan, Oct 2026, secondary vendor blog)**
- Anthropic direct: no Japan-only processing.
- Claude via Bedrock: Tokyo/Osaka processing.
- Azure: some models only.
- OpenAI direct: Japan storage, but processing abroad.
- Sakura AI Engine: domestic only.
- M365 Copilot: domestic processing planned for 2028.
- Requiring domestic processing raises costs by about 10%.
- Examples of on-prem packages: Intec local-LLM support from ¥5M (about 1 month); APOLLO11 EdgeLLM from ¥9.8M plus a monthly fee.
- Source: [AI Revolution](https://ai-revolution.co.jp/media/regulated-industry-ai/). The source sells contract development, so treat it as indicative.

**Corporate bans / code-leak precedent**
- Samsung banned genAI tools (memo, late Apr 2023, reported 2 May 2023) after an engineer uploaded sensitive internal source code to ChatGPT. Amazon warned staff (Jan 2023), and JPMorgan heavily restricted use (Feb 2023), followed by BofA, Citi, Deutsche Bank, Wells Fargo and Goldman — [Forbes Australia](https://www.forbes.com.au/news/innovation/samsung-bans-chatgpt-among-employees-after-sensitive-code-leak/).

**US / EU regulated**
- US Senate FCU built its first AI agent on-prem for security, control and retention of model data. Standard Chartered is rolling out a private cloud across 200+ clusters — [TechTarget](https://www.techtarget.com/it-infrastructure/news/366649924/Enterprises-make-strides-with-private-AI-on-premises).
- EU drivers cited for sovereignty: the US CLOUD Act and FISA 702, DORA, NIS2, and the AI Act — [SoftwareSeni (Gartner survey context)](https://www.softwareseni.com/why-61-percent-of-european-cios-want-to-reduce-us-cloud-dependency-and-what-it-means/); [Bitdefender / IDC](https://www.bitdefender.com/en-gb/blog/businessinsights/idc-eu-data-sovereignty-cybersecurity-cloud-partnership).

### Inferences
- The blocker for hosted coding tools in Japan is usually the *contract and data-classification* step (confidential data barred from standard-terms cloud AI), not an outright law. Self-hosted tools remove that step entirely, which is a concrete sales argument for government, finance and healthcare IT departments and their SIers.
- DS-920's checklist (logging, model disclosure, migration and abstraction, history export, audit cooperation) is effectively a product requirements list for any vendor selling into Japanese public bodies.

### Gaps
- No primary FFIEC/OCC, Basel, HIPAA, FedRAMP or ITAR AI-specific text was retrieved.
- No named Japanese bank was found publicly running an on-prem LLM. Mizuho with SB Intuitions and MUFG with Sakana are partnerships with unstated deployment form ([CodeNote](https://codenote.net/en/posts/japanese-local-llm-development-case-studies/)).
- No 2025–26 survey was found on the share of companies banning hosted coding assistants specifically.

---

## 3. Japan in depth

### Takeaway
Japan has moved from laggard to high nominal adoption: 86–87% of large firms use genAI. Value realisation is weak, organisational adoption lags (27% have no organisational initiative), and SMEs trail badly (about 20%). Policy is promotional (the AI Promotion Act carries no penalties) and pushes "open AI sovereignty": avoid over-dependence and use domestic models where it matters. Government demand is concentrated in Gennai and domestic LLMs. Buying runs through SIers, and an acute talent shortage keeps outsourcing dominant. Subsidies (デジタル化・AI導入補助金, 省力化投資補助金) can fund SME purchases, but only through registered vendors and tools.

### Cited Findings
**Adoption**
- PwC Japan *生成AIに関する実態調査2026春* (gloss: PwC's spring 2026 six-country genAI survey; Japan n=932, 12–19 Feb 2026, firms with revenue ≥¥50B):
  - Japan's adoption is 87% (+11 points). Other countries: US 90%, UK 89%, China 91%, Germany 89%, Korea 93%.
  - Results "far exceeded" expectations for 9% in Japan (lowest) versus 38% in the US. Results were below expectations for 19% in Japan.
  - 41% of Japanese firms expect an effect within one year, versus 66% in the US.
  - [PwC](https://www.pwc.com/jp/ja/knowledge/thoughtleadership/generative-ai-survey2026.html)
- MIC 2026 White Paper: 86.4% of Japanese firms use genAI in at least one task (US 90.9%, Germany 91.6%, China 98.1%). 65.6% have organisational use, while **27.0% have no organisational initiative** (higher than the other three countries). 41.1% have company-wide guidelines. Enterprise sample: 515 (353 large, 162 SMEs) — [MIC PDF](https://www.soumu.go.jp/johotsusintokei/whitepaper/ja/r08/pdf/n1210000.pdf); [AdverTimes](https://www.advertimes.com/20260729/article552212/). For contrast, the 2024 edition reported 46.8% for Japan versus 84.7% in the US — [Jiji](https://sp.m.jiji.com/english/show/34045).
- Teikoku Databank (gloss: TDB credit-research survey, 17–31 Mar 2026, n=10,312):
  - 34.5% use genAI in business: large firms 46.5%, SMEs 32.4%, small firms 28.0%, 1,000+ employees 63.6%, finance 38.6%.
  - Programming support is used by only 5.9% of users.
  - Concerns: accuracy 50.4%, lack of skills 41.3%, deciding scope 40.0%, **information-leak risk 33.5%**.
  - [TDB](https://www.tdb.co.jp/report/economic/20260514-genai/)
- Tokyo Shoko Research (31 Mar–7 Apr 2026, n=6,327): 59.1% of large firms and 32.3% of SMEs promote organisational use — [TSR](https://www.tsr-net.co.jp/data/detail/1202766_1527.html).
- IPA *DX動向2026* (gloss: IPA's DX trends survey; Apr–Jun 2026, n=1,799):
  - AI adoption is 42.3% plus 15.7% trialling. By size: 100 employees or fewer 16.6%, 1,001+ employees 78.3%.
  - 47.0% use AI for **development support**.
  - Effects are 91.6% efficiency gains and only 3.9% revenue.
  - DX talent: 50.1% "severely short" and 85.5% short overall.
  - [Uravation summary of IPA](https://uravation.com/media/ipa-dx-trend-survey-2026-ai-adoption/)
- OpenText (Japan survey Dec 2025): 80% of Japanese firms use genAI (global 32%). Top use case is software development (46%), and the top AI-security challenge is the AI talent shortage (45%) — [@IT, Apr 2026](https://atmarkit.itmedia.co.jp/ait/articles/2604/06/news041.html). Vendor survey.
- SMEs: the SMRJ survey (Nov–Dec 2025, n=1,647) puts SME AI adoption at 20.4%. The 2026 SME White Paper gives reasons for non-use: can't imagine use cases 63.4%, no staff to drive it 40.0%, no rules 26.2%, **security/leak worries 14.5%**, budget 13.8% — [Uravation](https://uravation.com/media/ai-adoption-rate-statistics-2026/). Leakage is a minor barrier for SMEs; know-how is the major one.
- Sakana AI's enterprise AI-agent market map:
  - 59.9% of company-wide genAI users cite leakage of internal confidential data as the top concern.
  - 55.0% of AI-agent users are uneasy about confidential data.
  - NRI reports skills as the top issue at 70.3%.
  - 33.1% cite difficulty integrating with existing systems.
  - The "peripheral support market" (RAG, integration, governance, operations) is identified as the battleground, with SIers strong in on-prem and closed-network environments.
  - [Sakana AI PDF](https://sakana.ai/assets/marlin/%E3%82%A8%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%97%E3%83%A9%E3%82%A4%E3%82%BAAI%E3%82%A8%E3%83%BC%E3%82%B8%E3%82%A7%E3%83%B3%E3%83%88%E5%B8%82%E5%A0%B4%E3%83%9E%E3%83%83%E3%83%97%20%E2%80%95%20%E5%B0%8E%E5%85%A5%E3%81%AE%E8%AA%B2%E9%A1%8C%E3%80%81%E6%94%AF%E6%8F%B4%E3%83%97%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC%E3%80%81%E6%A9%9F%E4%BC%9A%E9%A0%98%E5%9F%9F.pdf)

**Policy**
- AI Promotion Act (gloss: 人工知能関連技術の研究開発及び活用の推進に関する法律, Act No. 53 of 2025): promulgated 4 Jun 2025 and fully in force 1 Sept 2025. The AI Strategy HQ first met 12 Sept 2025 — [Cabinet Office](https://www.cao.go.jp/press/new_wave/20251003.html). It has no penalty provisions, and binding force comes via procurement specifications — [Hakky](https://book.st-hakky.com/en/column/japan-ai-policy-procurement-requirement).
- AI Basic Plan (人工知能基本計画), Cabinet decision 14 Jul 2026: "open AI sovereignty" (開かれたAI主権). It calls for avoiding excessive dependence on specific countries or companies, and stronger autonomy over compute, data, models and applications in government, defence and critical infrastructure. Projected investment to FY2040: vertical AI ¥23.1T, physical AI ¥10.5T — [Mihata column citing the plan](https://mihata.jp/column/sovereign-ai-japan) (primary: www8.cao.go.jp/cstp/ai/ai_plan/aiplan_20260714.pdf, not read directly).
- Gennai (源内, gloss: the Digital Agency's in-house genAI platform for civil servants):
  - Prime Minister's instruction 19 Dec 2025: 100k+ staff from May 2026. The rollout covers 39 agencies and about 180,000 staff from May 2026.
  - ¥4.4B in the FY2025 supplementary budget, and ministries fund their own use from FY2027.
  - Runs on the government cloud.
  - [Digital Agency PDF, 6 Mar 2026](https://www.digital.go.jp/assets/contents/node/information/field_ref_resources/2d69c287-2897-46d8-a28f-ea5a1fc9bce9/86f43a74/20260306_policies_ai_gennai_mass_deployment.pdf)
- Seven domestic models were selected for Gennai (6 Mar 2026, 15 applicants): NTT tsuzumi 2, KDDI/ELYZA Llama-3.1-ELYZA-JP-70B, SoftBank Sarashina2 mini, NEC cotomi v3, Fujitsu Takane 32B (with Cohere), PFN PLaMo 2.0 Prime, and Customer Cloud CC Gov-LLM. Inference must run on the government cloud with domestic processing. Gennai went open source in Apr 2026 for municipalities. Several models run on Sakura Cloud from Jul 2026 — [ISSOH](https://www.issoh.co.jp/tech/details/11305/). Overseas models (Claude, Nova) are also offered in Gennai — [Digital Agency PDF](https://www.digital.go.jp/assets/contents/node/information/field_ref_resources/2d69c287-2897-46d8-a28f-ea5a1fc9bce9/86f43a74/20260306_policies_ai_gennai_mass_deployment.pdf).
- GENIAC (METI/NEDO, since Feb 2024): foundation-model compute support for 10, 20, 24 and 16 projects across rounds 1–4. Sakana's 1T-parameter model was in round 4. Compute support offering was ¥33.9B (Nikkei xTech, Mar 2025) — [Arpable](https://arpable.com/artificial-intelligence/geniac-japan-ai-sovereignty/).
- Domestic LLM vendors' positioning:
  - NTT tsuzumi 2 (launched 20 Oct 2025): 30B parameters on **one GPU**, targeted at on-prem and private cloud for confidential data, with hardware cost claimed at 1/10–1/20 of comparable models. NTT's AI-related orders were ¥67B in FY2025 Q1 — [MONOist](https://monoist.itmedia.co.jp/mn/articles/2510/22/news048_2.html); [EnterpriseZine](https://enterprisezine.jp/news/detail/22970); [CodeNote](https://codenote.net/en/posts/japanese-local-llm-development-case-studies/).
  - PLaMo is used in 150+ municipalities via QommonsAI — [CodeNote](https://codenote.net/en/posts/japanese-local-llm-development-case-studies/).
  - SB Intuitions' Sarashina API is used for the Digital Agency's G-Biz portal project — [SB Intuitions, 25 Mar 2026](https://www.sbintuitions.co.jp/en/news/press/20260325_01/).

**SIers and buying**
- IDC Japan's 2024 domestic IT services market was ¥7.02T (+7.4%). Top five: Fujitsu, Hitachi, NEC, NTT Data, IBM (Accenture 6th) — [IDC, 30 Jul 2025](https://www.idc.com/resource-center/press-releases/2024%e5%b9%b4-%e5%9b%bd%e5%86%85it%e3%82%b5%e3%83%bc%e3%83%93%e3%82%b9%e5%b8%82%e5%a0%b4%e3%83%99%e3%83%b3%e3%83%80%e3%83%bc-%e5%a3%b2%e4%b8%8a%e3%83%a9%e3%83%b3%e3%82%ad%e3%83%b3%e3%82%b0%e3%82%92/).
- About 75% of Japanese IT engineers work at IT vendors versus about 25% at user companies (IT人材白書2014 data for 2013), contrasted with a "Western model" where talent sits in user firms — [METI PDF](https://www.meti.go.jp/shingikai/sankoshin/shomu_ryutsu/joho_keizai/it_jinzai/pdf/002_02_00.pdf).
- Levtech (Dec 2025, n=553 DX staff): 70.7% outsource to IT vendors, and 65.5% are moving some work in-house. The barriers are lack of know-how (52.2%) and lack of DX leaders (45.6%) — [Levtech PDF](https://leverages.jp/wp-content/uploads/2026/02/3640bcfc3761d93bb6826e5d6d138831.pdf).
- Foreign platforms (Microsoft, Salesforce, ServiceNow) rely on Japanese partners. NTT Data resells OpenAI and supports use cases for 100 firms — [Sakana AI PDF](https://sakana.ai/assets/marlin/%E3%82%A8%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%97%E3%83%A9%E3%82%A4%E3%82%BAAI%E3%82%A8%E3%83%BC%E3%82%B8%E3%82%A7%E3%83%B3%E3%83%88%E5%B8%82%E5%A0%B4%E3%83%9E%E3%83%83%E3%83%97%20%E2%80%95%20%E5%B0%8E%E5%85%A5%E3%81%AE%E8%AA%B2%E9%A1%8C%E3%80%81%E6%94%AF%E6%8F%B4%E3%83%97%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC%E3%80%81%E6%A9%9F%E4%BC%9A%E9%A0%98%E5%9F%9F.pdf). Cohere uses Fujitsu as its Japan design partner — [Sacra](https://sacra.com/research/cohere-at-150m-arr/).

**Talent shortage / "2025 digital cliff"**
- METI DX Report (2018): if legacy-system problems are not overcome, losses of up to ¥12T per year after 2025 — [Business+IT](https://www.sbbit.jp/article/sp/125611).
- METI / Mizuho IT talent supply-demand study (2019): shortfall of up to 790,000 IT staff by 2030 — [NTT Docomo Business Watch](https://www.ntt.com/bizon/d/00491.html); [Business+IT](https://www.sbbit.jp/article/sp/72563).
- IPA 2026: 85.5% of firms short of DX talent — [Uravation](https://uravation.com/media/ipa-dx-trend-survey-2026-ai-adoption/).

**Subsidies**
- デジタル化・AI導入補助金2026 (gloss: the renamed IT Introduction Subsidy).
  - Rates and caps: the general frame is about ¥50k–¥4.5M depending on process count, at 1/2 to 2/3 (3/4 to 4/5 for small amounts and small firms). The security frame is ¥50k–¥1.5M.
  - Software purchase and up to 2 years of cloud fees are eligible.
  - **The vendor must register as an IT導入支援事業者 and register each tool.**
  - Round 6 deadline: 30 Oct 2026.
  - [SME Agency PDF](https://www.chusho.meti.go.jp/koukai/yosan/r8/digital_ai_summary.pdf); [Hojyokin Portal](https://hojyokin-portal.jp/columns/ai-agent-hojyo)
- 中小企業省力化投資補助金 (gloss: SME labour-saving investment subsidy):
  - General type: up to ¥100M at 1/2 (2/3 for small firms), covering custom AI system development.
  - Catalogue type: registered products only.
  - ものづくり補助金 (gloss: manufacturing/innovation subsidy): up to ¥40M.
  - [Hojyokin Portal (secondary, updated 1 Sept 2026)](https://hojyokin-portal.jp/columns/ai-agent-hojyo)

### Inferences
- The most receptive Japanese segments for a self-hosted dev-agent platform are: (a) large enterprises and finance, where leakage is the top concern and in-house development is growing; (b) public sector and municipalities following DS-920 and Gennai's open-source rollout; (c) SIers who need a packaged on-prem or closed-network offering to resell. SMEs are blocked mainly by know-how, not sovereignty, so an SME pitch should lead on "it builds it for you" plus subsidy eligibility rather than on sovereignty.
- Supporting domestic models (tsuzumi 2, PLaMo, Takane, cotomi, Sarashina, ELYZA) as first-class backends, plus single-GPU footprints, aligns directly with government selection and NTT's positioning.
- Registering as an IT導入支援事業者 is a cheap channel unlock for SME sales.

### Gaps
- Impress 生成AI利用実態調査, MM総研, JEITA, JIPDEC, Deloitte Tohmatsu and BCG Japan figures were not retrieved.
- The 2026 GENIAC budget and the official 省力化投資補助金 per-employee caps were not confirmed from primary sources.
- No survey quantifies Japanese attitudes to data leaving the country (domestic-processing preference) directly.
- The "AI Guidelines for Business" (AI事業者ガイドライン) latest version number and date were not verified.

---

## 4. EU

### Takeaway
EU sovereignty demand is measurable and rising: 61% of Western European CIOs plan more reliance on local clouds, IDC reports 40% using sovereign cloud in 2025, and EU-wide procurement and regulatory frameworks are forming. AI Act high-risk deadlines slipped to Dec 2027 and Aug 2028, which reduces near-term compliance urgency. Vendors (Mistral, Cohere + Aleph Alpha) win with "sovereign" framed as customer control over deployment, data and models, rather than an all-European stack.

### Cited Findings
- AI Act timeline:
  - Prohibitions since 2 Feb 2025.
  - GPAI obligations since 2 Aug 2025.
  - Article 50 transparency from 2 Aug 2026.
  - The Digital Omnibus (proposed 19 Nov 2025; political deal 7 May 2026; Parliament vote 16 Jun 2026 at 423–57–174; Council approval 29 Jun 2026) moves Annex III high-risk to **2 Dec 2027** and Annex I to **2 Aug 2028**.
  - [SecurePrivacy, 10 Jul 2026](https://secureprivacy.ai/blog/eu-ai-act-digital-omnibus-the-new-high-risk-ai-deadlines-after-council-approval); [CADE](https://cadeproject.org/updates/eus-digital-omnibus-proposes-major-delay-to-ai-act-high-risk-rules/)
- Data Act: applicable 12 Sept 2025.
  - Switching to another provider *or to on-premises* within a 30-day transition after up to 2 months' notice.
  - Switching charges limited to cost until 12 Jan 2027, then generally banned.
  - It applies to non-EU providers serving EU customers.
  - [Alston & Bird](https://www.alston.com/en/insights/publications/2025/09/eu-data-act-switching-requirements-cloud-services)
- Cloud and AI Development Act (Commission proposal, as of Jun 2026): aims to triple EU data-centre capacity in 5–7 years, sets a cloud sovereignty framework with 4 assurance levels, and adds public-procurement measures. Gaia-X Label has 3 levels, and CISPE has committed up to 3,000 labelled services. Gaia-X claims about 65% of the European cloud market is held by 3 US hyperscalers (advocacy figure) — [Gaia-X, 12 Jun 2026](https://gaia-x.eu/gaia-x-welcomes-the-eu-cloud-and-ai-development-act-and-calls-for-a-practical-trusted-path-to-european-digital-sovereignty/).
- Gartner (Nov 2025, 241 Western European CIOs): 61% plan to increase reliance on local cloud providers ("geopatriation"), and 44% have already restricted use of global providers. Accenture reports 62% of European organisations actively seeking sovereign cloud — [SoftwareSeni](https://www.softwareseni.com/why-61-percent-of-european-cios-want-to-reduce-us-cloud-dependency-and-what-it-means/); [The Register, 30 Jan 2026](https://www.theregister.com/2026/01/30/euro_firms_must_ditch_us/). Gartner forecasts European IT spend of $1.4T in 2026 (+11%). Airbus has a €50M, decade-long sovereign cloud tender — [The Register](https://www.theregister.com/2026/01/30/euro_firms_must_ditch_us/).
- IDC Worldwide Digital Sovereignty Survey: about 30% of European organisations used sovereign cloud in 2023–24, rising to 40% in 2025, with a further 31% planning to — [Bitdefender / IDC market note, Feb 2026](https://www.bitdefender.com/en-gb/blog/businessinsights/idc-eu-data-sovereignty-cybersecurity-cloud-partnership).
- Kiteworks (Jul 2026):
  - 46% plan migration to EU-based providers and 45% plan data localisation.
  - 34% keep all AI training data in the EU.
  - 40% cite AI Act obligations as a top concern.
  - [Kiteworks exec summary](https://www.kiteworks.com/sites/default/files/resources/kiteworks-executive-summary-eu-data-sovereignty-2026-compliance-risk.pdf)
- Mistral:
  - ~$400M ARR in Jan 2026 (Sacra estimate), pivoting to private on-prem deployments and a sovereign stack "outside both US and Chinese control" — [Sacra](https://sacra.com/research/400m-year-napoleon-of-sovereign-ai/).
  - €3B Series D (reported 8 Sept 2026) at more than €21B, led by Samsung, with the EU Scaleup Europe Fund co-leading.
  - The CFO targets $1B ARR by end-2026.
  - Customers include Airbus, ASML and HSBC.
  - The pitch is customer control over data, models and deployment — [Channel Insider](https://www.channelinsider.com/ai/news-mistral-24b-valuation-europe-sovereign-ai-emea-france/).
- Cohere + Aleph Alpha (announced 24 Apr 2026): about $20B combined valuation; Schwarz Group commits $600M (€500M). Sovereign offering on STACKIT. Pitch: "an option between the hyperscalers and the hegemon." Cohere ARR was $240M in 2025 — [Futurum](https://futurumgroup.com/insights/cohere-acquires-aleph-alpha-a-deal-born-of-sovereignty-necessity/); [Pulse 2.0](https://pulse2.com/cohere-and-aleph-alpha-600-million-financing-commitment-from-schwarz-group-anchors-transatlantic-sovereign-ai-merger/amp/). Futurum questions whether sovereignty is a durable category or a geopolitical moment, and says buyers still decide on capability and TCO.
- Aleph Alpha / STACKIT "PhariaAI-as-a-Service" (May 2025) targets finance, public administration and regulated industry — [european.cloud](https://european.cloud/2026/02/schwarz-group-aleph-alpha/) (AI-assisted article; low reliability).

### Inferences
- The EU is a second market where "self-hostable plus model-agnostic plus exportable data" is a strong message. The Data Act's switch-to-on-prem right and the DS-920-style migration requirements in Japan point the same way, toward portability as a feature.
- The AI Act delay means near-term EU demand is driven more by geopolitics and CLOUD Act exposure than by compliance deadlines.

### Gaps
- Nextcloud and OpenProject positioning and figures were not retrieved.
- No quantified demand data was found specifically for EU self-hosted *developer* tooling.

---

## 5. Evidence of willingness to pay for self-hosted developer and AI tooling

### Takeaway
Buyers pay for self-hosted tools at roughly SaaS-equivalent seat prices. Self-hosting commonly sits in enterprise tiers, so it lifts deal size rather than discounting it. Self-hosted/private deployments are the core revenue of sovereign-AI vendors (Cohere: about 85% of revenue).

### Cited Findings
- GitHub: Enterprise Cloud lists at $21/user/month and Enterprise Server at about the same per-seat price. Copilot Business is $19/month and Copilot Enterprise $39/month (requires Enterprise Cloud). Vendr median buyer spend is $54,326/yr (n=985; range $14k–$159k). GHES minimum seats are typically 25–50 — [Vendr](https://www.vendr.com/marketplace/github); [CI/CD Cost](https://cicdcost.com/enterprise-ci-cost). Note that Vendr's text separately says "$21 per user per year" for the Server licence, which is inconsistent.
- GitLab: Premium $29/user/month, Ultimate contact-sales — [Toolradar](https://toolradar.com/tools/gitlab/pricing). Duo Self-Hosted supports air-gapped and on-prem, private cloud, Bedrock or Azure model serving (e.g. Mistral via vLLM), and is positioned for healthcare, finance and the public sector — [SPK](https://www.spkaa.com/blog/exploring-gitlab-duos-full-suite-from-cloud-to-air-gapped-environments).
- Tabnine: Code Assistant $39/user/month and Agentic $59/user/month, billed annually. Both support SaaS, VPC, on-prem and air-gapped deployment — [Costbench (single-source, medium confidence)](https://costbench.com/software/ai-coding-assistants/tabnine/).
- Sourcegraph (Mar–Jun 2026): moved from $49/user/month to credit-based Enterprise "starting at $16K", which now explicitly includes self-hosted deployment — [PricingSaaS](https://pricingsaas.com/companies/sourcegraph/diffs/2026Q2).
- Cohere: about 85% of revenue comes from private deployments on multi-year contracts, plus software licence fees for on-prem. ARR was $150M in Oct 2025 (Sacra estimate). Customers include Oracle, RBC, Fujitsu and LG — [Sacra](https://sacra.com/research/cohere-at-150m-arr/).
- Mistral: on-prem and private deployments are central to its enterprise pivot, with ~$400M ARR in Jan 2026 (Sacra estimate) and a $1B ARR target for end-2026 (CFO) — [Sacra](https://sacra.com/research/400m-year-napoleon-of-sovereign-ai/); [Channel Insider](https://www.channelinsider.com/ai/news-mistral-24b-valuation-europe-sovereign-ai-emea-france/).
- Japan local-LLM integration packages: Intec from ¥5M; APOLLO11 EdgeLLM from ¥9.8M plus a monthly fee — [AI Revolution (secondary)](https://ai-revolution.co.jp/media/regulated-industry-ai/). NTT's AI-related orders were ¥67B in FY2025 Q1 — [CodeNote](https://codenote.net/en/posts/japanese-local-llm-development-case-studies/).
- Hosted comparators: Anthropic's run-rate exceeds $30B (Apr 2026), with 1,000+ customers spending over $1M/yr, and OpenAI is at about $24–25B — [Trending Topics, 7 Apr 2026](https://www.trendingtopics.eu/anthropic-overtakes-openai-in-revenue-hitting-30-billion-run-rate/) (company-reported).

### Inferences
- Benchmarks for pricing a self-hosted dev-agent platform: $39–59/user/month (Tabnine) or a $16k+ annual floor (Sourcegraph). In Japan, an ¥5–10M integration package via an SIer is a familiar deal shape.

### Gaps
- No public figures were found for JetBrains AI on-prem, Writer, or Glean self-hosted pricing.
- GitLab Dedicated and Duo add-on prices were not retrieved.
- No public deal sizes were found for Mistral on-prem contracts.

---

## 6. What buyers require before purchasing, and procurement cycle length

### Takeaway
Expect SOC 2 (Type II) and/or ISO 27001 as the baseline, increasingly ISO/IEC 42001. Expect long AI-specific questionnaires (CAIQ plus AI-CAIQ, SIG AI domains) covering training-data use, logging, tenant isolation and regional pinning. In Japan, DS-920's checklist and ISMAP or ISMAP-LIU apply for government, and SIer-led procurement is the norm. AI reviews add weeks.

### Cited Findings
- Questionnaire content: CSA AI-CAIQ adds 47 AI questions to the 261-question CAIQ, and SIG now has AI domains. Buyers ask about prompt and output logging and retention, whether customer data trains models (contractual exclusion expected), tenant isolation, region-pinned inference, AI-BOMs, and prompt-injection evals. ISO/IEC 42001 is becoming "preferred or required". AI security reviews take **4–8 weeks longer** than non-AI reviews (author estimate) — [Tian Pan blog, Apr 2026](https://tianpan.co/blog/2026/04/27/80-question-wall-enterprise-ai-security-questionnaire).
- SOC 2 cost and time (vendor marketing): traditional total $20–30k+, Type I 3–6 months, Type II 6–12+ months. "66% of B2B buyers demand a SOC 2 report" is unsourced — [Comp AI](https://trycomp.ai/soc-2-for-ai-companies).
- Japan government: the DS-920 checklist requires model and version disclosure, a statement of the provider's home-country law, bias evaluations, logging, audit cooperation, migration and abstraction design, and history export — [Timewell](https://timewell.jp/en/columns/digital-agency-generative-ai-procurement-guideline-2026). ISMAP takes about 12–18 months and tens of millions of yen; ISMAP-LIU about 6–9 months and ¥10–20M (unsourced estimates) — [Timewell ISMAP](https://timewell.jp/en/columns/ismap-government-cloud-security-explained-2026).
- Japan subsidy channel: requires IT導入支援事業者 registration and tool registration — [SME Agency PDF](https://www.chusho.meti.go.jp/koukai/yosan/r8/digital_ai_summary.pdf).
- GHES-style self-hosting buyers bear their own infrastructure and operations costs, with minimums of 25–50 seats — [Vendr](https://www.vendr.com/marketplace/github).

### Inferences
- For a small Japan-based vendor: ISO 27001 (ISMS) plus a Privacy Mark-style posture, a DS-920 checklist answer pack, an air-gap install path, SSO/SCIM, audit logs, a model-provenance disclosure and a no-training guarantee are table stakes. Self-hosting sidesteps ISMAP, which covers cloud services (the source did not address on-prem software), so self-hosting could be a faster public-sector route than SaaS. This needs verification.
- Selling through SIers (Fujitsu, NEC, NTT Data, Hitachi, or mid-tier firms such as Intec) likely shortens trust-building, since SIers already hold the customer relationships and security attestations.

### Gaps
- No reliable measured data was found on procurement-cycle length for small AI vendors in Japan or the US.
- No primary data was found on how often air-gap support, SBOMs or specific support SLAs are mandatory.

---

## 7. Counter-evidence: will local-first AI remain niche?

### Takeaway
Hosted frontier APIs dominate spend and are growing explosively. Open-source share of enterprise *API* usage fell in 2025 (Menlo), and IDC expects a shift *toward* public cloud. Self-hosting costs and ops burden are rising concerns. Japanese firms historically prefer public cloud, and SMEs care little about sovereignty. Local-first is strongest as a segment (regulated, government, cost-sensitive high volume) and as a hybrid option, not as a default.

### Cited Findings
- Open-source share of enterprise LLM API usage fell from 19% to 11% in 2025, and Anthropic, OpenAI and Google hold 88% — [Menlo Ventures](https://menlovc.com/2025-the-state-of-generative-ai-in-the-enterprise/).
- Anthropic's run-rate exceeds $30B (Apr 2026, more than tripled since end-2025) and OpenAI's is about $24–25B — [Trending Topics](https://www.trendingtopics.eu/anthropic-overtakes-openai-in-revenue-hitting-30-billion-run-rate/).
- IDC (Dec 2025): 63.6% expect the AI deployment mix to shift toward public cloud — [TechTarget](https://www.techtarget.com/it-infrastructure/news/366649924/Enterprises-make-strides-with-private-AI-on-premises).
- 93% of open-weight production adopters' proprietary usage is still growing, and self-hosting cost concern rose from 40% to 50% — [Techstrong.ai](https://techstrong.ai/articles/open-weight-ai-models-expected-to-capture-41-of-enterprise-token-usage/). 82% say on-prem infrastructure isn't AI-ready — [Nutanix ECI via The Source Code](https://www.the-sourcecode.com/business-tech/nutanix-eci-2026-enterprise-ai-readiness-gap-shadow-ai).
- Break-even (arXiv 2509.18101): on-prem pays off mainly at ≥50M tokens/month or under data-residency mandates. Small models break even in 0.3–3 months, while large deployments can take 5–9 years against cheap APIs. Open models show less than 10% accuracy loss versus the top commercial models (e.g. GPQA: GPT-5 85.4% vs Qwen3-235B 79.0%). The model **excludes staffing and maintenance** — [arXiv](https://arxiv.org/html/2509.18101v3).
- Japan: 70.9% prefer public cloud for genAI training (IDC Japan, 2025) — [Cloud Watch](https://cloud.watch.impress.co.jp/docs/news/2006962.html). Only 14.5% of non-adopting SMEs cite security or leakage — [Uravation / SME White Paper](https://uravation.com/media/ai-adoption-rate-statistics-2026/).
- Japan's government itself offers hosted overseas models (Claude, Nova) in Gennai alongside domestic models, and DS-920 does not mandate domestic models — [Digital Agency PDF](https://www.digital.go.jp/assets/contents/node/information/field_ref_resources/2d69c287-2897-46d8-a28f-ea5a1fc9bce9/86f43a74/20260306_policies_ai_gennai_mass_deployment.pdf); [Timewell](https://timewell.jp/en/columns/digital-agency-generative-ai-procurement-guideline-2026).
- Hyperscalers are closing the gap with domestic processing (Bedrock Tokyo/Osaka, Bedrock in ISMAP scope), which weakens the "must self-host" argument — [AWS Japan blog](https://aws.amazon.com/jp/blogs/news/amazon-bedrock-ismap/); [AI Revolution](https://ai-revolution.co.jp/media/regulated-industry-ai/).
- Futurum on Cohere and Aleph Alpha: sovereignty is necessary but not sufficient, and buyers decide on capability and TCO — [Futurum](https://futurumgroup.com/insights/cohere-acquires-aleph-alpha-a-deal-born-of-sovereignty-necessity/).

### Inferences
- Weak segments: SMEs without IT staff (who need hosted convenience), startups and digital natives, and low-volume users.
- The defensible position is "runs on local models when it must, hosted models when allowed, and is portable either way", sold first into regulated and public-sector Japan through SIers. In-house development teams at large firms (47% of Japanese AI adopters use it for development support) are a parallel entry point.

### Gaps
- Bain, McKinsey and Gartner counter-forecasts were not retrieved (search budget exhausted).
- No Japan-specific data on the market size for local and on-prem AI.
