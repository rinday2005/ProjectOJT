import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Award,
  Users,
  Activity,
  ArrowRight,
  Phone,
  CheckCircle2,
  PlayCircle,
  Home,
  Stethoscope,
  ClipboardList,
  ShieldCheck,
  Lock,
  UserCog,
  Pill,
  ChevronRight
} from "lucide-react";
import { servicesPageData } from "@/data/home";
import ScrollAnimation from "@/components/ui/scroll-animation";

const Services = () => {
  const { hero, categories, dashboardFeature, comparisonPlans, trustFeatures } = servicesPageData;

  const IconMap: Record<string, React.ComponentType<any>> = {
    Home: Home,
    Stethoscope: Stethoscope,
    Activity: Activity,
    Heart: Heart,
    ShieldCheck: ShieldCheck,
    Lock: Lock,
    UserCog: UserCog,
    Phone: Phone
  };

  return (
    <div className="flex-1 flex-col font-manrope bg-white dark:bg-[#101f22] text-slate-800 dark:text-gray-100 transition-colors duration-300">

      {/* Hero Section */}
      <section className="max-w-[1200px] mx-auto px-6 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <ScrollAnimation animation="slide-right">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0d8ca5]/10 text-[#0d8ca5] text-sm font-bold w-fit">
                <Heart className="w-4 h-4 fill-current" />
                {hero.badge}
              </span>
              <h1 className="text-5xl md:text-6xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white mt-4">
                {hero.title} <span className="text-[#0d8ca5] italic font-serif">{hero.titleHighlight}</span> {hero.titleSuffix}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed mt-4">
                {hero.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button className="bg-[#0d8ca5] text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-[#0d8ca5]/20 cursor-pointer flex items-center justify-center">
                  Start Your Journey
                </button>
                <button className="flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 px-8 py-4 rounded-full font-bold text-lg bg-transparent text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <PlayCircle className="w-5 h-5" />
                  How it works
                </button>
              </div>
            </ScrollAnimation>
          </div>
          <div className="relative">
            <ScrollAnimation animation="slide-left">
              <div
                className="w-full aspect-[4/5] bg-center bg-cover rounded-[3rem] shadow-2xl overflow-hidden"
                style={{ backgroundImage: `url('${hero.image}')` }}
              >
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white/70 dark:bg-black/40 backdrop-blur-md p-6 rounded-2xl shadow-xl flex items-center gap-4 max-w-[240px] border border-white/30">
                <div className="size-12 rounded-full bg-[#4ea6a5] text-white flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{hero.successBadge.subLabel}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-300">{hero.successBadge.label}</p>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Service Categories Grid */}
      <section className="bg-white dark:bg-[#101f22]/50 py-20 border-y border-[#F0F8FF] dark:border-gray-800">
        <div className="max-w-[1200px] mx-auto px-6 text-center mb-16">
          <ScrollAnimation animation="fade-up">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Specialized Care Solutions</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Explore our range of services designed to meet every stage of the care journey.</p>
          </ScrollAnimation>
        </div>
        <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const Icon = IconMap[category.icon];
            return (
              <ScrollAnimation key={index} animation="fade-up" delay={index * 0.1} className="h-full">
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-gray-100 dark:border-gray-800 group hover:-translate-y-2 transition-transform h-full flex flex-col justify-between">
                  <div className="flex-1 flex flex-col">
                    <div className={`size-14 rounded-2xl ${category.color} ${category.textColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div
                      className="w-full h-48 bg-center bg-cover rounded-2xl mb-6"
                      style={{ backgroundImage: `url('${category.image}')` }}
                    ></div>
                    <h3 className="text-2xl font-bold mb-4">{category.title}</h3>
                    <ul className="space-y-3 mb-8 flex-1">
                      {category.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <CheckCircle2 className="w-5 h-5 text-[#4ea6a5]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className="w-full h-14 rounded-full border border-[#0d8ca5] text-[#0d8ca5] bg-transparent font-bold hover:bg-[#0d8ca5] hover:text-white transition-all duration-300 shadow-none flex items-center justify-center cursor-pointer">
                    Learn More
                  </button>
                </div>
              </ScrollAnimation>
            );
          })}
        </div>
      </section>

      {/* Monitoring Feature Highlight */}
      <section className="py-24 max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <ScrollAnimation animation="slide-right">
              <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-1 shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Dashboard Visualizer */}
                <div className="bg-[#f8f9fb] dark:bg-gray-900 p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="font-black text-xl">Health Dashboard</h4>
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold uppercase">Live Updates</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {dashboardFeature.stats.map((stat, index) => {
                      const Icon = IconMap[stat.icon];
                      return (
                        <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                          <Icon className={`w-6 h-6 mb-2 ${stat.color}`} />
                          <p className="text-xs text-gray-500 font-bold">{stat.label}</p>
                          <p className="text-2xl font-black">{stat.value}</p>
                        </div>
                      );
                    })}
                    <div className="col-span-2 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="size-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                          <Pill className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-bold">Next Medication</p>
                          <p className="font-bold">{dashboardFeature.medication.name} - {dashboardFeature.medication.time}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-center">
                    <div className="flex -space-x-3">
                      {dashboardFeature.careTeam.map((img, i) => (
                        <div key={i} className="size-8 rounded-full border-2 border-white bg-gray-300 bg-cover bg-center" style={{ backgroundImage: `url('${img}')` }}></div>
                      ))}
                      <div className="size-8 rounded-full border-2 border-white bg-[#0d8ca5] flex items-center justify-center text-[10px] text-white font-bold">+2</div>
                    </div>
                    <p className="text-xs text-gray-400 ml-6 self-center">Monitored by care team</p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
          <div className="order-1 lg:order-2">
            <ScrollAnimation animation="slide-left">
              <h2 className="text-4xl font-black mb-6 leading-tight">{dashboardFeature.title}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                {dashboardFeature.description}
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="size-12 shrink-0 rounded-full bg-[#0d8ca5]/10 text-[#0d8ca5] flex items-center justify-center">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-lg">Vital Tracking</h5>
                    <p className="text-gray-500">Live monitoring of heart rate, pressure, and temperature.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="size-12 shrink-0 rounded-full bg-[#0d8ca5]/10 text-[#0d8ca5] flex items-center justify-center">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-lg">Digital Care Logs</h5>
                    <p className="text-gray-500">View daily activity summaries and mood reports instantly.</p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="bg-gray-50 dark:bg-gray-900/40 py-24 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="text-center mb-16">
            <ScrollAnimation animation="fade-up">
              <h2 className="text-3xl font-black mb-4">Choose the Right Plan</h2>
              <p className="text-gray-500">Tailored to your specific needs and timeline.</p>
            </ScrollAnimation>
          </div>
          <ScrollAnimation animation="scale-up" delay={0.2}>
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/60">
                    <th className="p-8 font-bold text-gray-400 uppercase text-xs tracking-widest">Service Feature</th>
                    <th className="p-8 font-bold text-center">On-Demand</th>
                    <th className="p-8 font-bold text-center text-[#0d8ca5] bg-[#0d8ca5]/5">Long-Term Care</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {comparisonPlans.features.map((feature, index) => (
                    <tr key={index}>
                      <td className="p-8 font-semibold">{feature.name}</td>
                      <td className="p-8 text-center text-gray-400">
                        {feature.onDemand === true ? (
                          <CheckCircle2 className="w-6 h-6 text-[#4ea6a5] mx-auto" />
                        ) : feature.onDemand === false ? "—" : feature.onDemand}
                      </td>
                      <td className="p-8 text-center text-[#0d8ca5] bg-[#0d8ca5]/5">
                        {feature.longTerm === true ? (
                          <CheckCircle2 className="w-6 h-6 text-[#0d8ca5] mx-auto" />
                        ) : feature.longTerm}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 max-w-[1200px] mx-auto px-6">
        <ScrollAnimation animation="fade-in">
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60">
            {trustFeatures.map((feature, index) => {
              const Icon = IconMap[feature.icon];
              return (
                <div key={index} className="flex flex-col items-center gap-3">
                  <div className="size-16 rounded-full border-2 border-[#0d8ca5]/30 flex items-center justify-center text-[#0d8ca5]">
                    <Icon className="w-8 h-8" />
                  </div>
                  <p className="font-bold text-sm">{feature.label}</p>
                </div>
              );
            })}
          </div>
        </ScrollAnimation>
      </section>

      {/* Final CTA Section */}
      <section className="max-w-[1200px] mx-auto px-6 pb-24">
        <ScrollAnimation animation="scale-up">
          <div className="bg-[#0d8ca5] rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
              <Heart className="w-48 h-48" />
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to find the perfect care?</h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                Join thousands of families who trust HomeCare Connect for their loved ones' daily needs and clinical excellence.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <button className="bg-white text-[#0d8ca5] px-10 py-5 rounded-full font-bold text-xl hover:bg-gray-50 transition-all hover:scale-105 duration-300 shadow-2xl flex items-center justify-center cursor-pointer">
                  Start Your Care Journey
                </button>
                <button className="bg-[#0d8ca5]/20 backdrop-blur-md border border-white/30 text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-[#0d8ca5]/30 hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer">
                  Book a Consultation
                </button>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </section>

    </div>
  );
};

export default Services;
