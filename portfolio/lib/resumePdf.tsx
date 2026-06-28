import React from "react";
import { pdf } from "@react-pdf/renderer";
import ResumePdfDocument from "@/components/ResumePdfDocument";

export const PDF_FILENAME = "Zachary_Hutton_Resume.pdf";

/** Generates resume PDF with clickable link annotations via @react-pdf/renderer. */
export async function downloadResumePdf(filename = PDF_FILENAME): Promise<void> {
  const blob = await pdf(<ResumePdfDocument />).toBlob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
