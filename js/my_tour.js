/**
 * Created by albertllavore on 12/2/14.
 */

// Define the tour!
var tour = {
    id: "plae-chef-hopscotch",
    steps: [
        {
            title: "Style Selector",
            content: "Click to select your favorite style.",
            target: document.querySelector(".styles-menu-list"),
            placement: "bottom",
            zindex: 100,
            yOffset: 100,
            xOffset: "center"
        },
        {
            title: "Color Selector",
            content: "Let's select a color. Double-click.",
            target: document.querySelector("#tabs_container"),
            placement: "left"
        },
        {
            title: "Customize your Shoe",
            content: "Let's customize your shoe by selecting different tabs. Double-click.",
            target: document.querySelector(".tab-styles-list"),
            placement: "right",
            zindex: 100
        }
    ]
};

// Start the tour!
hopscotch.startTour(tour);

