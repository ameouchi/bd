const file = 'csvjson.json';
const width = window.innerWidth;
const height = window.innerHeight;
const colors = {
     'regular': '#e23cad',
     'irrregular coyote': '#3ba7c9',
     'irregular on own or with Caravan': '#1540c4'
 };
 

// 	var forceX= d3.forceX(function(d){
// 		if (d.country === 'GTM') {
// 			return 250
// 		} 	else {
// 			return 800
// 		}
// 		}).strength(0.05)
// 		
// 	var simulation = d3.forceSimulation()
// 		.force("x", forceX)
// 		.force("y", d3.forceY(width / 2).strength(0.05))
// 		.force("collide", d3.forceCollide(2))
// 		
// 	d3.select("#combine").on('click', function(d) {
// 		simulation
// 			.force("x", d3.forceX(width / 2).strength(0.05))
// 	});

	
const generateChart = data => {
    const bubble = data => d3.pack()
        .size([width, height])
        .padding(.5)(d3.hierarchy({ children: data }).sum(d => d.mig_ext_cost_total));
    
    const svg = d3.select('#bubble-chart')
        .style('width', width)
        .style('height', height);
    
    const root = bubble(data);
    const tooltip = d3.select('.tooltip');

    const node = svg.selectAll()
        .data(root.children)
        .enter().append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);
    
    const circle = node.append('circle')
        .style('fill', d => colors[d.data.mig_ext_medio])
        .on('mouseover', function (e, d) {

            tooltip.select('a').attr('href', d.data.link).text(d.data.ID);
            tooltip.select('span').attr('class', d.data.country).text(d.data.mig_ext_cost_total);
            tooltip.style('visibility', 'visible');

            d3.select(this).style('stroke', '#222');
        })
        .on('mousemove', e => tooltip.style('top', `${e.pageY}px`)
                                     .style('left', `${e.pageX + 10}px`))
        .on('mouseout', function () {
            d3.select(this).style('stroke', 'none');
            return tooltip.style('visibility', 'hidden');
        })
		
    node.transition()
        .ease(d3.easeExpInOut)
        .duration(0.1)
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
    
    circle.transition()
        .ease(d3.easeExpInOut)
        .duration(1000)
        .attr('r', d => d.r);
        
	d3.forceSimulation(node)
		.force('charge', d3.forceManyBody().strength(5))
		.force('x', d3.forceX().x(function(d) {
		return xCenter[d.country];
		}))
		.force('collision', d3.forceCollide().radius(function(d) {
		return d.radius;
		}))
		.on('tick', ticked);
	
	d3.select('svg g')
		.selectAll('circle')
		.data(node)
		.join('circle')
		.attr('r', function(d) {
			return d.radius;
		})
		.attr('cx', function(d) {
			return d.x;
		})
		.attr('cy', function(d) {
			return d.y;
		});
// }

};

(async () => {
    data = await d3.json(file).then(data => data);
    generateChart(data);
})();
