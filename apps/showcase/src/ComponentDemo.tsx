import { useState } from "react";
import {
  Button,
  Input,
  Select,
  Checkbox,
  Modal,
  Tabs,
  Pagination,
  Badge,
  Loading,
  Card,
  Alert,
  FileUpload,
  Toast,
  Table,
  Search,
  Filter,
  Sidebar,
  Navbar,
  Breadcrumb,
  Chart,
  Form,
} from "@hub/ui-core";
import { chartPoints, type ComponentName } from "@hub/patterns";
export interface DemoProps {
  name: ComponentName;
  label: string;
  variant: "default" | "outline" | "ghost" | "destructive";
  size: "sm" | "default" | "lg";
  disabled: boolean;
  loading: boolean;
}
export function demoCode(p: DemoProps) {
  const label = JSON.stringify(p.label);
  let state = "";
  let jsx = "";
  switch (p.name) {
    case "Button":
      jsx = `<Button variant="${p.variant}" size="${p.size}" disabled={${p.disabled}} loading={${p.loading}} onClick={() => alert('클릭했습니다.')}>{${label}}</Button>`;
      break;
    case "Input":
      state = "const [value,setValue]=useState('');";
      jsx = `<Input aria-label={${label}} placeholder={${label}} disabled={${p.disabled}} value={value} onChange={e=>setValue(e.target.value)}/>`;
      break;
    case "Select":
      jsx = `<Select aria-label={${label}} options={['개발','디자인','운영']} disabled={${p.disabled}}/>`;
      break;
    case "Checkbox":
      state = "const [checked,setChecked]=useState(false);";
      jsx = `<Checkbox label={${label}} checked={checked} onCheckedChange={setChecked} disabled={${p.disabled}}/>`;
      break;
    case "Modal":
      state = "const [open,setOpen]=useState(false);";
      jsx = `<><Button disabled={${p.disabled}} onClick={()=>setOpen(true)}>{${label}}</Button><Modal open={open} onOpenChange={setOpen} title={${label}}><p>모달 콘텐츠</p></Modal></>`;
      break;
    case "Table":
      jsx = `<Table rows={[{id:1,name:'UI 구현',status:'진행 중'}]} getKey={row=>row.id} columns={[{key:'name',header:'작업',cell:row=>row.name},{key:'status',header:'상태',cell:row=>row.status}]}/>`;
      break;
    case "Pagination":
      state = "const [page,setPage]=useState(1);";
      jsx = "<Pagination page={page} total={5} onChange={setPage}/>";
      break;
    case "Filter":
      state = "const [value,setValue]=useState('전체');";
      jsx =
        "<Filter value={value} options={['전체','개발','디자인']} onChange={setValue}/ >";
      break;
    case "Search":
      state = "const [value,setValue]=useState('');";
      jsx =
        '<Search value={value} onChange={setValue} placeholder="작업 검색…"/>';
      break;
    case "Sidebar":
    case "Navbar":
      state = "const [active,setActive]=useState('개요');";
      jsx = `<${p.name} items={['개요','프로젝트','설정']} active={active} onChange={setActive}/>`;
      break;
    case "Breadcrumb":
      state = "const [message,setMessage]=useState('');";
      jsx =
        '<><Breadcrumb items={["홈","프로젝트","설정"]} onNavigate={index=>setMessage(`${index+1}번째 경로 선택`)}/><p aria-live="polite">{message}</p></>';
      break;
    case "Tabs":
      jsx =
        "<Tabs items={[{label:'개요',content:<p>프로젝트 개요</p>},{label:'코드',content:<code>export default App;</code>}]}/ >";
      break;
    case "Toast":
      state = "const [message,setMessage]=useState('');";
      jsx = `<><Button onClick={()=>setMessage(${label})}>알림 표시</Button><Toast message={message} onClose={()=>setMessage('')}/></>`;
      break;
    case "Alert":
    case "Badge":
      jsx = `<${p.name}>{${label}}</${p.name}>`;
      break;
    case "Loading":
      jsx = "<Loading/>";
      break;
    case "Card":
      jsx = `<Card title={${label}}><p>재사용할 수 있는 콘텐츠 영역입니다.</p></Card>`;
      break;
    case "Chart":
      jsx = '<Chart values={[30,10,60,40,80]} label="샘플 추이"/>';
      break;
    case "Form":
      jsx = `<Form disabled={${p.disabled}} loading={${p.loading}} onSave={value=>alert(value)}/>`;
      break;
    case "FileUpload":
      jsx = `<FileUpload disabled={${p.disabled}}/>`;
      break;
  }
  return `import { useState } from 'react';\nimport { ${p.name}${p.name === "Modal" || p.name === "Toast" ? ", Button" : ""} } from '@hub/ui-core';\n\nexport default function Example(){\n  ${state}\n  return (${jsx});\n}`;
}
export default function ComponentDemo(p: DemoProps) {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState("개요");
  const sample = [
    "API 연결하기",
    "컴포넌트 구성하기",
    "프로젝트 빌드하기",
  ].filter((s) => s.includes(value));
  const action = () => setMessage("버튼을 클릭했습니다.");
  let demo: React.ReactNode;
  switch (p.name) {
    case "Button":
      demo = (
        <Button
          variant={p.variant}
          size={p.size}
          disabled={p.disabled}
          loading={p.loading}
          onClick={action}
        >
          {p.label}
        </Button>
      );
      break;
    case "Input":
      demo = (
        <div className="stack w-full max-w-sm">
          <Input
            aria-label={p.label}
            placeholder={p.label}
            value={value}
            disabled={p.disabled}
            onChange={(e) => setValue(e.target.value)}
          />
          <small aria-live="polite">입력 값: {value || "없음"}</small>
        </div>
      );
      break;
    case "Select":
      demo = (
        <Select
          aria-label={p.label}
          options={["개발", "디자인", "운영"]}
          disabled={p.disabled}
        />
      );
      break;
    case "Checkbox":
      demo = (
        <Checkbox
          label={p.label}
          checked={checked}
          onCheckedChange={setChecked}
          disabled={p.disabled}
        />
      );
      break;
    case "Modal":
      demo = (
        <>
          <Button disabled={p.disabled} onClick={() => setOpen(true)}>
            {p.label}
          </Button>
          <Modal open={open} onOpenChange={setOpen} title={p.label}>
            <p>모달 콘텐츠</p>
          </Modal>
        </>
      );
      break;
    case "Table":
      demo = (
        <Table
          rows={["설계 검토", "UI 구현", "테스트"].map((title, id) => ({
            id,
            title,
          }))}
          getKey={(row) => row.id}
          columns={[
            { key: "title", header: "작업", cell: (row) => row.title },
            {
              key: "status",
              header: "상태",
              cell: (row) => (
                <button
                  className="badge"
                  onClick={() => setTab(tab === row.title ? "완료" : row.title)}
                  disabled={p.disabled}
                >
                  {tab === row.title ? "완료" : "진행 중"} · 전환
                </button>
              ),
            },
          ]}
        />
      );
      break;
    case "Pagination":
      demo = <Pagination page={page} total={5} onChange={setPage} />;
      break;
    case "Filter":
      demo = (
        <div className="stack">
          <Filter
            value={value || "전체"}
            options={["전체", "개발", "디자인"]}
            onChange={setValue}
          />
          <p className="text-sm">
            표시 결과: {!value || value === "전체" ? "개발 · 디자인" : value}
          </p>
        </div>
      );
      break;
    case "Search":
      demo = (
        <div className="stack">
          <Search value={value} onChange={setValue} placeholder="작업 검색…" />
          <ul className="text-sm">
            {sample.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          {!sample.length && <small>검색 결과 없음</small>}
        </div>
      );
      break;
    case "Sidebar":
    case "Navbar": {
      const Nav = p.name === "Sidebar" ? Sidebar : Navbar;
      demo = (
        <div className="stack">
          <Nav
            items={["개요", "프로젝트", "설정"]}
            active={tab}
            onChange={setTab}
          />
          <p aria-live="polite">{tab} 화면</p>
        </div>
      );
      break;
    }
    case "Breadcrumb":
      demo = (
        <div className="stack">
          <Breadcrumb
            items={["홈", "프로젝트", "설정"]}
            onNavigate={(i) => setMessage(`${i + 1}번째 경로를 선택했습니다.`)}
          />
        </div>
      );
      break;
    case "Tabs":
      demo = (
        <Tabs
          items={[
            { label: "개요", content: <p>프로젝트 개요입니다.</p> },
            { label: "코드", content: <pre>export default App;</pre> },
          ]}
        />
      );
      break;
    case "Toast":
      demo = (
        <Button disabled={p.disabled} onClick={() => setMessage(p.label)}>
          알림 표시
        </Button>
      );
      break;
    case "Alert":
      demo = <Alert>{p.label}</Alert>;
      break;
    case "Badge":
      demo = <Badge>{p.label}</Badge>;
      break;
    case "Loading":
      demo = <Loading />;
      break;
    case "Card":
      demo = (
        <Card title={p.label}>
          <p className="text-sm muted">재사용할 수 있는 콘텐츠 영역입니다.</p>
        </Card>
      );
      break;
    case "Chart":
      demo = (
        <div className="w-full text-primary">
          <label className="row text-foreground text-sm">
            데이터 세트
            <Select
              aria-label="차트 데이터 세트"
              options={["주간", "월간"]}
              value={value || "주간"}
              onChange={(e) => setValue(e.target.value)}
            />
          </label>
          <Chart
            values={
              value === "월간" ? [50, 70, 20, 90, 120] : [30, 10, 60, 40, 80]
            }
            label="샘플 추이"
          />
        </div>
      );
      break;
    case "Form":
      demo = (
        <Form
          disabled={p.disabled}
          loading={p.loading}
          onSave={(v) => setMessage(`${v} 이름으로 저장했습니다.`)}
        />
      );
      break;
    case "FileUpload":
      demo = <FileUpload disabled={p.disabled} />;
      break;
  }
  return (
    <>
      <div className="demo-stage">{demo}</div>
      <Toast message={message} onClose={() => setMessage("")} />
    </>
  );
}
