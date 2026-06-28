import type { CaseStudy } from "../types";
import { pntcogCaseStudy } from "./pntcog";
import { weroiCaseStudy } from "./weroi";
import { studysyncApiCaseStudy } from "./studysync-api";
import { webhookRelayApiCaseStudy } from "./webhook-relay-api";
import { openapiDevkitCaseStudy } from "./openapi-devkit";
import { phoneStoreApiCaseStudy } from "./phone-store-api";

export const caseStudiesBySlug: Record<string, CaseStudy> = {
  pntcog: pntcogCaseStudy,
  weroi: weroiCaseStudy,
  "studysync-api": studysyncApiCaseStudy,
  "webhook-relay-api": webhookRelayApiCaseStudy,
  "openapi-devkit": openapiDevkitCaseStudy,
  "phone-store-api": phoneStoreApiCaseStudy,
};

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudiesBySlug[slug];
}
