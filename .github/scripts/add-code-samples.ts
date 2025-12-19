#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import simpleGit from 'simple-git';
import { findMatchingFiles } from './utils';

// SDK Repository configurations in format: REPO_URL#BRANCH#DIRECTORY
// Repository names use language codes as prefixes (e.g., CURL_, DOTNET_, etc.)
const SDK_REPOSITORIES = {
  CURL_SAMPLES_REPO: 'https://github.com/box-community/box-curl-samples.git#main#/',
  DOTNET_SAMPLES_REPO: 'https://github.com/box/box-windows-sdk-v2.git#main#/docs/',
  SWIFT_SAMPLES_REPO: 'https://github.com/box/box-ios-sdk.git#main#/docs/',
  JAVA_SAMPLES_REPO: 'https://github.com/box/box-java-sdk.git#main#/docs/',
  NODE_SAMPLES_REPO: 'https://github.com/box/box-node-sdk.git#main#/docs/',
  PYTHON_SAMPLES_REPO: 'https://github.com/box/box-python-sdk.git#main#/docs/',
};

interface CodeSample {
  lang: string;
  label: string;
  source: string;
}

interface SampleData {
  operationId: string;
  lang: string;
  code: string;
}

interface RepoConfig {
  url: string;
  branch: string;
  directory: string;
  language: string;
}

/**
 * Parse repository configuration string
 * Format: REPO_URL#BRANCH#DIRECTORY
 */
function parseRepoConfig(configString: string, repoName: string): RepoConfig {
  const parts = configString.split('#');

  if (parts.length !== 3) {
    throw new Error(`Invalid repo config format: ${configString}`);
  }

  const [url, branch, directory] = parts;

  // Extract language from repo name (e.g., CURL_SAMPLES_REPO -> curl)
  const languagePrefix = repoName.split('_')[0];
  const language = languagePrefix.toLowerCase();

  return {
    url,
    branch,
    directory,
    language,
  };
}

/**
 * Clone a repository with specified branch using sparse checkout for specific directory
 */
async function cloneRepository(config: RepoConfig, cloneDir: string): Promise<string> {
  console.log(`📦 Cloning ${config.language} repository (${config.directory}) to ${cloneDir}...`);

  try {
    // Create directory if it doesn't exist
    if (!fs.existsSync(cloneDir)) {
      fs.mkdirSync(cloneDir, { recursive: true });
    }

    const git = simpleGit(cloneDir);

    // Initialize empty repository
    await git.init();

    // Add remote
    await git.addRemote('origin', config.url);

    // Enable sparse checkout
    await git.raw(['config', 'core.sparseCheckout', 'true']);

    // Configure sparse checkout to only include the target directory
    // Remove leading/trailing slashes and handle root directory
    const sparseCheckoutPath = config.directory === '/' || config.directory === ''
      ? '*'
      : config.directory.replace(/^\/+|\/+$/g, '') + '/*';

    const sparseCheckoutFile = path.join(cloneDir, '.git', 'info', 'sparse-checkout');
    const sparseCheckoutDir = path.dirname(sparseCheckoutFile);

    if (!fs.existsSync(sparseCheckoutDir)) {
      fs.mkdirSync(sparseCheckoutDir, { recursive: true });
    }

    fs.writeFileSync(sparseCheckoutFile, sparseCheckoutPath);

    // Pull only the specified directory
    await git.raw(['pull', '--depth', '1', 'origin', config.branch]);

    console.log(`✅ Repository cloned successfully (sparse checkout: ${sparseCheckoutPath})`);
    return cloneDir;
  } catch (error) {
    console.error(`❌ Error cloning repository:`, error);
    throw error;
  }
}

/**
 * Extract samples from markdown files in the docs directory
 */
function extractSamplesFromMarkdown(docsDir: string, language: string): SampleData[] {
  console.log(`📖 Extracting ${language} samples from ${docsDir}...`);
  const samples: SampleData[] = [];

  if (!fs.existsSync(docsDir)) {
    console.warn(`⚠️  Docs directory not found: ${docsDir}`);
    return samples;
  }

  const markdownFiles = findMarkdownFiles(docsDir);
  console.log(`   Found ${markdownFiles.length} markdown files`);

  for (const filePath of markdownFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const extractedSamples = parseSamplesFromContent(content, language);
    samples.push(...extractedSamples);
  }

  console.log(`✅ Extracted ${samples.length} samples`);
  return samples;
}

/**
 * Recursively find all markdown files in a directory
 */
function findMarkdownFiles(dir: string): string[] {
  const files: string[] = [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.markdown'))) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Parse samples from markdown content
 * Looks for pattern: <!-- sample operationId --> or <!-- sample operationId variant -->
 * Followed by a code block (with flexible whitespace)
 * Converts space-separated identifiers to hash format (e.g., "put_files_id add_shared_link" -> "put_files_id#add_shared_link")
 */
function parseSamplesFromContent(content: string, lang: string): SampleData[] {
  const samples: SampleData[] = [];

  // Match <!-- sample operationId [variant] --> followed by code block
  // Allows flexible whitespace between comment and code block
  // Captures optional second identifier (variant) after space
  // Allows dots in operationId for version suffixes (e.g., v2025.0)
  // Allows any non-whitespace characters in language identifier (e.g., dotnet, c#, c++, objective-c)
  const samplePattern = /<!--\s*sample\s+([a-zA-Z0-9_.]+)(?:\s+([a-zA-Z0-9_.]+))?\s*-->\s*```\S*\s*\n([\s\S]*?)```/g;

  let match;
  while ((match = samplePattern.exec(content)) !== null) {
    const baseOperationId = match[1];
    const variant = match[2]; // Optional variant identifier
    const code = match[3].trim();

    // Combine with hash if variant exists (e.g., put_files_id#add_shared_link)
    const operationId = variant ? `${baseOperationId}#${variant}` : baseOperationId;

    samples.push({ operationId, lang, code });
  }

  return samples;
}

/**
 * Load OpenAPI schemas from files
 */
function loadOpenAPISchemas(filePaths: string[]): Array<{ path: string; schema: any }> {
  console.log(`📄 Loading ${filePaths.length} OpenAPI schema(s)...`);

  const schemas: Array<{ path: string; schema: any }> = [];

  for (const filePath of filePaths) {
    const fullPath = path.resolve(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️  OpenAPI file not found: ${filePath} - skipping`);
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    const schema = JSON.parse(content);
    schemas.push({ path: fullPath, schema });
    console.log(`   ✓ Loaded ${filePath}`);
  }

  if (schemas.length === 0) {
    throw new Error('No OpenAPI files could be loaded');
  }

  console.log(`✅ Loaded ${schemas.length} OpenAPI schema(s)`);
  return schemas;
}

/**
 * Merge extracted samples into OpenAPI schema
 * Only one sample per language per operation - replaces existing samples with same language
 */
function mergeSamplesIntoSchema(
  schema: any,
  samplesArray: SampleData[]
): { matched: number; added: number; matchedIds: string[] } {
  console.log(`🔗 Merging samples into OpenAPI schema...`);

  let matchedCount = 0;
  let addedCount = 0;
  const matchedIds: string[] = [];

  // Group samples by operationId, then by language (only keep last sample per language)
  const samplesByOperation = new Map<string, Map<string, SampleData>>();
  for (const sample of samplesArray) {
    if (!samplesByOperation.has(sample.operationId)) {
      samplesByOperation.set(sample.operationId, new Map());
    }
    // This will replace any existing sample with the same language
    samplesByOperation.get(sample.operationId)!.set(sample.lang, sample);
  }

  // Iterate through all paths and operations
  const paths = schema.paths || {};

  for (const [pathName, pathItem] of Object.entries(paths)) {
    const methods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'];

    for (const method of methods) {
      const operation = (pathItem as any)[method];

      if (!operation || !operation.operationId) {
        continue;
      }

      const operationId = operation.operationId;

      // Check if we have samples for this operation
      if (samplesByOperation.has(operationId)) {
        const samplesByLang = samplesByOperation.get(operationId)!;
        matchedCount++;
        matchedIds.push(operationId);

        const label = operation.summary || operationId;

        // Initialize x-codeSamples array if it doesn't exist
        if (!operation['x-codeSamples']) {
          operation['x-codeSamples'] = [];
        }

        // Create a map of existing samples by language
        const existingSamplesByLang = new Map<string, number>();
        for (let i = 0; i < operation['x-codeSamples'].length; i++) {
          const existingSample = operation['x-codeSamples'][i];
          if (existingSample.lang) {
            existingSamplesByLang.set(existingSample.lang, i);
          }
        }

        // Add or replace samples for each language
        for (const [lang, sample] of samplesByLang.entries()) {
          const newSample: CodeSample = {
            lang: lang,
            label: label,
            source: sample.code
          };

          if (existingSamplesByLang.has(lang)) {
            // Replace existing sample with same language
            const index = existingSamplesByLang.get(lang)!;
            operation['x-codeSamples'][index] = newSample;
            console.warn(`   ⚠️  Replaced existing ${lang} sample for ${operationId}`);
          } else {
            // Add new sample
            operation['x-codeSamples'].push(newSample);
          }
          addedCount++;
        }

        // console.log(`   ✓ Processed ${samplesByLang.size} sample(s) for ${operationId} (${method.toUpperCase()} ${pathName})`);
      }
    }
  }

  console.log(`✅ Matched ${matchedCount} operations, processed ${addedCount} samples`);
  return { matched: matchedCount, added: addedCount, matchedIds };
}

/**
 * Write updated OpenAPI schemas back to files
 */
function writeOpenAPISchemas(schemas: Array<{ path: string; schema: any }>, outputPath?: string): void {
  console.log(`💾 Writing ${schemas.length} updated schema(s)...`);

  for (const schemaInfo of schemas) {
    const content = JSON.stringify(schemaInfo.schema, null, 2);

    // Determine output file path
    let outputFilePath: string;
    if (outputPath) {
      // If output path is provided, save files there
      const fileName = path.basename(schemaInfo.path);

      // Ensure output directory exists
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }

      outputFilePath = path.join(outputPath, fileName);
      console.log(`   ✅ Writing ${fileName} to ${outputPath}`);
    } else {
      // Otherwise, save in place
      outputFilePath = schemaInfo.path;
      console.log(`   ✅ Updated ${path.basename(schemaInfo.path)}`);
    }

    fs.writeFileSync(outputFilePath, content, 'utf-8');
  }

  console.log('✅ All schemas updated successfully');
}

/**
 * Clean up cloned repository
 */
function cleanup(dir: string): void {
  console.log(`🧹 Cleaning up ${dir}...`);

  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log('✅ Cleanup complete');
    }
  } catch (error) {
    console.warn(`⚠️  Error during cleanup: ${error}`);
  }
}

/**
 * Main execution function
 */
export async function main(directoryPath?: string, pattern?: string, outputPath?: string): Promise<number> {
  // Get command line arguments if not provided
  let dir = directoryPath;
  let pat = pattern;
  let outPath = outputPath;

  if (!dir || !pat) {
    const args = process.argv.slice(2);

    if (args.length < 2) {
      console.error('❌ Error: Missing required arguments');
      console.error('');
      console.error('Usage: cd .github/scripts && npm run add-sdk-samples -- <directory> <pattern> [output]');
      console.error('');
      console.error('Arguments:');
      console.error('  <directory>  - Path to directory containing OpenAPI JSON files');
      console.error('  <pattern>    - Regex pattern to match filenames');
      console.error('  [output]     - Optional output directory (if not provided, files are saved in place)');
      console.error('');
      console.error('Examples:');
      console.error('  cd .github/scripts && npm run add-sdk-samples -- "../../openapi" "openapi.*\\.json"');
      console.error('  cd .github/scripts && npm run add-sdk-samples -- "../../openapi" "openapi.*\\.json" "../../output"');
      return 1;
    }

    dir = args[0];
    pat = args[1];
    outPath = args[2]; // Optional third argument
  }

  console.log('🚀 Starting multi-SDK sample extraction...\n');
  console.log(`Searching in directory: ${dir}`);
  console.log(`Pattern: ${pat}`);
  if (outPath) {
    console.log(`Output directory: ${outPath}`);
  }
  console.log();

  // Find matching OpenAPI files
  const openapiFiles = findMatchingFiles(dir, pat);

  if (openapiFiles.length === 0) {
    console.log('⚠️  No files found matching the pattern');
    return 1;
  }

  console.log(`Found ${openapiFiles.length} matching file(s):\n`);
  openapiFiles.forEach(file => console.log(`  - ${file}`));
  console.log('');

  const startTime = Date.now();
  const cloneDirs: string[] = [];
  const allSamples: SampleData[] = [];

  try {
    // Step 1: Extract samples from all SDK repositories
    for (const [repoName, configString] of Object.entries(SDK_REPOSITORIES)) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Processing ${repoName}`);
      console.log('='.repeat(60));

      try {
        // Parse repository configuration
        const config = parseRepoConfig(configString, repoName);
        console.log(`   Language: ${config.language}`);
        console.log(`   Branch: ${config.branch}`);
        console.log(`   Directory: ${config.directory}`);
        console.log();

        // Clone repository
        const cloneDir = path.join(os.tmpdir(), `box-sdk-${config.language}-${Date.now()}`);
        cloneDirs.push(cloneDir);
        await cloneRepository(config, cloneDir);
        console.log();

        // Extract samples from markdown files
        const docsDir = path.join(cloneDir, config.directory);
        const samples = extractSamplesFromMarkdown(docsDir, config.language);
        allSamples.push(...samples);
        console.log();
      } catch (error) {
        console.error(`⚠️  Error processing ${repoName}:`, error);
        console.log('   Continuing with next repository...\n');
      }
    }

    console.log(`${'='.repeat(60)}\n`);

    if (allSamples.length === 0) {
      console.warn('⚠️  No samples found in any documentation');
      return 1;
    }


    // Step 2: Load OpenAPI schemas
    const schemas = loadOpenAPISchemas(openapiFiles);
    console.log();

    // Step 3: Merge all samples into each schema
    let totalMatched = 0;
    let totalAdded = 0;
    const matchedOperationIds = new Set<string>();
    const allSchemaOperationIds = new Set<string>();

    for (const schemaInfo of schemas) {
      console.log(`🔗 Processing ${path.basename(schemaInfo.path)}...`);

      // Count operations in this schema and collect all operation IDs
      const schemaPaths = schemaInfo.schema.paths || {};
      let operationCount = 0;
      for (const pathItem of Object.values(schemaPaths)) {
        const methods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'];
        for (const method of methods) {
          const opId = (pathItem as any)[method]?.operationId;
          if (opId) {
            operationCount++;
            allSchemaOperationIds.add(opId);
          }
        }
      }
      console.log(`   Total operations in schema: ${operationCount}`);

      const { matched, added, matchedIds } = mergeSamplesIntoSchema(schemaInfo.schema, allSamples);
      totalMatched += matched;
      totalAdded += added;

      // Track which operationIds were matched
      matchedIds.forEach(id => matchedOperationIds.add(id));

      console.log();
    }

    // Report unmatched samples
    const uniqueSampleOperationIds = new Set(allSamples.map(s => s.operationId));
    const unmatchedSamples = Array.from(uniqueSampleOperationIds).filter(id => !matchedOperationIds.has(id));

    if (unmatchedSamples.length > 0) {
      console.log(`⚠️  Warning: ${unmatchedSamples.length} sample(s) did not match any operation:`);
      unmatchedSamples.forEach(id => console.log(`   - ${id}`));
      console.log();
    }

    // Report operations without samples
    const operationsWithoutSamples = Array.from(allSchemaOperationIds).filter(id => !matchedOperationIds.has(id));

    if (operationsWithoutSamples.length > 0) {
      console.log(`⚠️  Warning: ${operationsWithoutSamples.length} operation(s) did not receive any samples:`);
      operationsWithoutSamples.forEach(id => console.log(`   - ${id}`));
      console.log();
    }

    if (totalAdded === 0) {
      console.warn('⚠️  No samples were added to any schema');
      return 1;
    }

    // Step 4: Write updated schemas
    writeOpenAPISchemas(schemas, outPath);
    console.log();

    // Summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    // Count samples by language
    const samplesByLang = new Map<string, number>();
    for (const sample of allSamples) {
      samplesByLang.set(sample.lang, (samplesByLang.get(sample.lang) || 0) + 1);
    }

    console.log('📊 Summary:');
    console.log(`   • OpenAPI schemas processed: ${schemas.length}`);
    console.log(`   • Total samples extracted: ${allSamples.length}`);
    console.log(`   • Samples by language:`);
    for (const [lang, count] of Array.from(samplesByLang.entries()).sort()) {
      console.log(`     - ${lang}: ${count}`);
    }
    console.log(`   • Operations matched: ${totalMatched}`);
    console.log(`   • Samples processed: ${totalAdded}`);
    console.log(`   • Duration: ${duration}s`);
    console.log('\n✨ Done!');

    return 0;
  } catch (error) {
    console.error('\n❌ Error:', error);
    return 1;
  } finally {
    // Step 5: Cleanup all cloned directories
    if (cloneDirs.length > 0) {
      console.log();
      for (const dir of cloneDirs) {
        cleanup(dir);
      }
    }
  }
}

// Run if executed directly
if (require.main === module) {
  main()
    .then((exitCode) => process.exit(exitCode))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

