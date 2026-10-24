---
title: Controller, keyboard and mouse input
description: Configuration format, default keybindings, mouse emulation settings, and automated test input injection.
---

import { Aside } from '@astrojs/starlight/components';

AnyPS5 supports game controllers recognized by SDL2, as well as customizable keyboard and mouse bindings.

## Game controller support

Standard game controllers recognized by SDL operate without extra configuration:

- Xbox controllers: A/B/X/Y map to Cross/Circle/Square/Triangle. LB/RB map to L1/R1. LT/RT map to analog triggers L2/R2. Start maps to Options. The View (Back) button registers as a center touchpad click.
- PlayStation controllers: DualShock 4 and DualSense buttons, sticks, triggers, touchpad clicks, and two-finger tracking pass through natively.
- Hot-plugging: Controllers can connect or disconnect while the game is running. The runtime uses the first recognized controller.

## Keyboard and mouse configuration

To customize keyboard and mouse bindings, create a file named `anyps5-input.ini` beside the game executable, or set the path using the `ANYPS5_INPUT_CONFIG` environment variable.

### File format

Lines use the syntax `Action = Type:Value`:

- `KEY:<name>`: Keyboard key name accepted by SDL (for example, `KEY:Space`, `KEY:Return`, `KEY:F`).
- `MOUSE:<button>`: Mouse button (`MOUSE:Left`, `MOUSE:Right`, `MOUSE:Middle`, `MOUSE:X1`, `MOUSE:X2`).
- `WHEEL:<direction>`: Scroll wheel movement (`WHEEL:Up`, `WHEEL:Down`).

Lines starting with `#` or `;` are comments. The first line for an action replaces its default binding; subsequent lines for the same action register alternative bindings.

### Default bindings

| Action | Built-in binding |
| :--- | :--- |
| `Cross` | Return, Space |
| `Circle` | C |
| `Triangle` | I |
| `Square` | Left mouse button |
| `L1` | Q |
| `R1` | E, Left Alt, Right Alt |
| `L2` | R, Mouse button 4 (X1) |
| `R2` | Right mouse button |
| `L3` | Left Shift, Right Shift |
| `R3` | Left Ctrl, Right Ctrl |
| `Options` | Escape |
| `Up`, `Right`, `Down`, `Left` | Arrow keys; Mouse wheel Up/Down |
| Left stick axes | A (left), D (right), W (up), S (down) |
| Right stick axes | F (left), H (right), T (up), G (down) |
| `TouchLeft`, `TouchRight` | Backspace, Tab |
| `Shake` | X (generates swing acceleration data) |
| `ToggleMouse` | Middle mouse button, F7 |
| `ToggleFullscreen` | F11 |
| `TogglePerformanceOverlay` | F10 |
| `Screenshot` | F12 |

### Configuration example

```ini
# Replace Cross with F or Space
Cross = KEY:F
Cross = KEY:Space

# Move left stick to IJKL
LeftStickLeft = KEY:J
LeftStickRight = KEY:L
LeftStickUp = KEY:I
LeftStickDown = KEY:K

# Map attacks to mouse buttons
Square = MOUSE:Left
R2 = MOUSE:Right
```

## Mouse-to-stick tuning settings

The same `anyps5-input.ini` file accepts fine-tuning parameters for mouse camera control and stick ramps:

| Setting | Range | Default | Description |
| :--- | :--- | :--- | :--- |
| `LeftStickDeadzone`, `RightStickDeadzone` | 0 to 90 | 0 | Percentage of stick travel treated as centered. |
| `MouseSensitivity` | 0.1 to 10 | 1 | Sensitivity multiplier. Higher values require less physical travel. |
| `MouseVerticalScale` | 0.1 to 10 | 1 | Multiplier for vertical mouse velocity. |
| `MouseCurve` | 0.2 to 5 | 1 | Response exponent. Values above 1 grant finer precision at low speed. |
| `MouseDeadzoneOffset` | 0 to 0.9 | 0.2 | Minimum stick tilt produced by slight movement. Set just above the title's deadzone. |
| `MouseMaxSpeed` | 0.1 to 10 | 1 | Maximum tracked speed multiplier. |
| `MouseSmoothingMs` | 0 to 500 | 10 | Smoothing window in milliseconds. Set to 0 to disable smoothing. |
| `MouseDecayMs` | 1 to 1000 | 30 | Milliseconds of stillness before centering the stick. |
| `StickModifierScale` | 0.05 to 1 | 0.5 | Stick tilt fraction applied when holding the `StickModifier` key. |
| `KeyboardRampMs` | 0 to 2000 | 0 | Milliseconds taken by keyboard keys to ramp stick tilt from center to maximum. |
| `TriggerRampMs` | 0 to 2000 | 0 | Milliseconds taken by digital keys to ramp analog triggers L2/R2 to full depression. |

## Automated input injection for test runs

Set the `APS5_PAD_INPUT_FILE` environment variable to a file path before launching the title to inject controller commands from scripts.

Send individual button pulses from a secondary terminal:

```sh
# Press cross
python3 tools/pad_input.py /tmp/anyps5-pad cross

# Hold D-pad down for 500 ms
python3 tools/pad_input.py /tmp/anyps5-pad down --hold-ms 500

# Tilt left stick to full right
python3 tools/pad_input.py /tmp/anyps5-pad release --left-stick 255 128 --hold-ms 1000
```

### Input timelines

Queue timed button sequences using `tools/pad_timeline.py` and a JSON sequence file:

```json
{
  "version": 1,
  "events": [
    { "at_ms": 200, "hold_ms": 300, "buttons": ["cross", "r1"] },
    { "at_ms": 1000, "hold_ms": 300, "buttons": ["down"] }
  ]
}
```

```sh
python3 tools/pad_timeline.py menu.json /tmp/anyps5-pad --repeat 3 --gap-ms 500
```
