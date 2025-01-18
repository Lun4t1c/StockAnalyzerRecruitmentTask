export async function getLinesFromCSVFile(file: File): Promise<string[]> {
    return (await file.text()).split('\n');
}