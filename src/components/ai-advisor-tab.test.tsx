import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AiAdvisorTab, QUICK_QUESTIONS } from "@/components/ai-advisor-tab";
import { Company } from "@/types/company";

const { completeMock } = vi.hoisted(() => ({ completeMock: vi.fn() }));
vi.mock("@ai-sdk/react", () => ({ useCompletion: () => ({ complete: completeMock }) }));

const company: Company = {
  code: "1155",
  name: "Maybank",
  sector: "Financial Services",
  score: 82,
  trend: -3.2,
  riskLevel: "low",
  constructs: { bl_score: 88, sv_score: 85, ei_score: 82, rm_score: 80, rt_score: 72, se_score: 84, so_score: 83 },
  events: [{ date: "2026-08-10", title: "Board review", description: "Independent director review completed." }],
  interventions: [{ priority: "medium", title: "Enhance remuneration disclosure", explanation: "Publish peer benchmarking.", impact: "+1.5 pts", construct: "RT" }],
};

describe("AiAdvisorTab", () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    completeMock.mockReset();
    completeMock.mockResolvedValue("## Fast answer\n\n- Review the weakest construct.");
  });

  it.each(QUICK_QUESTIONS)("populates and focuses the input for %s", async (question) => {
    const user = userEvent.setup();
    render(<AiAdvisorTab company={company} />);
    await user.click(screen.getByRole("button", { name: question }));
    const input = screen.getByRole("textbox", { name: "Ask the Advisor" });
    expect(input).toHaveValue(question);
    expect(input).toHaveFocus();
    expect(screen.getByRole("button", { name: "Ask Advisor" })).toBeEnabled();
  });

  it("submits a typed question with Enter", async () => {
    const user = userEvent.setup();
    render(<AiAdvisorTab company={company} />);
    const input = screen.getByRole("textbox", { name: "Ask the Advisor" });
    await user.type(input, "Which risk control should we validate?");
    await user.keyboard("{Enter}");
    await waitFor(() => expect(completeMock).toHaveBeenCalledWith("Which risk control should we validate?", expect.objectContaining({ body: expect.objectContaining({ question: "Which risk control should we validate?", code: "1155" }) })));
  });

  it("shows loading and prevents duplicate submissions", async () => {
    const user = userEvent.setup();
    let resolveRequest: (value: string) => void = () => undefined;
    completeMock.mockReturnValue(new Promise<string>((resolve) => { resolveRequest = resolve; }));
    render(<AiAdvisorTab company={company} />);
    const input = screen.getByRole("textbox", { name: "Ask the Advisor" });
    await user.type(input, QUICK_QUESTIONS[0]);
    await user.click(screen.getByRole("button", { name: "Ask Advisor" }));
    expect(screen.getByRole("button", { name: "Advisor is responding" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Advisor is responding" }));
    expect(completeMock).toHaveBeenCalledTimes(1);
    resolveRequest("## Done");
    await waitFor(() => expect(screen.getByText("Done")).toBeInTheDocument());
  });

  it("shows useful local fallback guidance when the live request fails", async () => {
    const user = userEvent.setup();
    completeMock.mockRejectedValue(new Error("offline"));
    render(<AiAdvisorTab company={company} />);
    await user.click(screen.getByRole("button", { name: QUICK_QUESTIONS[0] }));
    await user.click(screen.getByRole("button", { name: "Ask Advisor" }));
    await waitFor(() => expect(screen.getAllByText(/Live Advisor is unavailable/).length).toBeGreaterThan(0));
    expect(screen.getByText(/Start with Remuneration Transparency/)).toBeInTheDocument();
    expect(screen.getByText(/Decision support only/)).toBeInTheDocument();
  });

  it("handles empty input by keeping Ask Advisor disabled", () => {
    render(<AiAdvisorTab company={company} />);
    expect(screen.getByRole("button", { name: "Ask Advisor" })).toBeDisabled();
    fireEvent.submit(screen.getByRole("textbox", { name: "Ask the Advisor" }).closest("form")!);
    expect(completeMock).not.toHaveBeenCalled();
  });
});
