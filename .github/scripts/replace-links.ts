#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import { findMatchingFiles } from './utils';

/**
 * Replace all occurrences of provided links with localised version in the given content
 */
function replaceLinks(content: string, oldUrl: string, newUrl: string): string {
  return content.replace(new RegExp(oldUrl, 'g'), newUrl);
}

/**
 * Process a single OpenAPI file
 */
function processFile(filePath: string, oldUrl: string, newUrl: string): void {
  try {
    console.log(`Processing: ${filePath}`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`  ❌ Error: File not found: ${filePath}`);
      process.exit(1);
    }

    // Read the file
    const content = fs.readFileSync(filePath, 'utf-8');

    // Verify it's valid JSON
    try {
      JSON.parse(content);
    } catch (e) {
      console.error(`  ❌ Error: Invalid JSON in file: ${filePath}`);
      console.error(`  ${(e as Error).message}`);
      process.exit(1);
    }

    // Count occurrences before replacement
    const matches = content.match(new RegExp(oldUrl, 'g'));
    const count = matches ? matches.length : 0;

    if (count === 0) {
      console.log(`  ℹ️  No links to replace in ${filePath}`);
      return;
    }

    // Replace links
    const updatedContent = replaceLinks(content, oldUrl, newUrl);

    // Write back to file
    fs.writeFileSync(filePath, updatedContent, 'utf-8');

    console.log(`  ✅ Replaced ${count} occurrence(s) in ${filePath}`);
  } catch (e) {
    console.error(`  ❌ Error processing ${filePath}:`, (e as Error).message);
    process.exit(1);
  }
}

/**
 * Main execution
 */
export function main(): number {
  // Get command line arguments
  const args = process.argv.slice(2);

  if (args.length < 4) {
    console.error('❌ Error: Missing required arguments');
    console.error('');
    console.error('Usage: cd .github/scripts && npm run replace-links -- <directory> <pattern> <old_url> <new_url>');
    console.error('');
    console.error('Arguments:');
    console.error('  <directory>  - Path to directory containing JSON files');
    console.error('  <pattern>    - Regex pattern to match filenames');
    console.error('  <old_url>    - URL to replace');
    console.error('  <new_url>    - Replacement URL');
    console.error('');
    console.error('Examples:');
    console.error('  cd .github/scripts && npm run replace-links -- "openapi" "openapi.*\\.json" "https://developer.box.com" "https://ja.developer.box.com"');
    return 1;
  }

  const directoryPath = args[0];
  const pattern = args[1];
  const oldUrl = args[2];
  const newUrl = args[3];

  console.log(`Replacing "${oldUrl}" with "${newUrl}"`);
  console.log(`Searching in directory: ${directoryPath}`);
  console.log(`Pattern: ${pattern}\n`);

  // Find matching files
  const filePaths = findMatchingFiles(directoryPath, pattern);

  if (filePaths.length === 0) {
    console.log('⚠️  No files found matching the pattern');
    return 0;
  }

  console.log(`Found ${filePaths.length} matching file(s):\n`);
  filePaths.forEach(file => console.log(`  - ${file}`));
  console.log('');

  // Process each file
  for (const filePath of filePaths) {
    processFile(filePath, oldUrl, newUrl);
  }

  console.log('\n✅ All files processed successfully!');
  return 0;
}

// Run if executed directly
if (require.main === module) {
  const exitCode = main();
  process.exit(exitCode);
}

