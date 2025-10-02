import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpendingChart } from "./SpendingChart";

describe("SpendingChart", () => {
  it("should render no data message when data is empty", () => {
    render(<SpendingChart data={[]} />);
    expect(screen.getByText("데이터가 없습니다")).toBeInTheDocument();
  });

  it("should render ResponsiveContainer when data is provided", () => {
    const data = [
      { name: "식비", value: 300000 },
      { name: "교통", value: 100000 },
    ];
    const { container } = render(<SpendingChart data={data} />);

    // Recharts는 jsdom에서 완전히 렌더링되지 않지만, 컴포넌트가 에러 없이 렌더링되는지 확인
    expect(container.firstChild).toBeTruthy();
    expect(screen.queryByText("데이터가 없습니다")).not.toBeInTheDocument();
  });
});
