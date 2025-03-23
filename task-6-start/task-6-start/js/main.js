/**Worked on by Simon Medalssy :) */


window.onload = run;

function run() {
  document.querySelector("#stepOneButton").addEventListener("click", fetchText);

  /****** PART A:: FETCH */  
  async function fetchText() {
    console.log("in fetch");
    let raw_rainbow_text = "";
    try {
      const response = await fetch('files/rainbow.txt');
      raw_rainbow_text = await response.text();
      document.querySelector("#stepOneButton").style.display = "none";
      document.querySelector("#inputDiv").style.display = "block";
      document.querySelector("#rainbow_text").innerText = raw_rainbow_text;
      document.querySelector("#resetButton").addEventListener("click", resetPoem);
      runPartB(raw_rainbow_text);
    } catch (e) {
      console.error("Failed to fetch the text", e);
    }
  }

  /****** PART B:: TEXT PROCESSING  */
  function runPartB(originalRainBowText) {
    document
      .querySelector("#produce-poem")
      .addEventListener("click", producePoem);

    function producePoem() {
      console.log(originalRainBowText);
      const phrase = document.querySelector("#phrase").value;
      const phrase_as_array = phrase.split(/[\s.!?\n]+/);
      const rainbow_tokens = originalRainBowText.split(/[\s.!?\n]+/);
      console.log(phrase_as_array);
      console.log(rainbow_tokens);
      runPartC(rainbow_tokens, phrase_as_array);
    }
  }

  /****** PART C:: POEM CREATION  */
  function runPartC(rainbow_words, seed_phrase_array) {
    console.log(rainbow_words);
    console.log(seed_phrase_array);
    let poem_sentence = "";
    seed_phrase_array.forEach(word => {
      for (let i = 0; i < word.length; i++) {
        const nextChar = word[i];
        const matchingWord = rainbow_words.find(rainbow_word => rainbow_word[i] === nextChar);
        if (matchingWord) {
          poem_sentence += matchingWord + " ";
        }
      }
    });
    console.log(poem_sentence);
    runPartD(poem_sentence.trim());
  }

  /****** PART D:: VISUALIZE  */
  function runPartD(new_sentence) {
    const outputDiv = document.querySelector("#output");
    outputDiv.style.display = "block";
    outputDiv.innerHTML = "";
    new_sentence.split("").forEach(char => {
      const span = document.createElement("span");
      span.innerText = char;
      span.style.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
      span.style.fontSize = `${Math.random() * 20 + 10}px`;
      outputDiv.appendChild(span);
    });
  }

  /****** PART E:: RESET  */
  function resetPoem() {
    document.querySelector("#output").innerHTML = "";
    document.querySelector("#output").style.display = "none";
    document.querySelector("#phrase").value = "";
  }
} //window onload


