import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { AiAdvisorTab, QUICK_QUESTIONS } from "@/components/ai-advisor-tab";
import { Company } from "@/types/company";

const company: Company = {
  code: "1155", name: "Maybank", sector: "Financial Services", score: 82, trend: -3.2, riskLevel: "low",
  constructs: { bl_score: 88, sv_score: 85, ei_score: 82, rm_score: 80, rt_score: 72, se_score: 84, so_score: 83 },
  events: [{ date: "2026-08-10", title: "Board review", description: "Independent director review completed." }],
  interventions: [{ priority: "medium", title: "Enhance remuneration disclosure", explanation: "Publish peer benchmarking.", impact: "+1.5 pts", construct: "RT" }],
};

describe("AiAdvisorTab", () => {
  afterEach(() => cleanup());
  it.each(QUICK_QUESTIONS)("populates and focuses the input for %s", async (question) => {
    const user = userEvent.setup(); render(<AiAdvisorTab company={company} />);
    await user.click(screen.getByRole("button", { name: question }));
    const input = screen.getByRole("textbox", { name: "Ask the Advisor" });
    expect(input).toHaveValue(question); expect(input).toHaveFocus(); expect(screen.getByRole("button", { name: "Ask Advisor" })).toBeEnabled();
  });
  it("submits a typed question with Enter and shows local guidance", async () => {
    const user = userEvent.setup(); render(<AiAdvisorTab company={company} />);
    const input = screen.getByRole("textbox", { name: "Ask the Advisor" });
    await user.type(input, "Which risk control should we validate?"); await user.keyboard("{Enter}");
    expect(await screen.findByText("A focused governance starting point")).toBeInTheDocument();
    expect(screen.getAllByText(/Instant local guidance/).length).toBeGreaterThan(0);
  });
  it("returns immediately and prevents rapid duplicate submissions", async () => {
    const user = userEvent.setup(); render(<AiAdvisorTab company={company} />);
    const input = screen.getByRole("textbox", { name: "Ask the Advisor" });
    await user.type(input, QUICK_QUESTIONS[0]);
    const form = input.closest("form")!; fireEvent.submit(form); fireEvent.submit(form);
    expect(screen.getAllByText(/Start with/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Instant local guidance/).length).toBeGreaterThan(0);
  });
  it("provides fallback guidance for the attention question", async () => {
    const user = userEvent.setup(); render(<AiAdvisorTab company={company} />);
    await user.click(screen.getByRole("button", { name: QUICK_QUESTIONS[0] })); await user.click(screen.getByRole("button", { name: "Ask Advisor" }));
    expect(screen.getByText(/Start with Remuneration Transparency/)).toBeInTheDocument(); expect(screen.getByText(/Decision support only/)).toBeInTheDocument();
  });
  it("handles empty input by keeping Ask Advisor disabled", () => {
    render(<AiAdvisorTab company={company} />); expect(screen.getByRole("button", { name: "Ask Advisor" })).toBeDisabled();
    fireEvent.submit(screen.getByRole("textbox", { name: "Ask the Advisor" }).closest("form")!);
    expect(screen.queryByText(/A focused governance starting point/)).not.toBeInTheDocument();
  });
});
