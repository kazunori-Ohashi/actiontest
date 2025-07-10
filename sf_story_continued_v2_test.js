const fs = require('fs');
const path = require('path');

// Test configuration
const STORY_FILE = 'sf_story_continued_v2.txt';
const MAX_CHARACTERS = 10000;
const MIN_CHARACTERS = 100;

// Expected characters (existing + new)
const EXPECTED_EXISTING_CHARACTERS = [
    '田中博士', '田中', // Dr. Tanaka
    'ユリ', // Yuri
    '山田', // Yamada
    '鈴木恵子', '鈴木', // Suzuki Keiko
    '中村' // Nakamura
];

const EXPECTED_NEW_CHARACTERS = [
    '林博士', '林', // Dr. Hayashi
    '佐々木' // Sasaki
];

// Theme keywords
const THEME_KEYWORDS = [
    '過去', // past
    '未来', // future
    '時間', // time
    '変える', '変え', // change
    '過去に行く', '過去への', // going to past
    '未来を変える' // changing future
];

// Test results
let testResults = [];
let passCount = 0;
let totalTests = 0;

function runTest(testName, testFunction) {
    totalTests++;
    try {
        const result = testFunction();
        if (result.pass) {
            passCount++;
            testResults.push(`✓ ${testName}: PASS`);
            if (result.details) {
                testResults.push(`  Details: ${result.details}`);
            }
        } else {
            testResults.push(`✗ ${testName}: FAIL - ${result.message}`);
        }
    } catch (error) {
        testResults.push(`✗ ${testName}: ERROR - ${error.message}`);
    }
}

function readStoryFile() {
    try {
        return fs.readFileSync(STORY_FILE, 'utf8');
    } catch (error) {
        throw new Error(`Cannot read story file: ${error.message}`);
    }
}

// Test 1: File exists and readable
function testFileExists() {
    const exists = fs.existsSync(STORY_FILE);
    return {
        pass: exists,
        message: exists ? 'File exists' : 'Story file does not exist'
    };
}

// Test 2: UTF-8 encoding (implicit in readFileSync with 'utf8')
function testUTF8Encoding() {
    try {
        const content = readStoryFile();
        const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(content);
        return {
            pass: hasJapanese,
            message: hasJapanese ? 'Contains Japanese characters' : 'No Japanese characters detected'
        };
    } catch (error) {
        return { pass: false, message: error.message };
    }
}

// Test 3: File extension
function testFileExtension() {
    const hasCorrectExtension = path.extname(STORY_FILE) === '.txt';
    return {
        pass: hasCorrectExtension,
        message: hasCorrectExtension ? 'Correct .txt extension' : 'Incorrect file extension'
    };
}

// Test 4: Length within limit
function testStoryLength() {
    const content = readStoryFile();
    const length = content.length;
    return {
        pass: length <= MAX_CHARACTERS,
        message: `Story length: ${length} characters (limit: ${MAX_CHARACTERS})`,
        details: `Current length: ${length}/${MAX_CHARACTERS} characters`
    };
}

// Test 5: Not empty
function testNotEmpty() {
    const content = readStoryFile();
    return {
        pass: content.length > 0,
        message: content.length > 0 ? 'Story is not empty' : 'Story is empty'
    };
}

// Test 6: Meaningful content
function testMeaningfulContent() {
    const content = readStoryFile();
    const trimmedContent = content.trim();
    const meaningfulLength = trimmedContent.length;
    return {
        pass: meaningfulLength >= MIN_CHARACTERS,
        message: `Meaningful content: ${meaningfulLength} characters (minimum: ${MIN_CHARACTERS})`
    };
}

// Test 7: Existing characters present
function testExistingCharacters() {
    const content = readStoryFile();
    const missingCharacters = [];
    const foundCharacters = [];
    
    for (const character of EXPECTED_EXISTING_CHARACTERS) {
        if (content.includes(character)) {
            foundCharacters.push(character);
        } else {
            missingCharacters.push(character);
        }
    }
    
    return {
        pass: missingCharacters.length === 0,
        message: missingCharacters.length === 0 ? 
            'All existing characters found' : 
            `Missing characters: ${missingCharacters.join(', ')}`,
        details: `Found: ${foundCharacters.join(', ')}`
    };
}

// Test 8: New character introduced
function testNewCharacters() {
    const content = readStoryFile();
    const foundNewCharacters = [];
    
    for (const character of EXPECTED_NEW_CHARACTERS) {
        if (content.includes(character)) {
            foundNewCharacters.push(character);
        }
    }
    
    return {
        pass: foundNewCharacters.length > 0,
        message: foundNewCharacters.length > 0 ? 
            'New characters found' : 
            'No new characters detected',
        details: `New characters: ${foundNewCharacters.join(', ')}`
    };
}

// Test 9: Total character count
function testTotalCharacterCount() {
    const content = readStoryFile();
    const allCharacters = [...EXPECTED_EXISTING_CHARACTERS, ...EXPECTED_NEW_CHARACTERS];
    const foundCharacters = allCharacters.filter(char => content.includes(char));
    const uniqueCharacters = [...new Set(foundCharacters)];
    
    return {
        pass: uniqueCharacters.length >= 6,
        message: `Found ${uniqueCharacters.length} unique characters (minimum: 6)`,
        details: `Characters: ${uniqueCharacters.join(', ')}`
    };
}

// Test 10-12: Theme tests
function testThemeKeywords() {
    const content = readStoryFile();
    const foundKeywords = [];
    
    for (const keyword of THEME_KEYWORDS) {
        if (content.includes(keyword)) {
            foundKeywords.push(keyword);
        }
    }
    
    return {
        pass: foundKeywords.length >= 3,
        message: foundKeywords.length >= 3 ? 
            'Theme keywords found' : 
            'Insufficient theme keywords',
        details: `Found keywords: ${foundKeywords.join(', ')}`
    };
}

// Test 13: Japanese language
function testJapaneseLanguage() {
    const content = readStoryFile();
    const japaneseChars = content.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g);
    const japaneseRatio = japaneseChars ? japaneseChars.length / content.length : 0;
    
    return {
        pass: japaneseRatio > 0.5,
        message: `Japanese character ratio: ${(japaneseRatio * 100).toFixed(1)}%`,
        details: `Japanese characters: ${japaneseChars ? japaneseChars.length : 0}/${content.length}`
    };
}

// Test 14: Proper encoding (similar to test 2)
function testProperEncoding() {
    return testUTF8Encoding();
}

// Test 15: Japanese formatting
function testJapaneseFormatting() {
    const content = readStoryFile();
    const hasProperStructure = content.includes('「') && content.includes('」');
    
    return {
        pass: hasProperStructure,
        message: hasProperStructure ? 
            'Japanese dialogue formatting detected' : 
            'No Japanese dialogue formatting found'
    };
}

// Test 16: Continuation from previous story
function testContinuation() {
    const content = readStoryFile();
    const hasContinuationElements = content.includes('続') || content.includes('後') || content.includes('新た');
    
    return {
        pass: hasContinuationElements,
        message: hasContinuationElements ? 
            'Story continuation elements found' : 
            'No continuation elements detected'
    };
}

// Test 17: World-building consistency
function testWorldBuilding() {
    const content = readStoryFile();
    const hasConsistentElements = content.includes('研究所') && content.includes('装置');
    
    return {
        pass: hasConsistentElements,
        message: hasConsistentElements ? 
            'Consistent world-building elements' : 
            'Inconsistent world-building'
    };
}

// Test 18: Character consistency
function testCharacterConsistency() {
    const content = readStoryFile();
    const hasConsistentRoles = content.includes('博士') && content.includes('技師');
    
    return {
        pass: hasConsistentRoles,
        message: hasConsistentRoles ? 
            'Character roles consistent' : 
            'Character roles inconsistent'
    };
}

// Test 19: Narrative structure
function testNarrativeStructure() {
    const content = readStoryFile();
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    
    return {
        pass: lines.length >= 10,
        message: `Story has ${lines.length} content lines`,
        details: `Narrative structure: ${lines.length} lines`
    };
}

// Test 20: Story conclusion
function testStoryConclusion() {
    const content = readStoryFile();
    const hasConclusion = content.includes('使命') || content.includes('未来') || content.includes('希望');
    
    return {
        pass: hasConclusion,
        message: hasConclusion ? 
            'Story has proper conclusion' : 
            'Story lacks proper conclusion'
    };
}

// Test 21: Scientific consistency
function testScientificConsistency() {
    const content = readStoryFile();
    const hasScientificElements = content.includes('実験') && content.includes('技術');
    
    return {
        pass: hasScientificElements,
        message: hasScientificElements ? 
            'Scientific concepts present' : 
            'Scientific concepts missing'
    };
}

// Run all tests
function runAllTests() {
    console.log('SF Story Continued Test Suite');
    console.log('==============================\n');
    
    // File Structure Tests
    console.log('File Structure Tests:');
    runTest('Test 1: File exists and readable', testFileExists);
    runTest('Test 2: UTF-8 encoding', testUTF8Encoding);
    runTest('Test 3: File extension', testFileExtension);
    
    // Content Length Tests
    console.log('\nContent Length Tests:');
    runTest('Test 4: Length within limit', testStoryLength);
    runTest('Test 5: Not empty', testNotEmpty);
    runTest('Test 6: Meaningful content', testMeaningfulContent);
    
    // Character Tests
    console.log('\nCharacter Tests:');
    runTest('Test 7: Existing characters present', testExistingCharacters);
    runTest('Test 8: New characters introduced', testNewCharacters);
    runTest('Test 9: Total character count', testTotalCharacterCount);
    
    // Theme Tests
    console.log('\nTheme Tests:');
    runTest('Test 10-12: Theme keywords', testThemeKeywords);
    
    // Language Tests
    console.log('\nLanguage Tests:');
    runTest('Test 13: Japanese language', testJapaneseLanguage);
    runTest('Test 14: Proper encoding', testProperEncoding);
    runTest('Test 15: Japanese formatting', testJapaneseFormatting);
    
    // Continuity Tests
    console.log('\nContinuity Tests:');
    runTest('Test 16: Continuation', testContinuation);
    runTest('Test 17: World-building consistency', testWorldBuilding);
    runTest('Test 18: Character consistency', testCharacterConsistency);
    
    // Quality Tests
    console.log('\nQuality Tests:');
    runTest('Test 19: Narrative structure', testNarrativeStructure);
    runTest('Test 20: Story conclusion', testStoryConclusion);
    runTest('Test 21: Scientific consistency', testScientificConsistency);
    
    // Print results
    console.log('\n' + '='.repeat(50));
    console.log('Test Results:');
    console.log('='.repeat(50));
    testResults.forEach(result => console.log(result));
    
    console.log('\n' + '='.repeat(50));
    console.log(`Summary: ${passCount}/${totalTests} tests passed`);
    console.log(`Success Rate: ${((passCount / totalTests) * 100).toFixed(1)}%`);
    console.log('='.repeat(50));
    
    return passCount === totalTests;
}

// Run tests if this file is executed directly
if (require.main === module) {
    const success = runAllTests();
    process.exit(success ? 0 : 1);
}

module.exports = { runAllTests };