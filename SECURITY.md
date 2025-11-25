# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please follow these steps:

1. **Do not** open a public GitHub issue
2. Send a detailed report to the maintainers via [GitHub Security Advisories](https://github.com/wbfoss/cf-status-dashboard/security/advisories/new)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Response Timeline

- We will acknowledge receipt of your vulnerability report within **48 hours**
- We will provide a more detailed response within **7 days**
- We will work on a fix and coordinate disclosure with you

## Security Best Practices

This project:
- Does not store any user data
- Does not require authentication
- Fetches data only from Cloudflare's public status API
- Runs entirely client-side (no backend servers)

## Third-Party Dependencies

We regularly update dependencies to patch known vulnerabilities. You can check for vulnerable dependencies by running:

```bash
npm audit
```

---

Thank you for helping keep this project and its users safe!
