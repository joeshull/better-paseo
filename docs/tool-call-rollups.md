# Tool call rollup prototype

The **Tool call rollups** switch is in Better Paseo settings under Tools. It
defaults to Off. When On, two or more consecutive safe tool calls, including
different operations and files, share an expandable **Called N tools** header.
Running tools add a running count. Expansion reveals the existing rich cards
in their original source slots, with their own copy, preview and detail controls.

Assistant updates, user prompts, reasoning and every other source timeline item
end a run. Native assistant/user renderers remain native when their existing
enhancement switches are Off. Errors, failed/rejected/canceled calls, questions,
plans and agent interaction cards stay outside rollups. An agent waiting for
permission shows its tool cards individually; host permission controls remain
host-owned.

The persistent field is `toolCallRollups: boolean`, with missing or invalid
values falling back to `false`, in the existing `presentation` settings document
(host scope, schema version 1). It uses the existing daemon settings registration
and sync path. Each runtime plugin ID has its own settings document, so a temporary
`better-paseo-rollups` installation needs its own switch enabled. Disclosure choices
use the existing in-memory store and survive card remounts, but not a client reload.

## Deployment by the parent

This branch does not install, reload or disable plugins, edit daemon config, or
restart the daemon. The parent handles deployment and must ensure only one
Better Paseo instance transforms a timeline while testing.

Directory source (reads this worktree; a later source edit needs plugin reload):

```sh
paseo plugin install /home/joe/.paseo/worktrees/0ank7g6x/tool-call-rollups --id better-paseo-rollups
```

Fork branch (runs the manifest's existing installation build):

```sh
paseo plugin install git:joeshull/better-paseo --ref tool-call-rollups --id better-paseo-rollups
```

After deployment, enable **Tool call rollups**, leave **Assistant Markdown** and
**Enhanced user bubble** Off, and open an agent with multiple tools between its
assistant updates. Verify collapse/expand, a live running call completing, a
failed call, a question and a pending permission. Test both desktop and compact
layouts, then toggle rollups Off to recover the original file-operation groups.

## Offline showcase and checks

From `/home/joe/.paseo/worktrees/0ank7g6x/tool-call-rollups`:

```sh
npm ci --prefix /home/joe/.paseo/worktrees/0ank7g6x/tool-call-rollups/.showcase
CHROME_PATH=/home/joe/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome node /home/joe/.paseo/worktrees/0ank7g6x/tool-call-rollups/.showcase/tools/rollups-smoke.mjs
```

The smoke builds the existing showcase, tests its rollup scene with real summary
and tool-card components at desktop and 440px compact widths in both themes,
checks hidden source wrappers have zero height, and exercises expansion and
collapse with a failure still visible. Eight screenshots go under
`/home/joe/.paseo/worktrees/0ank7g6x/tool-call-rollups/.showcase/out/rollups`.
It simulates the observed Paseo 0.12 wrapper shape; it does not test a deployed
plugin or connect to a daemon. The source adjacency and live renderer tests
separately exercise native boundaries, inverted mounting, additions, failures,
permission waits, remounts and the setting toggle.

## Prototype ceilings

- Order is confirmed through Paseo 0.12's SDK `refetch`/`subscribe` and the existing
  shared page reader. Unknown, ambiguous duplicate or incomplete source data
  leaves calls standalone. A read covers the recent 50 rows plus at most ten
  older pages (about 2050 rows). Calls deeper than that remain standalone.
  Retaining covered pages/cursors, as the existing sender store does, is the
  upgrade path if deeper history matters.
- Groups cover mounted, source-adjacent members only. Virtualization can split a
  run and change its count/head as rows mount or leave. Missing members never get
  invented or pulled from outside the window. Native text boundaries remain safe.
- Web/desktop spacing uses narrowly scoped CSS for the host wrapper containing an
  explicitly marked collapsed member, including the observed `display:contents`
  bridge. No DOM inspection determines grouping. Older browsers without `:has`
  or a changed wrapper shape can retain blank gaps. React Native uses the same
  grouping and disclosure, but a native host with 16pt outer slot margins can
  retain those gaps. A host API for hiding source slots, or source-preserving
  grouped projection, removes this ceiling; no native host API is assumed here.
- Hermes checks compile both the source client bundle and the install-built
  bundle/Tasks chunk. This machine has `hermesc` but no Hermes VM, so runtime
  evaluation in that VM is skipped. Browser smoke is not an iOS/Android device run.

API references checked: [current plugin reference](https://paseo.sh/docs/plugins/reference.md)
and the locally installed `@getpaseo/plugin`/`@getpaseo/client` 0.12.0 contracts.
No newer timeline or settings API is required.
