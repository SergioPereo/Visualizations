var input;
var sortButton;
var genRandomButton;
var arrToSort = []
var comparisonIndexes = [-1, -1]
var sortedIndexes = []
var comparisonSound
var swapSound

function preload() {
    // set the global sound formats
    soundFormats('wav');
  
    // load either beatbox.mp3, or .ogg, depending on browser
    comparisonSound = loadSound('assets/sounds/change.wav');
    swapSound = loadSound('assets/sounds/change1.wav');
  }

function setup(){
    createCanvas(windowWidth, windowHeight);
    input = select('.text-input')
    genRandomButton = select('#generate-random')
    sortButton = select('#sort')
    genRandomButton.mouseClicked(doGenRandom)
    sortButton.mouseClicked(doSort)
}
function draw(){
    background(255)
    drawArr()
}

function sleep(millisecondsDuration)
{
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  })
}

function mapToPlot(x, uh){
    return (uh/300)*x
}

async function makeSorting(sortConstruction){
    await sleep(1000)
    for(var i = 0 ; i < sortConstruction.length ; i++){
        if(sortConstruction[i]["type"] == 0){
            comparisonIndexes[0] = sortConstruction[i]["m_index"]
            comparisonIndexes[1] = sortConstruction[i]["c_index"]
            if(i%3 == 0){
                comparisonSound.play()
            }
            await sleep(200)
        } else {
            swap(arrToSort, sortConstruction[i]["m_index"], sortConstruction[i]["c_index"])
            sortedIndexes.push(sortConstruction[i]["c_index"])
            swapSound.play()
            await sleep(200)
        }
    }
    sortedIndexes.push(sortConstruction.length-1)
}

function drawArr(startTime){
    if(arrToSort.length > 0){
        const INITIAL_W = 30
        const INITIAL_H = 20
        const FW = width-30
        const FH = height-150
        const UW = FW-INITIAL_W
        const UH = FH-INITIAL_H
        const RECT_WIDTH = UW/(arrToSort.length)
        line(INITIAL_W, INITIAL_H, INITIAL_W, FH)
        line(INITIAL_W, FH, FW, FH)
        var rectHeight = 0
        var index = 0
        for(var i = INITIAL_W; i<=UW+INITIAL_W ; i+=RECT_WIDTH){
            if(sortedIndexes.includes(index)){
                fill(34, 139, 34)
            } else if (comparisonIndexes.includes(index)){
                fill(115, 147, 179)
            }else {
                fill(255)
            }
            rectHeight = mapToPlot(arrToSort[index++],UH)
            rect(i, FH-rectHeight, RECT_WIDTH, rectHeight)
        }
    }
}

function doSort() {
    var sortNumbers = input.value();
    sortNumbers = sortNumbers.replace(/\s/g, '').split(",")
    var array = []
    for (var i=0; i < sortNumbers.length ; i++) {
        array.push(parseInt(sortNumbers[i]))
    }
    arrToSort = array
    var construction = selectionSort(arrToSort)
    console.log(construction)
    makeSorting(construction)
}

function doGenRandom() {
    var array = []
    for (var i=0; i < 50 ; i++) {
        array.push(parseInt(random(300)))
    }
    input.value(array.join(','))
}

// Sorts

function swap(arr, a, b){
    var temp=arr[a]
    arr[a]=arr[b]
    arr[b]=temp
}

// type:0 - comparation
// type:1 - swap
function selectionSort(arr) {
    var sortConstruction = []
    var tempArr = [...arr]
    if (tempArr.length > 1) {
        var value = 0
        var index = 0
        for (var i = 0; i < tempArr.length; i++) {
            value = tempArr[i];
            index = i;
            for (var j = i + 1; j < tempArr.length; j++) {
                sortConstruction.push({'type': 0, 'm_index': index, 'c_index': j})
                if (tempArr[j] < value) {
                    value = tempArr[j];
                    index = j;
                }
            }
            sortConstruction.push({'type': 1, 'm_index': index, 'c_index': i})
            swap(tempArr, i, index);
        }
    }
    return sortConstruction
}
