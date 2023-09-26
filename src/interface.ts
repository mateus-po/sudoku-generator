const GenerateButton = document.getElementById('Generate')!
const Container = document.getElementById('Container')!
let mistakes_board:HTMLElement
let timer_board:HTMLElement
let mistakes:number


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
        [100, 170, 210]
    ]

    Container.innerHTML = `
        <a onClick="location.reload()">Go back</a>
        <span id="Info">
            Mistakes: <span id="Mistakes">0</span>, Time: <span id="Timer">00:00:00</span>
        </span>
        <div id="Grid"></div>`

    mistakes_board = document.getElementById("Mistakes")!
    timer_board = document.getElementById("Timer")!
    sudoku = new Sudoku(size, difficulties[size-2][difficulty], 'Grid')
    empty_cells = sudoku.getEmptyCells()
    mistakes = 0 
})


function pressKey(event:KeyboardEvent) {

    const ActiveElement = document.querySelector(".Active")!

    if (!ActiveElement) return

    if (sudoku.getAllowedNumbers().includes(parseInt(event.key)) || event.key == 'Enter' || event.key == "Backspace") {

        let selected_number:number = 0


        if (event.key == 'Backspace') {
            ActiveElement.innerHTML = ""
            ActiveElement.className = 'small-square Active'
            return
        }
        else if (sudoku.getSize() < 4) {
            ActiveElement.innerHTML = event.key
            selected_number = parseInt(event.key)
        }
        else if (event.key == '1') {
            ActiveElement.innerHTML = event.key
            return
        }
        else if (ActiveElement.innerHTML == ''
        && ['2','3','4','5','6','7','8','9'].includes(event.key)) {
            ActiveElement.innerHTML = event.key
            selected_number = parseInt(event.key)
        } 
        else if (ActiveElement.innerHTML == '1'
        && ['1','2','3','4','5','6','7','8','9'].includes(event.key)) {
            ActiveElement.innerHTML += event.key
            selected_number = parseInt(ActiveElement.innerHTML)
        }
        else if (event.key == 'Enter' && ActiveElement.innerHTML == '1')
        {
            selected_number = 1
        }
        

        let id = ActiveElement.id;
        let cords_strings= id.split("-")
        let cords:number[] = [];

        cords.push(parseInt(cords_strings[0].slice(1, cords_strings[0].length))-1)
        cords.push(parseInt(cords_strings[1])-1)



        if (timer_go === false) { 
            timer_go = true
            timer_Interval = setInterval(timer, 1000)
        }
        
        if (sudoku.getValue(cords[1], cords[0]) != selected_number) {
            ActiveElement.className += " incorrect"
            add_mistake()
        }
        else {
            ActiveElement.className = "fixed"
            empty_cells --
            if (empty_cells == 0) {
                clearInterval(timer_Interval)
                victory()
            }
        }
    }
}


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
    fireworks()

}

