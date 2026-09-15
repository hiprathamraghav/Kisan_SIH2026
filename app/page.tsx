import { DemoCta } from "../components/demo-cta";
import { Ecosystem } from "../components/ecosystem";
import { Faq } from "../components/faq";
import { FeatureBar } from "../components/feature-bar";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Hero } from "../components/hero";
import { HowItWorks } from "../components/how-it-works";
import { RealImpact } from "../components/real-impact";
import { WhyAnnabata } from "../components/why-annabata";

export default function Home() {
  return <main className="overflow-hidden"><Header /><Hero /><FeatureBar /><WhyAnnabata /><HowItWorks /><Ecosystem /><RealImpact /><DemoCta /><Faq /><Footer /></main>;
}
