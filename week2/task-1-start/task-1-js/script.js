window.onload = setup;

/** function setup */
function setup(){
console.log("we are a go!")
/*** ALL ANWSERS TO BE ADDED IN THE ALLOCATED SPACE */
/*** START PART ONE ACCESS */ 
/* 1: all paragraph elements */
/***CODE */
const allParagraphs = document.querySelectorAll('p');
console.log(allParagraphs);
/***OUTPUT: NodeList containing all <p> elements on the page
 * 
 */


/*************************************** */
/* 2: only the first paragraph element */
/***CODE */
const firstParagraph = document.querySelector('p');
console.log(firstParagraph);
/***OUTPUT: The first <p> element on the page
 * 
 */


/*************************************** */
/* 3: all elements with the class inner-container */
/***CODE */
const innerContainers = document.querySelectorAll('.inner-container');
console.log(innerContainers);
/***OUTPUT: NodeList containing all elements with class "inner-container"
 * 
 */


/*************************************** */
/* 4: the last image element inside the element that has the class img-container */
/***CODE */
const imgElements = document.querySelectorAll('.img-container img');
const lastImg = imgElements[imgElements.length - 1];
console.log(lastImg);
/***OUTPUT: The last <img> element inside an element with class "img-container"
 * 
 */


/*************************************** */
/* 5A: all h2 elements */
/*** CODE */
const allH2s = document.querySelectorAll('h2');
console.log(allH2s);
/*** OUTPUT: NodeList containing all <h2> elements on the page */

/* 5B: length of the list in 5A */
 /*** CODE */
const h2Count = allH2s.length;
console.log(h2Count);
/*** OUTPUT: The number of <h2> elements on the page */

/* 5C: the text content of the first element in the list from 5A */
/*** CODE */
const firstH2Text = allH2s[0]?.textContent;
console.log(firstH2Text);
/*** OUTPUT: The text content of the first <h2> element */


/*************************************** */
/* 6: the element with id name parent */
/***CODE */
const parentElement = document.querySelector('#parent');
console.log(parentElement);
/***OUTPUT: The element with id "parent"
 * 
 */

/*************************************** */
/*** END PART ONE ACCESS */ 


/*************************************** */
/*** START PART TWO MODIFY */ 
/*************************************** */
// /* 1: Select the first paragraph and replace the text within the paragraph... */
// /***CODE */
// const firstParagraphModify = document.querySelector('p');
// const todayDate = new Date().toLocaleDateString();
// firstParagraphModify.textContent = `New text in paragraph one: text changed by YOUR_NAME on the following date: ${todayDate}.`;
// console.log(firstParagraphModify.textContent);
// /*** OUTPUT: New text in paragraph one: text changed by YOUR_NAME on the following date: today's date. */
// /*************************************** */
// /* 2: Select all elements in the HTML that have the class name content-container
//  and change the background color ... of first and second ...*/
// /***CODE */
//  const contentContainers = document.querySelectorAll('.content-container');
// contentContainers[0].style.backgroundColor = 'orange';
// contentContainers[1].style.backgroundColor = 'purple';
// console.log('Changed background colors of the first two content-container elements.');

// /*************************************** */
// /* 3: Change the src element of the first image element on the page to be ...
// /***CODE */
// const firstImage = document.querySelector('img');
// firstImage.src = 'task-1-images/seven.png';
// console.log('Updated src attribute of the first image to seven.png.');

// /*************************************** */
// /* 4: Select the third paragraph element on the page and 
// replace the content (within the paragraph) to be an h2 element which contains the text `TEST 123`
// /***CODE */
// const thirdParagraph = document.querySelectorAll('p')[2];
// thirdParagraph.innerHTML = '<h2>TEST 123</h2>';
// console.log('Replaced content of the third paragraph with an h2 element.');

// /*************************************** */
// /* 5: Select the fourth paragraph element on the page and 
// add to the existing content an h2 element containing the text `TEST 123`
// /***CODE */
// const fourthParagraph = document.querySelectorAll('p')[3];
// fourthParagraph.innerHTML += '<h2>TEST 123</h2>';
// console.log('Added an h2 element to the fourth paragraph.');

// /*************************************** */
// /* 6: Select the fifth paragraph element on the page and add to the existing content 
// an img element that holds `one.png`, and add the class newStyle to said paragraph element.
// /***CODE */
//  const fifthParagraph = document.querySelectorAll('p')[4];
// fifthParagraph.innerHTML += '<img src="task-1-images/one.png" />';
// fifthParagraph.classList.add('newStyle');
// console.log('Added an img element and applied the newStyle class to the fifth paragraph.');

// /*************************************** */
// /* 7: Add the following array variable: let colors = ['red','blue','green','orange'];, 
// then access all elements with class name inner-container and save to a variable called `innerContainers`. 
// Next, iterate over the colors array, and for each color: 
// assign the element from innerContainers variable with the same index 
// (i.e. colors[0] should be allocated to the first innerContainers element, colors[1] to the second, etc ...) 
// a background using that color.
// /***CODE */
// let colors = ['red', 'blue', 'green', 'orange'];
// const innerContainersArray = document.querySelectorAll('.inner-container');
// innerContainersArray.forEach((container, index) => {
//   if (colors[index]) {
//     container.style.backgroundColor = colors[index];
//   }
// });
// console.log('Assigned colors to inner-container elements.');

// /*************************************** */
// /*** END PART TWO MODIFY */ 


/*************************************** */
/*** START PART THREE CREATE */ 
/*************************************** */
/* 1: NEW PARAGRAPHS */
/* 1A: Access all paragraph elements, and store the result in a variable called: allPTagsThree */
/* 1B: Create a function:function customCreateElement(parent){ //body } */
/* 1C:  In the body of customCreateElement create a new parargraph element*/
/* 1D:  Set the text of this element to be : `using create Element`*/
/* 1E:  Set the background of this paragraph element to be green */
/* 1F:  Set the color of the text in this paragraph element to be white */
/* 1G: Append this new element to the parent variable within the function. */
/* 1H: Iterate through the allPTagsThree array and call customCreateElement(), 
passing the current allPTagsThree element as the parent with each iteration.*/
/***CODE */

const allPTagsThree = document.querySelectorAll('p');

function customCreateElement(parent) {
    const newParagraph = document.createElement('p');
    newParagraph.textContent = 'using create Element';
    newParagraph.style.backgroundColor = 'green';
    newParagraph.style.color = 'white';
    parent.appendChild(newParagraph);
}

allPTagsThree.forEach((paragraph) => {
  customCreateElement(paragraph);
});
console.log('Added new paragraphs to each parent paragraph.');

/***EXPLANATION::
 * 
 * 
 */

/*************************************** */
/* 2: GRID OF BOXES */
/* 2A: Create another new function: function customNewBoxCreate(parent){ //body }*/
/* 2B: In the body of customNewBoxCreate create a new div element, that has the class testDiv. 
/* 2C:Then append this new element to the parent variable within the function. 
/* 2D:Finally, return</code> this new element */
/* 2E:Create a nested for loop (for rows and columns) to iterate through 10 columns and 10 rows (just like the JS Review :)). 
    Call the customNewBoxCreate function, in order to generate a new div -> representing each cell in the grid. 
    Ensure that the parent element for each of these new divs is the element whose id is named `new-grid`*/
/* 2F: You will see at this point that the x,y position of the resulting divs makes no sense... 
    Fix this by doing the following: every time you call customNewBoxCreate() - save the current returned element 
    in a variable i.e. returnedDiv. 
    Set the style (left and top) to the of this element to 
    the necessary x and y position (use the counter variables in the for nested for loop to 
    calculate the new positions.
/* 2G: BONUS I: Make every div in the resulting grid in an even numbered row have white background 
    and otherwise let it have a background of purple.</li>
/* 2H: BONUS II: For every div in an even numbered row make it contain the text `EVEN`, 
    otherwise lat it have the content `ODD`.*/

/***CODE */

 function customNewBoxCreate(parent) {
    const newDiv = document.createElement('div');
    newDiv.className = 'testDiv';
    parent.appendChild(newDiv);
    return newDiv;
}

const gridParent = document.getElementById('new-grid');
const gridSize = 10;
for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
        const returnedDiv = customNewBoxCreate(gridParent);
        returnedDiv.style.position = 'absolute';
        returnedDiv.style.left = `${col * 50}px`;
        returnedDiv.style.top = `${row * 50}px`;
        returnedDiv.style.width = '50px';
        returnedDiv.style.height = '50px';
        if (row % 2 === 0) {
            returnedDiv.style.backgroundColor = 'white';
            returnedDiv.textContent = 'EVEN';
        } else {
            returnedDiv.style.backgroundColor = 'cornflowerblue';
            returnedDiv.textContent = 'ODD';
        }
    }
}
const allTestDivs = document.querySelectorAll('.testDiv');
console.log(allTestDivs.length);

/***EXPLANATION::
 * 
 * 
 */

/*************************************** */
/* 3: GRID OF BOXES II */

/* 3A: Create ANOTHER nested for loop - in order to generate a new grid ... 
    USE the same customNewBoxCreate function..., the only difference is that the parent element 
    for each of these new divs is the element whose id is `new-grid-three`. */
/* 3B: Then: write the code to check when a column is a multiple of 3 (no remainder), 
    when it is a column where the remainder is 1 or when the remainder is 2 ... 
    HINT:: look up the % operator.. */
/* 3C: Then for each of the above cases: give the new divs in the first case a background of red, 
        then the second a background of orange and the third yellow. */
/*  3D: Finally, let each div contain the text content representing the associated remainder 
    when dividing by three. */

/***CODE */

/*DISCLAIMER: Since I did this without a group, and part 3 was very difficult, I used AI to help when I got stuck to complete it.*/

const gridParentTwo = document.getElementById('new-grid-three');
for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
        const returnedDiv = customNewBoxCreate(gridParentTwo);
        returnedDiv.style.position = 'absolute';
        returnedDiv.style.left = `${col * 50}px`;
        returnedDiv.style.top = `${row * 50}px`;
        returnedDiv.style.width = '50px';
        returnedDiv.style.height = '50px';
        if (col % 3 === 0) {
            returnedDiv.style.backgroundColor = 'red';
            returnedDiv.textContent = '0';
        } else if (col % 3 === 1) {
            returnedDiv.style.backgroundColor = 'orange';
            returnedDiv.textContent = '1';
        } else {
            returnedDiv.style.backgroundColor = 'yellow';
            returnedDiv.textContent = '2';
        }
    }
}
  const allTestDivsTwo = document.querySelectorAll('#new-grid-three .testDiv');
  console.log(allTestDivsTwo.length);

/***EXPLANATION::
 * 
 * 
 */

/*************************************** */
/*** END PART THREE CREATE */ 
/*************************************** */
    

}