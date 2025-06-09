
# W3b Sauce 🧪

<img src="https://user-images.githubusercontent.com/5603206/153614570-2a6f817c-fe12-4c14-b9d3-a79c170485ab.gif" width="100%" />

**W3b Sauce** is a lightweight, reactive web3 connector framework built to make wallet connection and state management smooth, modular, and framework-agnostic. This monorepo houses the core library and adapters for use in different frontend environments.

## ✨ Features

- 🔌 Plug & play wallet connection architecture (MetaMask, WalletConnect, etc.)
- 🧠 Built-in reactive observables with **RxJS**
- ♻️ Auto-reconnection & persistent session management
- 🛠 Framework-specific packages (e.g. **React** integration)
- 🌐 EIP-1193 compliant
- 🧪 TypeScript-first with extensive typing and test coverage

## 📦 Packages

- `@w3bsauce/core` – The core logic for connection handling and state management.
- `@w3bsauce/react` – React-specific bindings using hooks and context.

## 🧪 Examples

Explore integration examples:

- `examples/react-app` – React + w3bsauce in action
- `examples/simple-web` – Vanilla JavaScript usage
- `examples/svelte-app` – Svelte integration showcase

## 🚀 Getting Started

Install the core package:

```bash
npm install @w3bsauce/core
