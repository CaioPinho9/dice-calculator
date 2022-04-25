var inicialText;
var text;
var diceArray = new Array();
var halfArray = new Array();
var expandedText = new Array();
var difficultyClass;
var bonus;
let data;
var config;
var chart,chart1,chart2,chart3;
var firstDice;
var error;
var d100;
var reRoll;
var advantageBool;
var disadvantageBool;
var add;
var charts = new Array();
var chartIndex = 0;
var chartVisibility = 0;


function checkError(times, side){
    if (String(times).match(/^[0-9]+$/) == null || String(side).match(/^[0-9]+$/) == null
        || times == 0 || side == 0) {
        error = true;
        console.error();
    }
}

if (text == null){document.getElementById('chart').style.visibility = "hidden"}
var calculate = document.getElementById('button');
calculate.onclick = function(){getText()}
var rollB = document.getElementById('roll');
rollB.onclick = function(){roll()}
var historyB = document.getElementById('historyB');
historyB.onclick = function(){historyOn()}

function roll() {
    result = document.getElementById('number');
    text = inicialText;
    text = text.toUpperCase();
    text = text.replaceAll(" ", "");
    text = text.replaceAll("-", "+-");
    text = text.replaceAll("CD", "DC");
    text =  text.replaceAll("DC", "DC");
    text = text.replaceAll("CA", "DC");
    text =  text.replaceAll("AC", "DC");
    var number = 0;
    var bonus = 0;

    if (text.includes("DC")) {
        var tempinicialtext;
        tempinicialtext = text.split("DC",2);
        text = tempinicialtext[0];
    }

    if (text.includes("+")) {
        expandedText = text.split("+", 12);
        for (var indexText = 0; indexText < expandedText.length; indexText++) {

            add = 1;
            if (expandedText[indexText].includes("-")){
                add = -1;
                expandedText[indexText] = expandedText[indexText].replaceAll("-", "");
            }

            if (expandedText[indexText].includes("D")) {
                reroll(indexText);
                number += readRoll(indexText); 
            } else {
                bonus += Number(expandedText[indexText]*add);
                number += bonus;
            }
            add = 1;
        }

    } else if (text.includes("D")) {
        expandedText[0] = text;
        reroll(0);
        number += readRoll(0);

    } else if (text.match(/^[0-9]+$/) != null) {
        number = text;
    }
    result.innerHTML = number;
    result.style.visibility = "visible";

}

function readRoll(indexText) {
    var division = expandedText[indexText].split("D", 2);
    var times;
    var side;
    var number = 0;
    var tempNumber;

    if (expandedText[indexText].includes(">") || expandedText[indexText].includes("<")) {
        advantageBool = true;
        if (expandedText[indexText].includes("<")) {
            disadvantageBool = true;
        }

        expandedText[indexText] = expandedText[indexText].replace(">", "");
        expandedText[indexText] = expandedText[indexText].replace("<", "");

//            Divide the expression in 2 parts, and check which one is just the side of a dice
        var division = new Array();
        var tempNumber = new Array();
        division = expandedText[indexText].split("D", 2);
        var times = division[0];
        var side = division[1];
        var reduceTimes = times-1;

        for (var i = 0; i<times; i++) {
            tempNumber[i] = Math.floor(Math.random() * side) + 1;
            if (tempNumber == reRoll) {
                tempNumber[i] = Math.floor(Math.random() * side) + 1;
            }
        }
        
        if (!disadvantageBool) {
            tempNumber.sort(function(a, b){return a - b});
        } else {
            tempNumber.sort(function(a, b){return b - a});
        }
    
        for (var i = 0; i<reduceTimes; i++) {
            tempNumber[i] = 0;
        }

        number += tempNumber.reduce((a, b) => a + b, 0);
        

    } else if (expandedText[indexText].includes("~")){
        var reduce = new Array();
        var division = new Array();
        var tempNumber = new Array();
        reduce = expandedText[indexText].split("~",2);
        division = reduce[0].split("D", 2);

        advantageBool = true;
        disadvantageBool = false;

        var times = division[0];
        var side = division[1];
        reduceTimes = reduce[1];

        for (var i = 0; i<times; i++) {
            tempNumber[i] = Math.floor(Math.random() * side) + 1;
            if (tempNumber[i] == reRoll) {
                tempNumber[i] = Math.floor(Math.random() * side) + 1;
            }
        }

        if (!disadvantageBool) {
            tempNumber.sort(function(a, b){return a - b});
        } else {
            tempNumber.sort(function(a, b){return b - a});
        }
    
        for (var i = 0; i<reduceTimes; i++) {
            tempNumber[i] = 0;
        }

        number += tempNumber.reduce((a, b) => a + b, 0);

//        Soma Ex: 4d6
    } else {
        if (number == null) {
            number = 0;
        }

        if (!division[0] == "") {
            times = division[0];
        } else {
            times = 1;
        }
        if (!division[1] == "") {
            side = division[1];
        } else {
            side = 20;
        }

        for (var i = 0; i<times; i++) {
            tempNumber = Math.floor(Math.random() * side) + 1;
            if (tempNumber == reRoll) {
                tempNumber = Math.floor(Math.random() * side) + 1;
            }
            number += tempNumber*add;
        }
    } 
    return number;
}

function getText(){
        difficultyClass = 0;
        bonus = 0;
        reRoll = 0;
        firstDice = true;
        error = false;
        d100 = false;
        advantageBool = false;
        disadvantageBool = false;
        add = 1;
        var input = document.querySelector("#text");
        inicialText = input.value;
        text = inicialText;

        historyStart();

        if (text != ""){
        document.getElementById('chart').style.visibility = "visible";
        document.getElementById('buttons').style.visibility = "visible";
        input.value = null;
        expand();
        if (!error){
            createChart();
        }
    }
}

function expand(){
    diceArray = new Array();
    text = text.toUpperCase();
    text = text.replaceAll(" ", "");
    text = text.replaceAll("-", "+-");
    text = text.replaceAll("CD", "DC");
    text =  text.replaceAll("DC", "DC");
    text = text.replaceAll("CA", "DC");
    text =  text.replaceAll("AC", "DC");

    if (text.includes("DC")) {
        var tempinicialtext;
        tempinicialtext = text.split("DC",2);
        text = tempinicialtext[0];
        difficultyClass = tempinicialtext[1];
        console.log(difficultyClass);
    }

    if (text.includes("+")) {
        expandedText = text.split("+", 12);
        for (var indexText = 0; indexText < expandedText.length; indexText++) {

            add = 1;
            if (expandedText[indexText].includes("-")){
                add = -1;
                expandedText[indexText] = expandedText[indexText].replaceAll("-", "");
        
            }

            if (expandedText[indexText].includes("D") && firstDice) {
                reroll(indexText);
                readDice(indexText);
                firstDice = false;

            } else if (expandedText[indexText].includes("D") && !firstDice) {
                reroll(indexText);
                var division = expandedText[indexText].split("D", 2);
                var times;
                var side;
                if (!division[0] == "") {
                    times = division[0];
                } else {
                    times = 1;
                }
                if (!division[1] == "") {
                    side = division[1];
                } else {
                    side = 20;
                }
                if (add > 0) {
                    addDice(times, side);
                } else {
                    minusDice(times, side);
                }
                
            } else {
                bonus += Number(expandedText[indexText]);
                console.log(bonus);
                var tempDiceArray = new Array();
                for (var i = 0; i<diceArray.length; i++) {
                    if (diceArray[i] != null){
                        tempDiceArray = increases(tempDiceArray,i,bonus,true);
                    }
                }
                diceArray = tempDiceArray;
            }
            add = 1;
        }

    } else if (text.includes("D")) {
        expandedText[0] = text;
        reroll(0);
        readDice(0);

    } else if (text.match(/^[0-9]+$/) != null) {
        diceArray[text] = 1;

    } else {
        console.error('Invalid Expression')
        error = true;
    }
}

function readDice(indexText) {

    //        2>d20 3<d20 4>d100 4d6~1
    
    //        Advantage Ex: d20>d20
            if (expandedText[indexText].includes(">") || expandedText[indexText].includes("<")) {
                advantageBool = true;
                if (expandedText[indexText].includes("<")) {
                    disadvantageBool = true;
                }
    
                expandedText[indexText] = expandedText[indexText].replace(">", "");
                expandedText[indexText] = expandedText[indexText].replace("<", "");
    
    //            Divide the expression in 2 parts, and check which one is just the side of a dice
                var division = new Array();
                division = expandedText[indexText].split("D", 2);
                var times = division[0];
                var sides = division[1];
                var reduceTimes = times-1;
                specialCase(times, sides, reduceTimes);
    
            } else if (expandedText[indexText].includes("~")){
                var reduce = new Array();
                var division = new Array();
                reduce = expandedText[indexText].split("~",2);
                division = reduce[0].split("D", 2);
    
                advantageBool = true;
                disadvantageBool = false;
    
                var times = division[0];
                var sides = division[1];
                reduceTimes = reduce[1];
                specialCase(times, sides, reduceTimes);
    
    //        Soma Ex: 4d6
            } else {
                var division = new Array();
                division = expandedText[indexText].split("D", 2);
                var times;
                var side;
                if (!division[0] == "") {
                    times = division[0];
                } else {
                    times = 1;
                }
                if (!division[1] == "") {
                    side = division[1];
                } else {
                    side = 20;
                }
    
                addDice(times, side);
    
            }
}

function increases(tempDiceArray, j, s, next) {

    if (j+s*add < 0) {
        if (diceArray[0] != null) {
            if (tempDiceArray[0] == null) {
                tempDiceArray[0] = diceArray[0]+diceArray[j];
            } else {
                tempDiceArray[0] += diceArray[0]+diceArray[j];
            }
        } else {
            if (tempDiceArray[0] == null) {
                tempDiceArray[0] = diceArray[j];
            } else {
                tempDiceArray[0] += diceArray[j];
            }
        }
    } else if (add < 0) {
        if (tempDiceArray[j+s*add] == null) {
            tempDiceArray[j+s*add] = diceArray[j];
        } else {
            tempDiceArray[j+s*add] += diceArray[j];
        }
    } else if (s == 0 && !next) {
        //First, Vantagem
        if (tempDiceArray[j] == null) {
            tempDiceArray[j] = add;
        } else {
            tempDiceArray[j] += add;
        }
    } else if (next){
        //Next
        if (tempDiceArray[j+s] == null) {
            tempDiceArray[j+s] = diceArray[j];
        } else {
            tempDiceArray[j+s] += diceArray[j];
        }
    } else if (!next) {
        //Reroll
        if (tempDiceArray[s] == null) {
            tempDiceArray[s] = add;
        } else {
            tempDiceArray[s] += add;
        }
    }
    return tempDiceArray;
}

function minusDice(times, side) {
    for (var i = 0; i<times; i++) {
        var tempDiceArray = new Array();
        for (var j = 0; j<diceArray.length; j++) {
            if (diceArray[j] != null) {
                for (var s = 1; s<=side; s++) {
                    increases(tempDiceArray,j,s,true)
                }
            }
        }
    }
    diceArray = tempDiceArray;
}

function addDice(times, side){

    checkError(times, side);
    if (side == 100) {
        d100 = true;
        disadvantageBool = !disadvantageBool;
    }

    for (var i = 0; i<times; i++) {
        var tempDiceArray = new Array();
        if (diceArray.length == 0) {
            for (var j = 1; j<=side; j++) {
                tempDiceArray = increases(tempDiceArray,j,0,false)
                if (j <= reRoll && reRoll != 0) {
                    for (var k = Number(reRoll)+1; k<=side; k++) {
                        tempDiceArray = increases(tempDiceArray,j,k,false)
                    }
                }
            }
        } else {
            for (var j = 0; j<diceArray.length; j++) {
                if (diceArray[j] != null) {
                    for (var s = 1; s<=side; s++) {
                        tempDiceArray = increases(tempDiceArray,j,s,true)
                        if (s <= reRoll && reRoll != 0) {
                            for (var k = Number(reRoll)+1; k<=side; k++) {
                                tempDiceArray = increases(tempDiceArray,j,k,true)
                            }
                        }
                    }
                    
                }
            }
        }
        diceArray = tempDiceArray;
    }
    reRoll = 0;
}

function reroll(indexText){
    var division = new Array();
    if (expandedText[indexText].includes("R")) {
        division = expandedText[indexText].split("R", 2);
        expandedText[indexText] = division[0];
        reRoll = division[1];
    }
}

function specialCase(times, side, reduceTimes){
    checkError(times, side);
    var dices = new Array(Number(times));
    dices.fill(1);

    if (side == 100) {
        d100 = true;
        disadvantageBool = !disadvantageBool;
    }
//          [1,1,1,1]
    var lastIndex = 0;

    for (var index = 0; index < dices.length;) {

//            possibility[Arrays.stream(diceArray).sum()] += 1;

//                Saves to add
        var sortDices = [...dices];
        if (advantageBool) {
            advantage(sortDices, reduceTimes);
        } else {
            var j = dices.reduce((a, b) => a + b, 0);
            diceArray = increases(tempDiceArray,j,0,false)
        }

//                Checks all index
        for (var check = 0; check<=lastIndex; check++) {

//                    When the array is completed, it breaks the loop Ex: 4d6 [6,6,6,6]
            if (dices.reduce((a, b) => a + b, 0) == side*times) {
                index = dices.length;
                break;
            }

            if (index == lastIndex && dices[lastIndex] >= side) {
                index = 0;
                dices[lastIndex] = 1;
                lastIndex++;
                dices[lastIndex]++;
                break;
            }

//                    When this array[index] is full it resets and increases the index
            if (dices[index] == side) {
                dices[index] = 1;
                index += 1;

//                    If it's not full the array increases
            } else {
                dices[index]++;
                index = 0;
                break;
            }
        }
    }
    if (!d100 && reRoll != 0 && advantageBool) {
        if (!disadvantageBool) {
            diceArray[1] = 0;
        } else {
            diceArray[1] = diceArray[2]/2;
        }
        reRoll = 0;
    }
}

function advantage(sortDices, reduceTimes) {

    if (!disadvantageBool) {
        sortDices.sort(function(a, b){return a - b});
    } else {
        sortDices.sort(function(a, b){return b - a});
    }

    for (var i = 0; i<reduceTimes; i++) {
        sortDices[i] = 0;
    }
    var j = sortDices.reduce((a, b) => a + b, 0);
    diceArray = increases(diceArray,j,0,false)

}

function createChart(){

    if(inicialText != null){
        document.getElementById('legenda').innerText = inicialText;
    }

    console.log(diceArray);

    var tempDiceArray = new Array();
    var tempHalfArray = new Array();
    var j = 0;
    while (diceArray[j] === null || isNaN(diceArray[j])) {
        j++;
    }     
    var k = j;
    for (var i = 0; i<diceArray.length-k; i++) {
        
        if (diceArray[j] != null) {
            if (halfArray[j] == null) {
                halfArray[j] = 0;
            }
            tempHalfArray[i] = halfArray[j];
            tempDiceArray[i] = diceArray[j];
            j++;
        }
    }
    diceArray = tempDiceArray;
    halfArray = tempHalfArray;
    var average = 0;
    var probabilityArray = new Array();
    for (var i = 0; i<diceArray.length; i++) {
        probabilityArray[i] = ((diceArray[i]/diceArray.reduce((a, b) => a + b, 0))*100).toFixed(2);
        average += diceArray[i]*i;
    }
    average = average/diceArray.reduce((a, b) => a + b, 0);
    average += k;
    average = average.toFixed(2);
    document.getElementById("average").innerHTML = "Média: " + average;
    document.getElementById("average").style.visibility = "visible";

    console.log(diceArray);
    console.log(halfArray);

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
            if (!d100){
                if ((i+l)<difficultyClass) {
                    backgroundColor.push('red');
                    label -= probabilityArray[i];
                } else {
                    backgroundColor.push('rgb(20, 152, 222)');
                }
            } else {
                if ((i+l)>difficultyClass) {
                    backgroundColor.push('red');
                    label -= probabilityArray[i];
                } else {
                    backgroundColor.push('rgb(20, 152, 222)');
                }
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
        var legend2 = document.getElementById('legend2');
        legend1.style.backgroundColor = 'rgb(20, 152, 222)';
        legend1.style.display = 'block';
        legend2.style.display = 'none';
        legend1.innerHTML = '100%';
        backgroundColor.push('rgb(20, 152, 222)')
    }
    label = '100';
    label += '%';

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
        stack: 'Stack 0', 
    },{
        skipNull: true,
        label: label,
        backgroundColor: 'rgb(255,140,0)',
        borderColor: 'rgb(255,140,0)',
        borderRadius: 5,
        minBarThickness: 30,
        maxBarThickness: 100,
        data: halfArray,  
        stack: 'Stack 0',
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
            interaction: {
              intersect: true,
            },
            scales: {
                x: {
                    reverse: d100,
                    ticks: {
                        color: 'white'
                    },
                    stacked: true,
                },
                y: {
                    ticks: {
                        color: 'white'
                    },
                    stacked: true,
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

function historyStart() {

        if (chartIndex == 1){
            document.getElementById('historyB').style.visibility = "visible";
            renderHistory(1);
            renderHistory(2)
            renderHistory(3)
            chartIndex++;
        } 
        if (chartIndex == 2){
            renderHistory(1)
            chartVisibility++;
        } 
        if (chartIndex == 3){
            renderHistory(2);
            chartVisibility++;
        } 
        if (chartIndex == 4){
            renderHistory(3);
            chartVisibility++;
        } 
        if (document.getElementById('history').style.visibility == 'visible') {
            if (chartVisibility > 0) {
                document.getElementById('chart1').style.visibility = 'visible';
            }
            if (chartVisibility > 1) {
                document.getElementById('chart2').style.visibility = 'visible';
            }
            if (chartVisibility > 2) {
                document.getElementById('chart3').style.visibility = 'visible';
            }
        }
        chartIndex++
        if (chartIndex == 5) {
            chartIndex = 2;
        }
}

function historyOn() {
    if (document.getElementById('history').style.visibility != 'visible') {
        document.getElementById('history').style.visibility = 'visible';
        if (chartVisibility > 0) {
            document.getElementById('chart1').style.visibility = 'visible';
        }
        if (chartVisibility > 1) {
            document.getElementById('chart2').style.visibility = 'visible';
        }
        if (chartVisibility > 2) {
            document.getElementById('chart3').style.visibility = 'visible';
        }
    } else {
        document.getElementById('history').style.visibility = 'hidden';
        document.getElementById('chart1').style.visibility = 'hidden';
        document.getElementById('chart2').style.visibility = 'hidden';
        document.getElementById('chart3').style.visibility = 'hidden';
        document.getElementById('chart4').style.visibility = 'hidden';
        document.getElementById('chart5').style.visibility = 'hidden';
        document.getElementById('chart6').style.visibility = 'hidden';
    }
}

function renderHistory(id) {

    // Destroy old graph
    if (id == 1) {
        if (chart1) {
            chart1.destroy();
        }
    
        // Render chart
        chart1 = new Chart(
            document.getElementById('chart1'),
            config
        );
    }
    if (id == 2) {
        if (chart2) {
            chart2.destroy();
        }
        
        // Render chart
        chart2 = new Chart(
            document.getElementById('chart2'),
            config
        );
    }
    if (id == 3) {
        if (chart3) {
            chart3.destroy();
        }

        // Render chart
        chart3 = new Chart(
            document.getElementById('chart3'),
            config
        );
    }
    
}