import $ from 'jquery';
let jquery = require('jquery');
let cytoscape = require('cytoscape');
let cxtmenu = require('cytoscape-cxtmenu');
let popper = require('cytoscape-popper');
// let dagre = require('cytoscape-dagre');

import dagre from 'cytoscape-dagre';
let graphml = require('cytoscape-graphml');
let expandCollapse = require('cytoscape-expand-collapse');

cytoscape.use(dagre);
cytoscape.use( popper );
cytoscape.use( cxtmenu ); // register extension

graphml( cytoscape, jquery ); // register extension
expandCollapse( cytoscape ); // register extension


const url = 'http://127.0.0.1:10004/'


let style_template= [
    {
        selector: 'node',
        style: {
            'content': 'data(d2)',
            'background-color': 'data(d9)',
            // 'background-color': '#ccc',
            // 'selection-box-color': '#ccc'
        }
    },
    {
        selector: ':selected',
        css: {
            'background-color': 'Blue',
            'line-color': 'black',
            'target-arrow-color': 'black',
            'source-arrow-color': 'black'
        }
    },
    {
        selector: 'edge',
        style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle'
        }
    },
    {
        selector: ':parent',
        style: {
            'background-opacity': 0.333
        }
    },
    {
        selector: 'edge[d10="shareholder relationship"]',
        style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'line-style': 'dashed',
            'line-dash-pattern': [3, 12],
            'curve-style': 'bezier'
        }
    }
]
var non_mod_graphStr = ''
var cy_global = cytoscape()


// div_tool_tip.style.zIndex = ++top_z;
function draw_network(parameters){

    document.getElementById("no_content").innerText = "";

    let graphStr = ''
    graphStr = jquery.ajax({
        url: url + 'get_graphml',
        async: false,
        dataType: 'json'
    }).responseJSON


    var cy = window.cy = cytoscape({
        container: document.getElementById('cy'),
        ready: function () {
            this.graphml({layoutBy: 'dagre',
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

    // Define Double Click
    var tappedBefore;
    var tappedTimeout;

    cy.on('tap', function(event) {
        let tappedNow = event.target;
        if (tappedTimeout && tappedBefore) {
            clearTimeout(tappedTimeout);
        }
        if(tappedBefore === tappedNow) {
            tappedNow.trigger('doubleTap', event);
            tappedBefore = null;
            // originalTapEvent = null;
        } else {
            tappedTimeout = setTimeout(function(){ tappedBefore = null; }, 300);
            tappedBefore = tappedNow;
        }
    });
    cy.on('doubleTap', 'node', function(event) {
        let node_selected = cy.elements('node#' + this.id() );
        let uuid = node_selected.data()['d1'];
        let win = window.open('https://my322962-sso.sapbydesign.com/sap/byd/nav?bo_ns=http://sap.com/xi/AP/FO/BusinessPartner/Global&bo=Customer&node=Root&operation=Open&object_key=' + uuid + '&key_type=APC_V_UUID', '_blank');
        win.location;
    });


    // Layouting
    let params = {
        name: 'dagre',
        nodeDimensionsIncludeLabels: true,
        transform: function( node, pos ){ return {x: pos['x'], y: -pos['y']}; }
        // name: 'breadthfirst' //breadthfirst, coses, 'dagre'

        // ,nodeDimensionsIncludeLabels: true
    };
    // https://js.cytoscape.org/#layouts
    // https://js.cytoscape.org/#extensions/layout-extensions
    let layout = cy.layout( params );
    layout.run();


    // Mouse Over
    let popper = 1
    cy.on('mouseover', 'node', function(event) {
        let node = event.target;

        popper = node.popper({
            content: () => {
                div_tool_tip.innerHTML =
                    'SAP ID: ' + node.data()['d0'] + '<br>' +
                    'Location: ' + node.data()['d5'] + '<br>' +
                    'Business not allowed: ' + node.data()['d6'] + '<br>' +
                    'Protection Status: ' + node.data()['d7']
                ;
                div_tool_tip.style.backgroundColor = 'white';
                div_tool_tip.style.border = '2px solid black';
                div_tool_tip.style.padding = '5px';
                return div_tool_tip;
            },
            popper: {placement: 'top', computeStyle: 1} // my popper options here
        });

        // let update = () => {
        //     popper.scheduleUpdate();
        // };
        // node.on('position', update);
    });

    cy.on('mouseout', 'node', function(event) {
        div_tool_tip.innerHTML = '';
        div_tool_tip.style.border = '';
        div_tool_tip.style.backgroundColor = '';
        popper.destroy()
    });

    draw_legend(sap_id)

    cy_global = cy;
    let STATIC_URL = '{{ url_for("static", filename="images/slogan_3.svg") }}'
    cy.cxtmenu({
        // Only Dummies
        selector: "[d0 = 'G9999']",
        commands: [
            {
                content: '<img src="/static/images/lupe.svg" height="35">',
                // content: '<img src="file:C:/scripts/account_hierarchy_dev/images/lupe.svg" height="35">',
                // content: '<img src="{% static "images/lupe.svg" %}" height="35">',
                // content: '<img src="' + STATIC_URL + '" height="35">',
                select:
                    function( ele ){
                        if (ele.id().toLowerCase().includes('parent_') ||
                        ele.id().toLowerCase().includes('daughter_')){
                            draw_network({
                                    current_network: non_mod_graphStr,
                                    selected_id: ele.id(),
                                    expand_all: false
                                }
                            );
                        }
                    }
            }
        ]
    });

};


// let button_submit = document.getElementById('submit_button')
let button_collapse = document.getElementById('collapse')
let button_expanse = document.getElementById('expanse')
let button_expanse_all = document.getElementById('expanse_all')
// let input_text = document.getElementById('searchTxt')
let form = document.getElementById('user-form')
// document.addEventListener('DOMContentLoaded', function(){
// button_submit.addEventListener('click', function(){draw_network({parameters: {expand_all: false}})});
// input_text.addEventListener('keypress', function(e) {
//         if (e.key === 'Enter') {
//             draw_network({parameters: {expand_all: false}})
//         }
//         }
//     );


button_expanse.addEventListener('click', function(){
    cy_global.nodes().forEach(function( ele ){
        if (ele.selected()) {
            if (ele.id().toLowerCase().includes('parent_') ||
                ele.id().toLowerCase().includes('daughter_')){
                draw_network({
                        current_network: non_mod_graphStr,
                        selected_id: ele.id(),
                        expand_all: false
                    }
                );
            }

        }
    });
});

//url + 'collapse',
button_collapse.addEventListener('click', function(){
    draw_network({
        current_network: non_mod_graphStr,
        collapse_flag: true
    });
});

//url + 'expand',
button_expanse_all.addEventListener('click', function(){
    draw_network({
        expand_all: true
    });
});

