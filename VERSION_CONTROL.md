# Version Control Guidelines

This document explains what files are ignored in version control and why.

## Files Ignored in Git

### Node.js and Dependencies
- `/node_modules`: Contains all installed dependencies. These should be installed using package managers.
- `.pnp.js` and `.pnp`: Yarn Plug'n'Play files.
- `yarn-debug.log*` and `yarn-error.log*`: Yarn log files.

### Build Output
- `/.next/`: Next.js build cache and output.
- `/out/`: Static export output.
- `/build`: Build artifacts.

### Environment Variables and Secrets
- `.env`: Contains sensitive environment variables like database connection strings.
- `.env.local`, `.env.development.local`, etc.: Environment-specific variables.

### Prisma
- `/prisma/migrations/`: Automatically generated database migration files.
- `/prisma/.env`: Prisma-specific environment variables.
- `/prisma/generated/`: Generated Prisma client code.
- `node_modules/.prisma/`: Prisma client cache.

### Database Files
- `*.db` and `*.db-journal`: SQLite database files (if used locally).

### Docker
- `docker-volume/`: Docker volume data directories.
- `/data/`: Data directories that might contain database files.

### IDE and Editor Files
- `.idea/`, `.vscode/`: IDE configuration directories.
- `*.swp`, `*.swo`: Vim swap files.
- `*.sublime-workspace`, `*.sublime-project`: Sublime Text files.

### OS Files
- `.DS_Store`: macOS folder metadata files.
- `Thumbs.db`: Windows thumbnail cache files.

## Files to Commit

You should commit:

1. Source code (`.js`, `.jsx`, `.ts`, `.tsx`, etc.)
2. Project configuration files (`package.json`, `next.config.js`, `tsconfig.json`, etc.)
3. Prisma schema (`schema.prisma`)
4. CSS and static assets
5. Documentation files
6. Docker and deployment configuration files 

## Managing Environment Variables

For environment variables, create a `.env.example` file with structure but no real values:

```
DATABASE_URL="postgresql://user:password@localhost:5432/mcat_tracker?schema=public"
```

This allows other developers to understand what environment variables are needed without exposing sensitive data. 