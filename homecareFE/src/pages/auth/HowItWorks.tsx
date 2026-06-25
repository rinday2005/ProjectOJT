import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  ShieldCheck,
  Activity,
  Users,
  Briefcase,
  CheckCircle2,
  Pill,
  Utensils
} from "lucide-react";
import { howItWorksPageData } from "@/data/home";
import ScrollAnimation from "@/components/ui/scroll-animation";

const HowItWorks = () => {
  const [activeRole, setActiveRole] = useState("families");
  const { hero, tabs, steps, dashboardWidget, cta } = howItWorksPageData;

  const IconMap: Record<string, React.ComponentType<any>> = {
    UserPlus,
    ShieldCheck,
    Activity,
    Users,
    Briefcase
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#101f22] text-slate-800 dark:text-gray-100 transition-colors duration-300 font-manrope">
      {/* Hero Section */}
      <section className="mb-20 w-full p-0">
        <ScrollAnimation animation="fade-in">
          <div className="relative overflow-hidden bg-slate-900 min-h-[800px] flex items-center justify-center p-8 lg:p-16">
            <div className="absolute inset-0 z-0 opacity-40">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#101f22] to-transparent"></div>
              <img
                alt="Caring interaction"
                className="w-full h-full object-cover"
                src={hero.image}
              />
            </div>
            <div className="relative z-10 text-center max-w-3xl">
              <ScrollAnimation animation="fade-up" delay={0.2}>
                <span className="inline-block px-4 py-1.5 mb-6 text-xs font-extrabold uppercase tracking-widest bg-[#2bcdee]/20 text-[#2bcdee] rounded-full">
                  {hero.badge}
                </span>
                <h1 className="text-white text-4xl lg:text-6xl font-extrabold leading-tight mb-6">
                  {hero.title}
                </h1>
              </ScrollAnimation>
              <ScrollAnimation animation="fade-up" delay={0.4}>
                <p className="text-white/80 text-lg lg:text-xl font-medium leading-relaxed mb-10">
                  {hero.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-[#2bcdee] text-[#111718] px-8 py-6 rounded-full font-extrabold text-lg hover:scale-105 transition-transform">
                    Start Your Journey
                  </Button>
                  <Button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-6 rounded-full font-extrabold text-lg hover:bg-white/20 transition-colors">
                    Watch Video Guide
                  </Button>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </ScrollAnimation>
      </section>

      {/* Role Selection Tabs */}
      <section className="mb-16 px-6 max-w-[1200px] mx-auto w-full">
        <ScrollAnimation animation="fade-up">
          <div className="text-center mb-8">
            <div className="inline-flex bg-white dark:bg-white/5 p-1.5 rounded-full border border-[#F0F8FF] dark:border-white/10 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveRole(tab.id)}
                  className={`px-8 py-3 rounded-full font-bold text-sm transition-all ${activeRole === tab.id
                    ? "bg-[#2bcdee] text-[#111718] shadow-md"
                    : "text-[#618389] dark:text-white/60 hover:text-[#2bcdee]"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </ScrollAnimation>
      </section>

      {/* Process Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-24 max-w-[1200px] mx-auto px-6 w-full">
        {/* Timeline (Steps) */}
        <div className="lg:col-span-7 space-y-2">
          <ScrollAnimation animation="slide-right">
            <h3 className="text-3xl font-extrabold mb-10">Step Process</h3>
          </ScrollAnimation>
          <div className="grid grid-cols-[60px_1fr] gap-x-6">
            {(steps as any)[activeRole].map((step: any, index: number) => {
              const Icon = IconMap[step.icon] || Activity;
              const isLast = index === (steps as any)[activeRole].length - 1;

              return (
                <ScrollAnimation key={index} animation="fade-up" delay={index * 0.1} className="contents">
                  <div className="contents">
                    <div className="flex flex-col items-center gap-2">
                      <div className="size-12 rounded-full bg-[#2bcdee]/10 border-2 border-[#2bcdee] flex items-center justify-center text-[#2bcdee]">
                        <Icon className="w-6 h-6" />
                      </div>
                      {!isLast ? (
                        <div className="w-1 bg-[#2bcdee]/20 h-24 rounded-full"></div>
                      ) : (
                        <div className="h-12"></div>
                      )}
                    </div>
                    <div className={`pt-1 ${!isLast ? 'pb-1' : 'pb-10'}`}>
                      <h5 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{step.title}</h5>
                      <p className="text-[#618389] dark:text-white/70 text-base leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </ScrollAnimation>
              );
            })}
          </div>
        </div>

        {/* Dashboard Preview Widget */}
        <div className="lg:col-span-5">
          <ScrollAnimation animation="slide-left" delay={0.2}>
            <div className="sticky top-32 p-1 rounded-3xl bg-gradient-to-br from-[#2bcdee]/20 via-white to-[#2bcdee]/30 shadow-2xl">
              <div className="bg-white dark:bg-[#152629] rounded-[2.5rem] p-6 lg:p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h4 className="font-extrabold text-lg">{dashboardWidget.title}</h4>
                    <p className="text-xs text-[#618389] dark:text-white/50">{dashboardWidget.status}</p>
                  </div>
                  <div className="size-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>

                {/* Vital Sign Card */}
                <div className="bg-[#2bcdee]/5 rounded-2xl p-4 mb-4 border border-[#2bcdee]/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2bcdee]">{dashboardWidget.pulse.label}</span>
                    <Activity className="w-5 h-5 text-[#2bcdee]" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{dashboardWidget.pulse.value}</span>
                    <span className="text-sm font-semibold text-[#618389]">{dashboardWidget.pulse.unit}</span>
                  </div>
                  <div className="mt-4 h-12 flex items-end gap-1">
                    <div className="w-full bg-[#2bcdee]/20 h-4 rounded-t-sm"></div>
                    <div className="w-full bg-[#2bcdee]/40 h-8 rounded-t-sm"></div>
                    <div className="w-full bg-[#2bcdee]/30 h-6 rounded-t-sm"></div>
                    <div className="w-full bg-[#2bcdee]/50 h-10 rounded-t-sm"></div>
                    <div className="w-full bg-[#2bcdee] h-7 rounded-t-sm"></div>
                  </div>
                </div>

                {/* Meds Tracker */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#F0F8FF]/50 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                      <Pill className="w-5 h-5 text-[#2bcdee]" />
                      <div>
                        <p className="text-sm font-bold">{dashboardWidget.meds.name}</p>
                        <p className="text-[10px] text-[#618389]">{dashboardWidget.meds.time}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded">{dashboardWidget.meds.status}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#F0F8FF]/50 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                      <Utensils className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-bold">{dashboardWidget.activity.name}</p>
                        <p className="text-[10px] text-[#618389]">{dashboardWidget.activity.time}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-[#2bcdee]/10 text-[#2bcdee] text-[10px] font-bold rounded">{dashboardWidget.activity.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-white dark:bg-[#152629] rounded-[3rem] p-12 text-center shadow-xl border border-[#F0F8FF] dark:border-white/5 max-w-[1200px] mx-auto w-full mb-20">
        <ScrollAnimation animation="scale-up">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">{cta.title}</h2>
          <p className="text-[#618389] dark:text-white/70 max-w-xl mx-auto mb-10 text-lg">
            {cta.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#2bcdee] text-[#111718] px-10 py-6 rounded-full font-extrabold text-lg hover:shadow-lg hover:shadow-[#2bcdee]/30 transition-all">
              Create Your Profile
            </Button>
            <Button variant="outline" className="border-2 border-[#111718] dark:border-white text-[#111718] dark:text-white px-10 py-6 rounded-full font-extrabold text-lg hover:bg-[#111718] hover:text-white dark:hover:bg-white dark:hover:text-[#101f22] transition-all bg-transparent">
              Speak to an Expert
            </Button>
          </div>
          <p className="mt-8 text-sm text-[#618389]">{cta.footerText}</p>
        </ScrollAnimation>
      </section>
    </div>
  );
};

export default HowItWorks;
