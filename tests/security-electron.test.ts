/// <reference types="bun" />

import { describe, expect, test } from 'bun:test';

describe('Electron Security Tests', () => {
  test('should validate CSP headers', () => {
    const validateCSP = (csp: string) => {
      const issues: string[] = [];
      
      // Check for dangerous directives
      if (csp.includes("'unsafe-inline'")) {
        issues.push("CSP contains 'unsafe-inline' directive");
      }
      
      if (csp.includes("'unsafe-eval'")) {
        issues.push("CSP contains 'unsafe-eval' directive");
      }
      
      if (csp.includes("'unsafe-hashes'")) {
        issues.push("CSP contains 'unsafe-hashes' directive");
      }
      
      if (csp.includes('*') && !csp.includes('*.trusted-domain.com')) {
        issues.push("CSP contains wildcard (*) without proper domain restriction");
      }
      
      // Check for proper frame-ancestors
      if (!csp.includes('frame-ancestors') && !csp.includes('frame-ancestors \'none\'')) {
        issues.push("CSP should include frame-ancestors directive");
      }
      
      return {
        isValid: issues.length === 0,
        issues,
      };
    };

    // Valid CSP
    expect(validateCSP("default-src 'self'; script-src 'self' 'nonce-abc123'; object-src 'none'; frame-ancestors 'none';").isValid).toBe(true);
    
    // Invalid CSP examples
    expect(validateCSP("default-src *; script-src 'unsafe-inline' 'unsafe-eval';").isValid).toBe(false);
    expect(validateCSP("default-src 'self'; script-src 'self' 'unsafe-inline';").isValid).toBe(false);
    expect(validateCSP("default-src 'self';").isValid).toBe(false); // Missing frame-ancestors
  });

  test('should validate Electron security options', () => {
    const validateElectronSecurity = (options: any) => {
      const issues: string[] = [];
      
      // Check for insecure options
      if (options.webPreferences?.nodeIntegration === true) {
        issues.push("nodeIntegration should be disabled");
      }
      
      if (options.webPreferences?.contextIsolation === false) {
        issues.push("contextIsolation should be enabled");
      }
      
      if (options.webPreferences?.enableRemoteModule === true) {
        issues.push("enableRemoteModule should be disabled");
      }
      
      if (options.webPreferences?.sandbox === false) {
        issues.push("sandbox should be enabled for additional security");
      }
      
      if (options.webPreferences?.webSecurity === false) {
        issues.push("webSecurity should be enabled");
      }
      
      if (options.webPreferences?.allowRunningInsecureContent === true) {
        issues.push("allowRunningInsecureContent should be disabled");
      }
      
      if (options.webPreferences?.experimentalFeatures === true) {
        issues.push("experimentalFeatures should be disabled in production");
      }
      
      if (options.webPreferences?.nodeIntegrationInWorker === true) {
        issues.push("nodeIntegrationInWorker should be disabled");
      }
      
      if (options.webPreferences?.nodeIntegrationInSubFrames === true) {
        issues.push("nodeIntegrationInSubFrames should be disabled");
      }
      
      return {
        isValid: issues.length === 0,
        issues,
      };
    };

    // Valid security options
    expect(validateElectronSecurity({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        webSecurity: true,
        allowRunningInsecureContent: false,
        experimentalFeatures: false,
        nodeIntegrationInWorker: false,
        nodeIntegrationInSubFrames: false,
        sandbox: true
      }
    }).isValid).toBe(true);
    
    // Invalid security options
    expect(validateElectronSecurity({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false
      }
    }).isValid).toBe(false);
  });

  test('should validate protocol handlers', () => {
    const validateProtocolHandler = (protocol: string, handler: Function) => {
      const issues: string[] = [];
      
      // Check for custom protocol security
      if (protocol.startsWith('http') || protocol.startsWith('file')) {
        issues.push("Custom protocols should not override standard protocols");
      }
      
      return {
        isValid: issues.length === 0,
        issues,
      };
    };

    expect(validateProtocolHandler('myapp', () => {})).toEqual({ isValid: true, issues: [] });
    expect(validateProtocolHandler('http', () => {})).toEqual({ 
      isValid: false, 
      issues: ["Custom protocols should not override standard protocols"] 
    });
  });

  test('should validate IPC communication', () => {
    const validateIPCMessage = (channel: string, data: any) => {
      const issues: string[] = [];
      
      // Validate channel names
      if (/^[\w-]+$/.test(channel) === false) {
        issues.push("Channel name contains invalid characters");
      }
      
      // Validate data structure
      if (typeof data === 'string' && data.includes('eval(')) {
        issues.push("Data contains eval() which is dangerous");
      }
      
      if (typeof data === 'string' && data.includes('Function(')) {
        issues.push("Data contains Function constructor which is dangerous");
      }
      
      return {
        isValid: issues.length === 0,
        issues,
      };
    };

    expect(validateIPCMessage('valid-channel', { data: 'safe' })).toEqual({ isValid: true, issues: [] });
    expect(validateIPCMessage('valid-channel', 'eval(alert(1))')).toEqual({ 
      isValid: false, 
      issues: ["Data contains eval() which is dangerous"] 
    });
    expect(validateIPCMessage('valid-channel', 'new Function("return alert(1)")')).toEqual({ 
      isValid: false, 
      issues: ["Data contains Function constructor which is dangerous"] 
    });
    expect(validateIPCMessage('invalid@channel', {})).toEqual({ 
      isValid: false, 
      issues: ["Channel name contains invalid characters"] 
    });
  });

  test('should validate window creation options', () => {
    const validateWindowOptions = (options: any) => {
      const issues: string[] = [];
      
      if (options.webPreferences?.nodeIntegration === true) {
        issues.push("nodeIntegration should be disabled in windows");
      }
      
      if (options.webPreferences?.nodeIntegrationInSubFrames === true) {
        issues.push("nodeIntegrationInSubFrames should be disabled in windows");
      }
      
      if (options.webPreferences?.webviewTag === true) {
        issues.push("webviewTag should be disabled for security");
      }
      
      if (options.resizable === undefined) {
        // Not necessarily an issue, but could be a consideration
      }
      
      return {
        isValid: issues.length === 0,
        issues,
      };
    };

    expect(validateWindowOptions({
      webPreferences: {
        nodeIntegration: false,
        nodeIntegrationInSubFrames: false,
        webviewTag: false
      }
    })).toEqual({ isValid: true, issues: [] });
    
    expect(validateWindowOptions({
      webPreferences: {
        nodeIntegration: true,
        webviewTag: true
      }
    })).toEqual({ 
      isValid: false, 
      issues: [
        "nodeIntegration should be disabled in windows",
        "webviewTag should be disabled for security"
      ] 
    });
  });

  test('should validate file access patterns', () => {
    const validateFilePath = (filePath: string) => {
      const issues: string[] = [];
      
      // Check for path traversal
      if (filePath.includes('../') || filePath.includes('..\\')) {
        issues.push("Path traversal detected");
      }
      
      // Check for absolute paths in unexpected contexts
      if ((filePath.startsWith('/') || filePath.match(/^[A-Za-z]:\\/)) && !filePath.includes('app.getPath')) {
        issues.push("Absolute paths should be validated carefully");
      }
      
      // Check for sensitive file access
      const sensitivePaths = [
        '/etc/passwd',
        '/etc/shadow',
        'C:\\Windows\\System32',
        '.env',
        'config.json'
      ];
      
      if (sensitivePaths.some(path => filePath.toLowerCase().includes(path.toLowerCase()))) {
        issues.push("Access to sensitive system files detected");
      }
      
      return {
        isValid: issues.length === 0,
        issues,
      };
    };

    expect(validateFilePath('./safe/path/file.txt')).toEqual({ isValid: true, issues: [] });
    expect(validateFilePath('../../etc/passwd')).toEqual({
      isValid: false,
      issues: ["Path traversal detected", "Access to sensitive system files detected"]
    });
    expect(validateFilePath('C:\\Windows\\System32\\drivers\\etc\\hosts')).toEqual({
      isValid: false,
      issues: expect.arrayContaining(["Access to sensitive system files detected"])
    });
  });

  test('should validate external resource loading', () => {
    const validateResourceUrl = (url: string) => {
      const issues: string[] = [];
      
      // Only allow HTTPS for external resources
      if (url.startsWith('http://')) {
        issues.push("External resources should use HTTPS");
      }
      
      // Block file:// protocol for external resources
      if (url.startsWith('file://')) {
        issues.push("External resources should not use file:// protocol");
      }
      
      // Block data: and javascript: protocols
      if (url.startsWith('data:') || url.startsWith('javascript:')) {
        issues.push("External resources should not use data: or javascript: protocols");
      }
      
      return {
        isValid: issues.length === 0,
        issues,
      };
    };

    expect(validateResourceUrl('https://trusted-cdn.com/script.js')).toEqual({ isValid: true, issues: [] });
    expect(validateResourceUrl('http://untrusted.com/script.js')).toEqual({ 
      isValid: false, 
      issues: ["External resources should use HTTPS"] 
    });
    expect(validateResourceUrl('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==')).toEqual({ 
      isValid: false, 
      issues: ["External resources should not use data: or javascript: protocols"] 
    });
  });
});