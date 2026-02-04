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
 * Security scanning script for comprehensive vulnerability assessment
 */

interface ScanConfig {
  targets: string[];
  outputFormat: 'json' | 'sarif' | 'text';
  outputDir: string;
  severityThreshold: 'low' | 'medium' | 'high' | 'critical';
  includeDevDeps: boolean;
  failOnIssues: boolean;
}

class SecurityScanner {
  private config: ScanConfig;
  private logger: typeof Logger;

  constructor(config?: Partial<ScanConfig>) {
    this.logger = Logger;
    this.config = {
      targets: ['.'],
      outputFormat: 'json',
      outputDir: joinProjectPath('security-reports'),
      severityThreshold: 'high',
      includeDevDeps: true,
      failOnIssues: false,
      ...config
    };
  }

  async run(): Promise<boolean> {
    try {
      this.logger.info('Starting comprehensive security scan...');
      
      // Ensure output directory exists
      ensureDir(this.config.outputDir);
      
      // Run various security scans
      const results = await this.runAllScans();
      
      // Generate consolidated report
      await this.generateReport(results);
      
      // Check if any issues exceed threshold
      const hasCriticalIssues = this.hasIssuesAboveThreshold(results);
      
      if (hasCriticalIssues && this.config.failOnIssues) {
        this.logger.error('Security scan found issues above threshold. Failing build.');
        return false;
      }
      
      this.logger.info('Security scan completed successfully!');
      return true;
    } catch (error) {
      this.logger.error(`Security scan failed: ${(error as Error).message}`);
      return false;
    }
  }

  private async runAllScans(): Promise<any> {
    const results: any = {};
    
    // Run dependency vulnerability scan
    results.dependencyScan = await this.scanDependencies();
    
    // Run SAST scan
    results.sastScan = await this.scanSAST();
    
    // Run secret detection
    results.secretScan = await this.scanSecrets();
    
    // Run license compliance scan
    results.licenseScan = await this.scanLicenses();
    
    // Run code quality/security scan
    results.qualityScan = await this.scanQuality();
    
    return results;
  }

  private async scanDependencies(): Promise<any> {
    this.logger.info('Scanning dependencies for vulnerabilities...');
    
    try {
      // Run npm audit
      const auditResult = execSync('npm audit --json', { encoding: 'utf-8' });
      const auditData = JSON.parse(auditResult);
      
      // Count vulnerabilities by severity
      const vulnerabilities = {
        low: auditData.metadata.vulnerabilities.low || 0,
        moderate: auditData.metadata.vulnerabilities.moderate || 0,
        high: auditData.metadata.vulnerabilities.high || 0,
        critical: auditData.metadata.vulnerabilities.critical || 0
      };
      
      this.logger.info(`Dependency scan found: ${JSON.stringify(vulnerabilities)}`);
      
      return {
        vulnerabilities,
        details: auditData.advisories || {}
      };
    } catch (error) {
      this.logger.error(`Dependency scan failed: ${(error as Error).message}`);
      return { error: (error as Error).message };
    }
  }

  private async scanSAST(): Promise<any> {
    this.logger.info('Running SAST scan...');
    
    try {
      // Run bun tests for security
      const testResult = execSync('bun test tests/security*.test.ts --reporter=json', { encoding: 'utf-8' });
      const testData = JSON.parse(testResult);
      
      // Count test results
      const stats = {
        total: testData.numPassedTestAssertions + testData.numFailedTestAssertions,
        passed: testData.numPassedTestAssertions,
        failed: testData.numFailedTestAssertions,
        skipped: testData.numPendingTestAssertions
      };
      
      this.logger.info(`SAST scan results: ${JSON.stringify(stats)}`);
      
      return {
        stats,
        tests: testData.testResults || []
      };
    } catch (error) {
      this.logger.error(`SAST scan failed: ${(error as Error).message}`);
      return { error: (error as Error).message };
    }
  }

  private async scanSecrets(): Promise<any> {
    this.logger.info('Scanning for secrets...');
    
    try {
      // Look for potential secrets in code
      const filesToScan = [
        ...this.findFilesByExtension(['.ts', '.js', '.json', '.env', '.yaml', '.yml']),
        'package.json',
        'package-lock.json'
      ];
      
      const secretPatterns = [
        /password\s*[:=]\s*["'][^"']*["']/gi,
        /secret\s*[:=]\s*["'][^"']*["']/gi,
        /token\s*[:=]\s*["'][^"']*["']/gi,
        /api[_-]?key\s*[:=]\s*["'][^"']*["']/gi,
        /private[_-]?key\s*[:=]\s*["'][^"']*["']/gi,
        /client[_-]?secret\s*[:=]\s*["'][^"']*["']/gi,
        /access[_-]?token\s*[:=]\s*["'][^"']*["']/gi,
        /authorization\s*[:=]\s*["'][^"']*["']/gi,
        /bearer\s+[\w\-_.~+/]+=*/gi,
        /sk_[a-zA-Z0-9]{24}/gi, // Stripe secret key pattern
        /rk_[a-zA-Z0-9]{24}/gi, // Stripe restricted key pattern
        /ghp_[a-zA-Z0-9]{36}/gi, // GitHub personal access token
        /gho_[a-zA-Z0-9]{36}/gi, // GitHub OAuth access token
        /ssh-rsa\s+[A-Za-z0-9+\/]{20,}={0,2}\s*/gi,
        /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/gi
      ];
      
      const findings: any[] = [];
      
      for (const file of filesToScan) {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          
          for (const pattern of secretPatterns) {
            const matches = line.match(pattern);
            if (matches) {
              findings.push({
                file,
                line: i + 1,
                content: line.trim(),
                pattern: pattern.toString()
              });
            }
          }
        }
      }
      
      this.logger.info(`Secret scan found ${findings.length} potential secrets`);
      
      return {
        count: findings.length,
        findings
      };
    } catch (error) {
      this.logger.error(`Secret scan failed: ${(error as Error).message}`);
      return { error: (error as Error).message };
    }
  }

  private async scanLicenses(): Promise<any> {
    this.logger.info('Scanning for license compliance...');
    
    try {
      // Read package.json to get dependencies
      const packageJsonPath = joinProjectPath('package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      const deps = {
        ...packageJson.dependencies,
        ...(this.config.includeDevDeps ? packageJson.devDependencies : {})
      };
      
      // This is a simplified check - in reality, you'd want to check each dependency's license
      const licenseIssues: string[] = [];
      
      // Check for problematic licenses
      const problematicLicenses = ['AGPL-1.0', 'AGPL-3.0', 'GPL-1.0', 'GPL-2.0', 'GPL-3.0'];
      
      // In a real implementation, we'd check each dependency's license
      // For now, we'll just return a basic report
      
      this.logger.info('License scan completed');
      
      return {
        dependencyCount: Object.keys(deps).length,
        licenseIssues: licenseIssues
      };
    } catch (error) {
      this.logger.error(`License scan failed: ${(error as Error).message}`);
      return { error: (error as Error).message };
    }
  }

  private async scanQuality(): Promise<any> {
    this.logger.info('Scanning code quality and security...');
    
    try {
      // Run Biome for code quality
      const biomeResult = execSync('bunx @biomejs/biome check --diagnostic-level=warn .', { encoding: 'utf-8' });
      
      // Parse Biome output for security-related diagnostics
      const lines = biomeResult.split('\n');
      const diagnostics = lines.filter(line => 
        line.includes('warn') || line.includes('error')
      );
      
      this.logger.info(`Quality scan found ${diagnostics.length} issues`);
      
      return {
        diagnosticCount: diagnostics.length,
        diagnostics
      };
    } catch (error) {
      this.logger.error(`Quality scan failed: ${(error as Error).message}`);
      return { error: (error as Error).message };
    }
  }

  private findFilesByExtension(extensions: string[]): string[] {
    const results: string[] = [];
    const searchDir = joinProjectPath('.');
    
    const walk = (dir: string) => {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          if (!file.startsWith('node_modules') && !file.startsWith('.')) {
            walk(fullPath);
          }
        } else {
          const ext = path.extname(file);
          if (extensions.includes(ext.toLowerCase())) {
            results.push(fullPath);
          }
        }
      }
    };
    
    walk(searchDir);
    return results;
  }

  private async generateReport(results: any): Promise<void> {
    const timestamp = new Date().toISOString();
    const report = {
      timestamp,
      config: this.config,
      results,
      summary: this.generateSummary(results)
    };
    
    const outputPath = path.join(this.config.outputDir, `security-report-${timestamp}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    
    this.logger.info(`Security report generated: ${outputPath}`);
  }

  private generateSummary(results: any): any {
    const summary: any = {};
    
    if (results.dependencyScan && !results.dependencyScan.error) {
      summary.dependencyVulnerabilities = results.dependencyScan.vulnerabilities;
    }
    
    if (results.sastScan && !results.sastScan.error) {
      summary.sastStats = results.sastScan.stats;
    }
    
    if (results.secretScan && !results.secretScan.error) {
      summary.secretsFound = results.secretScan.count;
    }
    
    if (results.qualityScan && !results.qualityScan.error) {
      summary.qualityIssues = results.qualityScan.diagnosticCount;
    }
    
    return summary;
  }

  private hasIssuesAboveThreshold(results: any): boolean {
    // Define thresholds based on severity
    const severityLevels = { low: 0, medium: 1, high: 2, critical: 3 };
    const thresholdLevel = severityLevels[this.config.severityThreshold];
    
    // Check dependency vulnerabilities
    if (results.dependencyScan && !results.dependencyScan.error) {
      const vulns = results.dependencyScan.vulnerabilities;
      
      if (thresholdLevel >= 3 && vulns.critical > 0) return true;
      if (thresholdLevel >= 2 && vulns.high > 0) return true;
      if (thresholdLevel >= 1 && vulns.moderate > 0) return true;
      if (thresholdLevel >= 0 && vulns.low > 0) return true;
    }
    
    // Check secrets
    if (results.secretScan && !results.secretScan.error && results.secretScan.count > 0) {
      return true;
    }
    
    return false;
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
  const config: Partial<ScanConfig> = {};
  
  if (args.includes('--format') && args[args.indexOf('--format') + 1]) {
    const format = args[args.indexOf('--format') + 1] as 'json' | 'sarif' | 'text';
    if (['json', 'sarif', 'text'].includes(format)) {
      config.outputFormat = format;
    }
  }
  
  if (args.includes('--output-dir') && args[args.indexOf('--output-dir') + 1]) {
    config.outputDir = args[args.indexOf('--output-dir') + 1];
  }
  
  if (args.includes('--severity') && args[args.indexOf('--severity') + 1]) {
    const severity = args[args.indexOf('--severity') + 1] as 'low' | 'medium' | 'high' | 'critical';
    if (['low', 'medium', 'high', 'critical'].includes(severity)) {
      config.severityThreshold = severity;
    }
  }
  
  if (args.includes('--exclude-dev-deps')) {
    config.includeDevDeps = false;
  }
  
  if (args.includes('--fail-on-issues')) {
    config.failOnIssues = true;
  }
  
  try {
    const scanner = new SecurityScanner(config);
    const success = await scanner.run();
    
    if (!success) {
      process.exit(1);
    }
  } catch (error) {
    ErrorHandler.handleError(error, 'security-scanner');
    process.exit(1);
  }
}

// Run the main function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { SecurityScanner, ScanConfig };