/**
 * Security Auditor for Admin Panel
 * Comprehensive Security Analysis and Recommendations
 */

interface SecurityVulnerability {
        id: string;
        type: 'xss' | 'csrf' | 'injection' | 'authentication' | 'authorization' | 'data_exposure' | 'configuration';
        severity: 'low' | 'medium' | 'high' | 'critical';
        description: string;
        location: string;
        recommendation: string;
        cwe?: string; // Common Weakness Enumeration ID
        owasp?: string; // OWASP Top 10 reference
}

interface SecurityScore {
        overall: number;
        authentication: number;
        authorization: number;
        dataProtection: number;
        inputValidation: number;
        configuration: number;
        communication: number;
}

interface SecurityReport {
        timestamp: Date;
        score: SecurityScore;
        vulnerabilities: SecurityVulnerability[];
        recommendations: string[];
        compliances: {
                owasp: boolean;
                gdpr: boolean;
                iso27001: boolean;
        };
}

class SecurityAuditor {
        private vulnerabilities: SecurityVulnerability[] = [];
        private securityHeaders: Record<string, string> = {};

        constructor() {
                this.initializeSecurityMonitoring();
        }

        private initializeSecurityMonitoring(): void {
                // Monitor for potential security issues
                this.monitorConsoleErrors();
                this.checkSecurityHeaders();
                this.setupCSPViolationReporting();
        }

        // Authentication Security Audit
        auditAuthentication(): SecurityVulnerability[] {
                const vulnerabilities: SecurityVulnerability[] = [];

                // Check for JWT security
                const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
                if (token) {
                        const jwtIssues = this.analyzeJWT(token);
                        vulnerabilities.push(...jwtIssues);
                }

                // Check password policies
                const passwordPolicy = this.checkPasswordPolicy();
                if (!passwordPolicy.isStrong) {
                        vulnerabilities.push({
                                id: 'weak-password-policy',
                                type: 'authentication',
                                severity: 'medium',
                                description: 'پالیسی رمز عبور ضعیف است',
                                location: 'Authentication System',
                                recommendation: 'پیاده‌سازی پالیسی رمز عبور قوی با حداقل 8 کاراکتر، اعداد و نمادها',
                                cwe: 'CWE-521',
                                owasp: 'A07:2021 – Identification and Authentication Failures'
                        });
                }

                // Check session management
                const sessionIssues = this.auditSessionManagement();
                vulnerabilities.push(...sessionIssues);

                // Check for multi-factor authentication
                if (!this.hasMFA()) {
                        vulnerabilities.push({
                                id: 'missing-mfa',
                                type: 'authentication',
                                severity: 'high',
                                description: 'احراز هویت دومرحله‌ای پیاده‌سازی نشده است',
                                location: 'Login System',
                                recommendation: 'پیاده‌سازی احراز هویت دومرحله‌ای (2FA/MFA)',
                                cwe: 'CWE-308',
                                owasp: 'A07:2021 – Identification and Authentication Failures'
                        });
                }

                return vulnerabilities;
        }

        // Authorization Security Audit
        auditAuthorization(): SecurityVulnerability[] {
                const vulnerabilities: SecurityVulnerability[] = [];

                // Check for role-based access control
                if (!this.hasRBAC()) {
                        vulnerabilities.push({
                                id: 'missing-rbac',
                                type: 'authorization',
                                severity: 'high',
                                description: 'کنترل دسترسی مبتنی بر نقش پیاده‌سازی نشده است',
                                location: 'Authorization System',
                                recommendation: 'پیاده‌سازی سیستم کنترل دسترسی مبتنی بر نقش (RBAC)',
                                cwe: 'CWE-862',
                                owasp: 'A01:2021 – Broken Access Control'
                        });
                }

                // Check for privilege escalation vulnerabilities
                const privilegeIssues = this.checkPrivilegeEscalation();
                vulnerabilities.push(...privilegeIssues);

                // Check API authorization
                const apiAuthIssues = this.auditAPIAuthorization();
                vulnerabilities.push(...apiAuthIssues);

                return vulnerabilities;
        }

        // Input Validation Audit
        auditInputValidation(): SecurityVulnerability[] {
                const vulnerabilities: SecurityVulnerability[] = [];

                // Check for XSS vulnerabilities
                const xssIssues = this.checkXSSVulnerabilities();
                vulnerabilities.push(...xssIssues);

                // Check for SQL injection (if applicable)
                const sqlInjectionIssues = this.checkSQLInjection();
                vulnerabilities.push(...sqlInjectionIssues);

                // Check for CSRF protection
                if (!this.hasCSRFProtection()) {
                        vulnerabilities.push({
                                id: 'missing-csrf-protection',
                                type: 'csrf',
                                severity: 'high',
                                description: 'محافظت در برابر CSRF پیاده‌سازی نشده است',
                                location: 'Form Submissions',
                                recommendation: 'پیاده‌سازی CSRF tokens برای تمام فرم‌ها',
                                cwe: 'CWE-352',
                                owasp: 'A01:2021 – Broken Access Control'
                        });
                }

                // Check input sanitization
                const sanitizationIssues = this.checkInputSanitization();
                vulnerabilities.push(...sanitizationIssues);

                return vulnerabilities;
        }

        // Data Protection Audit
        auditDataProtection(): SecurityVulnerability[] {
                const vulnerabilities: SecurityVulnerability[] = [];

                // Check for sensitive data exposure
                const dataExposureIssues = this.checkSensitiveDataExposure();
                vulnerabilities.push(...dataExposureIssues);

                // Check encryption practices
                if (!this.hasProperEncryption()) {
                        vulnerabilities.push({
                                id: 'weak-encryption',
                                type: 'data_exposure',
                                severity: 'high',
                                description: 'رمزنگاری مناسب برای داده‌های حساس اعمال نشده است',
                                location: 'Data Storage',
                                recommendation: 'استفاده از الگوریتم‌های رمزنگاری قوی (AES-256) برای داده‌های حساس',
                                cwe: 'CWE-326',
                                owasp: 'A02:2021 – Cryptographic Failures'
                        });
                }

                // Check for data retention policies
                if (!this.hasDataRetentionPolicy()) {
                        vulnerabilities.push({
                                id: 'missing-data-retention',
                                type: 'data_exposure',
                                severity: 'medium',
                                description: 'پالیسی نگهداری داده تعریف نشده است',
                                location: 'Data Management',
                                recommendation: 'تعریف و پیاده‌سازی پالیسی نگهداری و حذف داده‌ها',
                                cwe: 'CWE-359'
                        });
                }

                return vulnerabilities;
        }

        // Configuration Security Audit
        auditConfiguration(): SecurityVulnerability[] {
                const vulnerabilities: SecurityVulnerability[] = [];

                // Check security headers
                const headerIssues = this.checkSecurityHeaders();
                vulnerabilities.push(...headerIssues);

                // Check HTTPS enforcement
                if (!this.isHTTPSEnforced()) {
                        vulnerabilities.push({
                                id: 'missing-https',
                                type: 'configuration',
                                severity: 'high',
                                description: 'HTTPS به طور کامل اجبار نشده است',
                                location: 'Network Configuration',
                                recommendation: 'اجبار استفاده از HTTPS و پیاده‌سازی HSTS',
                                cwe: 'CWE-319',
                                owasp: 'A02:2021 – Cryptographic Failures'
                        });
                }

                // Check Content Security Policy
                if (!this.hasCSP()) {
                        vulnerabilities.push({
                                id: 'missing-csp',
                                type: 'configuration',
                                severity: 'medium',
                                description: 'Content Security Policy تنظیم نشده است',
                                location: 'HTTP Headers',
                                recommendation: 'پیاده‌سازی Content Security Policy برای جلوگیری از XSS',
                                cwe: 'CWE-79',
                                owasp: 'A03:2021 – Injection'
                        });
                }

                // Check for development/debug modes in production
                if (this.isDebugModeEnabled()) {
                        vulnerabilities.push({
                                id: 'debug-mode-enabled',
                                type: 'configuration',
                                severity: 'critical',
                                description: 'حالت debug در محیط production فعال است',
                                location: 'Application Configuration',
                                recommendation: 'غیرفعال کردن حالت debug در محیط production',
                                cwe: 'CWE-489',
                                owasp: 'A05:2021 – Security Misconfiguration'
                        });
                }

                return vulnerabilities;
        }

        // JWT Analysis
        private analyzeJWT(token: string): SecurityVulnerability[] {
                const vulnerabilities: SecurityVulnerability[] = [];

                try {
                        const payload = JSON.parse(atob(token.split('.')[1]));

                        // Check expiration
                        if (!payload.exp) {
                                vulnerabilities.push({
                                        id: 'jwt-no-expiration',
                                        type: 'authentication',
                                        severity: 'high',
                                        description: 'JWT فاقد زمان انقضا است',
                                        location: 'JWT Token',
                                        recommendation: 'تنظیم زمان انقضای مناسب برای JWT tokens',
                                        cwe: 'CWE-613'
                                });
                        } else {
                                const expirationTime = payload.exp * 1000;
                                const timeToExpire = expirationTime - Date.now();

                                if (timeToExpire > 24 * 60 * 60 * 1000) { // More than 24 hours
                                        vulnerabilities.push({
                                                id: 'jwt-long-expiration',
                                                type: 'authentication',
                                                severity: 'medium',
                                                description: 'زمان انقضای JWT بیش از حد طولانی است',
                                                location: 'JWT Token',
                                                recommendation: 'کاهش زمان انقضای JWT به حداکثر 24 ساعت',
                                                cwe: 'CWE-613'
                                        });
                                }
                        }

                        // Check for sensitive data in JWT
                        const sensitiveFields = ['password', 'ssn', 'credit_card', 'secret'];
                        for (const field of sensitiveFields) {
                                if (payload[field]) {
                                        vulnerabilities.push({
                                                id: 'jwt-sensitive-data',
                                                type: 'data_exposure',
                                                severity: 'critical',
                                                description: 'اطلاعات حساس در JWT قرار دارد',
                                                location: 'JWT Payload',
                                                recommendation: 'حذف اطلاعات حساس از JWT payload',
                                                cwe: 'CWE-200'
                                        });
                                }
                        }

                } catch (error) {
                        vulnerabilities.push({
                                id: 'jwt-invalid-format',
                                type: 'authentication',
                                severity: 'high',
                                description: 'فرمت JWT معتبر نیست',
                                location: 'JWT Token',
                                recommendation: 'بررسی و تصحیح فرمت JWT',
                                cwe: 'CWE-345'
                        });
                }

                return vulnerabilities;
        }

        // Password Policy Check
        private checkPasswordPolicy(): { isStrong: boolean; issues: string[] } {
                // Simulate password policy check
                const issues: string[] = [];

                // These would typically be checked against actual policy configuration
                const hasMinLength = true; // Minimum 8 characters
                const hasComplexity = false; // Requires numbers, symbols
                const hasExpiration = false; // Password expiration policy
                const preventReuse = false; // Prevent password reuse

                if (!hasMinLength) issues.push('حداقل طول رمز عبور');
                if (!hasComplexity) issues.push('پیچیدگی رمز عبور');
                if (!hasExpiration) issues.push('انقضای رمز عبور');
                if (!preventReuse) issues.push('جلوگیری از استفاده مجدد رمز عبور');

                return {
                        isStrong: issues.length === 0,
                        issues
                };
        }

        // Session Management Audit
        private auditSessionManagement(): SecurityVulnerability[] {
                const vulnerabilities: SecurityVulnerability[] = [];

                // Check session timeout
                const sessionTimeout = sessionStorage.getItem('sessionTimeout');
                if (!sessionTimeout) {
                        vulnerabilities.push({
                                id: 'missing-session-timeout',
                                type: 'authentication',
                                severity: 'medium',
                                description: 'تایم‌اوت session تنظیم نشده است',
                                location: 'Session Management',
                                recommendation: 'تنظیم تایم‌اوت مناسب برای session های کاربری',
                                cwe: 'CWE-613'
                        });
                }

                // Check secure session storage
                if (localStorage.getItem('authToken')) {
                        vulnerabilities.push({
                                id: 'insecure-token-storage',
                                type: 'authentication',
                                severity: 'medium',
                                description: 'token در localStorage ذخیره شده که امن نیست',
                                location: 'Token Storage',
                                recommendation: 'استفاده از httpOnly cookies یا sessionStorage برای tokens',
                                cwe: 'CWE-522'
                        });
                }

                return vulnerabilities;
        }

        // XSS Vulnerability Check
        private checkXSSVulnerabilities(): SecurityVulnerability[] {
                const vulnerabilities: SecurityVulnerability[] = [];

                // Check for dangerous innerHTML usage
                const scriptElements = document.scripts;
                for (let i = 0; i < scriptElements.length; i++) {
                        const script = scriptElements[i];
                        if (script.innerHTML.includes('innerHTML') && !script.innerHTML.includes('sanitize')) {
                                vulnerabilities.push({
                                        id: 'potential-xss-innerhtml',
                                        type: 'xss',
                                        severity: 'high',
                                        description: 'استفاده از innerHTML بدون sanitization',
                                        location: `Script element ${i + 1}`,
                                        recommendation: 'استفاده از textContent یا sanitization library',
                                        cwe: 'CWE-79',
                                        owasp: 'A03:2021 – Injection'
                                });
                        }
                }

                // Check for eval usage
                if (this.containsEval()) {
                        vulnerabilities.push({
                                id: 'dangerous-eval-usage',
                                type: 'xss',
                                severity: 'critical',
                                description: 'استفاده از eval() که خطرناک است',
                                location: 'JavaScript Code',
                                recommendation: 'حذف استفاده از eval() و استفاده از روش‌های امن',
                                cwe: 'CWE-95',
                                owasp: 'A03:2021 – Injection'
                        });
                }

                return vulnerabilities;
        }

        // Input Sanitization Check
        private checkInputSanitization(): SecurityVulnerability[] {
                const vulnerabilities: SecurityVulnerability[] = [];

                // Check form inputs for sanitization
                const forms = document.querySelectorAll('form');
                forms.forEach((form, index) => {
                        const inputs = form.querySelectorAll('input, textarea');

                        inputs.forEach((input, inputIndex) => {
                                const htmlInput = input as HTMLInputElement;

                                // Check if input has validation
                                if (!htmlInput.pattern && !htmlInput.required && htmlInput.type === 'text') {
                                        vulnerabilities.push({
                                                id: `form-${index}-input-${inputIndex}-no-validation`,
                                                type: 'injection',
                                                severity: 'medium',
                                                description: 'فیلد ورودی فاقد validation است',
                                                location: `Form ${index + 1}, Input ${inputIndex + 1}`,
                                                recommendation: 'اعمال validation و sanitization مناسب',
                                                cwe: 'CWE-20'
                                        });
                                }
                        });
                });

                return vulnerabilities;
        }

        // Security Headers Check
        private checkSecurityHeaders(): SecurityVulnerability[] {
                const vulnerabilities: SecurityVulnerability[] = [];
                const requiredHeaders = [
                        'X-Frame-Options',
                        'X-Content-Type-Options',
                        'Referrer-Policy',
                        'Permissions-Policy'
                ];

                // Note: In a real implementation, these would be checked from actual HTTP response headers
                requiredHeaders.forEach(header => {
                        if (!this.securityHeaders[header]) {
                                vulnerabilities.push({
                                        id: `missing-header-${header.toLowerCase()}`,
                                        type: 'configuration',
                                        severity: 'medium',
                                        description: `هدر امنیتی ${header} تنظیم نشده است`,
                                        location: 'HTTP Headers',
                                        recommendation: `تنظیم هدر ${header} با مقدار مناسب`,
                                        cwe: 'CWE-16'
                                });
                        }
                });

                return vulnerabilities;
        }

        // Helper Methods
        private hasMFA(): boolean {
                // Check if MFA is implemented
                return sessionStorage.getItem('mfaEnabled') === 'true';
        }

        private hasRBAC(): boolean {
                // Check if role-based access control is implemented
                return localStorage.getItem('userRole') !== null;
        }

        private hasCSRFProtection(): boolean {
                // Check for CSRF tokens in forms
                const forms = document.querySelectorAll('form');
                for (const form of forms) {
                        if (!form.querySelector('input[name="_token"]') &&
                                !form.querySelector('meta[name="csrf-token"]')) {
                                return false;
                        }
                }
                return true;
        }

        private hasProperEncryption(): boolean {
                // This would check encryption implementation
                return true; // Placeholder
        }

        private hasDataRetentionPolicy(): boolean {
                // Check if data retention policy is defined
                return false; // Placeholder
        }

        private isHTTPSEnforced(): boolean {
                return location.protocol === 'https:' || location.hostname === 'localhost';
        }

        private hasCSP(): boolean {
                const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
                return metaCSP !== null;
        }

        private isDebugModeEnabled(): boolean {
                // Check for debug indicators
                return window.location.search.includes('debug=true') ||
                        localStorage.getItem('debug') === 'true' ||
                        (window as any).DEBUG === true;
        }

        private containsEval(): boolean {
                // This is a simplified check - in reality would scan actual code
                return false; // Placeholder
        }

        private checkPrivilegeEscalation(): SecurityVulnerability[] {
                const vulnerabilities: SecurityVulnerability[] = [];

                // Check for admin endpoints accessible to non-admin users
                const userRole = localStorage.getItem('userRole');
                const currentPath = window.location.pathname;

                if (currentPath.includes('/admin/') && userRole !== 'admin') {
                        vulnerabilities.push({
                                id: 'privilege-escalation-admin-access',
                                type: 'authorization',
                                severity: 'critical',
                                description: 'دسترسی غیرمجاز به بخش مدیریت',
                                location: 'Admin Routes',
                                recommendation: 'بررسی و تقویت کنترل دسترسی به روت‌های مدیریت',
                                cwe: 'CWE-269',
                                owasp: 'A01:2021 – Broken Access Control'
                        });
                }

                return vulnerabilities;
        }

        private checkSQLInjection(): SecurityVulnerability[] {
                // This would check for SQL injection vulnerabilities in API calls
                // For a React frontend, this is more relevant for the backend
                return [];
        }

        private auditAPIAuthorization(): SecurityVulnerability[] {
                const vulnerabilities: SecurityVulnerability[] = [];

                // Check if API calls include proper authorization headers
                const hasAuthHeader = this.checkAPIAuthHeaders();
                if (!hasAuthHeader) {
                        vulnerabilities.push({
                                id: 'missing-api-auth',
                                type: 'authorization',
                                severity: 'high',
                                description: 'درخواست‌های API فاقد هدر authorization مناسب هستند',
                                location: 'API Calls',
                                recommendation: 'اضافه کردن Authorization header به تمام درخواست‌های API',
                                cwe: 'CWE-862'
                        });
                }

                return vulnerabilities;
        }

        private checkAPIAuthHeaders(): boolean {
                // This would check if fetch/axios interceptors include auth headers
                return true; // Placeholder
        }

        private checkSensitiveDataExposure(): SecurityVulnerability[] {
                const vulnerabilities: SecurityVulnerability[] = [];

                // Check for sensitive data in console logs
                if (this.hasSensitiveDataInConsole()) {
                        vulnerabilities.push({
                                id: 'sensitive-data-console',
                                type: 'data_exposure',
                                severity: 'medium',
                                description: 'اطلاعات حساس در console log نمایش داده می‌شود',
                                location: 'Console Logs',
                                recommendation: 'حذف یا ماسک کردن اطلاعات حساس از console logs',
                                cwe: 'CWE-532'
                        });
                }

                // Check for sensitive data in local storage
                const sensitiveKeys = ['password', 'ssn', 'credit_card', 'api_key', 'secret'];
                for (const key of sensitiveKeys) {
                        if (localStorage.getItem(key) || sessionStorage.getItem(key)) {
                                vulnerabilities.push({
                                        id: `sensitive-data-storage-${key}`,
                                        type: 'data_exposure',
                                        severity: 'high',
                                        description: `اطلاعات حساس (${key}) در local/session storage ذخیره شده است`,
                                        location: 'Browser Storage',
                                        recommendation: 'حذف اطلاعات حساس از browser storage',
                                        cwe: 'CWE-922'
                                });
                        }
                }

                return vulnerabilities;
        }

        private hasSensitiveDataInConsole(): boolean {
                // This would check console history for sensitive data patterns
                return false; // Placeholder
        }

        private monitorConsoleErrors(): void {
                const originalError = console.error;
                console.error = (...args) => {
                        // Monitor for security-related errors
                        const message = args.join(' ');
                        if (message.includes('CSP') || message.includes('CORS') || message.includes('Mixed Content')) {
                                console.warn('🔒 Security-related error detected:', message);
                        }
                        originalError.apply(console, args);
                };
        }

        private setupCSPViolationReporting(): void {
                document.addEventListener('securitypolicyviolation', (event) => {
                        console.warn('🔒 CSP Violation:', {
                                blockedURI: event.blockedURI,
                                violatedDirective: event.violatedDirective,
                                originalPolicy: event.originalPolicy
                        });

                        // In a real implementation, this would be sent to a security monitoring service
                });
        }

        // Main Audit Method
        async performSecurityAudit(): Promise<SecurityReport> {
                console.log('🔒 Starting comprehensive security audit...');

                const vulnerabilities: SecurityVulnerability[] = [];

                // Run all audit checks
                vulnerabilities.push(...this.auditAuthentication());
                vulnerabilities.push(...this.auditAuthorization());
                vulnerabilities.push(...this.auditInputValidation());
                vulnerabilities.push(...this.auditDataProtection());
                vulnerabilities.push(...this.auditConfiguration());

                this.vulnerabilities = vulnerabilities;

                // Calculate security score
                const score = this.calculateSecurityScore(vulnerabilities);

                // Generate recommendations
                const recommendations = this.generateRecommendations(vulnerabilities);

                // Check compliance
                const compliances = this.checkCompliances(vulnerabilities);

                const report: SecurityReport = {
                        timestamp: new Date(),
                        score,
                        vulnerabilities,
                        recommendations,
                        compliances
                };

                console.log('🔒 Security audit completed');
                console.log(`📊 Overall Security Score: ${score.overall}/100`);
                console.log(`🚨 Found ${vulnerabilities.length} security issues`);

                return report;
        }

        private calculateSecurityScore(vulnerabilities: SecurityVulnerability[]): SecurityScore {
                const initialScore = 100;
                let totalDeduction = 0;

                const categoryScores = {
                        authentication: 100,
                        authorization: 100,
                        dataProtection: 100,
                        inputValidation: 100,
                        configuration: 100,
                        communication: 100
                };

                vulnerabilities.forEach(vuln => {
                        let deduction = 0;
                        switch (vuln.severity) {
                                case 'critical': deduction = 25; break;
                                case 'high': deduction = 15; break;
                                case 'medium': deduction = 8; break;
                                case 'low': deduction = 3; break;
                        }

                        totalDeduction += deduction;

                        // Deduct from specific categories
                        switch (vuln.type) {
                                case 'authentication':
                                        categoryScores.authentication = Math.max(0, categoryScores.authentication - deduction);
                                        break;
                                case 'authorization':
                                        categoryScores.authorization = Math.max(0, categoryScores.authorization - deduction);
                                        break;
                                case 'data_exposure':
                                        categoryScores.dataProtection = Math.max(0, categoryScores.dataProtection - deduction);
                                        break;
                                case 'xss':
                                case 'injection':
                                        categoryScores.inputValidation = Math.max(0, categoryScores.inputValidation - deduction);
                                        break;
                                case 'configuration':
                                        categoryScores.configuration = Math.max(0, categoryScores.configuration - deduction);
                                        break;
                        }
                });

                return {
                        overall: Math.max(0, initialScore - totalDeduction),
                        authentication: categoryScores.authentication,
                        authorization: categoryScores.authorization,
                        dataProtection: categoryScores.dataProtection,
                        inputValidation: categoryScores.inputValidation,
                        configuration: categoryScores.configuration,
                        communication: categoryScores.communication
                };
        }

        private generateRecommendations(vulnerabilities: SecurityVulnerability[]): string[] {
                const recommendations = new Set<string>();

                vulnerabilities.forEach(vuln => {
                        recommendations.add(vuln.recommendation);
                });

                // Add general recommendations
                recommendations.add('🔐 پیاده‌سازی ورود دومرحله‌ای (2FA)');
                recommendations.add('🛡️ به‌روزرسانی منظم کتابخانه‌ها و dependencies');
                recommendations.add('📝 ایجاد و پیاده‌سازی Security Policy');
                recommendations.add('🔍 اجرای منظم Security Audit');
                recommendations.add('📊 نظارت و logging فعالیت‌های امنیتی');

                return Array.from(recommendations);
        }

        private checkCompliances(vulnerabilities: SecurityVulnerability[]): any {
                const criticalVulns = vulnerabilities.filter(v => v.severity === 'critical').length;
                const highVulns = vulnerabilities.filter(v => v.severity === 'high').length;

                return {
                        owasp: criticalVulns === 0 && highVulns <= 2,
                        gdpr: !vulnerabilities.some(v => v.type === 'data_exposure' && v.severity === 'high'),
                        iso27001: criticalVulns === 0 && highVulns <= 1
                };
        }
}

export default SecurityAuditor; 