const GenerateButton = document.getElementById('Generate')!
const Container = document.getElementById('Container')!
let mistakes_board:HTMLElement
let timer_board:HTMLElement


let sudoku: Sudoku
let timer_go = false
let empty_cells:number
let timer_Interval:number

function toggle(me:HTMLLabelElement) {
    me.querySelector('input')!.checked = true;
}

function activate(me:HTMLDivElement) {
    if (me.className != "fixed") {
        const squares = document.querySelectorAll(".small-square");
            for (let each of squares) {
                let eachClasses = each.className.split(" ");

                if (eachClasses.includes("incorrect")) {
                    each.className = eachClasses[0] + " incorrect"
                }
                else {
                    each.className = eachClasses[0]
                } 
        }
        me.className += " Active";
    }
    
}

GenerateButton.addEventListener('click', () => {
    const checkedSize:HTMLInputElement = document.querySelector('input[name=size]:checked')!
    const checkedDifficulty:HTMLInputElement = document.querySelector('input[name=difficulty]:checked')!

    let size:number = parseInt(checkedSize.value)
    let difficulty:number = parseInt(checkedDifficulty.value)

    let difficulties = [
        [10, 16, 30],
        [45, 70, 140],
        [100, 170, 200]
    ]

    Container.innerHTML = `
        <a onClick="location.reload()">Go back to menu</a>
        <span id="Info">
            Mistakes: <span id="Mistakes">0</span>, Time: <span id="Timer">00:00:00</span>
        </span>
        <div id="Grid"></div>`

    mistakes_board = document.getElementById("Mistakes")!
    timer_board = document.getElementById("Timer")!
    sudoku = new Sudoku(size, difficulties[size-2][difficulty], 'Grid')
    empty_cells = sudoku.getEmptyCells()
})


function pressKey(event:KeyboardEvent) {


    if (sudoku.getAllowedNumbers().includes(parseInt(event.key))) {

        let selected_number = parseInt(event.key)

        if (sudoku.getSize() < 4) {
            document.querySelector(".Active")!.innerHTML = event.key;
        }
        

        let id = document.querySelector(".Active")!.id;
        let cords_strings= id.split("-")
        let cords:number[] = [];

        cords.push(parseInt(cords_strings[0].slice(1, cords_strings[0].length))-1)
        cords.push(parseInt(cords_strings[1])-1)



        if (timer_go === false) { 
            timer_go = true
            timer_Interval = setInterval(timer, 1000)
        }
        
        if (sudoku.getValue(cords[1], cords[0]) != selected_number) {
            document.querySelector(".Active")!.className += " incorrect"
            add_mistake()
        }
        else {
            document.querySelector(".Active")!.className = "fixed"
            empty_cells --
            if (empty_cells == 0) {
                clearInterval(timer_Interval)
                victory()
            }
        }
    }
}

let mistakes = 0
function add_mistake() {
    mistakes += 1;
    mistakes_board.innerHTML = mistakes.toString()
}

function timer() {
    let input = timer_board.innerHTML.split(":").map(e => parseInt(e))
    
    input[2] ++

    if (input[2] == 60) {
        input[2] = 0;
        input[1] += 1
        if (input[1] == 60) {
            input[1] = 0
            input[0] += 1
        }
    }

    let output = ""

    for (let el of input){
        if (el < 10) output += "0" + el.toString()
        else output += el.toString()
        output += ":"
    }
    output = output.slice(0,output.length-1)

    timer_board.innerHTML = output

}

function victory() {
    console.log("wygranko")
    party.confetti(Container, {gravity: -1000,
                            count: party.variation.range(100, 200)})

}