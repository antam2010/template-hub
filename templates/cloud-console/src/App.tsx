import { applyTheme } from "@cloudscape-design/components/theming";
import "@fontsource-variable/noto-sans-kr";
import { useState } from "react";
import Table from "@cloudscape-design/components/table";
import Header from "@cloudscape-design/components/header";
import Button from "@cloudscape-design/components/button";
import SpaceBetween from "@cloudscape-design/components/space-between";
import TextFilter from "@cloudscape-design/components/text-filter";
import StatusIndicator from "@cloudscape-design/components/status-indicator";
import Modal from "@cloudscape-design/components/modal";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import Select from "@cloudscape-design/components/select";
import Box from "@cloudscape-design/components/box";
import Flashbar from "@cloudscape-design/components/flashbar";
import BreadcrumbGroup from "@cloudscape-design/components/breadcrumb-group";
import Pagination from "@cloudscape-design/components/pagination";
// Use Cloudscape's supported typography token; never target generated CSS hashes.
applyTheme({
  theme: {
    tokens: {
      fontFamilyBase: '"Noto Sans KR Variable", "Open Sans", sans-serif',
    },
  },
});

interface Resource {
  id: string;
  name: string;
  type: string;
  region: string;
  state: "running" | "stopped";
}
const initial: Resource[] = Array.from({ length: 8 }, (_, i) => ({
  id: `i-0f8a2c${i + 1}`,
  name: [
    "api-production",
    "web-production",
    "worker-queue",
    "db-replica",
    "staging-api",
    "batch-daily",
    "monitoring",
    "dev-sandbox",
  ][i]!,
  type: i % 2 ? "t3.medium" : "t3.large",
  region: "ap-northeast-2",
  state: i % 3 === 2 ? "stopped" : "running",
}));
export default function CloudConsole() {
  const [resources, setResources] = useState(initial);
  const [selected, setSelected] = useState<Resource[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [kind, setKind] = useState({ label: "t3.medium", value: "t3.medium" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [ascending, setAscending] = useState(true);
  const filtered = resources
    .filter((r) =>
      `${r.name} ${r.id} ${r.state}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
    );
  const pages = Math.max(1, Math.ceil(filtered.length / 5));
  const current = Math.min(page, pages);
  function toggle() {
    const ids = new Set(selected.map((r) => r.id));
    setResources((prev) =>
      prev.map((r) =>
        ids.has(r.id)
          ? { ...r, state: r.state === "running" ? "stopped" : "running" }
          : r,
      ),
    );
    setSelected([]);
    setMessage("선택한 인스턴스의 상태를 변경했습니다.");
  }
  return (
    <main
      style={{
        fontFamily: '"Noto Sans KR Variable", sans-serif',
        maxWidth: 1300,
        margin: "auto",
        padding: 24,
      }}
    >
      <SpaceBetween size="l">
        <BreadcrumbGroup
          items={[
            { text: "Cloud Console", href: "#" },
            { text: "컴퓨팅", href: "#compute" },
            { text: "인스턴스", href: "#instances" },
          ]}
          ariaLabel="탐색 경로"
          onFollow={(e) => {
            e.preventDefault();
            setMessage(
              `${e.detail.text} 경로입니다. 이 데모에서는 인스턴스 화면을 제공합니다.`,
            );
          }}
        />
        <Header
          variant="h1"
          description="서울 리전의 컴퓨팅 리소스를 관리합니다. Mock 데이터는 새로고침하면 초기화됩니다."
        >
          리소스 관리
        </Header>
        {message && (
          <Flashbar
            items={[
              {
                type: "success",
                content: message,
                dismissible: true,
                onDismiss: () => setMessage(""),
                id: "action",
              },
            ]}
          />
        )}
        <Table<Resource>
          trackBy="id"
          selectionType="multi"
          selectedItems={selected}
          onSelectionChange={(e) => setSelected(e.detail.selectedItems)}
          ariaLabels={{
            selectionGroupLabel: "인스턴스 선택",
            itemSelectionLabel: (_, i) => `${i.name} 선택`,
            allItemsSelectionLabel: () => "모든 인스턴스 선택",
          }}
          items={filtered.slice((current - 1) * 5, current * 5)}
          columnDefinitions={[
            {
              id: "name",
              header: "인스턴스 이름",
              cell: (r) => r.name,
              sortingField: "name",
            },
            { id: "id", header: "인스턴스 ID", cell: (r) => r.id },
            {
              id: "state",
              header: "상태",
              cell: (r) => (
                <StatusIndicator
                  type={r.state === "running" ? "success" : "stopped"}
                >
                  {r.state === "running" ? "실행 중" : "중지됨"}
                </StatusIndicator>
              ),
            },
            { id: "type", header: "유형", cell: (r) => r.type },
            { id: "region", header: "리전", cell: (r) => r.region },
          ]}
          sortingColumn={{ sortingField: "name" }}
          sortingDescending={!ascending}
          onSortingChange={(e) => setAscending(!e.detail.isDescending)}
          header={
            <Header
              counter={`(${resources.length})`}
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button disabled={!selected.length} onClick={toggle}>
                    상태 전환
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setName("");
                      setError("");
                      setOpen(true);
                    }}
                  >
                    인스턴스 생성
                  </Button>
                </SpaceBetween>
              }
            >
              인스턴스
            </Header>
          }
          filter={
            <TextFilter
              filteringText={query}
              filteringPlaceholder="이름, ID, 상태 검색"
              filteringAriaLabel="인스턴스 검색"
              onChange={(e) => {
                setQuery(e.detail.filteringText);
                setPage(1);
                setSelected([]);
              }}
            />
          }
          pagination={
            <Pagination
              currentPageIndex={current}
              pagesCount={pages}
              onChange={(e) => {
                setPage(e.detail.currentPageIndex);
                setSelected([]);
              }}
              ariaLabels={{
                nextPageLabel: "다음 페이지",
                previousPageLabel: "이전 페이지",
                pageLabel: (n) => `${n} 페이지`,
              }}
            />
          }
          empty={
            <Box textAlign="center" padding="l">
              일치하는 인스턴스가 없습니다.
            </Box>
          }
        />
      </SpaceBetween>
      <Modal
        visible={open}
        onDismiss={() => setOpen(false)}
        header="인스턴스 생성"
        closeAriaLabel="닫기"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => setOpen(false)}>취소</Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (!name.trim()) {
                    setError("인스턴스 이름을 입력하세요.");
                    return;
                  }
                  setResources((prev) => [
                    {
                      id: `i-${Date.now().toString(16)}`,
                      name: name.trim(),
                      type: kind.value,
                      region: "ap-northeast-2",
                      state: "running",
                    },
                    ...prev,
                  ]);
                  setOpen(false);
                  setQuery("");
                  setPage(1);
                  setMessage("새 인스턴스를 생성했습니다.");
                }}
              >
                생성 확인
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <SpaceBetween size="m">
          <FormField label="인스턴스 이름" errorText={error}>
            <Input
              value={name}
              onChange={(e) => setName(e.detail.value)}
              placeholder="my-instance"
            />
          </FormField>
          <FormField label="인스턴스 유형">
            <Select
              selectedOption={kind}
              onChange={(e) =>
                setKind({
                  label: e.detail.selectedOption.label!,
                  value: e.detail.selectedOption.value!,
                })
              }
              options={[
                { label: "t3.medium", value: "t3.medium" },
                { label: "t3.large", value: "t3.large" },
              ]}
            />
          </FormField>
        </SpaceBetween>
      </Modal>
    </main>
  );
}
