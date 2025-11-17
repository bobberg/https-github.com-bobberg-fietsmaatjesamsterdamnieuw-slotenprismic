#!/usr/bin/env node
/**
 * Dump all Prismic content to JSON files
 */

import * as prismic from "@prismicio/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dumpDir = path.join(__dirname, "../prismic-dump");

const repositoryName = "fietsmaatjes";
const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoibWFjaGluZTJtYWNoaW5lIiwiZGJpZCI6ImZpZXRzbWFhdGplcy1lOTg1YzE2ZS1iY2JkLTQyODMtOTc0Yy0yNDIxZTFjNDM2ZWJfNSIsImRhdGUiOjE3NjM0MTYzMDAsImRvbWFpbiI6ImZpZXRzbWFhdGplcyIsImFwcE5hbWUiOiJGaWV0c21hYXRqZXNBbXN0ZXJkYW1OaWV1d1Nsb3RlbiIsImlhdCI6MTc2MzQxNjMwMH0.-dCJXaWK-3PWBLVrMzkmgOHaSrDSXVsvUKTFb8Zx1R0";

async function dumpPrismicContent() {
  try {
    if (!fs.existsSync(dumpDir)) {
      fs.mkdirSync(dumpDir, { recursive: true });
    }

    console.log(`📥 Fetching Prismic content from "${repositoryName}"...`);

    const client = prismic.createClient(repositoryName, {
      accessToken,
      fetch,
    });

    // Fetch all documents
    const allDocuments = await client.dangerouslyGetAll();

    console.log(`✅ Found ${allDocuments.length} documents\n`);

    // Save all documents
    fs.writeFileSync(
      path.join(dumpDir, "all-documents.json"),
      JSON.stringify(allDocuments, null, 2)
    );

    // Organize by document type
    const byType = {};
    allDocuments.forEach((doc) => {
      if (!byType[doc.type]) {
        byType[doc.type] = [];
      }
      byType[doc.type].push(doc);
    });

    // Save by type
    Object.entries(byType).forEach(([type, docs]) => {
      fs.writeFileSync(
        path.join(dumpDir, `${type}.json`),
        JSON.stringify(docs, null, 2)
      );
      console.log(`  📄 ${type}.json: ${docs.length} documents`);
    });

    // Save metadata
    const metadata = {
      dumped: new Date().toISOString(),
      repository: repositoryName,
      totalDocuments: allDocuments.length,
      documentTypes: Object.keys(byType),
      documentCounts: Object.fromEntries(
        Object.entries(byType).map(([type, docs]) => [type, docs.length])
      ),
    };

    fs.writeFileSync(
      path.join(dumpDir, "metadata.json"),
      JSON.stringify(metadata, null, 2)
    );

    console.log(`\n✨ Content dumped to: ${dumpDir}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

dumpPrismicContent();
