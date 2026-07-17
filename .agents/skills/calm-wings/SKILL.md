```markdown
# calm-wings Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill introduces the development patterns and conventions used in the `calm-wings` TypeScript codebase. It covers file naming, import/export styles, commit message standards, and testing patterns. While no frameworks or automated workflows were detected, this guide will help you contribute code that aligns with the project's established practices.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `userProfile.ts`, `apiClient.ts`

### Import Style
- Use **relative imports** for referencing modules within the codebase.
  - Example:
    ```typescript
    import { fetchData } from './apiClient';
    ```

### Export Style
- **Mixed export style**: Both named and default exports are used.
  - Named export example:
    ```typescript
    export function calculateSum(a: number, b: number): number {
      return a + b;
    }
    ```
  - Default export example:
    ```typescript
    const config = { apiUrl: '...' };
    export default config;
    ```

### Commit Messages
- Use **conventional commit** format.
- Prefix with the type, e.g., `fix:`.
- Keep messages concise (average ~58 characters).
  - Example:  
    ```
    fix: correct typo in userProfile function
    ```

## Workflows

_No automated workflows detected in this repository._

## Testing Patterns

- **Test files** follow the pattern: `*.test.*`
  - Example: `userProfile.test.ts`
- **Testing framework** is unknown; check existing test files for patterns.
- To write a test:
  1. Create a file named after the module, ending with `.test.ts`.
  2. Place test cases inside using the project's preferred test syntax.

  Example:
  ```typescript
  // userProfile.test.ts
  import { getUserProfile } from './userProfile';

  test('should return user profile data', () => {
    const result = getUserProfile('user123');
    expect(result).toBeDefined();
  });
  ```

## Commands
| Command         | Purpose                                   |
|-----------------|-------------------------------------------|
| /test           | Run all test files                        |
| /lint           | Lint the codebase (if linter is configured)|
| /commit         | Create a conventional commit               |

```