import { test, expect } from "@playwright/test";
test("gallery filters, detail responsive preview and theme persist", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".template-card")).toHaveCount(3);
  await page.getByRole("textbox", { name: "템플릿 검색" }).fill("Cloudscape");
  await expect(page.locator(".template-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Cloud Console 미리보기" }).click();
  await page.getByRole("link", { name: "상세 및 반응형 미리보기" }).click();
  await expect(
    page.getByRole("heading", { name: "Cloud Console", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "모바일", exact: true }).click();
  await expect(page.locator("iframe")).toHaveCSS("width", /px/);
  await page.getByRole("button", { name: "다크 모드로 전환" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveClass("dark");
  await expect(page.locator("iframe")).toHaveAttribute("src", /theme=dark/);
});
test("props update preview and Modal supports keyboard close", async ({
  page,
}) => {
  await page.goto("/components");
  await page
    .getByRole("textbox", { name: "레이블", exact: true })
    .fill("내 버튼");
  await expect(
    page.locator(".demo-stage").getByRole("button", { name: "내 버튼" }),
  ).toBeVisible();
  await page.getByRole("checkbox", { name: "Disabled" }).click();
  await expect(page.locator(".demo-stage").getByRole("button")).toBeDisabled();
  await page.getByRole("checkbox", { name: "Disabled" }).click();
  await page.getByRole("button", { name: "Modal", exact: true }).click();
  await page
    .locator(".demo-stage")
    .getByRole("button", { name: "내 버튼" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
test("CMS create, edit, search, delete and CSV", async ({ page }) => {
  await page.goto("/admin-cms.html");
  await page.getByRole("button", { name: "콘텐츠 등록" }).click();
  await page
    .getByRole("textbox", { name: "제목", exact: true })
    .fill("E2E 콘텐츠");
  await page.getByRole("button", { name: "저장", exact: true }).click();
  await page.getByRole("textbox", { name: "콘텐츠 검색" }).fill("E2E");
  await expect(
    page.getByRole("cell", { name: "E2E 콘텐츠", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "E2E 콘텐츠 수정" }).click();
  await page
    .getByRole("textbox", { name: "제목", exact: true })
    .fill("E2E 수정");
  await page.getByRole("button", { name: "저장", exact: true }).click();
  await expect(
    page.getByRole("cell", { name: "E2E 수정", exact: true }),
  ).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "CSV 내보내기" }).click();
  expect((await download).suggestedFilename()).toBe("contents.csv");
  await page.getByRole("button", { name: "E2E 수정 삭제" }).click();
  await page.getByRole("button", { name: "삭제 확인" }).click();
  await expect(page.getByText("검색 결과가 없습니다.")).toBeVisible();
});
test("Cloudscape creates, filters and changes instance state", async ({
  page,
}) => {
  await page.goto("/cloud-console.html");
  await page
    .getByRole("button", { name: "인스턴스 생성", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "인스턴스 이름", exact: true })
    .fill("test-server");
  await page.getByRole("button", { name: "생성 확인" }).click();
  await page
    .getByRole("searchbox", { name: "인스턴스 검색" })
    .fill("test-server");
  await expect(
    page.getByRole("cell", { name: "test-server", exact: true }),
  ).toBeVisible();
  await page.getByRole("checkbox", { name: "test-server 선택" }).check();
  await page.getByRole("button", { name: "상태 전환" }).click();
  await expect(page.getByText("중지됨", { exact: true })).toBeVisible();
});
test("analytics filters recalculate KPI", async ({ page }) => {
  await page.goto("/analytics.html");
  const before = await page.getByTestId("kpi-총 매출").textContent();
  await page
    .getByRole("combobox", { name: "분석 기간" })
    .selectOption("최근 30일");
  expect(await page.getByTestId("kpi-총 매출").textContent()).not.toBe(before);
  await page.getByRole("combobox", { name: "유입 채널" }).selectOption("검색");
  await expect(
    page.getByText("최근 30일 · 검색 채널 · 단위: 만 원"),
  ).toBeVisible();
});
test("generator downloads zip and validates unsafe names", async ({ page }) => {
  await page.goto("/generator");
  await page.getByRole("textbox", { name: "프로젝트 이름" }).fill("../escape");
  await page.getByRole("button", { name: "프로젝트 ZIP 다운로드" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "영문 소문자로 시작" }),
  ).toBeVisible();
  await page.getByRole("textbox", { name: "프로젝트 이름" }).fill("test-app");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "프로젝트 ZIP 다운로드" }).click();
  expect((await download).suggestedFilename()).toBe("test-app.zip");
  await expect(page.getByRole("status")).toContainText(
    "ZIP 파일을 생성했습니다.",
  );
});
test("file upload displays selection and no layout overflow", async ({
  page,
}) => {
  await page.goto("/components");
  await page.getByRole("button", { name: "FileUpload", exact: true }).click();
  await page.locator("input[type=file]").setInputFiles({
    name: "sample.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("demo"),
  });
  await expect(page.getByText("sample.txt", { exact: true })).toBeVisible();
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
