

class Sudoku {

    #SIZE:number 
    #Array:number[][]
    #Grid:HTMLElement|null
    #PossibleSolutions: number
    #Difficulty:number
    #Empty_Cells:number


    constructor (size:number, difficulty:number, gridID:string) {
        this.#SIZE = size
        this.#Empty_Cells = 0
        this.#Difficulty = difficulty
        this.#Grid = document.getElementById(gridID)

        if (!this.#Grid) {
            throw Error('You have to provide correct grid ID')
        }

        this.#Array = []
        this.#PossibleSolutions = 0
        let tries = this.#fill_arr()
        document.documentElement.style.setProperty('--size', `${size}`);
        this.#getGridHTML()

        this.#readyGrid()

    }

    getValue(x:number, y:number): number {
        return this.#Array[x][y]
    }

    getSize():number {
        return this.#SIZE
    }

    getAllowedNumbers():number[] {
        return this.#range(this.#SIZE**2)
    }

    getEmptyCells():number {
        return this.#Empty_Cells
    }

    #getGridHTML():void {
        let sqx = 1;
        let sqy = 1;
        
        for (let i = 1; i <= this.#SIZE ** 2; i++) {
            if (sqx > this.#SIZE) {
                sqy += 1;
                sqx = 1;
            }
            this.#Grid!.innerHTML += `<div id="sq${sqx}-${sqy}" class="big-square"></div>`;
        
            let fy = (sqy-1) * this.#SIZE + 1;
            let fx = (sqx-1) * this.#SIZE + 1;
            let counter = 1;
        
            for (let j = 1; j <= this.#SIZE ** 2; j++) {
        
                if (counter > this.#SIZE) {
                    fy += 1;
                    fx = (sqx-1)*this.#SIZE + 1;
                    counter = 1;
                }
                this.#Grid!.lastElementChild!.innerHTML += `<div id="f${fx}-${fy}" class="small-square" onclick="activate(this)"></div>`;
                fx += 1;
                counter += 1;
            }
            sqx +=1;
            
        }
    }

    #getLineY_arr(i:number): number[] {
        let result:number[] = []
        for (let j = 0; j < this.#Array.length-1; j++) {
            if (!result.includes(this.#Array[j][i]) && this.#Array[j][i] != undefined) result.push(this.#Array[j][i]);
        }
        return result;
    }

    #getSquare_arr(x:number, y:number):number[] {
        let sq_y = (y - y % this.#SIZE)
        let sq_x = (x - x % this.#SIZE)
        
        let result: number[] = []
    
        for (let i = sq_y; i < y; i++) {

            let bufor:number
            if ((this.#Array[sq_y].length) - sq_x == 0) {
                bufor = x
            }
            else {
                bufor = sq_x + this.#SIZE
            }

            for (let j = sq_x; j < bufor; j++) {

                if (!result.includes(this.#Array[i][j]) && this.#Array[i][j] != undefined) result.push(this.#Array[i][j]);
            }
        }
    
        return result
    }

    #range(a:number, exclude:number[]=[]):number [] {
        let result = [];
        while (a > 0) {
            if (!exclude.includes(a)) {
                result.push(a)
            }
            a--;
        }
        return result;
    }

    #fill_arr(ile=1):number {
        this.#Array.length = 0
        let ProperlyGeneratedFlag = true
        for (let i = 0; i < this.#SIZE**2; i++) {
            let inLineX = []

            let attempts = 1
            this.#Array.push([])
            for (let j = 0; j < this.#SIZE**2; j++) {
                let toExclude = []
                toExclude.push(...inLineX)

                for (let number of this.#getSquare_arr(j,i)){
                    if (!toExclude.includes(number)) {
                        toExclude.push(number)
                    }
                }

                for (let number of this.#getLineY_arr(j)){
                    if (!toExclude.includes(number)) {
                        toExclude.push(number)
                    }
                }

                let AllowedNumbers = this.#range(this.#SIZE**2, toExclude)
                let RandomizedNumbers = AllowedNumbers[Math.floor(Math.random() * AllowedNumbers.length)];
                if(RandomizedNumbers === undefined) {
                    if (attempts < 10) {
                        j = -1;
                        inLineX = []
                        this.#Array[i].length = 0
                        attempts += 1;
                        continue
                    }
                    else {
                        ProperlyGeneratedFlag = false
                        break
                    }
    
                }
                inLineX.push(RandomizedNumbers)
                this.#Array[i].push(RandomizedNumbers)
            }
            
        }
        if(!ProperlyGeneratedFlag) return this.#fill_arr(ile+1)

        return ile
    }

    #validate_Y(arr:number[][], i:number) {
        let result:number[] = []
        for (let j = 0; j < arr.length; j++) {
            if (!result.includes(arr[j][i]) && arr[j][i] != undefined && arr[j][i] != 0) result.push(arr[j][i]);
        }
        return result;
    }

    #validate_Square(arr:number[][], x:number,y:number) {
        let sq_y = (y - y % Math.sqrt(arr.length))
        let sq_x = (x - x % Math.sqrt(arr.length))

        
        let result:number[] = []

        for (let i = sq_y; i < sq_y+Math.sqrt(arr.length); i++) {
            for (let j = sq_x; j < sq_x + Math.sqrt(arr.length); j++) {

                if (!result.includes(arr[i][j]) && arr[i][j] != undefined && arr[i][j] != 0) result.push(arr[i][j]);
            }
        }

        return result
    }

    #validate_X(arr:number[][], y:number) {
        let result:number[] = []
        for (let cell of arr[y]) {
            if (cell != 0) result.push(cell)
        }
        return result
    }


    #sudokuSolver(grid:number[][]) {

        for (let row = 0; row < grid.length; row++) {
        
            for (let cell = 0; cell < grid.length; cell++) {
                
                if (grid[row][cell] == 0) { //if we find first empty cell we try to put in some value - if its impossible, the function should stop working


                    let inY = this.#validate_Y(grid, cell)
                    let inX = this.#validate_X(grid, row)
                    let inSq = this.#validate_Square(grid,cell,row)
                    //those numbers should be excluded
                    for (let i = 1; i <= grid.length; i++ ) {


                        if (!inY.includes(i) && !inX.includes(i) && !inSq.includes(i)) {  // if none of there arrays include i

                            grid[row][cell] = i // we try to put here a candidate number to see what happens next
                            let grid_copy = grid
                            let full = true
                            for (let r of grid) {
                                if (r.includes(0)) {
                                    full = false
                                    break
                                }
                            }
                            if (full) {
                                this.#PossibleSolutions += 1
                                grid[row][cell] = 0
                                return true
                            }
                            else {
                                if (!this.#sudokuSolver(grid_copy)) {
                                    grid[row][cell] = 0
                                }
                            }
                        }
                        grid[row][cell] = 0
                    }

                }
                if (grid[row][cell] == 0) return false //i.e. nothing was put there
            }
        }
    }

    #getRandomIntInclusive(min:number, max:number):number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    #readyGrid() {
        // deep copy
        let grid_copy = JSON.parse(JSON.stringify(this.#Array))

        let i = 1
        this.#Empty_Cells = 0
        while (i < this.#Difficulty) {
            i ++
            //console.log(i)
            let row = this.#getRandomIntInclusive(0,this.#SIZE**2-1)
            let cell = this.#getRandomIntInclusive(0,this.#SIZE**2-1)

            if (grid_copy[row][cell] == 0) continue

            
            let x = grid_copy[row][cell]
            grid_copy[row][cell] = 0;

            this.#PossibleSolutions = 0;
            this.#sudokuSolver(grid_copy)

            if (this.#PossibleSolutions == 1) {
                this.#Empty_Cells += 1
            }
            else {
               grid_copy[row][cell] = x
            }
            
            
        }
        for (let i = 0; i < this.#SIZE**2; i++) {
                for (let j = 0; j < this.#SIZE**2; j++) {
                    if (grid_copy[i][j] != 0) {
                        document.getElementById(`f${j+1}-${i+1}`)!.innerHTML = grid_copy[i][j]
                        document.getElementById(`f${j+1}-${i+1}`)!.className = "fixed"
                }
            }

        }
    }
    
}
