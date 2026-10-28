import { describe, it, expect } from "vitest";
import {
  filterContent,
  initialContent,
  chartPoints,
} from "../packages/patterns/src/index";
describe("CMS filtering", () => {
  it("combines case insensitive query and state", () => {
    expect(
      filterContent(initialContent, "업데이트", "게시").map((i) => i.id),
    ).toEqual([2]);
    expect(filterContent(initialContent, "업데이트", "초안")).toEqual([]);
  });
  it("preserves initial records and supports empty result", () => {
    expect(filterContent(initialContent, "없는 내용", "전체")).toEqual([]);
    expect(initialContent).toHaveLength(6);
  });
});
it("chart scaling remains finite for empty, zero and one-point series", () => {
  expect(chartPoints([])).toBe("");
  expect(chartPoints([0])).not.toMatch(/NaN|Infinity/);
  expect(chartPoints([100])).toBe("20,20");
});
