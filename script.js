let arabicNumbers = ["&#1632;", "&#1633;", "&#1634;", "&#1635;", "&#1636;", "&#1637;", "&#1638;", "&#1639;", "&#1640;", "&#1641;"];

// this function prints quran suras to web page:
function printQuran(start, end) {
    document.getElementById("quranArea").innerHTML = ""; // ---> clearing innerHTML of div tag
    let output = "";	// ---> this string crates the whole html of the sura and at the end will be set as innerHTML of above div tag
    thisAyahNum = 1;    // ---> this variable will be used for numbering ayahs
    for(k = start; k < end; k++) {		// ---> looping through quran ayahs in specified range (in chosen surah)
        for(i = 0; i < quranText[k].length; i++) {	// ---> looping through words of this ayah
            // preparing the root of each word:
            if(typeof(qurootText[k][i]) == "string") {	// ---> cheking if this word has only one root (multiple roots are stored in array):
                // crating each ayah word by word in span tags and adding the root of each word as title attribure:
                output = output + "<span title='" + qurootText[k][i] + "'>" + quranText[k][i] + " " + "</span>";
            }else{  // --> if this word has more than one root
                multiRoots = "";
                for(j = 0; j < qurootText[k][i].length; j++) {	// --> looping through the array which contains all roots of this word
                    multiRoots = multiRoots + qurootText[k][i][j] + "&nbsp;&nbsp;|&nbsp;&nbsp;";
                }
                multiRoots = multiRoots.slice(0, -25)   // ---> removing last extra " | " from the end of string
                output = output + "<span title='" + multiRoots + "'>" + quranText[k][i] + "&nbsp;" +  "</span>";
            }
        }
        // separating bismillah from first ayah of this surah:
        if(thisAyahNum == 1 && start != 0 && start != 1235) {	// ---> if it's first ayah but is not surah number 1 and is not surah number 9)
            let b = "<br><hr>";
            let position = 259;
            output = [output.slice(0, position), b, output.slice(position)].join('');
        }
        // converting english numbers to acabic numbers:
        thisAyahNum_arabic = "";
        for(l = 0; l < thisAyahNum.toString().length; l++) {
            thisAyahNum_arabic = thisAyahNum_arabic + arabicNumbers[thisAyahNum.toString()[l]];
        }
        output = output + "﴿" + thisAyahNum_arabic + "﴾" + "<br><hr>";
        thisAyahNum += 1;   // ---> incrementing ayah number for next usage
    }
    // writing output to page:
    document.getElementById("quranArea").innerHTML = output;
}
