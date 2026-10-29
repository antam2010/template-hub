import { test, expect } from "@playwright/test";
test("company kit composes approved member controls", async ({ page }) => {
  await page.goto("/company-kit");
  const region = page.getByRole("region", { name: "회원 관리", exact: true });
  await region.getByRole("button", { name: "등록", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "회원 등록" });
  await dialog.getByLabel("이름", { exact: true }).fill("표준 회원");
  await dialog
    .getByLabel("이메일", { exact: true })
    .fill("standard@example.com");
  await dialog.getByRole("button", { name: "저장", exact: true }).click();
  await region
    .getByRole("textbox", { name: "검색", exact: true })
    .fill("standard@example.com");
  await expect(
    region.getByRole("cell", { name: "표준 회원", exact: true }),
  ).toBeVisible();
  await expect(region.getByText("1 / 1", { exact: true })).toBeVisible();
  await region.getByRole("button", { name: "수정", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByLabel("이름", { exact: true })
    .fill("수정한 회원");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "저장", exact: true })
    .click();
  await expect(
    region.getByRole("cell", { name: "수정한 회원", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "공통 컴포넌트 검색" })
    .fill("FormDialog");
  await expect(
    page.getByRole("button", { name: "FormDialog", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "시작 프로젝트 ZIP 다운로드 ↗" }),
  ).toHaveAttribute("href", "/distribution/company-members.zip");
});
