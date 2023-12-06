// create svg element:
const width = 1050
const height = 50
const squareWidth = 10
const compressionNum = 1000
const margin = { top: 10, right: 30, bottom: 30, left: 0 }
var scaffoldCurrent = 'Sc0000000'
var selectedBar = null

const chromosomeBtn = function () {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 60, left: 90 },
        barWidth = width - margin.left - margin.right,
        barHeight = 200 - margin.top - margin.bottom

    // append the svg object to the body of the page
    var svg = d3
        .select('#my_dataviz')
        .append('svg')
        .attr('width', barWidth + margin.left + margin.right)
        .attr('height', barHeight + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    // Parse the mutation Data
    d3.json('new.json', function (data) {
        // Parse the scaffold Data
        // d3.json('compressGeneFormat.json', function (data2) {
        //     d3.json('scaffoldLength.json', function (data3) {
        // // Calculate the count of dots for each line
        // var lineCounts = data.reduce(function (counts, d) {
        //     counts[d.chromosome] = (counts[d.chromosome] || 0) + 1
        //     return counts
        // }, {})

        // // Sort the lines based on the count of dots in ascending order
        // data.sort(function (a, b) {
        //     return lineCounts[b.chromosome] - lineCounts[a.chromosome]
        // })

        // Define the x-axis tick formatting function

        // X axis
        var x = d3
            .scaleBand()
            .range([0, barWidth])
            .domain(
                data.map(function (d) {
                    return d.chromosome
                })
            )
        // .padding(1)
        var xAxis = d3.axisBottom(x)
        var tickValues = data
            .map(function (d) {
                return d.chromosome
            })
            .filter(function (value, index, self) {
                return self.indexOf(value) === index
            })

        xAxis.tickValues(tickValues)
        svg.append('g')
            .attr('transform', 'translate(0,' + barHeight + ')')
            .call(d3.axisBottom(x))
            // .selectAll('.tick text')
            // .style('display', 'none')
            .call(xAxis)
            .selectAll('text')
            .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'end')
            .attr('font-size', '10px')

        const tooltip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0)

        // Find the maximum endpoint value in the data
        // var maxEndpoint = d3.max(data3, function (d) {
        //     return d.Length
        // })

        // Add Y axis /* Change y axis to the length of scaffold */
        var y = d3.scaleLinear().domain([0, 3000000]).range([barHeight, 0])
        var yAxis = d3.axisLeft(y).ticks(5) // Set the desired number of ticks on the y-axis

        svg.append('g').call(yAxis)

        // Add y-axis label
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left) // Adjust the position of the label from the left margin
            .attr('x', 0 - barHeight / 2) // Adjust the position of the label from the top
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text('Scaffold Length')
            .attr('fill', '#3f4f5e')

        // Lines
        svg.selectAll('myline')
            .data(data)
            .enter()
            .append('line')
            .attr('x1', function (d) {
                return x(d.chromosome) // the top x axis of the line
            })
            .attr('x2', function (d) {
                return x(d.chromosome) // the bottom x axis of the line
            })
            .attr('y1', function (d) {
                return y(d.length) // the top of the line
            })
            .attr('y2', y(0)) // the base of the line
            .attr('stroke', 'grey')
            .attr('cursor', 'pointer') // Set the cursor to indicate it's clickable
            .on('mouseover', function (d) {
                tooltip.transition().duration(200).style('opacity', 1)
                tooltip
                    .html(`Chr: ${d.chromosome} Length: ${d.length}`)
                    .style('left', d3.event.pageX + 2 + 'px')
                    .style('top', d3.event.pageY + 30 + 'px')

                // tooltip
                //     .html(`Chr: ${d.chromosome} Length: ${d.end}`)
                //     .style('left', d3.event.pageX + 2 + 'px')
                //     .style('top', d3.event.pageY + 30 + 'px')
                d3.select(this).style('stroke', '#c02425').style('stroke-width', '2px')
            })
            .on('mouseout', function () {
                tooltip.transition().duration(200).style('opacity', 0)
                d3.select(this).style('stroke', 'none').style('stroke-width', '0')
            })
            .on('click', function (d) {
                d3.select('#chr_name').text(d.chromosome)
                d3.select('#content2').text('') // Clear the content
                // d3.select("#content2").remove();
                d3.select(this).style('stroke', '#c02425').style('stroke-width', '3px')
                mutationView(squareWidth, compressionNum, d.chromosome) // Update the content with the selected bar's data
            })

        svg.selectAll('mycircle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                return x(d.chromosome)
            })
            .attr('cy', function (d) {
                return y(d['mutation'][0].BP)
            })
            .attr('r', function (d) {
                return d['mutation'][0].muValues * 10
            })
            .style('fill', function (d) {
                return 'rgba(192,36,37,0.4)' // Apply a different fill color for data with PopID "OL"
            })
            .attr('cursor', 'pointer') // Set the cursor to indicate it's clickable
            .on('mouseover', function (d) {
                tooltip.transition().duration(200).style('opacity', 1)
                tooltip
                    .html(
                        `Chr: ${d.chromosome} <br> BP: ${d['mutation'][0].BP} <br> Degree: ${d['mutation'][0].muValues}`
                    )
                    .style('left', d3.event.pageX + 5 + 'px')
                    .style('top', d3.event.pageY + -40 + 'px')
                    .style('background-color', 'rgba(0, 0, 0, 0.8)')
                    .style('color', '#fff')
                    .style('border-radius', '5px')
                    .style('padding', '5px')
                d3.select(this)
                    .transition() // Add transition effect
                    .duration(200) // Set the transition duration in milliseconds
                    .attr('r', function (d) {
                        return d['mutation'][0].muValues * 10 + 5
                    })
            })
            .on('mouseout', function () {
                tooltip.transition().duration(200).style('opacity', 0)
                d3.select(this)
                    .transition() // Add transition effect
                    .duration(200) // Set the transition duration in milliseconds
                    .attr('r', function (d) {
                        return d['mutation'][0].muValues * 10
                    })
            })
            .on('click', function (d) {
                d3.select('#chr_name').text(d.chromosome)
                d3.select('#content2').text('') // Clear the content
                // d3.select("#content2").remove()

                d3.select(this)
                    .classed('selected', true)
                    .attr('stroke', '#c02425')
                    .attr('stroke-width', '3px')

                if (d3.select(this))
                    // }else{
                    //     d3.select(this)
                    //     .attr('stroke', 'none')
                    //     .attr('stroke-width', '0px')
                    // }

                    mutationView(squareWidth, compressionNum, d.chromosome) // Update the content with the selected bar's data
            })
            .filter(function (d) {
                return d['mutation'][0].muValues == 0
            }) // Filter out data with Value equal to 0
            .style('display', 'none') // Hide the circle for data with Value equal to 0

        svg.selectAll('mycircle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                return x(d.chromosome)
            })
            .attr('cy', function (d) {
                return y(d['mutation'][0].BP)
            })
            .attr('r', 1.5)
            .style('fill', function (d) {
                return 'rgba(192,140,1,1)' // Apply a different fill color for data with PopID "OL"
            })
    })
}

const mutationView = function (squareWidth, compressionNum, scaffold) {
    scaffoldCurrent = scaffold
    // square width and height
    let squareHeight = squareWidth

    // gene's location
    let X = 0
    let Y = squareWidth + 10
    let yAdd = squareWidth * 2

    // mutation's location
    let muX = 0
    let muY = squareWidth + 10

    // mutation circle size
    let muRadius = 10 * 1.5
    let compression = compressionNum
    let scaffoldNum = scaffold
    let muSize = 5

    // Genome colors
    let genomeColorL1 = '#53B3BD'
    // Variants colors
    let variantColor = d3.scaleLinear().domain([1, 0]).range(['#c02425', '#EDC534'])
    // Compression colors
    // let compressionColor = d3
    //     .scaleLinear()
    //     .domain([1, 999])
    //     .range(['#BDC3C7', '#3f4f5e'])
    let comColor = '#BDC3C7'
    // //Create SVG element
    let svg = d3
        .select('#content2')
        .append('svg')
        .attr('width', width)
        .attr('transform', `translate(${margin.left},${margin.top})`)

    // Read the gene file
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText)
            let xhr3 = new XMLHttpRequest()
            let geneWidth = 0
            let space = 0

            // Whole gene

            // chr svg
            // let chr_svg = d3
            //     .select('#content2')
            //     .append('svg')
            //     .attr('width', width)
            //     .attr('height', height)

            // Content1
            // Loop through the data and append all the names to a string
            // for (let i = 0; i < data.length; i++) {
            //     widths += data[i].gene[j].width + ', '
            // }

            // Remove the last comma and space from the string
            // widths = widths.slice(0, -2)
            // document.getElementById('content1').innerHTML = widths

            // Content2
            // let xhr2 = new XMLHttpRequest()
            // xhr2.onreadystatechange = function () {
            let lastGene = 0 // record the last gene to compare with real endpoint
            for (let i = 0; i < data.length; i++) {
                if (data[i].chromosome == scaffold) {
                    // space

                    if (i == 0 || data[i].chromosome != data[i - 1].chromosome) {
                        space = (data[i].start - 1) / compression //non gene
                    } else {
                        space = (data[i].start - 1 - (data[i - 1].end + 1)) / compression //non gene
                    }

                    ///////////* Old version *//////////
                    // space = space * squareWidth

                    // // case1:換行前有空白
                    // if (X + geneWidth * squareWidth + space > width) {
                    //     // 這裡的geneWidth為上一個
                    //     Y += yAdd
                    //     space = space - (width - X - geneWidth * squareWidth)
                    //     X = 0
                    // }
                    // // space長度超出視窗
                    // while (space > width) {
                    //     Y += yAdd
                    //     space -= width
                    // }

                    // X = space //starting point of each gene
                    ///////////* Old version *//////////

                    // ** New compression code **
                    for (let n = 0; n < space; n++) {
                        if (X + squareWidth > width) {
                            Y += yAdd
                            X = 0
                        }

                        drawRectangle(svg, X, Y, squareWidth, squareHeight, comColor)
                        X += squareWidth
                    }

                    geneWidth = data[i].width / compression // square number of genwidth
                    // if (geneWidth % compression != 0) geneWidth += 1

                    if (geneWidth != 0) {
                        for (let k = 0; k < geneWidth; k++) {
                            if (X + squareWidth > width) {
                                Y += yAdd
                                X = 0
                            }
                            drawGeneRectangle(
                                svg,
                                X,
                                Y,
                                squareWidth,
                                squareHeight,
                                genomeColorL1,
                                `Name: ${data[i].name} &nbsp Start: ${data[i].start} &nbsp End: ${data[i].end}`
                            )
                            X += squareWidth
                        }
                    }
                    lastGene++
                }
            }

            // last gene endpoint to scaffold length endpoint
            // xhr3.onreadystatechange = function () {
            //     if (this.readyState == 4 && this.status == 200) {
            //         let data3 = JSON.parse(this.responseText)
            for (let scaf = 0; scaf < data3.length; scaf++) {
                if (data[lastGene].chromosome == data3[scaf].chromosome) {
                    if (data[lastGene].end < data3[scaf].Length) {
                        space = (data3[scaf].Length - data[lastGene].end + 1) / compression

                        for (let n = 0; n < space; n++) {
                            if (X + squareWidth > width) {
                                Y += yAdd
                                X = 0
                            }
                            drawRectangle(svg, X, Y, squareWidth, squareHeight, comColor)
                            X += squareWidth
                        }
                    }
                }
            }
            // }
            // }
            // xhr3.open('GET', 'scaffoldLength.json', true)
            // xhr3.send()

            if (squareWidth < 5) {
                svg.attr('height', Y + 10)
            } else {
                svg.attr('height', Y + squareWidth + 10)
            }
            console.timeEnd()
            // }
            // xhr2.open('GET', 'mutation.json', true)
            // xhr2.send()
        }
        let nonMu = 0
        let first = true

        for (let i = 0; i < data2.length; i++) {
            while (data2[i].chromosome == scaffoldNum) {
                if (data2[i].muValues != 0) {
                    // compression
                    if (first) {
                        nonMu = (data2[i].BP - 1) / compression
                    } else if (data2[i - 1].chromosome == data2[i].chromosome) {
                        nonMu = (data2[i].BP - 1 - (data2[i - 1].BP + 1)) / compression
                    }

                    first = false
                    for (let j = 0; j < nonMu; j++) {
                        // case1:超出視窗，換行
                        if (muX + squareWidth > width) {
                            muY += yAdd
                            muX = 0
                        }
                        muX += squareWidth
                    }

                    // mutation
                    // 確認是否換行
                    if (muX + squareWidth > width) {
                        muY += yAdd
                        muX = 0
                    }
                    //
                    // Problem
                    if (muRadius / 2 < 5) {
                        // if radius is smaller than 5 then change the radius to 10
                        muRadius = data2[i].muValues * muSize * (10 * 0.5)
                    } else {
                        // mutation size depend on the mutation degree(MuValue)
                        muRadius = data2[i].muValues * muSize * (squareWidth * 0.5)
                    }

                    drawCircle(
                        svg,
                        muX,
                        muY + squareWidth * 0.5,
                        muRadius, // circle size
                        variantColor(data2[i].muValues), // Not sure what does the color mean
                        data2[i].muValues, // opacity
                        `BP: ${data2[i].BP}<br>Mmutation degree: ${data2[i].muValues}<br>P Nuc: ${data2[i].PNuc}`
                    )
                    muX += squareWidth
                }
                i++
            }
        }
        muX = 0
        muY = squareWidth + 10

        first = true

        for (let i = 0; i < data2.length; i++) {
            while (data2[i].chromosome == scaffoldNum) {
                if (data2[i].muValues != 0) {
                    // compression
                    if (first) {
                        nonMu = (data2[i].BP - 1) / compression
                    } else {
                        nonMu = (data2[i].BP - 1 - (data2[i - 1].BP + 1)) / compression
                    }

                    first = false
                    for (let j = 0; j < nonMu; j++) {
                        // case1:超出視窗，換行
                        if (muX + squareWidth > width) {
                            muY += yAdd
                            muX = 0
                        }

                        muX += squareWidth
                    }

                    // mutation
                    // 確認是否換行
                    if (muX + squareWidth > width) {
                        muY += yAdd
                        muX = 0
                    }

                    // if (muRadius / 2 < 5) {
                    //     // if radius is smaller than 5 then change the radius to 10
                    //     muRadius = 10
                    // }

                    drawCircle(
                        svg,
                        muX,
                        muY + squareWidth * 0.5,
                        muRadius * 0.2,
                        '#c02425',
                        1,
                        `BP: ${data2[i].BP}<br>Mmutation degree: ${data2[i].muValues}<br>P Nuc: ${data2[i].PNuc}`
                    )

                    muX += squareWidth
                }
                i++
            }
        }
    }
    xhr.open('GET', 'new.json', true)
    xhr.send()

    //mutation
    // let xhr2 = new XMLHttpRequest()
    // xhr2.onreadystatechange = function () {
    //     if (this.readyState == 4 && this.status == 200) {
    // let data2 = JSON.parse(this.responseText)

    // }
    // }
    // xhr2.open('GET', 'mutation.json', true)
    // xhr2.send()
}

chromosomeBtn()
// mutationView(squareWidth, compressionNum, scafold)

function drawRectangle(svg, x, y, w, h, c) {
    // Append a rectangle element to the SVG
    const rectangle = svg
        .append('rect')
        // Set the x and y coordinates of the rectangle
        .attr('x', x)
        .attr('y', y)
        // Set the width and height of the rectangle
        .attr('width', w)
        .attr('height', h)
        // Set the fill color of the rectangle
        .attr('fill', c)
        .style('opacity', 0.7)

    rectangle.lower()
    // Create a tooltip
}

function drawGeneRectangle(svg, x, y, w, h, c, details) {
    // Append a rectangle element to the SVG
    const rectangle = svg
        .append('rect')
        // Set the x and y coordinates of the rectangle
        .attr('x', x)
        .attr('y', y)
        // Set the width and height of the rectangle
        .attr('width', w)
        .attr('height', h)
        // Set the fill color of the rectangle
        .attr('fill', c)
        .style('opacity', 0.7)

    rectangle.lower()
    // Create a tooltip
    const tooltip = d3
        .select('.content2')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)

    // Add event handlers
    rectangle
        .on('mouseover', function () {
            tooltip.transition().duration(200).style('opacity', 1)
            tooltip
                .html(details)
                .style('left', d3.event.pageX + 10 + 'px')
                .style('top', d3.event.pageY + 15 + 'px')
            // d3.select(this)
            //     .style("stroke", "#3f4f5e")
            //     .style("stroke-width", "2px");
        })
        .on('mouseout', function () {
            tooltip.transition().duration(200).style('opacity', 0)
            // d3.select(this)
            //     .style("stroke", "none")
            //     .style("stroke-width", "0");
        })
}

function drawCircle(svg, x, y, radius, c, opacity, details) {
    const circle = svg
        .append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', radius)
        .attr('fill', c)
        .style('opacity', 0.7)
        .style('stroke', 'none') // Initially, no stroke

    // svg.append('circle')
    //     .attr('cx', x)
    //     .attr('cy', y)
    //     .attr('r', 3)
    //     .attr('fill', "#c02425")
    //     .style('opacity', 1)
    //     .style("stroke", "none")

    // circle.raise();
    // Create a tooltip
    const tooltip = d3
        .select('.content2')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)

    // Add event handlers
    circle
        .on('mouseover', function () {
            tooltip.transition().duration(200).style('opacity', 1)
            tooltip
                .html(details)
                .style('left', d3.event.pageX + 2 + 'px')
                .style('top', d3.event.pageY + 2 + 'px')
            d3.select(this).style('stroke', '#c02425').style('stroke-width', '2px')
        })
        .on('mouseout', function () {
            tooltip.transition().duration(200).style('opacity', 0)
            d3.select(this).style('stroke', 'none').style('stroke-width', '0')
        })
}

// Square size and compression ratio
const squareContainer = document.getElementById('content2')
const squareSizeInput = document.getElementById('square-size-input')
// const updateSquaresBtn = document.getElementById('update-squares-btn')
const compressionInput = document.getElementById('compression-input')
const updateCompressionBtn = document.getElementById('update-compression-btn')

let squareSize = squareSizeInput.value
let compressionDegree = compressionInput.value

// updateSquaresBtn.addEventListener('click', updateSquares)

// function updateSquares() {
//     squareSize = Number(squareSizeInput.value)
//     renderSquares()
// }

updateCompressionBtn.addEventListener('click', updateCompression)

function updateCompression() {
    squareSize = Number(squareSizeInput.value)
    compressionDegree = Number(compressionInput.value)
    renderSquares()
}
function renderSquares() {
    squareContainer.innerHTML = ''
    const square = mutationView(squareSize, compressionDegree, scaffoldCurrent)
    squareContainer.append(square)
}
