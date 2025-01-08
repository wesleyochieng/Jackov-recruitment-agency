import fs from 'fs/promises';
import path from 'path';

async function diagnoseNextJsProject() {
  console.log('Diagnosing Next.js project...');

  try {
    // Read package.json
    const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
    
    console.log('Checking dependencies...');
    const hasDependencies = packageJson.dependencies && packageJson.dependencies.next;
    const hasDevDependencies = packageJson.devDependencies && packageJson.devDependencies.next;
    
    if (hasDependencies) {
      console.log('✅ Next.js found in dependencies');
    } else if (hasDevDependencies) {
      console.log('✅ Next.js found in devDependencies');
    } else {
      console.log('❌ Next.js not found in dependencies or devDependencies');
    }

    console.log('\nChecking scripts...');
    const requiredScripts = ['dev', 'build', 'start'];
    for (const script of requiredScripts) {
      if (packageJson.scripts && packageJson.scripts[script]) {
        console.log(`✅ "${script}" script found`);
      } else {
        console.log(`❌ "${script}" script not found`);
      }
    }

    console.log('\nChecking for next.config.js...');
    try {
      await fs.access('next.config.js');
      console.log('✅ next.config.js found');
    } catch {
      console.log('❌ next.config.js not found');
    }

    console.log('\nChecking for pages or app directory...');
    let hasCorrectStructure = false;
    try {
      const appStats = await fs.stat('app');
      if (appStats.isDirectory()) {
        console.log('✅ "app" directory found (App Router)');
        hasCorrectStructure = true;
      }
    } catch {}
    
    try {
      const pagesStats = await fs.stat('pages');
      if (pagesStats.isDirectory()) {
        console.log('✅ "pages" directory found (Pages Router)');
        hasCorrectStructure = true;
      }
    } catch {}

    if (!hasCorrectStructure) {
      console.log('❌ Neither "app" nor "pages" directory found');
    }

  } catch (error) {
    console.error('Error diagnosing project:', error);
  }
}

diagnoseNextJsProject();