#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import { findMatchingFiles } from './utils';

const replaceValuesForKey = (content: any, key: string, oldValue: string, newValue: string): { result: any, count: number } => {
  if (typeof content !== 'object' || content === null) {
    return { result: content, count: 0 }
  }

  if (Array.isArray(content)) {
    const { result, count } = content.reduce((acc, item) => {
      const { result: itemResult, count: itemCount } = replaceValuesForKey(item, key, oldValue, newValue)
      return {
        result: [...acc.result, itemResult],
        count: acc.count + itemCount
      }
    }, { result: [] as any[], count: 0 })
    return { result, count }
  }

  let regex = new RegExp(oldValue, 'g');
  let totalCount = 0;

  const result = Object.keys(content).reduce((acc, objKey) => {
    const value = content[objKey]
    if ((objKey === key) && typeof value === 'string') {
      const matches = value.match(regex);
      const count = matches ? matches.length : 0;
      totalCount += count;
      acc[objKey] = value.replace(regex, newValue)
    } else if (typeof value === 'object' && value !== null) {
      const { result: nestedResult, count } = replaceValuesForKey(value, key, oldValue, newValue)
      totalCount += count;
      acc[objKey] = nestedResult
    } else {
      acc[objKey] = value
    }
    return acc
  }, {} as Record<string, any>)

  return { result, count: totalCount }
}

/**
 * Replace all occurrences of provided links with localised version in the given content
 */
function replaceLinks(content: string, oldUrl: string, newUrl: string): { content: string, count: number } {
  let parsed = JSON.parse(content);
  let { result: updated, count } = replaceValuesForKey(parsed, 'description', oldUrl, newUrl)
  return { content: JSON.stringify(updated, null, 2), count }
}

/**
 * Process a single OpenAPI file
 */
function processFile(filePath: string, oldUrl: string, newUrl: string, outputPath?: string): void {
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

    // Replace links and get the actual count
    const { content: updatedContent, count } = replaceLinks(content, oldUrl, newUrl);

    if (count === 0) {
      console.log(`  ℹ️  No links to replace in ${filePath}`);
      return;
    }

    // Determine output file path
    let outputFilePath: string;
    if (outputPath) {
      // If output path is provided, save files there
      const fileName = path.basename(filePath);

      // Ensure output directory exists
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }

      outputFilePath = path.join(outputPath, fileName);
      console.log(`  ✅ Replaced ${count} occurrence(s), saved to ${outputFilePath}`);
    } else {
      // Otherwise, save in place
      outputFilePath = filePath;
      console.log(`  ✅ Replaced ${count} occurrence(s) in ${filePath}`);
    }

    // Write to file
    fs.writeFileSync(outputFilePath, updatedContent, 'utf-8');
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
    console.error('Usage: cd .github/scripts && npm run replace-links -- <directory> <pattern> <old_url> <new_url> [output]');
    console.error('');
    console.error('Arguments:');
    console.error('  <directory>  - Path to directory containing JSON files');
    console.error('  <pattern>    - Regex pattern to match filenames');
    console.error('  <old_url>    - URL to replace');
    console.error('  <new_url>    - Replacement URL');
    console.error('  [output]     - Optional output directory (if not provided, files are saved in place)');
    console.error('');
    console.error('Examples:');
    console.error('  cd .github/scripts && npm run replace-links -- "../../openapi" "openapi.*\\.json" "https://developer.box.com" "https://ja.developer.box.com"');
    console.error('  cd .github/scripts && npm run replace-links -- "../../openapi" "openapi.*\\.json" "https://developer.box.com" "https://ja.developer.box.com" "output"');
    return 1;
  }

  const directoryPath = args[0];
  const pattern = args[1];
  const oldUrl = args[2];
  const newUrl = args[3];
  const outputPath = args[4]; // Optional fifth argument

  console.log(`Replacing "${oldUrl}" with "${newUrl}"`);
  console.log(`Searching in directory: ${directoryPath}`);
  console.log(`Pattern: ${pattern}`);
  if (outputPath) {
    console.log(`Output directory: ${outputPath}`);
  }
  console.log();

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
    processFile(filePath, oldUrl, newUrl, outputPath);
  }

  console.log('\n✅ All files processed successfully!');
  return 0;
}

// Run if executed directly
if (require.main === module) {
  const exitCode = main();
  process.exit(exitCode);
}
