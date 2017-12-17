

var patternForeground = "grey";
var patternBackground = "white";
var patterns = [
    //pattern1 circles
    {
        attr: [
            ["id", "texCircles8"], //must be the first
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
    },
        //pattern1 circles inv
        {
            attr: [
                ["id", "texCirclesInv8"], //must be the first
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
                        ["fill", patternForeground],
                    ]
                },
                //circle1
                {
                    type: "circle",
                    attr: [
                        ["cx", 4],
                        ["cy", 4],
                        ["r", 4],
                        ["fill", patternBackground]
                    ]
                },
            ]
        },
    //pattern2, strokes
    {
        attr: [
            ["id", "texStrokes3"], //must be the first
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
    },
    //pattern3, squares
    {
        attr: [
        ["id", "teSquares6"], //must be the first
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
    },
    //pattern3, squares inv
    {
        attr: [
        ["id", "teSquaresInv6"], //must be the first
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
                    ["fill", patternForeground],
                ]
            },
            //circle1
            {
                type: "rect",
                attr: [
                    ["height", 6],
                    ["width", 6],
                    ["fill", patternBackground],
                ]
            },
        ]
    },
    
    //pattern2, horizontal strokes
    {
        attr: [
            ["id", "texHoriStrokes3"], //must be the first
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
    },
    
    //pattern2, vertical strokes
    {
        attr: [
            ["id", "texVertStrokes3"], //must be the first
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
    },
]

var patternIds = patterns.map(p => "#" + p.attr[0][1]);
console.log(patternIds);

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
