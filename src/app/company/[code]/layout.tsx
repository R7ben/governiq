import type { Metadata } from "next";
import companiesData from "@/data/companies.json";
import { Company } from "@/types/company";
import { weakestConstruct } from "@/lib/scoring";

const companies = companiesData as Company[];

export async function generateMetadata({ params }: { params: { code: string } }): Promise<Metadata> {
  const company = companies.find((item) => item.code === params.code);
  if (!company) return { title: "Company Profile | GovernIQ" };
  return {
    title: `${company.name} Governance Profile | GovernIQ`,
    description: `${company.name} scores ${company.score}/100 on the GovernIQ seven-construct governance benchmark. Weakest area: ${weakestConstruct(company.constructs).label}.`,
  };
}

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
