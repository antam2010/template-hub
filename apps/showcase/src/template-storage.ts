import {
  isTemplateConfig,
  type TemplateConfig,
} from "../../../templates/workspace/src/model";
export interface SavedTemplate {
  id: string;
  name: string;
  config: TemplateConfig;
  updatedAt: string;
}
const key = "hub-saved-templates-v1";
export function savedTemplates(): SavedTemplate[] {
  try {
    const list: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    if (!Array.isArray(list)) return [];
    return list.filter(
      (v): v is SavedTemplate =>
        !!v &&
        typeof v === "object" &&
        typeof v.id === "string" &&
        typeof v.name === "string" &&
        typeof v.updatedAt === "string" &&
        isTemplateConfig(v.config),
    );
  } catch {
    return [];
  }
}
export function storeTemplate(config: TemplateConfig, id?: string) {
  const value: SavedTemplate = {
    id:
      id ??
      `template-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name: config.title.trim() || "나의 템플릿",
    config,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(
    key,
    JSON.stringify([
      value,
      ...savedTemplates().filter((v) => v.id !== value.id),
    ]),
  );
  return value;
}
export function removeTemplate(id: string) {
  localStorage.setItem(
    key,
    JSON.stringify(savedTemplates().filter((v) => v.id !== id)),
  );
}
