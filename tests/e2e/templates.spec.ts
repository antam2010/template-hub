import { test, expect } from "@playwright/test";
test("choose complete template, apply composition and save selected configuration", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".picker-card")).toHaveCount(12);
  await page.getByRole("textbox", { name: "완성형 템플릿 검색" }).fill("회원");
  await page
    .getByRole("link", { name: "회원·권한 관리 템플릿 구성하기" })
    .click();
  await page.getByRole("button", { name: /부드러운 카드형/ }).click();
  const preview = page.frameLocator("iframe");
  await expect(preview.locator(".wt-cards")).toBeVisible();
  await page.getByRole("button", { name: "상단 메뉴", exact: true }).click();
  await expect(preview.locator(".workspace-template")).toHaveClass(
    /wt-layout-topbar/,
  );
  await page.getByRole("button", { name: "내 템플릿으로 저장" }).click();
  await page.getByRole("link", { name: "내 템플릿", exact: true }).click();
  await expect(page.locator(".picker-card")).toHaveCount(1);
  await page.getByRole("link", { name: "이어서 수정" }).click();
  await expect(
    page.frameLocator("iframe").locator(".workspace-template"),
  ).toHaveClass(/wt-layout-topbar/);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "이 구성 가져가기" }).click();
  await page.getByRole("button", { name: "프로젝트 ZIP 다운로드" }).click();
  expect((await download).suggestedFilename()).toBe("my-workspace.zip");
});
test("workspace mock CRUD and board actions operate", async ({ page }) => {
  await page.goto("/workspace.html?template=members");
  await page.getByRole("button", { name: "새 항목 등록" }).click();
  await page
    .getByRole("textbox", { name: "이름", exact: true })
    .fill("E2E 사용자");
  await page
    .getByRole("textbox", { name: "이메일", exact: true })
    .fill("test@example.com");
  await page.getByRole("textbox", { name: "역할", exact: true }).fill("멤버");
  await page.getByRole("button", { name: "저장", exact: true }).click();
  await page.getByRole("textbox", { name: "항목 검색" }).fill("E2E 사용자");
  await expect(page.getByRole("cell", { name: /E2E 사용자$/ })).toBeVisible();
  await page.goto("/workspace.html?template=tasks");
  await page
    .getByRole("button", { name: "다음 단계", exact: true })
    .first()
    .click();
  await expect(page.getByRole("status")).toContainText("→ 진행 중");
});
