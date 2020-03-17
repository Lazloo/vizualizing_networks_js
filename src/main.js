import $ from 'jquery';
let jquery = require('jquery');
let cytoscape = require('cytoscape');
let cxtmenu = require('cytoscape-cxtmenu');
let popper = require('cytoscape-popper');
// let dagre = require('cytoscape-dagre');
let fcose = require('cytoscape-fcose');
let cola = require('cytoscape-cola');

// import dagre from 'cytoscape-dagre';
let graphml = require('cytoscape-graphml');
let expandCollapse = require('cytoscape-expand-collapse');

// cytoscape.use(dagre);
cytoscape.use(cola);
cytoscape.use(fcose); // register extension
cytoscape.use( popper );
cytoscape.use( cxtmenu ); // register extension


graphml( cytoscape, jquery ); // register extension
expandCollapse( cytoscape ); // register extension


let style_template= [
    {
        selector: 'node',
        style: {
            'content': 'data(d0)',
            // 'background-color': rgb('data(d2)', 'data(d3)', 'data(d4)'),
            // 'background-color': 'rgb(255,0,0)',
            // 'background-color': '#ccc',
            // 'selection-box-color': '#ccc'

            'width': 'data(d1)',
            'height': 'data(d1)'
            // 'height': function(ele){ return makeSvg(ele).height; }
        }
    },
    {
        selector: 'edge',
        style: {
            // 'width': 'data(d7)/10',
            'width': 1,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'curve-style': 'bezier'
            // 'label': 'data(d7)'
        }
    }
]


const url = '127.0.0.1:10004/'
let graphStr = ''
graphStr = jquery.ajax({
    url: 'http://127.0.0.1:10004/get_data',
    async: false,
    dataType: 'json'
}).responseJSON

var cy = window.cy = cytoscape({
    container: document.getElementById('cy'),
    ready: function () {
        this.graphml({layoutBy: 'breadthfirst',
            nodeDimensionsIncludeLabels: true,
            transform: function( node, pos ){
                pos['x'] = -pos['x'];
                return -pos;
            }
        });
        this.graphml(graphStr);
    },
    style: style_template

});

cy.selectable =  true

// Layouting



let params = {
    // name: 'random',
    nodeDimensionsIncludeLabels: true,
    // convergenceThreshold: 100, // end layout sooner, may be a bit lower quality
    // animate: false,
    idealEdgeLength: 300,
    name: 'fcose' //breadthfirst, coses, 'dagre'


    // ,nodeDimensionsIncludeLabels: true
};

let layout = cy.layout( params );
layout.run();

console.log(cy)
