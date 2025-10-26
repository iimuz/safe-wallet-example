# Safe Wallet Example - Account Abstraction with MetaMask

Safe（旧 Gnosis Safe）を使用したAccount Abstraction（AA）のサンプルコードです。MetaMaskのアカウントを1 Signerとして使用し、Safeアカウントを作成・管理する方法を示します。

## 📋 概要

このリポジトリには、Safe Protocol Kitを使用した以下のサンプルが含まれています：

- **ブラウザ版**: MetaMaskを使用してSafeアカウントを作成するWebアプリケーション
- **Node.js版**: プライベートキーを使用してSafeアカウントを作成・管理するCLIツール
- **トランザクション実行**: Safeアカウントからトランザクションを送信する例

## 🔧 必要な環境

- Node.js 18以上
- MetaMask拡張機能（ブラウザ版の場合）
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

### 1. ブラウザ版（MetaMaskを使用）

1. `index.html`をブラウザで開く

```bash
# シンプルなHTTPサーバーを起動
npx http-server -p 8080
```

2. ブラウザで `http://localhost:8080` にアクセス
3. MetaMaskを接続
4. 「Create New Safe Account」ボタンをクリック

**機能:**
- Safeアカウントの作成（1 owner, threshold: 1/1）
- 既存のSafeアカウントへの接続
- Safeアカウント情報の表示

### 2. Node.js版（プライベートキーを使用）

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
PRIVATE_KEY=0x... RPC_URL=https://rpc.sepolia.org npm run dev

# またはビルドしてから実行
npm run build
PRIVATE_KEY=0x... RPC_URL=https://rpc.sepolia.org npm start
```

#### 既存のSafeに接続

```bash
npm run dev connect 0xYourSafeAddress
```

#### トランザクションの送信

`package.json`にスクリプトを追加してください:

```json
{
  "scripts": {
    "send": "ts-node-esm src/send-transaction.ts"
  }
}
```

実行:
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
├── src/
│   ├── createSafe.ts          # Safeアカウント作成（ブラウザ用）
│   ├── node-example.ts        # Node.js版のサンプル
│   └── send-transaction.ts    # トランザクション送信のサンプル
├── index.html                  # ブラウザ版のUI
├── package.json
├── tsconfig.json
├── .env.example               # 環境変数のテンプレート
└── README.md
```

## 🤝 コントリビューション

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容を説明してください。

## 📄 ライセンス

MIT
