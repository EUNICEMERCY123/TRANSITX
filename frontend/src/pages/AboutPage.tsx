import React from 'react';
import {
  Info,
  Database,
  Layers,
  CheckCircle2,
  Lock,
  Eye,
  Server,
  Code2,
  ShieldCheck,
  TrendingUp,
  Brain,
  Sparkles
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const workflowSteps = [
    {
      title: 'DATA COLLECTION',
      desc: 'Gather baseline ridership, schedule headways, and station coordinates.',
      method: 'Multi-corridor transit feeds',
      icon: Database
    },
    {
      title: 'DATA CLEANING',
      desc: 'Impute missing delay values using corridor medians and validate dates.',
      method: 'Median & mode imputation',
      icon: CheckCircle2
    },
    {
      title: 'STATISTICAL EXPLORATION',
      desc: 'Measure typical passenger demand, hourly averages, and variation spread.',
      method: 'Mean, median, IQR & distributions',
      icon: TrendingUp
    },
    {
      title: 'PATTERN COMPARISON',
      desc: 'Compare weekday vs. weekend patterns and test if differences are real.',
      method: 'Two-sample Welch’s t-test',
      icon: Layers
    },
    {
      title: 'UNUSUAL DEMAND DETECTION',
      desc: 'Identify stations with passenger counts significantly higher or lower than usual.',
      method: 'Z-score statistical anomaly detection',
      icon: Sparkles
    },
    {
      title: 'ROUTE GROUPING & SIMILARITY',
      desc: 'Group routes that show similar passenger volume and delay patterns.',
      method: 'K-Means clustering & vector cosine similarity',
      icon: Brain
    }
  ];

  const ethicsPillars = [
    {
      title: 'Privacy & De-identification',
      desc: 'All passenger observations are aggregated to hourly bins. No personal trip sequences, smart card numbers, or individual identities are stored.',
      icon: Lock,
      color: 'text-[#A86F18] bg-[#FFF3D6]'
    },
    {
      title: 'Aggregate Activity & Ethical Visualization',
      desc: 'People shown in the 3D scene are visual representations of aggregate passenger activity. TRANSITX does not track or identify individual people.',
      icon: Eye,
      color: 'text-[#242521] bg-[#EEEAE0]'
    },
    {
      title: 'Data Quality & Imputation',
      desc: 'Missing schedule delay records were imputed using corridor-specific medians rather than artificial numbers, preventing distorted wait-time summaries.',
      icon: CheckCircle2,
      color: 'text-[#A86F18] bg-[#FFF3D6]'
    },
    {
      title: 'Sampling Awareness & Bias',
      desc: 'High-tech metro interchange stations generate denser ticket tap data than outlying suburban stops. Aggregated views ensure smaller stations remain visible.',
      icon: Eye,
      color: 'text-[#242521] bg-[#EEEAE0]'
    },
    {
      title: 'Contextual Interpretation',
      desc: 'A crowded station does not automatically indicate an operational failure. Special events, stadium matches, and weather conditions must be interpreted responsibly.',
      icon: ShieldCheck,
      color: 'text-[#A86F18] bg-[#FFF3D6]'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="pb-4 border-b border-[#DDD9CF]">
        <div className="text-xs font-bold text-[#D89B32] uppercase tracking-wider flex items-center gap-1.5">
          <Info className="w-4 h-4" />
          <span>Platform Overview</span>
        </div>
        <h1 className="text-2xl font-black text-[#242521] tracking-tight mt-1">
          About TRANSITX
        </h1>
        <p className="text-xs text-[#6E6E67] mt-0.5">
          An interactive transportation data platform turning transit measurements into understandable insights.
        </p>
      </div>

      {/* What it does */}
      <div className="bg-[#FFFFFF] p-7 rounded-3xl border border-[#DDD9CF] shadow-xs space-y-3">
        <h2 className="text-base font-bold text-[#242521]">
          What TRANSITX Does
        </h2>
        <p className="text-xs sm:text-sm text-[#6E6E67] leading-relaxed max-w-3xl">
          TRANSITX turns public transportation data into visual insights about passenger demand, routes,
          stations, and delays. By analyzing thousands of hourly measurements across urban transit lines,
          it helps commuters, planners, and analysts understand how people move through the city.
        </p>
      </div>

      {/* From Data to Insight Pipeline */}
      <div className="bg-[#FFFFFF] p-7 rounded-3xl border border-[#DDD9CF] shadow-xs space-y-5">
        <div>
          <h2 className="text-base font-bold text-[#242521]">
            How TRANSITX Works — From Data to Insight
          </h2>
          <p className="text-xs text-[#6E6E67]">
            How raw transit observations are transformed into actionable visual discoveries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="p-5 rounded-2xl bg-[#F7F5EF] border border-[#DDD9CF] space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#FFF3D6] text-[#A86F18] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#6E6E67]">Step 0{idx + 1}</span>
                      <h3 className="text-xs font-bold text-[#242521]">{step.title}</h3>
                    </div>
                  </div>
                  <p className="text-xs text-[#6E6E67] mt-2 leading-relaxed">{step.desc}</p>
                </div>
                <div className="pt-2 border-t border-[#DDD9CF] text-[10px] font-mono text-[#A86F18] font-semibold">
                  Method: {step.method}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Source & Responsible Use */}
      <div className="bg-[#FFFFFF] p-7 rounded-3xl border border-[#DDD9CF] shadow-xs space-y-5">
        <div>
          <h2 className="text-base font-bold text-[#242521]">
            Data Provenance & Responsible Analytics
          </h2>
          <p className="text-xs text-[#6E6E67]">
            Principles guiding dataset collection, privacy preservation, and interpretation integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ethicsPillars.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#DDD9CF] space-y-2">
                <div className="flex items-center space-x-2.5">
                  <div className={`p-2 rounded-xl ${p.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-[#242521]">{p.title}</h3>
                </div>
                <p className="text-xs text-[#6E6E67] leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-[#FFFFFF] p-7 rounded-3xl border border-[#DDD9CF] shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-[#242521]">
            Technology Stack
          </h2>
          <p className="text-xs text-[#6E6E67]">
            Clean decoupled modern product architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#DDD9CF] space-y-1.5">
            <div className="font-bold text-[#242521] flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#D89B32]" />
              <span>Frontend Architecture</span>
            </div>
            <p className="text-[#6E6E67]">
              React 19, TypeScript, MapLibre GL 3D vector mapping, Leaflet interactive mapping, Recharts visualizations, Tailwind CSS.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#DDD9CF] space-y-1.5">
            <div className="font-bold text-[#242521] flex items-center gap-2">
              <Server className="w-4 h-4 text-[#242521]" />
              <span>Backend API</span>
            </div>
            <p className="text-[#6E6E67]">
              FastAPI async ASGI server, in-memory caching, RESTful router architecture.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#DDD9CF] space-y-1.5">
            <div className="font-bold text-[#242521] flex items-center gap-2">
              <Brain className="w-4 h-4 text-[#A86F18]" />
              <span>Data Science & Inference</span>
            </div>
            <p className="text-[#6E6E67]">
              Pandas, NumPy, Scikit-learn (K-Means & Linear Regression), SciPy (Welch's t-test).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
