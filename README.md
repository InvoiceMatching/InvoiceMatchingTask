# Invoice Matching Configurator

A single-page tool for configuring the Invoice Matching Task web component, previewing it live, and exporting ready-to-use code — no build step, no install.

**Live:** [https://<org>.github.io/<repo>/](https://invoicematching.github.io/InvoiceMatchingTask/)

---

## What it does

- **Live preview** — the real component, not a mock-up. Change a setting, watch the task update immediately, including the live event stream.
- **Generated code** — three copy-paste outputs for your chosen settings:
  - a bare `<invoice-matching-task>` tag with your options as attributes
  - a complete, runnable `index.html` (plain HTML host)
  - an **oTree page template**, in Basic and Live variants
- **Log viewer** — paste or upload an exported event-log JSON array and inspect it as a table, so you can sanity-check a pilot run without writing analysis code.

The configurator itself is static and client-side only. It doesn't store, transmit, or persist anything — it just builds config and hands you code.

---

## Configuration options

Every control in the configurator maps 1:1 to a component option (kebab-case as an HTML attribute, camelCase as a JS property). The most common ones:

| Option | Type | Default | Notes |
|---|---|---|---|
| `taskDuration` | int (sec) | `300` | `0`/`null` = no time limit |
| `roundDuration` | int (sec) \| null | `null` | Per-round limit; auto-submits on expiry |
| `startDifficulty` / `minDifficulty` / `maxDifficulty` | int 1–6 | `1` / `1` / `3` | Levels 4–6 are opt-in |
| `adaptiveDifficulty` | bool | `true` | `false` lets you drive difficulty yourself via `setDifficulty()` |
| `correctStreakForLevelUp` / `wrongStreakForLevelDown` | int ≥ 1 | `4` / `4` | Consecutive right/wrong answers before the level moves |
| `numberOfOptions` | int 3–12 | `8` | Invoices shown per round |
| `invoiceOrder` / `randomSeed` | enum / string | `"random"` / `null` | Set `"fixed"` + a seed for reproducible rounds |
| `maxSubmissions` / `maxCorrectSubmissions` | int \| null | `null` / `null` | Caps that end the task early |
| `showTimer` / `showFeedback` / `showDifficulty` | bool | `true` / `true` / `false` | Participant-facing UI toggles |
| `logLevel` / `mutedEvents` | enum / string[] | `"basic"` / `[]` | Controls which events are emitted |

---

## Using the generated snippet in oTree

1. In the configurator, dial in your settings, then open the **Generated code → oTree** tab and pick **Basic** (single end-of-task submit) or **Live** (streams every event to the server via `live_method`).
2. Paste the output into your oTree page template, e.g. `your_app/templates/your_app/InvoiceTask.html`.
3. Add a field to store the log on the `Player` model — use `LongStringField`, not `StringField`, since the event log can exceed `StringField`'s length limit:

   ```python
   # your_app/__init__.py
   class Player(BasePlayer):
       invoice_log = models.LongStringField(initial='[]')

   class InvoiceTask(Page):
       form_model = 'player'
       form_fields = ['invoice_log']
   ```

4. Copy the built component bundle (`invoice-matching-task.js`) into `your_app/static/your_app/`, and reference it with `{{ static 'your_app/invoice-matching-task.js' }}`. Alternatively, just reference the file hosted on GitHub `https://cdn.jsdelivr.net/gh/InvoiceMatching/InvoiceMatchingTask/invoice-matching-task.js`
5. The generated template auto-starts the task, accumulates every event into a hidden `input[name="invoice_log"]`, and clicks oTree's `{{ next_button }}` when `taskFinished` fires — so the normal oTree submit flow carries the log to the server. No extra JS needed on your part.
6. For the **Live** variant, add a `live_method` on the page to receive each event server-side as it happens (useful for server-driven difficulty or real-time monitoring).

---

## Running locally

No build step required:

```bash
git clone https://github.com/InvoiceMatching/InvoiceMatchingTask.git
open index.html   # or just double-click it
```

---
