const fs = require('fs');
const path = require('path');

async function main() {
    const source = process.argv[2];
    if (!source) {
        console.error('Usage:');
        console.error('  # Fetch from URL (requires network, use BypassSandbox=true):');
        console.error('  node scripts/fetch-familiar-cards.js <url>');
        console.error('');
        console.error('  # Read from local HTML file:');
        console.error('  node scripts/fetch-familiar-cards.js <path/to/file.html>');
        process.exit(1);
    }

    let html;
    if (source.startsWith('http')) {
        console.log(`Fetching from ${source}...`);
        const res = await fetch(source);
        html = await res.text();
    } else {
        console.log(`Reading from local file ${source}...`);
        html = fs.readFileSync(source, 'utf8');
    }

    // Parse table rows: <td>NAME</td><td>PROB%</td>
    const regex = /<td[^>]*>\s*([^<]+?)\s*<\/td>\s*<td[^>]*>\s*([0-9.]+)%\s*<\/td>/g;
    let match;
    const items = [];
    const SKIP_NAMES = new Set(['道具名稱', '特殊', '稀有', '罕見', '傳說']);

    while ((match = regex.exec(html)) !== null) {
        let name = match[1].trim();
        if (SKIP_NAMES.has(name) || name.includes('機率')) continue;
        let prob = parseFloat(match[2]);
        if (!isNaN(prob)) {
            items.push({ name, probability: prob });
        }
    }

    if (items.length === 0) {
        console.error('❌ No items found. The HTML table structure may have changed.');
        process.exit(1);
    }

    // Grand prizes: items with probability < 0.5%
    let grandPrizes = items.filter(i => i.probability < 0.5).map(i => i.name);
    if (grandPrizes.length === 0) {
        // Fallback: first 4 items
        grandPrizes = items.slice(0, 4).map(i => i.name);
    }

    // Read existing data.ts
    const dataTsPath = path.join(__dirname, '../src/app/[locale]/tools/simulators/maplestory/familiar-card-pack/data.ts');
    let dataTs = fs.readFileSync(dataTsPath, 'utf8');

    // Replace FAMILIAR_CARD_REWARDS array
    const rewardsRegex = /export const FAMILIAR_CARD_REWARDS:\s*FamiliarCardReward\[\]\s*=\s*\[[\s\S]*?\];/;
    const newRewardsString = `export const FAMILIAR_CARD_REWARDS: FamiliarCardReward[] = [\n` +
        items.map(i => `    { name: '${i.name.replace(/'/g, "\\'")}', probability: ${i.probability} },`).join('\n') +
        `\n];`;
    dataTs = dataTs.replace(rewardsRegex, newRewardsString);

    // Replace GRAND_PRIZES array
    const grandPrizesRegex = /export const GRAND_PRIZES\s*=\s*\[[\s\S]*?\];/;
    const newGrandPrizesString = `export const GRAND_PRIZES = [\n` +
        grandPrizes.map(name => `    '${name.replace(/'/g, "\\'")}',`).join('\n') +
        `\n];`;
    dataTs = dataTs.replace(grandPrizesRegex, newGrandPrizesString);

    fs.writeFileSync(dataTsPath, dataTs);
    console.log(`✅ Updated data.ts successfully!`);
    console.log(`   - ${items.length} items parsed`);
    console.log(`   - ${grandPrizes.length} grand prizes: ${grandPrizes.join(', ')}`);
}

main().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
