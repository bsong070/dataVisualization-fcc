let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
let req = new XMLHttpRequest() //import js update

let data    //store response
let values = [] //store array for dates and GDP

let heightScale //determine height of bar
let xScale //determine where bars placed horizonatally on canvas
let xAxisScale
let yAxisScale

let width=800
let height=600
let padding=40

let svg = d3.select('svg')

let drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

let generateScales = () => {
    heightScale = d3.scaleLinear()
                    .domain([0,d3.max(values, (d)=>{
                        return d[1]
                    })])
                    .range([0,height-2*padding])

    xScale = d3.scaleLinear()
                    .domain([0,values.length - 1])
                    .range([padding, width-padding])
                    
    let datesArray = values.map((item)=>{
        return new Date(item[0])
    }) //need to convert date string to numerical

    xAxisScale = d3.scaleTime()
                    .domain([d3.min(datesArray),d3.max(datesArray)])
                    .range([padding, width-padding])

    yAxisScale = d3.scaleLinear()
                    .domain([0, d3.max(values, (item)=>{
                        return item[1]
                    })])
                    .range([height-padding, padding])
}

let drawBars = () => {

    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id','tooltip')
                    .style('visibility','hidden')
                    .style('width','auto')
                    .style('height','auto')


    svg.selectAll('rect')
        .data(values) //put in values into rect elements
        .enter() //what to do if it doesn't exist
        .append('rect')
        .attr('class','bar')
        .attr('width',(width - 2*padding)/values.length)
        .attr('data-date',(item)=>{
            return item[0]
        })
        .attr('data-gdp',(item)=>{
        return item[1]
        })
        .attr('height',(item)=>{
        return heightScale(item[1])
        })
        .attr('x',(item,index)=>{
            return xScale(index)
        })
        .attr('y',(item)=>{
            return (height - padding) - heightScale(item[1])
        })
        .on('mouseover', (item)=>{
            tooltip.transition()
                .style('visibility','visible')

            tooltip.text(item[0])

            document.querySelector('#tooltip').setAttribute('data-date',item[0])
        })
        .on('mouseout', (item)=> {
            tooltip.transition()
            .style('visibility','hidden')
        })
}       

let generateAxes = () => {
    let xAxis = d3.axisBottom(xAxisScale) //need to be on right
    let yAxis = d3.axisLeft(yAxisScale) //need to be on left

    svg.append('g')
        .call(xAxis) //create xAxis and place inside g
        .attr('id','x-axis')
        .attr('transform', 'translate(0,' + (height-padding) + ')')

    svg.append('g')
        .call(yAxis)
        .attr('id','y-axis')
        .attr('transform', 'translate('+ padding + ', 0)')
}

req.open('GET',url,true)
req.onload = () => {
    data = JSON.parse(req.responseText)
    values=data.data
    console.log(values)
    drawCanvas()
    generateScales()
    drawBars()
    generateAxes()
}
req.send()