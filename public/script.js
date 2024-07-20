// public/script.js
const width = 800;
const height = 600;

const svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);



// Define the territories as GeoJSON-like objects
const territories = [
    { 
        type: "Feature", 
        id: 1,
        properties: { name: "Northern Tundra" },
        geometry: {
            type: "Polygon",
            coordinates: [[
                [200, 50], [600, 50], [550, 150], [250, 150], [200, 50]
            ]]
        }
    },
    { 
        type: "Feature", 
        id: 2,
        properties: { name: "Eastern Mountains" },
        geometry: {
            type: "Polygon",
            coordinates: [[
                [550, 150], [700, 200], [650, 350], [500, 300], [550, 150]
            ]]
        }
    },
    { 
        type: "Feature", 
        id: 3,
        properties: { name: "Southern Desert" },
        geometry: {
            type: "Polygon",
            coordinates: [[
                [200, 450], [500, 450], [450, 550], [150, 550], [200, 450]
            ]]
        }
    },
    { 
        type: "Feature", 
        id: 4,
        properties: { name: "Western Forest" },
        geometry: {
            type: "Polygon",
            coordinates: [[
                [100, 150], [250, 150], [200, 300], [50, 300], [100, 150]
            ]]
        }
    },
    { 
        type: "Feature", 
        id: 5,
        properties: { name: "Central Plains" },
        geometry: {
            type: "Polygon",
            coordinates: [[
                [250, 150], [550, 150], [500, 300], [200, 300], [250, 150]
            ]]
        }
    },
    { 
        type: "Feature", 
        id: 6,
        properties: { name: "Northeastern Highlands" },
        geometry: {
            type: "Polygon",
            coordinates: [[
                [600, 50], [750, 100], [700, 200], [550, 150], [600, 50]
            ]]
        }
    },
    { 
        type: "Feature", 
        id: 7,
        properties: { name: "Eastern Coast" },
        geometry: {
            type: "Polygon",
            coordinates: [[
                [650, 350], [750, 300], [700, 450], [600, 400], [650, 350]
            ]]
        }
    },
    { 
        type: "Feature", 
        id: 8,
        properties: { name: "Southeastern Savannah" },
        geometry: {
            type: "Polygon",
            coordinates: [[
                [500, 300], [650, 350], [600, 400], [500, 450], [500, 300]
            ]]
        }
    },
    { 
        type: "Feature", 
        id: 9,
        properties: { name: "Southern Coast" },
        geometry: {
            type: "Polygon",
            coordinates: [[
                [450, 550],[500, 450], [630, 500], [700, 550], [450, 550]
            ]]
        }
    },
    { 
        type: "Feature", 
        id: 10,
        properties: { name: "Southwestern Hills" },
        geometry: {
            type: "Polygon",
            coordinates: [[
                [50, 300], [200, 300], [150, 450], [100, 400], [50, 300]
            ]]
        }
    },
    { 
        type: "Feature", 
        id: 11,
        properties: { name: "Central Lakes" },
        geometry: {
            type: "Polygon",
            coordinates: [[
                [200, 300], [500, 300], [500, 450], [200, 450],[150, 450], [200, 300]
            ]]
        }
    },
    { 
        type: "Feature", 
        id: 12,
        properties: { name: "Northern Bay" },
        geometry: {
            type: "Polygon",
            coordinates: [[
                [100, 50], [200, 50], [250, 150], [100, 150], [100, 50]
            ]]
        }
    },
    { 
        type: "Feature", 
        id: 13,
        properties: { name: "Western Peninsula" },
        geometry: {
            type: "Polygon",
            coordinates: [[
                [50, 300], [100, 400], [50, 500], [0, 400], [50, 300]
            ]]
        }
    },
    { 
        type: "Feature", 
        id: 14,
        properties: { name: "Eastern Plateau" },
        geometry: {
            type: "Polygon",
            coordinates: [[
                [700, 200], [750, 100], [800, 200], [750, 300],[650, 350], [700, 200]
            ]]
        }
    }
];

// Create a path generator
const path = d3.geoPath();

// Create the territories
svg.selectAll("path")
    .data(territories)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "territory")
    .attr("fill", (d, i) => d3.schemeCategory10[i % 10])
    .on("mouseover", showTerritoryInfo);

// Add territory labels
svg.selectAll("text")
    .data(territories)
    .enter()
    .append("text")
    .attr("x", d => path.centroid(d)[0])
    .attr("y", d => path.centroid(d)[1])
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "13px")
    .text(d => d.properties.name);

function showTerritoryInfo(event, d) {
    fetch(`/territory/${d.id}`)
        .then(response => response.json())
        .then(data => {
            const info = `
                Name: ${data.name}
                Resources: ${data.resources}
                Population: ${data.population}
            `;
            //alert(info);
            const resultDiv = document.getElementById('territory');
            resultDiv.innerHTML = `${info}`;
        });
}

function simulateBattle() {
    const army1 = {
        infantry: parseInt(document.getElementById('army1-infantry').value) || 0,
        cavalry: parseInt(document.getElementById('army1-cavalry').value) || 0,
        artillery: parseInt(document.getElementById('army1-artillery').value) || 0,
        supplies: 100,
        morale: 100,
        experience: Math.random() * 100
    };

    const army2 = {
        infantry: parseInt(document.getElementById('army2-infantry').value) || 0,
        cavalry: parseInt(document.getElementById('army2-cavalry').value) || 0,
        artillery: parseInt(document.getElementById('army2-artillery').value) || 0,
        supplies: 100,
        morale: 100,
        experience: Math.random() * 100
    };

    fetch('/simulate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ army1, army2 }),
    })
    .then(response => response.json())
    .then(data => {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            Battle Result: ${data}
        `;
    });
}