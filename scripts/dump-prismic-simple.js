#!/usr/bin/env node
/**
 * Simple Prismic content dump using REST API
 * Run: node scripts/dump-prismic-simple.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dumpDir = path.join(__dirname, "../prismic-dump");

const repositoryName = "fietsmaatjes";
const accessToken = process.env.PRISMIC_ACCESS_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoibWFjaGluZTJtYWNoaW5lIiwiZGJpZCI6ImZpZXRzbWFhdGplcy1lOTg1YzE2ZS1iY2JkLTQyODMtOTc0Yy0yNDIxZTFjNDM2ZWJfNSIsImRhdGUiOjE3NjM0MTYzMDAsImRvbWFpbiI6ImZpZXRzbWFhdGplcyIsImFwcE5hbWUiOiJGaWV0c21hYXRqZXNBbXN0ZXJkYW1OaWV1d1Nsb3RlbiIsImlhdCI6MTc2MzQxNjMwMH0.-dCJXaWK-3PWBLVrMzkmgOHaSrDSXVsvUKTFb8Zx1R0";

async function dumpPrismicContent() {
  try {
    // Create dump directory if it doesn't exist
    if (!fs.existsSync(dumpDir)) {
      fs.mkdirSync(dumpDir, { recursive: true });
    }

    console.log(`📥 Fetching Prismic content from "${repositoryName}"...`);

    const allDocuments = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const url = `https://${repositoryName}.cdn.prismic.io/api/v2/documents?access_token=${accessToken}&pageSize=100&page=${page}`;
      
      console.log(`  📄 Fetching page ${page}...`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      allDocuments.push(...data.results);

      hasMore = page < data.total_pages;
      page++;
    }

    console.log(`✅ Found ${allDocuments.length} documents`);

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
      console.log(`  📄 ${type}: ${docs.length} documents`);
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
    console.log(`📊 Metadata:`, metadata);
  } catch (error) {
    console.error("❌ Error dumping Prismic content:", error.message);
    process.exit(1);
  }
}

dumpPrismicContent();
