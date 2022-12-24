var search_input = document.querySelector(".page-search-input");

//add event listener to search input on enter key

search_input.addEventListener("keyup", function(event) {

    if (event.keyCode === 13) {

        event.preventDefault();

        find_page();

    }

});



function find_page() {

    var search_value = search_input.value;

    //strip "/", "-", "." from search value

    search_value = search_value.replace(/\//g, " ");
    search_value = search_value.replace(/-/g, " ");
    search_value = search_value.replace(/\./g, " ");

    //if search value is empty, hide results

    if (search_value == "") {

        document.querySelector(".page-search-results").innerHTML = "";

    }

    //if search value is not empty, show results

    else {

        var search_terms = document.querySelector("pageSearchTerms").innerHTML;

        var search_terms_array = search_terms.split(",");

        var search_results = [];
        var score_results = [];

        for (var i = 0; i < search_terms_array.length; i++) {

            var search_term = search_terms_array[i];
            var term_name = search_term.split(":")[0];
            var term_slug = search_term.split(":")[1];
            var term_terms = search_term.split(":")[2];
            var term_terms_array = term_terms.split(";");

            for (var j = 0; j < term_terms_array.length; j++) {

                var term_term = term_terms_array[j];

                result = scoreSearchTerm(term_term, search_value);

                if (term_term != "" && term_term != " " && term_term != "/" ) {

                    if (result > 0) {

                        if (search_results.indexOf(search_term) == -1) {

                            search_results.push(search_term);
                            score_results.push(result);

                        }

                        else {

                            var index = search_results.indexOf(search_term);
                            score_results[index] == result;

                        }

                    }

                }

            }

        }

        //sort search results by score

        for (var i = 0; i < search_results.length; i++) {

            for (var j = 0; j < search_results.length; j++) {

                if (score_results[i] > score_results[j]) {

                    var temp = score_results[i];
                    score_results[i] = score_results[j];
                    score_results[j] = temp;

                    var temp = search_results[i];
                    search_results[i] = search_results[j];
                    search_results[j] = temp;

                }

            }

        }

        console.log(search_results, score_results);

        //direct user to number 1 search result, if there are none, send to 404?search=term

        if (search_results.length > 0 && search_value.length > 2 && score_results[0] > 3) {

            var search_result = search_results[0].split(":")[1];
            window.location.href = search_result;

        } else {

            window.location.href = "/404?search=" + search_value;

        }

    }

}

function scoreSearchTerm(str1, str2) {
    str1 = str1.trim().toLowerCase();
    str2 = str2.trim().toLowerCase();

    if (str1.includes("#")) {
        str1 = str1.split("#")[1];
    }

    if (str2.includes("#")) {
        str2 = str2.split("#")[1];
    }

    var result = 0;
    if (str1.includes(str2)) {
        result += 0.35 * str2.length;
    }

    if (str2.includes(str1)) {
        result += 0.35 * str1.length;
    }

    if (str1.startsWith(str2) || str2.startsWith(str1)) {
        result += 2.3;
    }

    if (str1.endsWith(str2) || str2.endsWith(str1)) {
        result += 2;
    }

    str1_words = str1.split(" ");
    str2_words = str2.split(" ");

    for (var i = 0; i < str1_words.length; i++) {
        word = str1_words[i];
        if (word.endsWith(str2) || str2.endsWith(word)) {
            result += 0.2 * word.length;
        }
    }

    for (var i = 0; i < str2_words.length; i++) {
        word = str2_words[i];
        if (word.endsWith(str1) || str1.endsWith(word)) {
            result += 0.2 * word.length;
        }
    }

    for (var i = 0; i < str1_words.length; i++) {
        word = str1_words[i];
        if (word.startsWith(str2) || str2.startsWith(word)) {
            result += 0.35 * word.length;
        }
    }

    for (var i = 0; i < str2_words.length; i++) {
        word = str2_words[i];
        if (word.startsWith(str1) || str1.startsWith(word)) {
            result += 0.35 * word.length;
        }
    }

    for (var i = 0; i < str1_words.length; i++) {
        word = str1_words[i];
        if (word.includes(str2) || str2.includes(word)) {
            result += 0.6 * word.length;
        }
    }

    for (var i = 0; i < str2_words.length; i++) {
        word = str2_words[i];
        if (word.includes(str1) || str1.includes(word)) {
            result += 0.6 * word.length;
        }
    }


    return result;

}

function calculateScore(str1, str2) {
  let score = 0;

  if (str1.length === str2.length) {
    if (str1 === str2) {
      score = 1;
    } else {
      if (str1.includes(str2) || str2.includes(str1)) {
        score += 21;
      }

      const str1Words = str1.split(" ");
      const str2Words = str2.split(" ");
      if (str1Words.sort().join(" ") === str2Words.sort().join(" ")) {
        score += 6;
      }
    }
  } else {
    if (str1.length > str2.length) {
      if (str1.includes(str2)) {
        score += 22;
      }
    } else {
      if (str2.includes(str1)) {
        score += 22;
      }
    }

    if (str1.startsWith(str2) || str2.startsWith(str1)) {
      score += 2;
    }

    if (str1.length === str2.length + 1 || str2.length === str1.length + 1) {
      score += 8;
    }
  }

  for (let i = 0; i < str1.length; i++) {
    if (str1[i] === str2[i]) {
      score += 15;
    }
  }

  let misspellingsCount = 0;
  for (let i = 0; i < str1.length; i++) {
    if (str1[i] !== str2[i]) {
      misspellingsCount++;
    }
  }
  score -= misspellingsCount * 10;

  return score / 100;
}