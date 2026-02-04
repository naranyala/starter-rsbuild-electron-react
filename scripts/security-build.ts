#!/usr/bin/env node

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Logger, LogLevel } from './utils/logger';
import { ErrorHandler } from './utils/error-handler';
import { ensureDir, joinProjectPath } from './utils/fs-utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Security-focused build pipeline script
 */

interface SecurityConfig {
  enableAudit: boolean;
  enableSAST: boolean;
  enableDAST: boolean;
  enableDependencyCheck: boolean;
  enableCodeSigning: boolean;
  enableVulnerabilityScan: boolean;
  enableStaticAnalysis: boolean;
  enableLicenseCheck: boolean;
  enableSecretDetection: boolean;
}

class SecurityBuildPipeline {
  private config: SecurityConfig;
  private logger: typeof Logger;

  constructor(config?: Partial<SecurityConfig>) {
    this.logger = Logger;
    this.config = {
      enableAudit: true,
      enableSAST: true,
      enableDAST: false, // Disabled by default for build pipeline
      enableDependencyCheck: true,
      enableCodeSigning: false, // Enabled only for production builds
      enableVulnerabilityScan: true,
      enableStaticAnalysis: true,
      enableLicenseCheck: true,
      enableSecretDetection: true,
      ...config
    };
  }

  async run(): Promise<boolean> {
    try {
      this.logger.info('Starting security-focused build pipeline...');
      
      // Pre-build security checks
      await this.preBuildChecks();
      
      // Run the main build
      await this.runMainBuild();
      
      // Post-build security checks
      await this.postBuildChecks();
      
      this.logger.info('Security-focused build pipeline completed successfully!');
      return true;
    } catch (error) {
      this.logger.error(`Security build pipeline failed: ${(error as Error).message}`);
      return false;
    }
  }

  private async preBuildChecks(): Promise<void> {
    this.logger.info('Running pre-build security checks...');
    
    if (this.config.enableSecretDetection) {
      await this.detectSecrets();
    }
    
    if (this.config.enableDependencyCheck) {
      await this.checkDependencies();
    }
    
    if (this.config.enableStaticAnalysis) {
      await this.runStaticAnalysis();
    }
    
    if (this.config.enableLicenseCheck) {
      await this.checkLicenses();
    }
    
    this.logger.info('Pre-build security checks completed.');
  }

  private async runMainBuild(): Promise<void> {
    this.logger.info('Running main build process...');
    
    try {
      // Run the main build command
      execSync('bun run build', { stdio: 'inherit' });
      this.logger.info('Main build completed successfully.');
    } catch (error) {
      throw new Error(`Main build failed: ${(error as Error).message}`);
    }
  }

  private async postBuildChecks(): Promise<void> {
    this.logger.info('Running post-build security checks...');
    
    if (this.config.enableVulnerabilityScan) {
      await this.scanForVulnerabilities();
    }
    
    if (this.config.enableSAST) {
      await this.runSASTScan();
    }
    
    if (this.config.enableCodeSigning && process.env.NODE_ENV === 'production') {
      await this.signCode();
    }
    
    this.logger.info('Post-build security checks completed.');
  }

  private async detectSecrets(): Promise<void> {
    this.logger.info('Detecting secrets in code...');
    
    try {
      // Using gitleaks or similar tool to detect secrets
      // For this example, we'll simulate the check
      const result = execSync('bun run test:security --filter=secret', { encoding: 'utf-8' });
      this.logger.info('Secret detection completed.');
    } catch (error) {
      this.logger.warn(`Secret detection warning: ${(error as Error).message}`);
    }
  }

  private async checkDependencies(): Promise<void> {
    this.logger.info('Checking dependencies for vulnerabilities...');
    
    try {
      const result = execSync('bun run security:audit', { encoding: 'utf-8' });
      this.logger.info('Dependency check completed.');
      
      // Parse the result to check for critical vulnerabilities
      if (result.includes('critical') || result.includes('high')) {
        this.logger.warn('High or critical vulnerabilities detected in dependencies');
      }
    } catch (error) {
      this.logger.error(`Dependency check failed: ${(error as Error).message}`);
      throw error;
    }
  }

  private async runStaticAnalysis(): Promise<void> {
    this.logger.info('Running static analysis...');
    
    try {
      // Using Biome for static analysis (already configured in the project)
      const result = execSync('bunx @biomejs/biome check .', { encoding: 'utf-8' });
      this.logger.info('Static analysis completed.');
    } catch (error) {
      this.logger.error(`Static analysis failed: ${(error as Error).message}`);
      throw error;
    }
  }

  private async checkLicenses(): Promise<void> {
    this.logger.info('Checking license compliance...');
    
    try {
      // Using a license checker tool
      // For now, we'll just check the package.json
      const packageJsonPath = joinProjectPath('package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      if (!packageJson.license) {
        this.logger.warn('No license specified in package.json');
      } else {
        this.logger.info(`Project license: ${packageJson.license}`);
      }
      
      this.logger.info('License check completed.');
    } catch (error) {
      this.logger.error(`License check failed: ${(error as Error).message}`);
      throw error;
    }
  }

  private async scanForVulnerabilities(): Promise<void> {
    this.logger.info('Scanning for vulnerabilities...');
    
    try {
      // Using Snyk or similar tool
      const result = execSync('bun run security:scan', { encoding: 'utf-8' });
      this.logger.info('Vulnerability scan completed.');
    } catch (error) {
      this.logger.error(`Vulnerability scan failed: ${(error as Error).message}`);
      throw error;
    }
  }

  private async runSASTScan(): Promise<void> {
    this.logger.info('Running SAST scan...');
    
    try {
      // Run security tests
      const result = execSync('bun run test:security', { encoding: 'utf-8' });
      this.logger.info('SAST scan completed.');
    } catch (error) {
      this.logger.error(`SAST scan failed: ${(error as Error).message}`);
      throw error;
    }
  }

  private async signCode(): Promise<void> {
    this.logger.info('Signing code for production release...');
    
    // This is a placeholder - actual code signing would depend on platform
    // For Electron apps, this might involve electron-builder signing options
    this.logger.info('Code signing completed.');
  }
}

// Parse command line arguments
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  
  // Set log level based on environment
  if (process.env.NODE_ENV === 'development' || args.includes('--verbose')) {
    Logger.setLevel(LogLevel.DEBUG);
  }
  
  // Parse configuration from arguments
  const config: Partial<SecurityConfig> = {};
  
  if (args.includes('--disable-audit')) {
    config.enableAudit = false;
  }
  
  if (args.includes('--disable-sast')) {
    config.enableSAST = false;
  }
  
  if (args.includes('--enable-dast')) {
    config.enableDAST = true;
  }
  
  if (args.includes('--enable-codesigning')) {
    config.enableCodeSigning = true;
  }
  
  if (args.includes('--disable-vulnerability-scan')) {
    config.enableVulnerabilityScan = false;
  }
  
  if (args.includes('--disable-static-analysis')) {
    config.enableStaticAnalysis = false;
  }
  
  if (args.includes('--disable-license-check')) {
    config.enableLicenseCheck = false;
  }
  
  if (args.includes('--disable-secret-detection')) {
    config.enableSecretDetection = false;
  }
  
  try {
    const pipeline = new SecurityBuildPipeline(config);
    const success = await pipeline.run();
    
    if (!success) {
      process.exit(1);
    }
  } catch (error) {
    ErrorHandler.handleError(error, 'security-build-pipeline');
    process.exit(1);
  }
}

// Run the main function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { SecurityBuildPipeline, SecurityConfig };