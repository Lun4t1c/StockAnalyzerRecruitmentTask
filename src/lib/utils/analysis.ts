export async function getLinesFromCSVFile(file: File): Promise<string[]> {
    return (await file.text())
        .split('\n')
        .filter(str => str !== '');
}

export async function findLargestDailyDecline(lines: string[]): Promise<number | null> {
    if (lines.length < 2) return null;

    let result: number = 0;

    for (let i = 0; i < lines.length - 1; i++) {
        const lineValues = lines[i].split(',');
        const nextLineValues = lines[i + 1].split(',');
        
        const difference = parseFloat(nextLineValues[2]) - parseFloat(lineValues[2])
        
        if (result > difference) {
            result = difference;
        }
    }
    
    return -result;
}