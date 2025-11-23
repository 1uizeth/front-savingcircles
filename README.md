# Saving Circles — Frontend UI

This repo is the reference implementation of the Saving Circles UI for demos and judging.

A minimal, neutral, Next.js-based interface to interact with Saving Circles smart contracts for browsing circles, joining, paying installments, viewing results, and participating in weighted raffles.

The UI mirrors the onchain lifecycle without adding business logic.


- Check the [main repo](https://github.com/yaronvel/SavingCircle)


---

## 📁 Project Structure

This repository contains:

```
front-savingcircles/
├── app/                         # Next.js App Router
│   ├── page.tsx                 # Homepage (list circles)
│   ├── circles/                 # Circle flows
│   │   ├── page.tsx             # User's joined circles
│   │   └── [id]/                # Dynamic circle instance
│   │       ├── preview/         # View circle details
│   │       ├── join/            # Join + first payment
│   │       ├── auction/         # Weighted bidding interface
│   │       └── result/          # Round result
│   ├── payments/                # Installment dashboard
│   ├── miles/                   # Protocol token overview
│   ├── profile/                 # Placeholder
│   ├── tokens/                  # Placeholder
│   └── layout.tsx               # Global layout
│
├── components/                  # UI components
│   ├── desktop-sidebar.tsx      # Desktop navigation
│   ├── mobile-bottom-nav.tsx   # Mobile navigation
│   ├── top-nav.tsx              # Top bar
│   ├── context-bar.tsx          # Contextual header
│   ├── mndg/                    # Token UI elements
│   │   ├── inline-token-balance.tsx
│   │   ├── token-allocation-display.tsx
│   │   ├── token-balance-card.tsx
│   │   ├── token-input-field.tsx
│   │   └── token-transaction-item.tsx
│   ├── payment-modal.tsx        # Payment modal
│   ├── progress-bar.tsx         # Progress displays
│   ├── round-status-display.tsx # Round status
│   └── theme-provider.tsx
│
├── contexts/                    # Shared UI state
│   ├── timer-context.tsx        # Round countdown timer
│   └── user-context.tsx         # Joined circles + token totals
│
├── lib/
│   ├── abi/                     # ABI for contract calls
│   │   └── savingcircle.sol.abi.json
│   ├── hooks/                   # Contract + RPC helpers
│   │   └── use-circle-contract-data.ts
│   ├── mock-data.ts             # Optional mock preview
│   └── utils.ts                 # UI utilities
│
└── public/                      # Assets
```

---

## 🏗️ Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- Ethers.js
- pnpm

The frontend remains intentionally thin: it only displays state derived from the chain and calls contract entrypoints.

---

## 🔌 Contract Touchpoints

UI calls are made only to the Saving Circles core contracts:

### SavingCircle.sol
- round info
- installment amount
- current participants
- deadlines
- next required action (e.g., `nextRoundToPay`)

### VRF Consumer
- fetching status of randomness requests
- result-driven updates for round transitions

### Seat NFTs
- showing seat ownership
- wallet verification
- displaying transfer options (if enabled)

All ABIs are loaded from:

```
lib/abi/savingcircle.sol.abi.json
```

The RPC URL is set through:

```
NEXT_PUBLIC_SEPOLIA_RPC_URL=
```

---

## 🎨 UI Principles

The UI mirrors the contract lifecycle:
- Preview a circle
- Join
- Pay installments
- Submit weighted bids
- Wait for Chainlink VRF draw
- See result
- Iterate until everyone wins once

Visual design goals:
- High legibility
- Clear state transitions
- Explicit urgency states
- Consistent affordances across mobile and desktop

No opinionated mechanics are implemented client-side.

---

## 🔑 Key Screens

| Screen | Purpose |
|--------|---------|
| Homepage | List available circles |
| Circle Preview | Parameters, members, timing |
| Join Flow | First installment + seat minting |
| Auction Page | Submit token bid, see pool weights |
| Result Screen | VRF-selected winner |
| Payments Dashboard | All due installments in one place |
| Miles / Tokens | Earned protocol tokens overview |

---

## ⚙️ How the UI Talks to the Chain

All blockchain functions use ethers:

### Read
- `contract.currRound()`
- `contract.numRounds()`
- `contract.numUsers()`
- `contract.roundDeadline()`
- `contract.installmentSize()`

### Write
- `payInstallment(round)`
- `submitBid(amount)`
- `joinCircle()`
- (optional) `transferFrom` for Seat NFT

A single hook centralizes reads:

```typescript
useCircleContractData(circleAddress)
```

This updates the UI reactively.

---

## 🧭 Development

### Install

```bash
pnpm install
```

### Run

```bash
pnpm dev
```

### Environment

```bash
NEXT_PUBLIC_SEPOLIA_RPC_URL=
```

### Build

```bash
pnpm build
pnpm start
```

---

## 🔐 Security Notes

- No private keys in frontend
- Only public RPC and read/write calls
- Transactions signed in user wallet
- No sensitive caching

---

## 🧩 Future Extensions

These match the main repo's roadmap but are not implemented here.

- Mortgageable seats UI
- Circles trust-graph reputation visualisation
- CRE-driven automated rounds
- Yield integrations
- Cross-chain circles (CCIP)

---

## 🙏 Credits

Built as part of Saving Circles (see [main repo](https://github.com/yaronvel/SavingCircle) for contracts and backend logic).
