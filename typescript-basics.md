# TypeScript 基礎メモ

## static / public / private まとめ

### ■ static あり／なし → 「どこに置くか」

- `static` なし → `new` するたびにインスタンスごとに別々の値を持つ
- `static` あり → クラスに1つだけ。全インスタンスで共有

### ■ public / private → 「外から触れるか」

- `public`  → クラスの外から `インスタンス.xxx` でアクセス・上書きできる
- `private` → クラスの中からしか触れない（外からはエラー）

### ■ 何も書かないとどうなる？

- `static`  → 書かなければ「static なし」（インスタンスごと）
- アクセス → 書かなければ「public」（外から触れる）

つまり何も書かない = 「static なし」かつ「public」

### ■ 例

```typescript
class Dog {
  name: string;                          // static なし + public（何も書かない）
  public name: string;                   // ↑ と全く同じ（明示しただけ）
  private secret: string;                // static なし + private
  static totalCount: number;             // static + public
  static private wifiPassword: string;   // static + private
}
```

---

## コンストラクターの書き方パターン

### パターン1: 宣言 + constructor で代入

```typescript
class MinStack {
  private stack: number[];
  private minStack: number[];

  constructor() {
    this.stack = [];
    this.minStack = [];
  }
}
```

宣言と代入が別々。一番明示的で読みやすい。

### パターン2: 宣言時に初期化（constructorなし）

```typescript
class MinStack {
  private stack: number[] = [];
  private minStack: number[] = [];
}
```

宣言と同時に `= []` で初期化。constructor が不要になる。
パターン1と動作は全く同じ。

### パターン3: constructor の引数で宣言（Parameter Properties）

```typescript
class MinStack {
  constructor(
    private stack: number[] = [],    // ← 第1引数
    private minStack: number[] = [], // ← 第2引数
  ) {}
}
```

引数に `private` をつけると「宣言 + 代入」を一発でやってくれる省略記法。
ただしこれは constructor の「引数」なので、外から値を渡せてしまう:

```typescript
new MinStack()              // → stack = [], minStack = []（デフォルト値）
new MinStack([1, 2, 3])     // → stack = [1,2,3], minStack = []
new MinStack([1, 2], [1])   // → stack = [1,2],   minStack = [1]
```

※ `= []` はデフォルト値。「渡されなかったときだけ」使われる。
渡したらそっちが優先される（上書きはされない）。
引数は順番で対応するので、第1引数 → stack、第2引数 → minStack。

MinStack の stack は内部データなので外から渡せるのは設計的に不自然。
→ MinStack にはパターン3は不向き。

**パターン3が嬉しいケース: 外から値を渡してほしいとき！**

```typescript
class User {
  constructor(
    private name: string,    // ← 外から渡してほしい
    private age: number,     // ← 外から渡してほしい
  ) {}
}
const user = new User("田中", 15);
```

パターン1だと name, age をそれぞれ3回書く（宣言、引数、代入）のが
パターン3なら1回で済む。

### どれを使えばいい？

| ケース | おすすめ |
|--------|----------|
| 外から渡す値（name, age） | パターン3 が楽 |
| 外から渡さない値（stack 等） | パターン1 or 2 が自然 |

- **パターン1**（宣言 + constructor）→ 面接ではこれが一番無難。誰でも読める
- **パターン2**（宣言時に初期化）→ 初期値が決まってるならこれが一番シンプル
- **パターン3**（引数で宣言）→ 外から値を渡すクラス（User等）に便利

MinStack なら パターン1 か パターン2 がおすすめ。

---

## abstract（抽象クラス・抽象メソッド）

### ■ 一言で

`abstract` = **「設計図だけ。そのままでは使えない」**

### ■ abstract class（抽象クラス）

`new` できないクラス。必ず `extends` して使う。

```typescript
abstract class Animal {
  // 普通のメソッド（中身あり）→ 子クラスでそのまま使える
  breathe(): void {
    console.log("呼吸する");
  }

  // abstract メソッド（中身なし）→ 子クラスが必ず書く
  abstract speak(): void;
}

// NG: abstract クラスは直接 new できない
const a = new Animal(); // ← エラー！

// OK: extends して abstract メソッドを実装する
class Dog extends Animal {
  speak(): void {
    console.log("ワン！");
  }
}

const dog = new Dog();
dog.breathe(); // "呼吸する"  ← 親の普通メソッドはそのまま使える
dog.speak();   // "ワン！"    ← 子が実装した abstract メソッド
```

### ■ abstract method（抽象メソッド）

中身（`{ }`）を書かないメソッド。子クラスが**必ず**実装しないとエラーになる。

```typescript
abstract class Shape {
  abstract area(): number;  // ← 中身なし。子クラスに任せる
}

class Circle extends Shape {
  constructor(private radius: number) { super(); }

  // area() を書かないとエラーになる
  area(): number {
    return Math.PI * this.radius * this.radius;
  }
}

class Square extends Shape {
  constructor(private side: number) { super(); }

  area(): number {
    return this.side * this.side;
  }
}

const c = new Circle(5);
console.log(c.area()); // 78.54...

const s = new Square(4);
console.log(s.area()); // 16
```

### ■ interface との違い

どっちも「こういうメソッドを持て」というルールを決めるもの。でも役割が違う。

| | `abstract class` | `interface` |
|--|-----------------|-------------|
| 中身のあるメソッドを持てる？ | はい（`breathe()` など） | いいえ（ルールだけ） |
| プロパティに初期値を持てる？ | はい | いいえ |
| 複数同時に使える？ | `extends` は1つだけ | `implements` は何個でもOK |
| 用途 | 共通の処理 + 一部を子に任せる | 「この形を守れ」という契約 |

```typescript
// interface = 「この形を守れ」だけ
interface Flyable {
  fly(): void;
}

// abstract class = 共通処理あり + 一部だけ子に任せる
abstract class Bird {
  eat(): void { console.log("エサを食べる"); }  // 共通処理
  abstract sing(): void;                         // 子に任せる
}

// 両方使える
class Sparrow extends Bird implements Flyable {
  sing(): void { console.log("チュンチュン"); }  // abstract を実装
  fly(): void { console.log("パタパタ"); }       // interface を実装
}
```

### ■ いつ使う？

| やりたいこと | 使うもの |
|-------------|---------|
| 「この形を守れ」だけ決めたい | `interface` |
| 共通処理を持ちつつ、一部を子クラスに任せたい | `abstract class` |
| 手順の骨組みを固定して、中身だけ変えたい | `abstract class`（= Template Method パターン） |
