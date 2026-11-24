# devotional-docket
A presentation harness for devotional texts

## Presentation
Themes and decorations live in presentation/ with independent registries. Add a theme directory with theme.css and register its ID; add a monochrome SVG in headers, dividers or footers and register its category and stable ID. Preferences are stored locally under devotional-docket.preferences.v1. Routes use #/theme/uuid with optional query overrides (size, spacing, width, header, divider, footer). Copy link shares the theme only; Copy customized link includes preferences. URL overrides do not automatically replace saved preferences. No build step.
