# jobtracker

A small TypeScript CLI for tracking job applications, daily targets, and streaks. I built this for my own DevOps/SRE job hunt — wanted something faster than a spreadsheet and right in the terminal where I already am.

```
$ jobs today

Today
  ████████████░░░░░░░░░░░░  3/6  (50%)

3 more to hit today's target. Current streak: 4d.
```

## Install

```bash
git clone https://github.com/<you>/jobtracker.git
cd jobtracker
npm install
npm run build
npm link    # puts `jobs` on your PATH
```

Requires Node 18+.

## Commands

| Command | What it does |
|---|---|
| `jobs add` | Interactive prompt to log a new application |
| `jobs list` | Recent applications as a table |
| `jobs list --status interview` | Filter by status |
| `jobs list --limit 50` | Limit results |
| `jobs today` | Progress bar against your daily target |
| `jobs streak` | Current streak, longest streak, active days |
| `jobs update <id>` | Change status or notes |
| `jobs stats` | Totals, response rate, status breakdown |

Statuses: `applied`, `screening`, `interview`, `offer`, `rejected`, `ghosted`.

## How it works

```
src/
├── index.ts            # CLI entry, commander setup
├── commands/           # one file per subcommand
│   ├── add.ts
│   ├── list.ts
│   ├── today.ts
│   ├── streak.ts
│   ├── update.ts
│   └── stats.ts
└── lib/
    ├── storage.ts      # atomic JSON read/write to ~/.jobtracker/data.json
    ├── streak.ts       # streak calculation
    └── types.ts        # shared types
```

Data lives at `~/.jobtracker/data.json`. No database, no cloud, no telemetry.

### Atomic writes

`saveData` writes to a temp file then renames. If the process is killed mid-write, the original file stays intact.

### Streak logic

A day "counts" if at least one application was logged. The current streak walks backward from today (or yesterday, since today might not be done yet). Dates are normalised to UTC `YYYY-MM-DD` keys to keep tests deterministic — a known tradeoff for users in extreme timezones.

## Tests

```bash
npm test
```

The streak logic is the most non-trivial piece. It's covered by `tests/streak.test.ts`.

## Stack

- TypeScript (strict mode)
- [commander](https://github.com/tj/commander.js) for arg parsing
- [inquirer](https://github.com/SBoudrias/Inquirer.js) for interactive prompts
- [chalk](https://github.com/chalk/chalk) + [cli-table3](https://github.com/cli-table/cli-table3) for output
- [vitest](https://vitest.dev/) for tests

## License

MIT — by [Wasim](https://wasims.vercel.app).
