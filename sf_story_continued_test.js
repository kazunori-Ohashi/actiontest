// SFショートショート続編 テスト仕様（TDD）
// 続編の要求仕様に基づくテストケース

const fs = require('fs');

// 続編ストーリーファイルの読み込み
function loadContinuedStory() {
    try {
        return fs.readFileSync('./sf_story_continued.txt', 'utf8');
    } catch (error) {
        console.error('続編ストーリーファイルが見つかりません:', error.message);
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

// テスト1: 続編が5000文字以内であること
function testContinuedStoryLength() {
    const story = loadContinuedStory();
    if (!story) return false;
    
    const length = story.length;
    const passed = length <= 5000;
    
    console.log(`テスト1: 続編文字数チェック`);
    console.log(`  実際の文字数: ${length}`);
    console.log(`  制限: 5000文字以内`);
    console.log(`  結果: ${passed ? 'PASS' : 'FAIL'}`);
    
    return passed;
}

// テスト2: 登場人物が前作より最低1人増えていること（3人→4人以上）
function testIncreasedCharacterCount() {
    const characters = loadCharacters();
    if (!characters) return false;
    
    const count = characters.length;
    const passed = count >= 4; // 前作3人から最低1人増加
    
    console.log(`テスト2: 登場人物増加チェック`);
    console.log(`  現在の登場人物数: ${count}人`);
    console.log(`  最低必要数: 4人以上（前作3人+1人）`);
    console.log(`  結果: ${passed ? 'PASS' : 'FAIL'}`);
    
    return passed;
}

// テスト3: 未来に行けない・未来を変えられない制約が守られていること
function testNoFutureTravel() {
    const story = loadContinuedStory();
    if (!story) return false;
    
    // 未来への移動や未来の変更に関する禁止事項が含まれているかチェック
    const futureBlocked = story.includes('未来への移動機能は完全に封印') || 
                         story.includes('未来に干渉できない') ||
                         story.includes('未来は変えられない');
    
    console.log(`テスト3: 未来制約チェック`);
    console.log(`  未来制約の言及: ${futureBlocked ? '確認' : '未確認'}`);
    console.log(`  結果: ${futureBlocked ? 'PASS' : 'FAIL'}`);
    
    return futureBlocked;
}

// テスト4: 続編として物語が繋がっていること
function testStoryContinuity() {
    const story = loadContinuedStory();
    if (!story) return false;
    
    // 前作のキャラクターや要素が続編に登場しているかチェック
    const hasOriginalCharacters = story.includes('田中博士') && 
                                 story.includes('ユリ') && 
                                 story.includes('山田');
    
    console.log(`テスト4: 物語継続性チェック`);
    console.log(`  前作キャラクターの登場: ${hasOriginalCharacters ? '確認' : '未確認'}`);
    console.log(`  結果: ${hasOriginalCharacters ? 'PASS' : 'FAIL'}`);
    
    return hasOriginalCharacters;
}

// テスト5: 新キャラクターの詳細情報が記録されていること
function testNewCharacterDetails() {
    const characters = loadCharacters();
    if (!characters) return false;
    
    // 新キャラクターが適切に定義されているかチェック
    const newCharacters = characters.filter(char => 
        !['田中博士', '佐藤ユリ', '山田'].includes(char.name)
    );
    
    const hasNewCharacterDetails = newCharacters.length >= 1 && 
                                  newCharacters.every(char => 
                                      char.name && char.gender && char.role && char.description
                                  );
    
    console.log(`テスト5: 新キャラクター詳細チェック`);
    console.log(`  新キャラクター数: ${newCharacters.length}人`);
    console.log(`  詳細情報完整性: ${hasNewCharacterDetails ? '完備' : '不完全'}`);
    console.log(`  結果: ${hasNewCharacterDetails ? 'PASS' : 'FAIL'}`);
    
    return hasNewCharacterDetails;
}

// 全テスト実行
function runAllContinuedTests() {
    console.log('=== SFショートショート続編 TDD テスト実行 ===\n');
    
    const test1 = testContinuedStoryLength();
    const test2 = testIncreasedCharacterCount();
    const test3 = testNoFutureTravel();
    const test4 = testStoryContinuity();
    const test5 = testNewCharacterDetails();
    
    console.log('\n=== テスト結果サマリー ===');
    console.log(`テスト1 (続編文字数): ${test1 ? 'PASS' : 'FAIL'}`);
    console.log(`テスト2 (登場人物増加): ${test2 ? 'PASS' : 'FAIL'}`);
    console.log(`テスト3 (未来制約): ${test3 ? 'PASS' : 'FAIL'}`);
    console.log(`テスト4 (物語継続性): ${test4 ? 'PASS' : 'FAIL'}`);
    console.log(`テスト5 (新キャラクター詳細): ${test5 ? 'PASS' : 'FAIL'}`);
    
    const allPassed = test1 && test2 && test3 && test4 && test5;
    console.log(`\n総合結果: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
    
    return allPassed;
}

// メイン実行
if (require.main === module) {
    runAllContinuedTests();
}

module.exports = { 
    runAllContinuedTests, 
    testContinuedStoryLength, 
    testIncreasedCharacterCount, 
    testNoFutureTravel,
    testStoryContinuity,
    testNewCharacterDetails
};