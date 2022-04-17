var inicialText;
var diceArray = new Array();
var expandedText = new Array();
var difficultyClass = 0;
let data;
var config;
var chart;
var bonus = 0;
var firstDice;

if (inicialText == null){document.getElementById('chart').style.visibility = "hidden"}
var button = document.getElementsByTagName(button);
button.onclick = function(){getText}
function getText(){
        var input = document.querySelector("#text");
        inicialText = input.value;
        if (inicialText != ""){
        document.getElementById('chart').style.visibility = "visible";
        input.value = null;
        expand();
        createChart();
    }
}

function expand(){
    diceArray = new Array();
    inicialText = inicialText.replaceAll(" ", "");
    inicialText = inicialText.toUpperCase();
    inicialText = inicialText.replaceAll("CD", "DC");
    inicialText =  inicialText.replaceAll("DC", "DC");
    inicialText = inicialText.replaceAll("CA", "DC");
    inicialText =  inicialText.replaceAll("AC", "DC");

    if (inicialText.includes("DC")) {
        var tempinicialtext;
        tempinicialtext = inicialText.split("DC",2);
        inicialText = tempinicialtext[0];
        difficultyClass = tempinicialtext[1];
        console.log(difficultyClass);
    }

    if (inicialText.includes("+")) {
        expandedText = inicialText.split("+", 12);
        for (var indexText = 0; indexText < expandedText.length; indexText++) {

            if (expandedText[indexText].includes("D") && firstDice) {
                readDice(indexText);
                firstDice = false;

            } else if (expandedText[indexText].includes("D") && !firstDice) {
                var division = expandedText[indexText].split("D", 2);
                var times = division[0];
                var side = division[1];
                addDice(times, side);

            } else {
                bonus += Number(expandedText[indexText]);
                console.log(bonus);
            }
        }

    } else if (inicialText.includes("D")) {
        expandedText[0] = inicialText;
        readDice(0);

        
    } else if (Number.inicialText != 'NaN') {
        diceArray[inicialText] = 1;

    } else {
        console.error('Expressão inválida')

    }
}

function readDice(indexText) {

    //        2>d20 3<d20 4>d100 4d6~1
    
    //        Advantage Ex: d20>d20
            if (expandedText[indexText].includes(">") || expandedText[indexText].includes("<")) {
    
                advantage = true;
                if (expandedText[indexText].includes("<")) {
                    disadvantage = true;
                }
    
                expandedText[indexText] = expandedText[indexText].replace(">", "");
                expandedText[indexText] = expandedText[indexText].replace("<", "");
    
    //            Divide the expression in 2 parts, and check which one is just the side of a dice
                var division = new Array();
                division = expandedText[indexText].split("D", 2);
                var times = division[0];
                var sides = division[1];
                specialCase(times, sides);
    
            } else if (expandedText[indexText].includes("~")){
                var reduce = new Array();
                var division = new Array();
                reduce = expandedText[indexText].split("~",2);
                division = reduce[0].split("D", 2);
    
                advantage = true;
    
                var times = division[0];
                var sides = division[1];
                reduceTimes = reduce[1]+1;
                specialCase(times, sides);
    
    //        Soma Ex: 4d6
            } else {
                var division = new Array();
                division = expandedText[indexText].split("D", 2);
                var times;
                if (!division[0] == "") {
                    times = division[0];
                } else {
                    times = 1;
                }
    
                var side = division[1];
                addDice(times, side);
    
            }
        }

function addDice(times, side){
    for (var i = 0; i<times; i++) {
        var tempDiceArray = new Array();
        if (diceArray.length == 0) {
            for (var j = 1; j<=side; j++) {
                diceArray[j] = 1;
            }
        } else {
            for (var j = 0; j<diceArray.length; j++) {
                if (diceArray[j] != 0) {
                    console.log(diceArray);
                    for (var s = 1; s<=side; s++) {
                        if (tempDiceArray[j+s] == null) {
                            tempDiceArray[j+s] = diceArray[j];
                        } else {
                            tempDiceArray[j+s] += diceArray[j];
                        }
                    }
                    
                }
            }
            diceArray = tempDiceArray;
        }
    }
}

function createChart(){

    if(inicialText != null){
        document.getElementById('legenda').innerHTML = inicialText;
    }

    //bonus
    var tempDiceArray = new Array();
    for (var i = 0; i<diceArray.length; i++) {
        tempDiceArray[i+bonus] = diceArray[i];
    }
    diceArray = tempDiceArray;

    var tempDiceArray = new Array();
    var j = 0;
    while (diceArray[j] == null) {j++;}     
    var k = j;
    for (var i = 0; i<diceArray.length-k; i++) {
        if (diceArray[j] != null) {
          tempDiceArray[i] = diceArray[j];
          j++;
        }
    }
    diceArray = tempDiceArray;

    var probabilityArray = new Array();
    for (var i = 0; i<diceArray.length; i++) {
        probabilityArray[i] = ((diceArray[i]/diceArray.reduce((a, b) => a + b, 0))*100).toFixed(2);
    }

    console.log(diceArray);

    let labels = new Array();
    var l = k;
    var i = 0;
    for (k; k<diceArray.length+l; k++){
        if(diceArray[k-l] != null){
            labels[i] = k;
            i++;
        }
    }

    var backgroundColor = new Array();
    var label = 100;
    if (difficultyClass != 0){
        for (var i = 0; i<probabilityArray.length; i++) {
            if ((i+l)<difficultyClass) {
                backgroundColor.push('red');
                label -= probabilityArray[i];
            } else {
                backgroundColor.push('rgb(20, 152, 222)');
            }
        }
        var legend1 = document.getElementById('legend1');
        var legend2 = document.getElementById('legend2');
        var legendLabel = [];
        legendLabel[0] = (100-label).toFixed(2);
        legendLabel[0] += '%';
        legendLabel[1] = (label).toFixed(2);
        legendLabel[1] += '%';
        legend1.innerHTML = legendLabel[0];
        legend2.innerHTML = legendLabel[1];
        legend1.style.backgroundColor = 'red';
        legend1.style.display = 'inline';
        legend2.style.display = 'inline';
    } else {
        var legend1 = document.getElementById('legend1');
        legend1.style.backgroundColor = 'rgb(20, 152, 222)';
        legend1.style.display = 'block';
        legend1.innerHTML = '100%';
        backgroundColor.push('rgb(20, 152, 222)')
    }
    label = '100';
    label += '%';

    console.log(backgroundColor);
    data = {
    labels: labels,
    datasets: [{
        skipNull: true,
        label: label,
        backgroundColor: backgroundColor,
        borderColor: 'rgb(20, 152, 222)',
        borderRadius: 5,
        minBarThickness: 30,
        maxBarThickness: 100,
        data: probabilityArray,  
    }]};

    config = {
        type: 'bar',
        data: data,
        options: {
            plugins: {
                legend: {
                    display: false,
                    labels: {
                       color: "white"
                    },
                    fillStyle: 'rgb(20, 152, 222)',
                    strokeStyle: 'rgb(20, 152, 222)'
                    
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: 'white'
                    }
                },
                y: {
                    ticks: {
                        color: 'white'
                    }
                },
                percentage: {
                    type: 'linear',
                    position: 'right',
                    ticks: {
                        color: 'white'
                    }
                }
            }
        }
    };
    renderGraph();
}

function renderGraph() {
    

    // Destroy old graph
    if (chart) {
        chart.destroy();
    }

    // Render chart
    chart = new Chart(
        document.getElementById('chart'),
        config
    );
}