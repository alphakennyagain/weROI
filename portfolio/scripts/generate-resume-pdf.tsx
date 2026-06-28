import React from "react";
import { renderToFile } from "@react-pdf/renderer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ResumePdfDocument from "../components/ResumePdfDocument";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, "../public/resume.pdf");

async function main() {
  await renderToFile(React.createElement(ResumePdfDocument), outputPath);
  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
