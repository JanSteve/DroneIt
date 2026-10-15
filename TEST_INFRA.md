# Droneit Autonomous Quick-Commerce & Investor Pitch Platform
# Comprehensive Test Infrastructure Specification (TEST_INFRA.md)

**Document Version**: 1.0.0  
**Author**: E2E Test Writer (`e2e_test_writer`)  
**Scope**: Requirement-Driven Opaque-Box E2E Test Suite (Tiers 1–4)  
**Target Application**: Droneit Dual-Mode Web Platform (`ORIGINAL_REQUEST.md`, `PROJECT.md`)  

---

## 1. Overview & Architecture Principles

The Droneit testing framework provides an independent, opaque-box, requirement-driven verification suite engineered to ensure flawless operational stability, physical safety compliance, and financial accuracy for premier business competition presentations.

### Core Principles
1. **Requirement-Driven**: All test cases and assertion bounds are derived directly from the authoritative specifications in `ORIGINAL_REQUEST.md` and `PROJECT.md § Feature Inventory`.
2. **Opaque-Box Verification**: The test suite evaluates observable external behaviors, state contracts, financial calculations, and simulated physical drone constraints without depending on fragile internal implementation details.
3. **Zero-Dependency Native Execution**: The test harness runs out-of-the-box using standard Node.js (`node:test` / native ESM) and seamlessly plugs into project test scripts (`npm test` / Vitest) with zero setup friction.
4. **4-Tier Hierarchical Architecture**:
   - **Tier 1: Feature Coverage**: Comprehensive verification of all 16 distinct functional feature areas (minimum 5 test cases per area; 95 total).
   - **Tier 2: Boundary & Corner Cases**: Stress tests at physical thresholds (2.500kg vs 2.501kg, empty cart, volume extremes, weather limits; 10 total).
   - **Tier 3: Cross-Feature Combinations**: Pairwise multi-system interactions (overweight cart + ground EV fallback + flight launch; mode toggles during flight; 6 total).
   - **Tier 4: Real-World Pitch Scenarios**: Multi-step holistic workflows (complete investor pitch sequence, 3-minute emergency medicine delivery, 15x demo speed simulation; 4 total).

---

## 2. Test Suite Directory Layout

```
/Users/janstevedaniel/Desktop/DroneIt/
├── tests/
│   ├── run-tests.mjs                       # Unified executable test runner (CLI & CI/CD)
│   ├── helpers/
│   │   ├── test-harness.mjs                # Assertion library & test suite registry
│   │   └── contracts.mjs                   # Domain contracts, datasets, & mathematical engines
│   └── e2e/
│       ├── tier1-features/                 # Tier 1: 16 Feature Area Suites (95 test cases)
│       │   ├── mode-toggle.test.mjs
│       │   ├── catalogue.test.mjs
│       │   ├── search.test.mjs
│       │   ├── cart.test.mjs
│       │   ├── weight-gauge.test.mjs
│       │   ├── drop-zone.test.mjs
│       │   ├── fee-breakdown.test.mjs
│       │   ├── flight-launch.test.mjs
│       │   ├── telemetry-hud.test.mjs
│       │   ├── winch-animation.test.mjs
│       │   ├── pitch-deck-tabs.test.mjs
│       │   ├── unit-economics-sliders.test.mjs
│       │   ├── dgca-matrix.test.mjs
│       │   ├── greenloop-counters.test.mjs
│       │   ├── competitor-grid.test.mjs
│       │   └── contact-triggers.test.mjs
│       ├── tier2-boundary/                 # Tier 2: Boundary & Corner Cases (10 test cases)
│       │   └── boundary-corner-cases.test.mjs
│       ├── tier3-cross-feature/            # Tier 3: Cross-Feature Permutations (6 test cases)
│       │   └── cross-feature-combinations.test.mjs
│       └── tier4-pitch-scenarios/          # Tier 4: Real-World Pitch Workflows (4 test cases)
│           └── real-world-pitch-scenarios.test.mjs
├── TEST_INFRA.md                           # This document
└── TEST_READY.md                           # Readiness declaration & checklist
```

---

## 3. Test Execution Guide

### Primary Command
To execute the complete 115-test suite:
```bash
node tests/run-tests.mjs
```

### Filtering by Tier
To run specific tiers independently:
```bash
node tests/run-tests.mjs --tier=1    # Run Tier 1 Feature Coverage only
node tests/run-tests.mjs --tier=2    # Run Tier 2 Boundary Cases only
node tests/run-tests.mjs --tier=3    # Run Tier 3 Cross-Feature Permutations only
node tests/run-tests.mjs --tier=4    # Run Tier 4 Pitch Scenarios only
```

### Filtering by Name / Keyword
To filter by test suite or feature keyword:
```bash
node tests/run-tests.mjs --filter="Unit Economics"
node tests/run-tests.mjs --filter="Winch"
node tests/run-tests.mjs --filter="Medicine"
```

### Machine-Readable JSON Output (for CI/CD and Victory Auditor)
```bash
node tests/run-tests.mjs --json
```

---

## 4. Tier Breakdown & Test Inventory

| Tier | Category | File Path | Test Count | Status |
|---|---|---|---|---|
| **Tier 1** | Area 1: Mode Toggle | `tests/e2e/tier1-features/mode-toggle.test.mjs` | 6 | **PASS** |
| **Tier 1** | Area 2: Catalogue | `tests/e2e/tier1-features/catalogue.test.mjs` | 6 | **PASS** |
| **Tier 1** | Area 3: Search | `tests/e2e/tier1-features/search.test.mjs` | 6 | **PASS** |
| **Tier 1** | Area 4: Cart | `tests/e2e/tier1-features/cart.test.mjs` | 6 | **PASS** |
| **Tier 1** | Area 5: Weight Gauge | `tests/e2e/tier1-features/weight-gauge.test.mjs` | 6 | **PASS** |
| **Tier 1** | Area 6: Drop-Zone Selection | `tests/e2e/tier1-features/drop-zone.test.mjs` | 6 | **PASS** |
| **Tier 1** | Area 7: Fee Breakdown | `tests/e2e/tier1-features/fee-breakdown.test.mjs` | 6 | **PASS** |
| **Tier 1** | Area 8: Flight Launch | `tests/e2e/tier1-features/flight-launch.test.mjs` | 6 | **PASS** |
| **Tier 1** | Area 9: Telemetry HUD | `tests/e2e/tier1-features/telemetry-hud.test.mjs` | 6 | **PASS** |
| **Tier 1** | Area 10: Winch Animation | `tests/e2e/tier1-features/winch-animation.test.mjs` | 5 | **PASS** |
| **Tier 1** | Area 11: Pitch Deck Tabs | `tests/e2e/tier1-features/pitch-deck-tabs.test.mjs` | 6 | **PASS** |
| **Tier 1** | Area 12: Unit Economics | `tests/e2e/tier1-features/unit-economics-sliders.test.mjs` | 6 | **PASS** |
| **Tier 1** | Area 13: DGCA Matrix | `tests/e2e/tier1-features/dgca-matrix.test.mjs` | 6 | **PASS** |
| **Tier 1** | Area 14: GreenLoop Counters | `tests/e2e/tier1-features/greenloop-counters.test.mjs` | 6 | **PASS** |
| **Tier 1** | Area 15: Competitor Grid | `tests/e2e/tier1-features/competitor-grid.test.mjs` | 6 | **PASS** |
| **Tier 1** | Area 16: Contact Triggers | `tests/e2e/tier1-features/contact-triggers.test.mjs` | 6 | **PASS** |
| **Tier 2** | Boundary & Corner Cases | `tests/e2e/tier2-boundary/boundary-corner-cases.test.mjs` | 10 | **PASS** |
| **Tier 3** | Cross-Feature Combinations | `tests/e2e/tier3-cross-feature/cross-feature-combinations.test.mjs` | 6 | **PASS** |
| **Tier 4** | Real-World Pitch Scenarios | `tests/e2e/tier4-pitch-scenarios/real-world-pitch-scenarios.test.mjs` | 4 | **PASS** |
| **TOTAL** | **Full E2E Test Suite** | **20 test files** | **115** | **100% PASS** |

---

## 5. Domain Contracts & Mathematical Reference Models

### 5.1 Physical Constraints
- **Maximum Safe Drone Payload**: `2,500g (2.500 kg)`
- **Payload Caution Threshold**: `2,001g – 2,500g` (Amber HUD alert)
- **Payload Overweight Threshold**: `> 2,500g` (Red lockout; prompts Greedy Bin-Packing split into dual flights or Partner Ground EV fallback)
- **Cruise Altitude**: `45m AGL` (within DGCA Green Zone <400ft ceiling)
- **Cruise Speed**: `40 km/h`
- **Winch Hover Altitude**: `15m AGL`
- **Flight Duration**: `180 seconds (3:00)`
- **Weather Limits**: Sustained wind $\le 42$ km/h, rain $\le 2.0$ mm/h

### 5.2 Pricing & Fee Structure
- **Base Drone Delivery**: `₹49`
- **Priority Delivery Slot**: `₹79`
- **Plantable Seed Paper Tag**: `₹5 – ₹10` (standard `₹5`)
- **GreenLoop Monthly Pass**: `₹99`
- **Partner Ground EV Courier**: `₹29` (15–20 min ETA for packages up to 15 kg)
- **Split Dual Drone Delivery**: `₹79` bundled fee
- **GST Tax**: 5% on food/groceries/medicine essentials, 18% on fees/print/electronics

### 5.3 Unit Economics Mathematical Model
- **Monthly Orders**: $M_V = V \times 30$
- **Revenue per Order**: $Rev_{order} = F_{del} + (AOV \times 0.18) + 4.50$
- **Battery Depreciation**: $\frac{36,000}{C_{batt} \times 1.5}$
- **Variable Cost per Order**:
  $$VC_{order} = 2.80 \text{ (electricity)} + \text{Battery} + 6.50 \text{ (maintenance)} + 5.20 \text{ (pod)} + 2.50 \text{ (telemetry)} + (AOV \times 0.012 + 3.00) \text{ (ins/pg)}$$
- **Contribution Margin per Order**: $CM_{order} = Rev_{order} - VC_{order}$
- **Fixed Monthly Hub OpEx**: $₹2,45,000$ baseline
- **Pilot Break-Even Daily Orders**: $V_{BE} = \frac{OpEx_{month}}{CM_{order} \times 30} \approx 143 \text{ orders/day}$ at baseline

### 5.4 Verified Contact Details
- **Telephone**: `+91 8438110297` (`tel:+918438110297`)
- **Email**: `Droneiteco@gmail.com` (`mailto:Droneiteco@gmail.com`)
- **Instagram**: `@drone.it` (`https://instagram.com/drone.it`)
