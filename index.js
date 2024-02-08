import { fetchData } from './data.js'

// Square size and compression ratio
const squareContainer = document.getElementById('content2')
const squareSizeInput = document.getElementById('square-size-input')
const compressionInput = document.getElementById('compression-input')
const updateCompressionBtn = document.getElementById('update-compression-btn')
const expressionBtn = document.getElementById('expression-btn')

let squareSize = Number(squareSizeInput.value)
let compressionDegree = Number(compressionInput.value)

// create svg element:
let containerWidth = document.getElementById('content2').offsetWidth

// Use the container's width for the SVG width
let width = containerWidth - 100

let scaffoldCurrent = 'Sc0000000'
let margin = { top: 10, right: 30, bottom: 60, left: 90 },
    barWidth = width - margin.left - margin.right - margin.top,
    barHeight = 200 - margin.top - margin.bottom

// append the svg object to the body of the page
let svg = d3
    .select('#scaffold-barchart')
    .append('svg')
    .attr('width', width)
    .attr('height', barHeight + margin.top + margin.bottom + margin.left)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

fetchData().then(data => {
    let x = d3
        .scaleBand()
        .range([0, barWidth])
        .padding(0.2)
        .domain(
            data.map(function (d) {
                return d.chromosome
            })
        )
    let xAxis = d3.axisBottom(x)
    let tickValues = data
        .filter(function (d) {
            return d.mutation.length > 0
        })
        .map(function (d) {
            return d.chromosome
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
    let y = d3.scaleLinear().domain([0, 50000000]).range([barHeight, 0])
    let yAxis = d3.axisLeft(y).ticks(5) // Set the desired number of ticks on the y-axis

    svg.append('g').call(yAxis)
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left) // Adjust the position of the label from the left margin
        .attr('x', 0 - barHeight / 2) // Adjust the position of the label from the top
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Scaffold Length')
        .attr('fill', '#3f4f5e')

    svg.selectAll('myline')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', function (d) {
            return x(d.chromosome) // the top x axis of the line
        })
        // .attr('x2', function (d) {
        //     return x(d.chromosome) // the bottom x axis of the line
        // })
        .attr('y', function (d) {
            return y(0)
        })
        // .attr('y2', y(0)) // the base of the line
        .attr('width', 10)
        .attr('height', function (d) {
            return 0
        })
        .attr('fill', 'grey')
        .attr('cursor', 'pointer') // Set the cursor to indicate it's clickable
        .on('mouseover', function (d) {
            tooltip.transition().duration(200).style('opacity', 1)
            tooltip
                .html(`Chr: ${d.chromosome} Length: ${d.length}`)
                .style('left', d3.event.pageX + 2 + 'px')
                .style('top', d3.event.pageY + 30 + 'px')
            d3.select(this).style('stroke', '#c02425').style('stroke-width', '2px')
        })
        .on('mouseout', function () {
            tooltip.transition().duration(200).style('opacity', 0)
            d3.select(this).style('stroke', 'grey').style('stroke-width', '0')
        })
        .on('click', function (d) {
            // d3.selectAll('rect')
            //     .classed('selected', false)
            //     .style('stroke', 'grey')
            //     .style('stroke-width', '1px')

            d3.select('#chr_name').text(d.chromosome)
            d3.select('#content2').text('') // Clear the content

            scaffoldCurrent = d.chromosome
            mutationView(squareSize, compressionDegree, d.chromosome) // Update the content with the selected bar's data
            d3.select('#content2')
                .style('opacity', 0) // 將 content2 的透明度變為 0
                .transition()
                .duration(500)
                .style('opacity', 1)
        })

    // Animation
    svg.selectAll('rect')
        .transition()
        .duration(500)
        .attr('y', function (d) {
            return y(d.length)
        })
        .attr('height', function (d) {
            return barHeight - y(d.length)
        })
        .delay(function (d, i) {
            return i * 100
        })

    let flatData = data.reduce(function (acc, d) {
        d.mutation.forEach(function (m) {
            acc.push({
                chromosome: d.chromosome,
                mutation: m,
            })
        })
        return acc
    }, [])
    // circle
    svg.selectAll('mycircle')
        .data(flatData)
        .enter()
        .append('circle')
        .attr('cx', function (d) {
            return x(d.chromosome)
        })
        .attr('cy', function (d) {
            return y(d.mutation.BP)
        })
        .attr('r', function (d) {
            return d.mutation.muValues * 10
        })
        .style('fill', function (d) {
            return 'rgba(192,36,37,0.4)' // Apply a different fill color for data with PopID "OL"
        })
        .attr('cursor', 'pointer') // Set the cursor to indicate it's clickable
        .on('mouseover', function (d) {
            tooltip.transition().duration(200).style('opacity', 1)
            tooltip
                .html(
                    `Chr: ${d.chromosome} <br> BP: ${d.mutation.BP} <br> Degree: ${d.mutation.muValues}`
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
                    return d.mutation.muValues * 10 + 5
                })
        })
        .on('mouseout', function () {
            tooltip.transition().duration(200).style('opacity', 0)
            d3.select(this)
                .transition() // Add transition effect
                .duration(200) // Set the transition duration in milliseconds
                .attr('r', function (d) {
                    return d.mutation.muValues * 10
                })
        })
        .on('click', function (d) {
            // Clear the stroke of all circles
            d3.selectAll('circle').attr('stroke', 'none').attr('stroke-width', '0px')

            d3.select('#chr_name').text(d.chromosome)
            d3.select('#content2').text('') // Clear the content

            // d3.select("#content2").remove()
            d3.select(this)
                .classed('selected', true)
                .attr('stroke', '#c02425')
                .attr('stroke-width', '3px')
            // if (d3.select(this))
            // }else{
            //     d3.select(this)
            //     .attr('stroke', 'none')
            //     .attr('stroke-width', '0px')
            // }
            scaffoldCurrent = d.chromosome
            mutationView(squareSize, compressionDegree, d.chromosome) // Update the content with the selected bar's data
            d3.select('#content2')
                .style('opacity', 0) // 將 content2 的透明度變為 0
                .transition()
                .duration(500)
                .style('opacity', 1)
        })
        .filter(function (d) {
            return d.mutation.MuValues == 0
        }) // Filter out data with Value equal to 0
        .style('display', 'none') // Hide the circle for data with Value equal to 0

    svg.selectAll('mycircle')
        .data(flatData)
        .enter()
        .append('circle')
        .attr('cx', function (d) {
            return x(d.chromosome)
        })
        .attr('cy', function (d) {
            return y(d.mutation.BP)
        })
        .attr('r', 1.5)
        .style('fill', function (d) {
            return 'rgba(192,140,1,1)' // Apply a different fill color for data with PopID "OL"
        })

    function mutationView(squareWidth, compressionNum, scaffold) {
        let squareHeight = squareWidth
        // gene's location
        let X = 0
        let Y = squareWidth + 10
        let yAdd = squareWidth * 2

        // colors
        let genomeColorL1 = '#53B3BD'
        let variantColor = d3.scaleLinear().domain([1, 0]).range(['#c02425', '#EDC534'])
        let comColor = '#BDC3C7'

        // mutation circle size
        let muRadius = squareWidth * 2

        let svg = d3
            .select('#content2')
            .append('svg')
            .attr('width', width + 100)
            .attr('transform', `translate(${margin.left - 60},${margin.top})`)

        let lastPosition = 0
        let endSquare = false

        for (let i = 0; i < data.length; i++) {
            if (data[i].chromosome !== scaffold) continue
            let lastGene = data[i].gene.length - 1
            let muInLastGene = false
            let mutations = data[i].mutation

            // enter selected scaffold
            for (let g = 0; g < data[i].gene.length; g++) {
                let gene = data[i].gene[g]
                let previousPoint = g === 0 ? 0 : data[i].gene[g - 1].end
                let hasMutation = false
                let mChange = false
                let mChangeTime = 0

                if (mutations.length === 0) {
                    geneCompress(previousPoint, gene.start, false)
                    geneCompress(gene.start, gene.end, true, gene.name)
                    continue
                }

                for (let m = 1; m < mutations.length; m += 2) {
                    hasMutation = false
                    let mutation = mutations[m]
                    // if (mutation.muValues === 0) continue
                    // check the mutation is in the current gene range

                    // among previous gene end + 1 and current gene start - 1
                    if (mutation.BP > previousPoint && mutation.BP < gene.start) {
                        geneCompress(previousPoint, mutation.BP, false)
                        drawMutation(mutation)
                        while (
                            m + 2 < mutations.length &&
                            mutations[m + 2].BP > previousPoint &&
                            mutations[m + 2].BP < gene.start
                        ) {
                            m += 2
                            if (mutations[m].BP - mutations[m - 2].BP < compressionNum) {
                                drawMutation(mutations[m])
                            } else {
                                geneCompress(mutations[m - 2].BP, mutations[m].BP, false)
                                drawMutation(mutations[m])
                            }
                        }
                        geneCompress(mutation.BP, gene.start, false)
                        if (m + 2 < mutations.length) mutation = mutations[(m += 2)]
                        hasMutation = true
                        geneCompress(gene.start, gene.end, true, gene.name)
                    }

                    // mutation is on the gene start
                    if (gene.start === mutation.BP) {
                        geneCompress(previousPoint, gene.start, false)
                        drawMutation(mutation)
                        while (
                            m + 2 < mutations.length && // Check that m + 1 is a valid index
                            mutations[m + 2].BP < gene.end
                        ) {
                            m += 2
                            if (mutations[m].BP - mutations[m - 2].BP < compressionNum) {
                                drawMutation(mutations[m])
                            } else {
                                geneCompress(mutations[m - 2].BP, mutations[m].BP, true, gene.name)
                                drawMutation(mutations[m])
                            }
                        }
                        geneCompress(mutations[m].BP, gene.end, true, gene.name)
                        if (m + 2 < mutations.length) mutation = mutations[(m += 2)]
                        hasMutation = true
                    }

                    // among current gene start and end
                    if (gene.start < mutation.BP && gene.end > mutation.BP) {
                        geneCompress(previousPoint, gene.start, false)
                        geneCompress(gene.start, mutation.BP, true, gene.name)
                        drawMutation(mutation)
                        while (
                            m + 2 < mutations.length && // Check that m + 1 is a valid index
                            mutations[m + 2].BP < gene.end
                        ) {
                            m += 2
                            if (mutations[m].BP - mutations[m - 2].BP < compressionNum) {
                                drawMutation(mutations[m])
                            } else {
                                geneCompress(mutations[m - 2].BP, mutations[m].BP, true, gene.name)
                                drawMutation(mutations[m])
                            }
                            mChange = true
                            mChangeTime++
                        }
                        if (!mChange) {
                            geneCompress(mutations[m].BP, gene.end, true, gene.name)
                        } else {
                            geneCompress(
                                mutations[m - 2 * mChangeTime].BP,
                                gene.end,
                                true,
                                gene.name
                            )
                        }
                        if (m + 2 < mutations.length) mutation = mutations[(m += 2)]
                        hasMutation = true
                    }

                    // mutation is on the gene end
                    if (gene.end === mutation.BP) {
                        geneCompress(previousPoint, gene.start, false)
                        geneCompress(gene.start, gene.end, true, gene.name)
                        drawMutation(mutation)
                        hasMutation = true
                        break
                    }

                    // mutation is among the last gene end and scaffold end
                    if (g === data[i].gene.length - 1 && mutation.BP > gene.end) {
                        geneCompress(gene.end, mutation.BP, false)
                        drawMutation(mutation)
                        while (m + 2 < mutations.length) {
                            m += 2
                            if (mutations[m].BP - mutations[m - 2].BP < compressionNum) {
                                drawMutation(mutations[m])
                            } else {
                                geneCompress(mutations[m - 2].BP, mutations[m].BP, false)
                                drawMutation(mutations[m])
                            }
                        }
                        geneCompress(mutation.BP, data[i].length, false)
                        hasMutation = true
                        muInLastGene = true
                    }
                }

                if (!hasMutation) {
                    geneCompress(previousPoint, gene.start, false)
                    geneCompress(gene.start, gene.end, true, gene.name)
                }
            }
            if (data[i].gene[lastGene].end < data[i].length) {
                endSquare = true
                if (!muInLastGene) {
                    geneCompress(data[i].gene[lastGene].end, data[i].length, false)
                }
            }
        }

        function drawMutation(mutation) {
            drawCircle(
                svg,
                X,
                Y + squareWidth * 0.5,
                muRadius * mutation.muValues,
                variantColor(mutation.muValues),
                mutation.muValues,
                `BP: ${mutation.BP}<br>Mmutation degree: ${mutation.muValues}<br>P Nuc: ${mutation.pNuc}`
            )
            X += 2
            if (X + squareWidth > width) {
                Y += yAdd
                X = 0
            }
        }

        function geneCompress(start, end, isGene, geneName) {
            let squareNum = Math.floor((end - start) / compressionNum)
            let squareRemain = Math.floor((end - start) % compressionNum)
            if ((squareNum === 0 && squareRemain > 0) || squareRemain > 0) squareNum += 1
            let last = false
            // lastPosition++
            if (squareRemain < 0) {
                console.log('SquareRemain:' + squareRemain)
                console.log('SquareNum:' + squareNum)
                console.log('Start:' + start)
                console.log('End:' + end)
                console.log('GeneName:' + geneName)
                console.log('lastPosistion:' + lastPosition)
            }
            for (let k = 0; k < squareNum; k++) {
                if (k == squareNum - 1 && squareRemain) {
                    lastPosition += squareRemain
                } else {
                    lastPosition += compressionNum
                }
                if (
                    (X + squareWidth <= width && X + squareWidth * 2 > width) ||
                    (endSquare && k === squareNum - 1)
                ) {
                    last = true
                }
                if (X + squareWidth > width) {
                    Y += yAdd
                    X = 0
                }
                if (squareWidth < 5) {
                    svg.attr('height', Y + 10)
                } else {
                    svg.attr('height', Y + squareWidth + 10)
                }
                if (isGene) {
                    drawGeneRectangle(
                        svg,
                        X,
                        Y,
                        squareWidth,
                        squareHeight,
                        genomeColorL1,
                        `Name: ${geneName} &nbsp Start: ${start} &nbsp End: ${end}`,
                        last,
                        lastPosition
                    )
                } else {
                    drawRectangle(
                        svg,
                        X,
                        Y,
                        squareWidth,
                        squareHeight,
                        comColor,
                        last,
                        lastPosition
                    )
                }

                X += squareWidth
                last = false
            }
        }
    }
    function drawRectangle(svg, x, y, w, h, c, last, lastPosition) {
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
        if (last) {
            svg.append('text')
                // Set the x and y coordinates of the text
                .attr('x', x + w * 1.5)
                .attr('y', y + w)
                // Set the content of the text
                .text(lastPosition)
                .style('font-size', w) // Replace '20px' with the desired font size
                .on('mouseover', function () {
                    if (w <= 5) {
                        d3.select(this).style('font-size', 10) // Double the font size on mouseover
                    }
                })
                .on('mouseout', function () {
                    if (w <= 5) {
                        d3.select(this).style('font-size', w) // Restore the original font size on mouseout
                    }
                })
        }
    }

    function drawGeneRectangle(svg, x, y, w, h, c, details, last, lastPosition) {
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
            .attr('cursor', 'pointer')

        rectangle.lower()

        if (last) {
            svg.append('text')
                // Set the x and y coordinates of the text
                .attr('x', x + w * 1.5)
                .attr('y', y + w)
                // Set the content of the text
                .text(lastPosition)
                .style('font-size', w) // Replace '20px' with the desired font size
                .on('mouseover', function () {
                    if (w <= 5) {
                        d3.select(this).style('font-size', 10) // Double the font size on mouseover
                    }
                })
                .on('mouseout', function () {
                    if (w <= 5) {
                        d3.select(this).style('font-size', w) // Restore the original font size on mouseout
                    }
                })
        }
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
                    .style('background-color', 'rgba(0, 0, 0, 0.8)')
                    .style('color', '#fff')
                    .style('border-radius', '5px')
                    .style('padding', '5px')
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
            .on('click', function () {
                parallelCoordinates()
            })
    }
    expressionBtn.addEventListener('click', parallelCoordinates)
    function parallelCoordinates() {
        // set the dimensions and margins of the graph
        var margin = { top: 30, right: 50, bottom: 10, left: 50 },
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom

        let filter = document.getElementById('filter')
        while (filter.firstChild) {
            filter.removeChild(filter.firstChild)
        }
        var svgContainer = d3.select('#PC')
        svgContainer.selectAll('*').remove()

        // Parse the Data
        d3.csv('./data/data.csv', function (data) {
            let sortAscending = {} // Store the sorting direction for each dimension

            let columnNames = d3.keys(data[0])
            let dimensions = columnNames
            drawChart(dimensions)

            for (let i = 1; i < columnNames.length; i++) {
                let btn = document.createElement('button')
                btn.innerHTML = columnNames[i]
                btn.classList.add('filterBtn')
                btn.addEventListener('click', function () {
                    console.log('click')
                    if (!this.clicked) {
                        // If the button has not been clicked, remove the dimension from the dimensions array
                        let index = dimensions.indexOf(this.innerHTML)
                        if (index !== -1) {
                            dimensions.splice(index, 1)
                        }

                        // Change the background color of the button
                        this.style.backgroundColor = 'lightgrey'
                        // Set the flag to true
                        this.clicked = true
                    } else {
                        // If the button has been clicked, add the dimension back to the dimensions array
                        dimensions.push(this.innerHTML)

                        // Reset the background color of the button
                        this.style.backgroundColor = ''
                        // Set the flag to false
                        this.clicked = false
                    }
                    drawChart(dimensions)
                })
                filter.appendChild(btn)
            }

            function drawChart(dimensions) {
                svgContainer.selectAll('*').remove()

                // append the svg object to the body of the page
                var svg = d3
                    .select('#PC')
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

                // Color scale: give me a specie name, I return a color
                var color = d3
                    .scaleOrdinal()
                    .domain([
                        data.map(function (d) {
                            return d.Gene
                        }),
                    ])
                    .range(['lightgrey'])

                // For each dimension, I build a scale. I store all in a y object
                let y = {}
                for (let i in dimensions) {
                    let name = dimensions[i]
                    let domain = d3.extent(data, function (d) {
                        return +d[name]
                    })
                    y[name] = d3.scaleLinear().domain(domain).range([height, 0])
                    sortAscending[name] = true // Initialize sorting direction for each dimension
                }

                // If the last column is of string type, use a point scale instead
                let name = dimensions[0]
                let domain = Array.from(
                    new Set(
                        data.map(function (d) {
                            return d[name]
                        })
                    )
                )
                y[name] = d3.scalePoint().domain(domain).range([height, 0])

                // Build the X scale -> it find the best position for each Y axis
                let x = d3.scalePoint().range([0, width]).domain(dimensions)

                // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
                function path(d) {
                    return d3.line()(
                        dimensions.map(function (p) {
                            return [x(p), y[p](d[p])]
                        })
                    )
                }
                const tooltip = d3
                    .select('body')
                    .append('div')
                    .attr('class', 'tooltip')
                    .style('opacity', 0)

                // Draw the lines
                svg.selectAll('myPath')
                    .data(data)
                    .enter()
                    .append('path')
                    .attr('class', function (d) {
                        return 'line ' + d.Gene
                    }) // 2 class for each line: 'line' and the group name
                    .attr('d', path)
                    .style('fill', 'none')
                    .style('stroke', function (d) {
                        return color(d.Gene)
                    })
                    .style('stroke-width', 4)
                    .style('opacity', 0.5)
                    .on('mouseover', function (d) {
                        let selected_specie = d.Gene

                        // first every group turns grey
                        d3.selectAll('.line')
                            .transition()
                            .duration(200)
                            .style('stroke', 'lightgrey')
                            .style('opacity', '0.2')
                        // Second the hovered specie takes its color
                        d3.selectAll('.' + selected_specie)
                            .transition()
                            .duration(200)
                            .style('stroke', 'red')
                            .style('opacity', '1')

                        tooltip.transition().duration(200).style('opacity', 1)
                        tooltip
                            .html(d.Gene)
                            .style('left', d3.event.pageX + 2 + 'px')
                            .style('top', d3.event.pageY + 30 + 'px')
                            .style('background-color', 'rgba(0, 0, 0, 0.8)')
                            .style('color', '#fff')
                            .style('border-radius', '5px')
                            .style('padding', '5px')
                    })
                    .on('mouseleave', function () {
                        d3.selectAll('.line')
                            .transition()
                            .duration(200)
                            .delay(1000)
                            .style('stroke', function (d) {
                                return color(d.Gene)
                            })
                            .style('opacity', '1')
                        tooltip.transition().duration(200).style('opacity', 0)
                    })

                svg.selectAll('myAxis')
                    .data(dimensions)
                    .enter()
                    .append('g')
                    .attr('class', 'axis')
                    .attr('transform', function (d) {
                        return 'translate(' + x(d) + ')'
                    })
                    .each(function (d) {
                        d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d]))
                    })
                    .append('text')
                    .style('text-anchor', 'middle')
                    .attr('y', -9)
                    .text(function (d) {
                        return d
                    })
                    .style('fill', 'black')
                    .on('click', function (d) {
                        if (sortAscending) {
                            // Sort the data in ascending order
                            data.sort(function (a, b) {
                                return d3.ascending(a[d], b[d])
                            })
                            sortAscending = false // Change the sorting direction
                        } else {
                            // Sort the data in descending order
                            data.sort(function (a, b) {
                                return d3.descending(a[d], b[d])
                            })
                            sortAscending = true // Change the sorting direction
                        }

                        // Redraw the paths with the sorted data
                        svg.selectAll('path').data(data).transition().duration(1000).attr('d', path)
                    })
            }
        })
    }

    function drawCircle(svg, x, y, radius, c, opacity, details) {
        svg.append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', 3)
            .attr('fill', '#c02425')
            .style('opacity', 1)
            .style('stroke', 'none')

        const circle = svg
            .append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', radius)
            .attr('fill', c)
            .style('opacity', opacity)
            .style('stroke', 'none') // Initially, no stroke

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
                    .style('background-color', 'rgba(0, 0, 0, 0.8)')
                    .style('color', '#fff')
                    .style('border-radius', '5px')
                    .style('padding', '5px')
                d3.select(this).style('stroke', '#c02425').style('stroke-width', '2px')
            })
            .on('mouseout', function () {
                tooltip.transition().duration(200).style('opacity', 0)
                d3.select(this).style('stroke', 'none').style('stroke-width', '0')
            })
    }

    updateCompressionBtn.addEventListener('click', updateCompression)

    function updateCompression() {
        squareSize = Number(squareSizeInput.value)
        compressionDegree = Number(compressionInput.value)
        renderSquares()
    }
    function renderSquares() {
        squareContainer.innerHTML = ''
        mutationView(squareSize, compressionDegree, scaffoldCurrent)
        // squareContainer.append(square)
    }
})
