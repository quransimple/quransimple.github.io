let specialArabicLetters = ["آ","أ","ي","ى","إ","ك","ئ","ء","ؤ","ة"];
let specialArabicLetters_numbers = [1,1,10,10,1,20,10,1,6,5];

let abjad_letters = ["ا", "ب", "ج", "د", "ه", "و", "ز", "ح", "ط", "ی", "ک", "ل", "م", "ن", "س", "ع", "ف", "ص", "ق", "ر", "ش", "ت", "ث", "خ", "ذ", "ض", "ظ", "غ"];
let abjad_numbers = [1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400,500,600,700,800,900,1000];

abjad_letters = abjad_letters.concat(specialArabicLetters);
abjad_numbers = abjad_numbers.concat(specialArabicLetters_numbers);

let quranRoots_numberValue = [];

for(let i = 0; i < rootElements.length; i++) {
	let thisRoot = rootElements[i].getAttribute("r");
	let thisRoot_numberValue = 0;
	for(let j = 0; j < thisRoot.length; j++) {
		let thisLetter_index = abjad_letters.indexOf(thisRoot[j]);
		let thisLetter_numberValue = abjad_numbers[thisLetter_index];
		thisRoot_numberValue += thisLetter_numberValue;
	}
	quranRoots_numberValue.push(thisRoot_numberValue);
}