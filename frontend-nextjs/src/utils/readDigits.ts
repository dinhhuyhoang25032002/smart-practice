const unitTexts = [
    '', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'
];

const scaleTexts = [
    '', 'nghìn', 'triệu', 'tỷ', 'nghìn', 'triệu', 'trăm'
]

const readThreeDigits = (number: number, isBigNumber?: boolean) => {
    const absNumber = Math.abs(number);
    const hundreds = Math.floor(absNumber / 100);
    const remain = absNumber % 100;
    const tens = Math.floor(remain / 10);
    const units = remain % 10;

    let result = "";

    if (hundreds > 0) {
        result += unitTexts[hundreds] + ' trăm '
    } else if (isBigNumber && (tens > 0 || units > 0)) {
        result += 'không trăm '
    }

    if (tens > 1) {
        result += unitTexts[tens] + ' mươi '
    } else if (tens === 1) {
        result += 'mười ';
    } else if (isBigNumber && units > 0) {
        result += "linh "
    }

    if (tens > 1 && units === 1) {
        result += 'mốt';
    } else if (tens > 0 && units === 5) {
        result += 'lăm';
    } else if (units > 0) {
        result += unitTexts[units];
    } else if (tens === 0 && units === 5) {
        result += unitTexts[units];
    }

    return result.trim();
}

export const readNumber = (number: number) => {
    if (number === 0) return "Không đồng"
    else {
        let absNumber = Math.abs(number);
        let result = '';
        let index = 0;
        const lastIndex = Math.floor(String(absNumber).length / 3);
        while (absNumber > 0) {
            const hasScale = index !== lastIndex;
            const threeDigits = readThreeDigits(absNumber % 1000, hasScale);
            if (threeDigits) {
                result = `${threeDigits} ${scaleTexts[index]} ${result}`
            }
            absNumber = Math.floor(absNumber / 1000);
            index++;
        }
        result = (number < 0 ? "âm" : "") + result.trim() + ' đồng'
        console.log(result[0].toUpperCase() + result.slice(1));
        return result[0].toUpperCase() + result.slice(1);
    }
}