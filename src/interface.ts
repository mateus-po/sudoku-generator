//this file contains all interface features - activating fields by clicking on them, filling activated fields
// (keyboard input), couting mistakes, keeping time amd checking if the player has won



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



// function press(event) {
//     if (range(SQUARE**2).includes(event.key)) { //size is a variable from a 'generowanie.js' script
//         document.querySelector(".Active").innerHTML = event.key;
//         let id = document.querySelector(".Active").id;
//         let cords = id.split("-")
//         cords[0] = parseInt(cords[0].slice(1, cords[0].length))-1
//         cords[1] = parseInt(cords[1])-1

//         if (timer_go === false) { // from now on we start counting time
//             timer_go = true
//             timer_Interval = setInterval(timer, 1000)
//         }
        

//         // console.log(event.key)
//         // console.log(plansza_arr[cords[1]][cords[0]])

//         if (plansza_arr[cords[1]][cords[0]] != event.key) {
//             document.querySelector(".Active").className += " incorrect"
//             add_mistake()
//         }
//         else {
//             document.querySelector(".Active").className = "fixed"
//             ile_pustych --
//             if (ile_pustych == 0) {
//                 clearInterval(timer_Interval)
//                 victory()
//             }
//         }
//     }
// }

// // mistakes handling
// const mistakes_board = document.getElementById("Mistakes")
// let mistakes = 0
// function add_mistake() {
//     mistakes += 1;
//     mistakes_board.innerHTML = mistakes
// }

// //timer
// const timer_board = document.getElementById("Timer")

// let timer_go = false
// function timer() {
//     let input = timer_board.innerHTML.split(":")
    
//     input[0] = parseInt(input[0])
//     input[1] = parseInt(input[1])
//     input[2] = parseInt(input[2]) + 1
//     if (input[2] == 60) {
//         input[2] = 0;
//         input[1] += 1
//         if (input[1] == 60) {
//             input[1] = 0
//             input[0] += 1
//         }
//     }

//     let output = ""

//     for (el of input){
//         if (el < 10) output += "0" + el.toString()
//         else output += el.toString()
//         output += ":"
//     }
//     output = output.slice(0,output.length-1)

    

//     timer_board.innerHTML = output

// }

// //used when the player wins
// function victory() {
//     console.log("wygranko")
//     party.confetti(plansza, {gravity: -1000,
//                             count: party.variation.range(100, 200)})

// }