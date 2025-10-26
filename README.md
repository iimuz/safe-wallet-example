# Safe Wallet Example - Account Abstraction with MetaMask

Safe（旧 Gnosis Safe）を使用したAccount Abstraction（AA）のサンプルコードです。MetaMaskのアカウントを1 Signerとして使用し、Safeアカウントを作成・管理する方法を示します。

## 📋 概要

このリポジトリには、Safe Protocol Kitを使用した以下のサンプルが含まれています：

- **React Webアプリ**: React + TypeScript + Viteで構築されたモダンなWebアプリケーション
- **CLI版**: プライベートキーを使用してSafeアカウントを作成・管理するNode.jsツール

## ✨ 主な機能

- MetaMaskとの統合（1 owner, threshold: 1/1）
- Safeアカウントの作成とデプロイ
- 既存のSafeアカウントへの接続
- Safeアカウント情報の表示
- トランザクションの作成・署名・実行
- レスポンシブなUIデザイン

## 🔧 必要な環境

- Node.js 18以上
- MetaMask拡張機能（Webアプリ版の場合）
- テストネットのETH（Sepoliaを推奨）

## 📦 インストール

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/safe-wallet-example.git
cd safe-wallet-example

# 依存関係をインストール
npm install
```

## 🚀 使い方

### 1. React Webアプリ（推奨）

開発サーバーを起動:

```bash
npm run dev:web
```

ブラウザで `http://localhost:5173` にアクセスして、以下の操作ができます：

1. **ウォレット接続**: MetaMaskを接続
2. **Safe作成**: 新しいSafeアカウントを作成
3. **Safe接続**: 既存のSafeアカウントに接続
4. **情報表示**: Safeのバランス、オーナー、閾値を表示
5. **トランザクション送信**: Safeからトランザクションを実行

プロダクションビルド:

```bash
npm run build:web
npm run preview
```

### 2. CLI版（Node.js）

#### 環境変数の設定

```bash
# .env.exampleをコピー
cp .env.example .env

# .envファイルを編集してプライベートキーとRPC URLを設定
# ⚠️ テスト用のアカウントのみ使用してください！
```

`.env`の例:
```env
PRIVATE_KEY=your_private_key_here
RPC_URL=https://rpc.sepolia.org
```

#### Safeアカウントの作成

```bash
# TypeScriptを直接実行
PRIVATE_KEY=0x... RPC_URL=https://rpc.sepolia.org npm run dev:cli

# またはビルドしてから実行
npm run build:cli
PRIVATE_KEY=0x... RPC_URL=https://rpc.sepolia.org npm run start:cli
```

#### 既存のSafeに接続

```bash
npm run dev:cli connect 0xYourSafeAddress
```

#### トランザクションの送信

```bash
PRIVATE_KEY=0x... npm run send 0xSafeAddress 0xDestinationAddress 0.1
```

## 📖 コード例

### Safeアカウントの作成

```typescript
import { ethers } from 'ethers';
import Safe, { SafeFactory } from '@safe-global/protocol-kit';
import { EthersAdapter } from '@safe-global/protocol-kit';

// MetaMaskに接続
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// EthersAdapterを作成
const ethAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: signer,
});

// SafeFactoryを作成
const safeFactory = await SafeFactory.create({ ethAdapter });

// Safeをデプロイ（1 owner, threshold: 1）
const safeSdk = await safeFactory.deploySafe({
  safeAccountConfig: {
    owners: [await signer.getAddress()],
    threshold: 1,
  }
});

const safeAddress = await safeSdk.getAddress();
console.log('Safe Address:', safeAddress);
```

### 既存のSafeに接続

```typescript
const safeSdk = await Safe.create({
  ethAdapter,
  safeAddress: '0xYourSafeAddress',
});

const owners = await safeSdk.getOwners();
const threshold = await safeSdk.getThreshold();
console.log('Owners:', owners);
console.log('Threshold:', threshold);
```

### トランザクションの実行

```typescript
// トランザクションを作成
const safeTransaction = await safeSdk.createTransaction({
  transactions: [{
    to: destinationAddress,
    value: ethers.parseEther('0.1').toString(),
    data: '0x',
  }]
});

// 署名
const signedTx = await safeSdk.signTransaction(safeTransaction);

// 実行
const txResponse = await safeSdk.executeTransaction(signedTx);
await txResponse.transactionResponse?.wait();
```

## 🌐 対応ネットワーク

- Ethereum Mainnet
- Sepolia Testnet（推奨）
- Polygon
- Gnosis Chain
- その他、Safeがサポートするネットワーク

詳細: https://docs.safe.global/home/supported-networks

## 📚 参考資料

- [Safe公式ドキュメント](https://docs.safe.global/)
- [Safe Protocol Kit](https://docs.safe.global/sdk/protocol-kit)
- [Safe Core SDK GitHub](https://github.com/safe-global/safe-core-sdk)
- [Safe Getting Started](https://help.safe.global/en/collections/9801-getting-started)

## ⚠️ セキュリティに関する注意

- **プライベートキーを公開しないでください**
- `.env`ファイルは絶対にコミットしないでください
- 本番環境では、テスト用アカウントではなく適切なキー管理を使用してください
- このサンプルコードは学習目的です。本番環境で使用する前に十分にテストしてください

## 📁 プロジェクト構造

```
safe-wallet-example/
├── src/                        # React Webアプリ
│   ├── components/            # Reactコンポーネント
│   │   ├── WalletConnect.tsx  # ウォレット接続
│   │   ├── CreateSafe.tsx     # Safe作成
│   │   ├── ConnectSafe.tsx    # Safe接続
│   │   ├── SafeInfo.tsx       # Safe情報表示
│   │   └── SendTransaction.tsx # トランザクション送信
│   ├── hooks/                 # カスタムフック
│   │   └── useSafe.tsx        # Safe操作のContext & Hook
│   ├── utils/                 # ユーティリティ関数
│   │   └── safe.ts            # Safe SDK操作
│   ├── types/                 # 型定義
│   │   └── safe.ts            # Safe関連の型
│   ├── App.tsx                # メインアプリ
│   ├── App.css                # スタイル
│   ├── main.tsx               # エントリーポイント
│   └── index.css              # グローバルスタイル
├── cli/                        # CLIツール（旧src/）
│   ├── node-example.ts        # Node.js版のサンプル
│   └── send-transaction.ts    # トランザクション送信
├── index.html                  # React用のHTML
├── vite.config.ts             # Vite設定
├── package.json
├── tsconfig.json              # Web用TypeScript設定
├── tsconfig.cli.json          # CLI用TypeScript設定
├── .env.example               # 環境変数テンプレート
└── README.md
```

## 🤝 コントリビューション

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容を説明してください。

## 📄 ライセンス

MIT
