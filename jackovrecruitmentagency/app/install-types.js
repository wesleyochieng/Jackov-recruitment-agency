import { execSync } from 'child_process';

console.log('Installing @types/react and @types/react-dom...');

try {
  execSync('npm install --save-dev @types/react @types/react-dom', { stdio: 'inherit' });
  console.log('Installation successful!');
} catch (error) {
  console.error('Installation failed:', error.message);
}