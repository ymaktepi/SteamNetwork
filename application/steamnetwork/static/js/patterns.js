//var patternForeground = "grey";
//var patternBackground = "white";

var listPatternsForeground = ["#1eb2ab", '#de2bf2', "#576d62", "#fcb723", "#ff644c", "#16bf4f"];

var listPatternsBackground = ["white"]

function createCircles(patternForeground, patternBackground) {
    return {
        attr: [
            ["id", "texCircles8" + patternForeground + patternBackground], //must be the first
            ["height", 10],
            ["width", 10],
            ["patternUnits", "userSpaceOnUse"],
        ],
        toAppend: [
            //rect1
            {
                type: "rect",
                attr: [
                    ["height", 10],
                    ["width", 10],
                    ["fill", patternBackground],
                ]
            },
            //circle1
            {
                type: "circle",
                attr: [
                    ["cx", 4],
                    ["cy", 4],
                    ["r", 4],
                    ["fill", patternForeground]
                ]
            },
        ]
    };
}

function createStrokes(patternForeground, patternBackground) {
    return {
        attr: [
            ["id", "texStrokes3" + patternForeground + patternBackground], //must be the first
            ["height", 10],
            ["width", 10],
            ["patternUnits", "userSpaceOnUse"],
        ],
        toAppend: [
            //rect1
            {
                type: "rect",
                attr: [
                    ["height", 10],
                    ["width", 10],
                    ["fill", patternBackground],
                ]
            },
            //stroke1
            {
                type: "path",
                attr: [
                    ["d", 'M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2'],
                    ["stroke", patternForeground],
                    ["stroke-width", 3]
                ]
            },
        ]
    }
}

function createSquares(patternForeground, patternBackground) {
    return {
        attr: [
            ["id", "teSquares6" + patternForeground + patternBackground], //must be the first
            ["height", 10],
            ["width", 10],
            ["patternUnits", "userSpaceOnUse"],
        ],
        toAppend: [
            //rect1
            {
                type: "rect",
                attr: [
                    ["height", 10],
                    ["width", 10],
                    ["fill", patternBackground],
                ]
            },
            //circle1
            {
                type: "rect",
                attr: [
                    ["height", 6],
                    ["width", 6],
                    ["fill", patternForeground],
                ]
            },
        ]
    }
}

function createHStrokes(patternForeground, patternBackground) {
    return {
        attr: [
            ["id", "texHoriStrokes3" + patternForeground + patternBackground], //must be the first
            ["height", 6],
            ["width", 6],
            ["patternUnits", "userSpaceOnUse"],
        ],
        toAppend: [
            //rect1
            {
                type: "rect",
                attr: [
                    ["height", 6],
                    ["width", 6],
                    ["fill", patternBackground],
                ]
            },
            //stroke1
            {
                type: "rect",
                attr: [
                    ["height", 3],
                    ["width", 6],
                    ["fill", patternForeground],
                ]
            },
        ]
    }
}

function createVStrokes(patternForeground, patternBackground) {
    return {
        attr: [
            ["id", "texVertStrokes3" + patternForeground + patternBackground], //must be the first
            ["height", 6],
            ["width", 6],
            ["patternUnits", "userSpaceOnUse"],
        ],
        toAppend: [
            //rect1
            {
                type: "rect",
                attr: [
                    ["height", 6],
                    ["width", 6],
                    ["fill", patternBackground],
                ]
            },
            //stroke1
            {
                type: "rect",
                attr: [
                    ["height", 6],
                    ["width", 3],
                    ["fill", patternForeground],
                ]
            },
        ]
    }
}
var listPatternsFunctions = [
    createCircles, createVStrokes, createSquares, createHStrokes, createStrokes
];

var lengthFunctions = listPatternsFunctions.length;
var lengthBG = listPatternsBackground.length;
var lengthFG = listPatternsForeground.length;
var max = lengthFunctions * lengthBG * lengthFG;

var patterns = [];

for (i = 0; i < max; i++) {
    patterns.push(listPatternsFunctions[i % lengthFunctions](listPatternsForeground[i % lengthFG], listPatternsBackground[i % lengthBG]));
}


var patternIds = patterns.map(p => "#" + p.attr[0][1]);

function addTextureDefs(svg) {
    let defs = svg.append("defs");

    patterns.forEach(p => {
        let pattern = defs.append("pattern");
        p.attr.forEach(attr => pattern.attr(attr[0], attr[1]));

        p.toAppend.forEach(toAppend => {
            let appened = pattern.append(toAppend.type);
            toAppend.attr.forEach(attr => appened.attr(attr[0], attr[1]));
        });
    });
    /*
        pattern.attr("id", "texCircles1")
            .attr("height", 10)
            .attr("width", 10)
            .attr("patternUnits", "userSpaceOnUse");

        pattern.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", patternBackground);

        pattern.append("circle")
            .attr("cx", 1)
            .attr("cy", 1)
            .attr("r", 1)
            .attr("fill", patternForeground);*/
}
