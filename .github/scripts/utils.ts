import * as fs from 'fs';
import * as path from 'path';

/**
 * Find all files in a directory that match the given regex pattern
 */
export function findMatchingFiles(directoryPath: string, pattern: string): string[] {
  try {
    // Check if directory exists
    if (!fs.existsSync(directoryPath)) {
      console.error(`❌ Error: Directory not found: ${directoryPath}`);
      process.exit(1);
    }

    // Check if it's a directory
    const stats = fs.statSync(directoryPath);
    if (!stats.isDirectory()) {
      console.error(`❌ Error: Path is not a directory: ${directoryPath}`);
      process.exit(1);
    }

    // Read all files in the directory
    const files = fs.readdirSync(directoryPath);

    // Create regex from pattern
    let regex: RegExp;
    try {
      regex = new RegExp(pattern);
    } catch (e) {
      console.error(`❌ Error: Invalid regex pattern: ${pattern}`);
      console.error(`  ${(e as Error).message}`);
      process.exit(1);
    }

    // Filter files that match the pattern
    const matchingFiles = files
      .filter(file => regex.test(file))
      .map(file => path.join(directoryPath, file));

    return matchingFiles;
  } catch (e) {
    console.error(`❌ Error reading directory ${directoryPath}:`, (e as Error).message);
    process.exit(1);
  }
}

