# Invoice Matching Task
An open-source invoice-matching task for behavioural and Information Systems research, together with a configurator for setting it up without writing code.

**Configurator (live):** [https://<org>.github.io/<repo>/](https://invoicematching.github.io/InvoiceMatchingTask/)

---

## Contents

| File | What it is |
|---|---|
| `index.html` | The configurator: set up the task, preview it live, and export ready-to-use code. Runs entirely in the browser. |
| `invoice-matching-task.js` | The task itself: a single-file web component, `<invoice-matching-task>`, that works on any web page or experiment platform (e.g. oTree). No framework needed on the host page. |
| `Configurator_720.mp4` | A short video walkthrough. |
| `LICENSE` | MIT license. |

---

## How the task works

Each round shows a **payment amount** and a list of **invoices** (8 by default). The participant ticks the invoices whose amounts add up exactly to the payment and clicks **Post**. Exactly one combination is correct. After an optional *Correct* / *Incorrect* message (600 ms), the next round starts. The task ends after a time limit, a number of submissions or correct submissions, or when the host stops it. An optional per-round time limit auto-submits the current selection.

---

### Difficulty levels

Six levels fix how many single-digit (1–9) and two-digit (10–99) invoices the correct answer contains, and how many **carries** its addition requires:

| Level | Single-digit | Two-digit | Carries | Example |
|---|---|---|---|---|
| 1 | 1 | 1 | 0 | 62 + 4 = 66 |
| 2 | 0 | 2 | 1 | 89 + 70 = 159 |
| 3 | 2 | 1 | 1 | 72 + 4 + 8 = 84 |
| 4 | 1 | 2 | 2 | 99 + 15 + 4 = 118 |
| 5 | 0 | 3 | 3 | 57 + 18 + 76 = 151 |
| 6 | 2 | 2 | 3 | 34 + 89 + 1 + 9 = 133 |

Carries are counted as in written column addition: a column whose digits (plus any incoming carry) reach 10 carries into the next one. `24 + 53` has no carry, `37 + 56` has one, `68 + 57` has two. The count is the total carried, so `9 + 9 + 9 = 27` counts as 2. Fixing the carry count per level keeps rounds within a level comparable.

By default the task starts at Level 1 and adapts within Levels 1–3; Levels 4–6 are available by raising `maxDifficulty`.

### Adaptive difficulty

By default the level rises by one after 4 consecutive correct answers and falls by one after 4 consecutive wrong answers (both thresholds configurable). Alternatively, adaptation can be switched off and the level set from outside, e.g. by an oTree server, with `setDifficulty(level)`. Every level change is logged together with its cause.

---

## Quick start

```html
<!doctype html>
<html>
  <body>
    <script src="https://cdn.jsdelivr.net/gh/InvoiceMatching/InvoiceMatchingTask/invoice-matching-task.js"></script>

    <invoice-matching-task
      task-duration="300"
      start-difficulty="1"
      max-submissions="20"
    ></invoice-matching-task>

    <script>
      const task = document.querySelector('invoice-matching-task');
      const log = [];

      // Listen for events before starting.
      task.addEventListener('invoiceTaskEvent', (event) => log.push(event.detail));

      customElements.whenDefined('invoice-matching-task').then(() => {
        requestAnimationFrame(() => task.start());
      });
    </script>
  </body>
</html>
```

You can also download `invoice-matching-task.js` and load it from your own server. The configurator generates this page, with your settings filled in, under **Generated code → HTML**.

---

## The Configurator
Open [the live configurator](https://invoicematching.github.io/InvoiceMatchingTask/) or download `index.html` and open it directly in a browser. No installation or server is needed.

- **Live preview** — the real task, not a mock-up. Every change is visible immediately, including the event stream.
- **All settings** — grouped as Difficulty, Feedback, Timing, Task volume, Session, Logging and Appearance (currency, colours, font).
- **Generated code** for your settings:
  - a bare `<invoice-matching-task>` tag with your options as attributes,
  - a complete, runnable `index.html`,
  - an **oTree page template**, in a **Basic** variant (the log is submitted with the page) and a **Live** variant (every event is streamed to the server).
- **Log viewer** — paste or upload an exported event log and read it as a table, to check a pilot run without writing analysis code.

The configurator only runs in your browser. It does not store, transmit or persist anything.

---

## Configuration options

Each option can be set as an HTML attribute (kebab-case, e.g. `task-duration`) or as a JavaScript property (camelCase, e.g. `taskDuration`). **Live** options can be changed while the task is running; the others are read when the task starts.

| Option | Type | Default | Live | Notes |
|---|---|---|---|---|
| `taskDuration` | seconds | `300` | | `0` = no time limit |
| `roundDuration` | seconds \| null | `null` | | Per-round limit; auto-submits when it runs out |
| `maxSubmissions` | integer \| null | `null` | ✓ | End after this many submissions |
| `maxCorrectSubmissions` | integer \| null | `null` | ✓ | End after this many correct submissions |
| `startDifficulty` | 1–6 | `1` | | Starting level |
| `minDifficulty` / `maxDifficulty` | 1–6 | `1` / `3` | | Range the level can move in |
| `adaptiveDifficulty` | boolean | `true` | ✓ | `false`: level stays fixed or is set via `setDifficulty()` |
| `correctStreakForLevelUp` | integer ≥ 1 | `4` | ✓ | Consecutive correct answers to go up a level |
| `wrongStreakForLevelDown` | integer ≥ 1 | `4` | ✓ | Consecutive wrong answers to go down a level |
| `numberOfOptions` | 3–12 | `8` | | Invoices shown per round |
| `invoiceOrder` | `random` \| `fixed` | `random` | | `fixed` makes rounds reproducible from `randomSeed` |
| `randomSeed` | string \| null | `null` | | Seed for `fixed` mode |
| `showTimer` | boolean | `true` | ✓ | Show the remaining time |
| `showFeedback` | boolean | `true` | ✓ | Show *Correct* / *Incorrect* after each submission |
| `showDifficulty` | boolean | `false` | ✓ | Show the current level to the participant |
| `currency` | `EUR` \| `GBP` \| `USD` | `EUR` | ✓ | Display only: `€ 57`, `£57`, `$57` |
| `completedMessage` | string | *"You have completed all invoice matching tasks."* | ✓ | Shown when the task ends |
| `sessionId` | string \| null | `null` | ✓ | Copied into every event, e.g. a participant ID |
| `logLevel` | `basic` \| `detailed` \| `debug` | `basic` | ✓ | `detailed` adds every click and pause |
| `mutedEvents` | list of event types | `[]` | ✓ | Event types to suppress |
| `autoStart` | boolean | `false` | | Start as soon as the element is ready |

Invalid values never break the task: the nearest valid value or the default is used, and a warning event records what was received and what was used.

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

```bash
git clone https://github.com/InvoiceMatching/InvoiceMatchingTask.git
cd InvoiceMatchingTask
open index.html   # or double-click it
```

`index.html` loads `invoice-matching-task.js` from the same folder, so keep the two files together.

---

## License

Released under the [MIT License](LICENSE).