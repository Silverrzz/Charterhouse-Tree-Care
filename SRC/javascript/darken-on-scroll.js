//Darken all elements with "darken-on-scroll" class when they are scrolled into view by adding a box shadow on the inside of the element

//Get all elements with "darken-on-scroll" class

function updateOpacity() {

    var darkenOnScroll = document.getElementsByClassName("darken-on-scroll");

    //Loop through all elements with "darken-on-scroll" class

    for (var i = 0; i < darkenOnScroll.length; i++) {

        //Get the current element

        var currentElement = darkenOnScroll[i];

        //Set transition duration

        currentElement.style.transition = "box-shadow 0.6s ease-in-out, opacity 0.6s ease-in-out"

        //Set the elements parent to a black background

        currentElement.parentElement.style.backgroundColor = "black";

        //Get the current element's top position

        var currentElementTop = currentElement.getBoundingClientRect().top;

        //Get the current element's bottom position

        var currentElementBottom = currentElement.getBoundingClientRect().bottom;

        //Is center of the current element in view?

        if (currentElementTop < window.innerHeight / 2 && currentElementBottom > window.innerHeight / 2) {

            currentElement.style.boxShadow = "inset 0 0 0 1000px rgba(0, 0, 0, 0.4)";

        } else {

            //Restore the opacity of the current element

            currentElement.style.boxShadow = "none";

        }

    }

}

//Update the opacity of all elements with "darken-on-scroll" class when the page is scrolled

window.addEventListener("scroll", updateOpacity);

//Update the opacity of all elements with "darken-on-scroll" class when the page is resized

window.addEventListener("resize", updateOpacity);

//Update the opacity of all elements with "darken-on-scroll" class when the page is loaded

window.addEventListener("load", updateOpacity);