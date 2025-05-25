// SFショートショート テスト仕様（TDD）
// 要求仕様に基づくテストケース

const fs = require('fs');

// ストーリーファイルの読み込み
function loadStory() {
    try {
        return fs.readFileSync('./sf_story.txt', 'utf8');
    } catch (error) {
        console.error('ストーリーファイルが見つかりません:', error.message);
        return null;
    }
}

// キャラクター情報ファイルの読み込み
function loadCharacters() {
    try {
        const content = fs.readFileSync('./characters.json', 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error('キャラクターファイルが見つかりません:', error.message);
        return null;
    }
}

// テスト1: 物語本文が1000文字以内であること
function testStoryLength() {
    const story = loadStory();
    if (!story) return false;
    
    const length = story.length;
    const passed = length <= 1000;
    
    console.log(`テスト1: 文字数チェック`);
    console.log(`  実際の文字数: ${length}`);
    console.log(`  制限: 1000文字以内`);
    console.log(`  結果: ${passed ? 'PASS' : 'FAIL'}`);
    
    return passed;
}

// テスト2: 登場人物が3人以上登場すること
function testCharacterCount() {
    const characters = loadCharacters();
    if (!characters) return false;
    
    const count = characters.length;
    const passed = count >= 3;
    
    console.log(`テスト2: 登場人物数チェック`);
    console.log(`  登場人物数: ${count}人`);
    console.log(`  最低必要数: 3人以上`);
    console.log(`  結果: ${passed ? 'PASS' : 'FAIL'}`);
    
    return passed;
}

// テスト3: 登場人物リストに女性が最低1人含まれていること
function testFemaleCharacter() {
    const characters = loadCharacters();
    if (!characters) return false;
    
    const femaleCount = characters.filter(char => char.gender === '女性').length;
    const passed = femaleCount >= 1;
    
    console.log(`テスト3: 女性キャラクターチェック`);
    console.log(`  女性キャラクター数: ${femaleCount}人`);
    console.log(`  最低必要数: 1人以上`);
    console.log(`  結果: ${passed ? 'PASS' : 'FAIL'}`);
    
    return passed;
}

// 全テスト実行
function runAllTests() {
    console.log('=== SFショートショート TDD テスト実行 ===\n');
    
    const test1 = testStoryLength();
    const test2 = testCharacterCount();
    const test3 = testFemaleCharacter();
    
    console.log('\n=== テスト結果サマリー ===');
    console.log(`テスト1 (文字数): ${test1 ? 'PASS' : 'FAIL'}`);
    console.log(`テスト2 (登場人物数): ${test2 ? 'PASS' : 'FAIL'}`);
    console.log(`テスト3 (女性キャラクター): ${test3 ? 'PASS' : 'FAIL'}`);
    
    const allPassed = test1 && test2 && test3;
    console.log(`\n総合結果: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
    
    return allPassed;
}

// メイン実行
if (require.main === module) {
    runAllTests();
}

module.exports = { runAllTests, testStoryLength, testCharacterCount, testFemaleCharacter };