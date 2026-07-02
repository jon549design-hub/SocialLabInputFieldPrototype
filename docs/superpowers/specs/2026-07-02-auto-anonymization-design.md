# Auto-Anonymization Modal Design

## Purpose

Give people using the Inline nudges version a one-time way to enable automatic privacy protection when they try to send a message containing privacy highlights.

## Interaction

1. The user presses Send.
2. In the Inline nudges version, if the message has unresolved privacy highlights and auto-anonymization has not been configured, a small centered modal appears over the interface.
3. The modal heading reads: "Want to turn on auto-anonymization?"
4. The modal lists the prototype's four privacy categories: Name, Contact, Location, and Timing.
5. Every category is enabled by default. Each row has a toggle on the right.
6. Selecting "Turn on" stores the chosen categories for the rest of the browser session, applies the existing protected treatment to matching highlights, and sends the current message.
7. Future messages automatically protect findings in enabled categories and send without showing the modal again.
8. Categories the user disables are intentionally sent without the protected treatment.
9. Selecting "Send without anonymizing" sends the current message unchanged and does not enable auto-anonymization.
10. Pressing Escape or clicking outside the modal closes it without sending.
11. Template, Privacy grade, Privacy color, and Onboarding send normally without the modal or privacy-based Send button colors.
12. Each category name has a small info button. Its tooltip opens on hover, keyboard focus, or tap and closes on pointer leave, focus loss, outside tap, or Escape.

## Category Explanations

- Name: People's names that could identify who you're talking about.
- Contact: Email addresses or phone numbers that can identify or reach someone.
- Location: Places that may reveal where someone is or plans to be.
- Timing: Dates or times that may reveal routines or future plans.

## Visual Design

The modal is compact and uses the prototype's existing typography, spacing, colors, and button styling. It sits above a subtle dimmed backdrop. The primary action uses the current product accent color. The secondary action is visually quieter. Toggles clearly show on and off states and can be operated by keyboard.

An outlined info icon sits directly after each category name without changing the row height. Its compact dark tooltip is positioned within the modal width, uses one or two lines, and remains readable in light and dark modes.

## State And Data

The composer owns three new pieces of temporary state: whether the modal is open, whether auto-anonymization is enabled, and which privacy categories are enabled. This state lasts while the current prototype page remains open; it is not stored permanently.

The existing privacy analysis remains unchanged. Its finding category values determine which toggle applies to each highlight. The existing secured-highlight state continues to provide the green protected appearance.

## Edge Cases

- A message without privacy findings sends normally.
- A message whose findings were all manually secured sends normally.
- The modal appears only when unresolved findings remain.
- The modal and red/green Send states appear only in the Inline nudges version.
- If analysis is still running when Send is pressed, the composer performs an immediate local analysis before deciding whether to show the modal.
- Turning every category off is allowed because it is an explicit user choice; the message is then sent without applying protection.

## Verification

- Confirm the modal appears on the first risky Send action.
- Confirm all four toggles start on and can be changed.
- Confirm Turn on sends and prevents the modal from returning on later messages.
- Confirm only enabled categories receive the protected state.
- Confirm Send without anonymizing sends and leaves auto-anonymization disabled.
- Confirm Escape, backdrop click, keyboard focus, desktop layout, and mobile layout work correctly.
- Confirm every version other than Inline nudges keeps the normal Send button and never opens the modal.
- Confirm every info tooltip opens and closes with pointer, keyboard, and tap interactions without overlapping the category toggle or leaving the modal bounds.
