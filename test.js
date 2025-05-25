class TestRunner {
    constructor() {
        this.tests = [];
        this.results = [];
    }

    test(name, testFunction) {
        this.tests.push({ name, testFunction });
    }

    assertEquals(actual, expected, message = '') {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(`${message}\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`);
        }
    }

    assertTrue(condition, message = '') {
        if (!condition) {
            throw new Error(`${message}\nExpected: true\nActual: false`);
        }
    }

    assertFalse(condition, message = '') {
        if (condition) {
            throw new Error(`${message}\nExpected: false\nActual: true`);
        }
    }

    runTests() {
        console.log('=== テトリス TDD テスト実行 ===');
        let passedTests = 0;
        let failedTests = 0;

        this.tests.forEach(({ name, testFunction }) => {
            try {
                testFunction.call(this);
                console.log(`✅ ${name}`);
                passedTests++;
            } catch (error) {
                console.error(`❌ ${name}: ${error.message}`);
                failedTests++;
            }
        });

        console.log(`\n=== テスト結果 ===`);
        console.log(`通過: ${passedTests}`);
        console.log(`失敗: ${failedTests}`);
        console.log(`総計: ${this.tests.length}`);

        return { passed: passedTests, failed: failedTests, total: this.tests.length };
    }
}

const testRunner = new TestRunner();

testRunner.test('テトリミノI型の初期状態テスト', function() {
    const tetromino = new Tetromino('I');
    this.assertEquals(tetromino.type, 'I', 'テトリミノタイプがIであること');
    this.assertEquals(tetromino.x, 3, '初期X座標が3であること');
    this.assertEquals(tetromino.y, 0, '初期Y座標が0であること');
    this.assertEquals(tetromino.rotation, 0, '初期回転角度が0であること');
    this.assertTrue(Array.isArray(tetromino.shape), 'shapeが配列であること');
});

testRunner.test('テトリミノの回転テスト', function() {
    const tetromino = new Tetromino('T');
    const originalShape = JSON.parse(JSON.stringify(tetromino.shape));
    tetromino.rotate();
    this.assertEquals(tetromino.rotation, 1, '回転後の角度が1であること');
    
    tetromino.rotate();
    tetromino.rotate();
    tetromino.rotate();
    this.assertEquals(tetromino.rotation, 0, '4回回転で元に戻ること');
});

testRunner.test('テトリミノの移動テスト', function() {
    const tetromino = new Tetromino('O');
    const originalX = tetromino.x;
    const originalY = tetromino.y;
    
    tetromino.moveLeft();
    this.assertEquals(tetromino.x, originalX - 1, '左移動でX座標が減ること');
    
    tetromino.moveRight();
    this.assertEquals(tetromino.x, originalX, '右移動でX座標が増えること');
    
    tetromino.moveDown();
    this.assertEquals(tetromino.y, originalY + 1, '下移動でY座標が増えること');
});

testRunner.test('ゲームボードの初期化テスト', function() {
    const game = new TetrisGame();
    this.assertEquals(game.board.length, 20, 'ボードの高さが20であること');
    this.assertEquals(game.board[0].length, 10, 'ボードの幅が10であること');
    this.assertEquals(game.score, 0, '初期スコアが0であること');
    this.assertFalse(game.gameOver, '初期状態でゲームオーバーでないこと');
});

testRunner.test('ライン消去テスト', function() {
    const game = new TetrisGame();
    
    for (let i = 0; i < 10; i++) {
        game.board[19][i] = 1;
    }
    
    const linesCleared = game.clearLines();
    this.assertEquals(linesCleared, 1, '1ライン消去されること');
    this.assertTrue(game.board[19].every(cell => cell === 0), '消去後の最下行が空であること');
});

testRunner.test('スコア計算テスト', function() {
    const game = new TetrisGame();
    const initialScore = game.score;
    
    game.addScore(1);
    this.assertEquals(game.score, initialScore + 100, '1ライン消去で100点加算されること');
    
    game.addScore(4);
    this.assertEquals(game.score, initialScore + 100 + 800, '4ライン同時消去でボーナス点が加算されること');
});

testRunner.test('ゲームオーバー判定テスト', function() {
    const game = new TetrisGame();
    
    for (let i = 0; i < 10; i++) {
        game.board[0][i] = 1;
        game.board[1][i] = 1;
    }
    
    const isGameOver = game.checkGameOver();
    this.assertTrue(isGameOver, '上部がブロックで埋まっているときゲームオーバーであること');
});

testRunner.test('テトリミノの衝突判定テスト', function() {
    const game = new TetrisGame();
    const tetromino = new Tetromino('I');
    
    this.assertFalse(game.checkCollision(tetromino, 0, 0), '初期位置で衝突しないこと');
    
    tetromino.y = 20;
    this.assertTrue(game.checkCollision(tetromino, 0, 0), 'ボード下端で衝突すること');
    
    tetromino.y = 0;
    tetromino.x = -1;
    this.assertTrue(game.checkCollision(tetromino, 0, 0), 'ボード左端で衝突すること');
    
    tetromino.x = 8;
    this.assertTrue(game.checkCollision(tetromino, 0, 0), 'ボード右端で衝突すること');
});

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof TetrisGame !== 'undefined' && typeof Tetromino !== 'undefined') {
            testRunner.runTests();
        } else {
            console.warn('TetrisGameまたはTetrominoクラスが見つかりません。テトリス実装の読み込みを確認してください。');
        }
    }, 100);
});