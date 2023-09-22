window.onload = function() {
// Создание канваса + фиксирование его размеров
    let canv        = document.createElement("canvas"),
        canv2       = canv,
        score       = document.createElement("p"),
        InnerHeight = 0.8*Math.floor(window.innerHeight),
        InnerWidth  = 0.8*Math.floor(window.innerWidth),
        DefaultSize = 0
        score.className = "score"
        score.innerHTML = "Steep: 0"
    function CanvResize () {
        InnerHeight = 0.8*Math.floor(window.innerHeight);
        InnerWidth  = 0.8*Math.floor(window.innerWidth);
        if (InnerHeight > InnerWidth) {
            DefaultSize = InnerWidth
        }else{
            DefaultSize = InnerHeight
        } 
        canv.setAttribute('style', 'width:'+DefaultSize+'px; height:'+DefaultSize+'px;')
        canv2.setAttribute('style', 'width:'+DefaultSize+'px; height:'+DefaultSize+'px;')
    }
    CanvResize();
    window.addEventListener('resize', CanvResize, true);
    ctx             = canv.getContext('2d')
    document.body.querySelector(".menu").remove()
    document.body.append(canv)
    document.body.append(score)
// Создание массива объектов
    let mapGrid = 15, obj = [["blob", mapGrid-3, mapGrid-3, null], ["player", 2, 2, 0]]
    console.log(obj)
// Расчёт привлекательности карты
    let map
    function MapPotential () {
        // Заготовка с полями
        map = []
        for (let i = 0; i < mapGrid+2; i++) {
            let line = [], psh = 100
            line.push(0)
            if (i == 0 || i == mapGrid+1) {psh = 0}
            for (let q = 0; q < mapGrid; q++) {
                line.push(psh)
            }line.push(0)
            map.push(line)
        }
        // Отрисовка на заготовке объектов
        for (let i = 0; i < obj.length; i++) {
            if (!(obj[i][3] === null)) {
                map[obj[i][2]+1][obj[i][1]+1] = obj[i][3]
            }
        }
        // подсчёт привлекательности
        for (let loop = 0; loop < 2; loop++) {
            for (let i = 1; i < map.length-1; i++) {
                for (let q = 1; q < map[i].length-1; q++) {
                    if (map[i][q]>0) {
                        map[i][q] = Math.floor((map[i-1][q] + map[i][q-1] + map[i+1][q] + map[i][q+1]) / 4)
                    }
                }
            }
        }
        // обрезание рамки
        let mapPull = []
        for (let i = 1; i < map.length-1; i++) {
            let LinePull = []
            for (let q = 1; q < map[i].length-1; q++) {
                LinePull.push(map[i][q])
            }
            mapPull.push(LinePull)
        }
        map = mapPull
    }
    MapPotential();
    console.log(map)
// Движение
    function sortArr(a, b) {
        if (a[0] === b[0]) {
            return 0;
        }
        else {
            return (a[0] > b[0]) ? -1 : 1;
        }
    }
    function blobMove () {
        let tier = [], ox = obj[0][1], oy = obj[0][2]
        ox > 0          &&tier.push([map[oy][ox-1], ox-1, oy]),
        oy > 0          &&tier.push([map[oy-1][ox], ox, oy-1]),
        ox < mapGrid-1  &&tier.push([map[oy][ox+1], ox+1, oy]),
        oy < mapGrid-1  &&tier.push([map[oy+1][ox], ox, oy+1])
        tier.sort(sortArr);
        obj[0][1] = tier[0][1]
        obj[0][2] = tier[0][2]
    }

    let canMove = true, moveLoop = 0, steep = 0
    function move(e,n){
        if (e == "y") {
            obj[1][2]+=n
        }
        if (e == "x") {
            obj[1][1]+=n
        }
        // canMove = false
        // setTimeout(() => {canMove = true}, 1000);
        moveLoop++;
        if (moveLoop > 4) {
            moveLoop = 0
            let i = 0
            do {
                i = [Math.round(Math.random()*(mapGrid-1)), Math.round(Math.random()*(mapGrid-1))]
                console.log(i[0], i[1], map[i[0]][i[1]])
                if (map[i[0]][i[1]] != 0) {
                    obj.push(["wall", i[0], i[1], 0])
                    console.log(["wall", i[0], i[1], 0])
                    break
                }
            } while (map[i[0]][i[1]] == 0);
        }
        steep++
        score.innerHTML = "Steep: "+steep
        MapPotential();
        blobMove();
        drawP();
    }

    function direction(e){
        if (canMove === true) {
            87==e.keyCode&&map[obj[1][2]-1][obj[1][1]]!=0&&obj[1][2]>0&&move("y",-1),
            65==e.keyCode&&map[obj[1][2]][obj[1][1]-1]!=0&&obj[1][1]>0&&move("x",-1),
            83==e.keyCode&&map[obj[1][2]+1][obj[1][1]]!=0&&obj[1][2]<mapGrid-1&&move("y",1),
            68==e.keyCode&&map[obj[1][2]][obj[1][1]+1]!=0&&obj[1][1]<mapGrid-1&&move("x",1)
        }
    }

    document.addEventListener("keydown",direction);
// Отрисовка
    function drawP () {
        ctx.clearRect(0, 0, 300, 150);
        for (let i = 0; i < map.length; i++) {
            for (let q = 0; q < map[i].length; q++) {
                if (map[i][q]>0) {
                    ctx.fillStyle = "rgb(255 0 0 / "+map[i][q]+"%)";
                } else {
                    ctx.fillStyle = "rgb(255 0 0 / 0%)";
                }
                ctx.fillRect(300*q/map.length, 150*i/map.length, 300/map.length, 150/map.length);
            }
        }
        for (let i = 0; i < obj.length; i++) {
            if (obj[i][0]=="player") {
                ctx.fillStyle = "blue";
            }
            if (obj[i][0]=="blob") {
                ctx.fillStyle = "green";
            }
            if (obj[i][0]=="wall") {
                // ctx.fillStyle = "gray";
            }
            ctx.fillRect(obj[i][1]*300/map.length, obj[i][2]*150/map.length, 300/map.length, 150/map.length)
            ctx.fillStyle = "white"
        }
    }
    drawP();
};