window.onload = function() {
    //  Создание переменных
    let canv        = document.createElement("canvas"),
        canv2       = canv,
        score       = document.createElement("p"),
        InnerHeight = 0.8*Math.floor(window.innerHeight),
        InnerWidth  = 0.8*Math.floor(window.innerWidth),
        DefaultSize = 0,
        mapGrid     = 15,
        obj         = [["blob", mapGrid-3, mapGrid-3, null], ["player", 2, 2, 0]],
        map         = [],
        DMS         = 150/mapGrid;
    //  Функция обновления размеров канваса
    function CanvResize(){
        InnerHeight=.8*Math.floor(window.innerHeight),
        InnerWidth=.8*Math.floor(window.innerWidth),
        DefaultSize=InnerHeight>InnerWidth?InnerWidth:InnerHeight,
        canv.setAttribute("style","width:"+DefaultSize+"px; height:"+DefaultSize+"px;"),
        canv2.setAttribute("style","width:"+DefaultSize+"px; height:"+DefaultSize+"px;")
    }
    //  Инициализация канваса и интерфейса
    score.className="score",
    score.innerHTML="Steep: 0",
    CanvResize(),
    window.addEventListener("resize",CanvResize,!0),
    console.log(DMS)
    ctx = canv.getContext("2d"),
    document.body.querySelector(".menu").remove(),
    document.body.append(canv),
    document.body.append(score);
    // Функция расчёта привлекательности карты
    function MapPotential () {
        // Обнуление
        map = []
        // Заготовка карты с полями
        for(let p=0;p<mapGrid+2;p++){
            let r = [],a = 100;
            r.push(0),
            0!=p&&p!=mapGrid+1||(a = 0);
            for(let p = 0; p < mapGrid; p++)r.push(a);
            r.push(0),
            map.push(r)
        }
        // Добавление объектов
        for(let o=0;o<obj.length;o++)null!==obj[o][3]&&(map[obj[o][2]+1][obj[o][1]+1]=obj[o][3]);
        // Подсчёт привлекательности
        for(let a=0;a<2;a++)for(let a=1;a<map.length-1;a++)for(let m=1;m<map[a].length-1;m++)map[a][m]>0&&(map[a][m]=Math.floor((map[a-1][m]+map[a][m-1]+map[a+1][m]+map[a][m+1])/4));
        // Удаление рамки
        let mapPull=[];
        for(let l=1;l<map.length-1;l++){
            let p=[];
            for(let a=1;a<map[l].length-1;a++)p.push(map[l][a]);
            mapPull.push(p)
        }
        map=mapPull;
    }
    MapPotential();
    // Функция сортировки массива
    function sortArr(r,n){return r[0]===n[0]?0:r[0]>n[0]?-1:1}
    // Анимация движения
    function MoveAnimate (from, to, color) {
        let a = from[1],
            b = from[2],
            c = to[1],
            d = to[2],
            e = 0,
            g = 0.05,
            f = setInterval(() => {
                ctx.fillStyle = color;
                let size = Math.round((Math.sin(Math.PI * (1+e))+1+Math.sin(Math.PI * e)*0.75)*100)/100
                ctx.clearRect(a*DMS*2, b*DMS, DMS*2, DMS),
                ctx.clearRect(c*DMS*2, d*DMS, DMS*2, DMS);
                if (a == c) {
                    ctx.fillRect((a+(1-size)/2)*DMS*2, (b+(1-size)/2+(d-b)*g)*DMS, DMS*2*size, DMS*size)
                } else {
                    ctx.fillRect((a+(1-size)/2+(c-a)*g)*DMS*2, (b+(1-size)/2)*DMS, DMS*2*size, DMS*size)
                }
                e += 1/19,
                g += 0.05;
            }, 10);
        setTimeout(() => {clearInterval(f);}, 190);
    }
    // Движение блёбы
    function blobMove () {
        let tier = [], ox = obj[0][1], oy = obj[0][2]
        ox > 0          &&tier.push([map[oy][ox-1], ox-1, oy]),
        oy > 0          &&tier.push([map[oy-1][ox], ox, oy-1]),
        ox < mapGrid-1  &&tier.push([map[oy][ox+1], ox+1, oy]),
        oy < mapGrid-1  &&tier.push([map[oy+1][ox], ox, oy+1])
        tier.sort(sortArr);
        MoveAnimate(obj[0], tier[0], "green");
        obj[0][1] = tier[0][1]
        obj[0][2] = tier[0][2]
    }
    // Анимация появления стенки
    function WallAnimate (x, y) {
        let g = 1/19,
            f = setInterval(() => {
                ctx.fillStyle = "gray";
                ctx.clearRect(x*DMS*2, y*DMS, DMS*2, DMS)
                ctx.fillRect((x+(1-g)/2)*DMS*2, (y+(1-g)/2)*DMS, DMS*2*g, DMS*g)
                g += 1/19;
            }, 10);
        setTimeout(() => {clearInterval(f);}, 190);
    }
    // Добавлние стенки
    function addEntt () {
        let i = 0
        do {
            i = [Math.round(Math.random()*(mapGrid-1)), Math.round(Math.random()*(mapGrid-1))]
            console.log(obj[0], i, map[i[0]][i[1]], obj[0][1]!=i[0], obj[0][2]!=i[1])
            if (map[i[0]][i[1]] != 0&&obj[0][1]!=i[0]&&obj[0][2]!=i[1]) {
                obj.push(["wall", i[0], i[1], 0])
                WallAnimate(i[0], i[1])
                break
            }
        } while (map[i[0]][i[1]] == 0||obj[0][1]==i[0]||obj[0][2]==i[1]);
    }
    // Движение игрока
    let canMove = true, moveLoop = 0, steep = 0
    function move(e,n){
        if (e == "y") {
            MoveAnimate(obj[1], [0, obj[1][1], obj[1][2]+n], "blue")
            obj[1][2]+=n
        }
        if (e == "x") {
            MoveAnimate(obj[1], [0, obj[1][1]+n, obj[1][2]], "blue")
            obj[1][1]+=n
        }
        canMove = false
        setTimeout(() => {canMove = true}, 210);
        moveLoop++;
        if (moveLoop > 0) {
            moveLoop = 0
            addEntt();
        }
        steep++
        score.innerHTML = "Steep: "+steep
        MapPotential();
        blobMove();
        drawP();
    }

    function direction(e){
        87==e.keyCode&&map[obj[1][2]-1][obj[1][1]]!=0&&canMove===true&&obj[1][2]>0&&move("y",-1),
        65==e.keyCode&&map[obj[1][2]][obj[1][1]-1]!=0&&canMove===true&&obj[1][1]>0&&move("x",-1),
        83==e.keyCode&&map[obj[1][2]+1][obj[1][1]]!=0&&canMove===true&&obj[1][2]<mapGrid-1&&move("y",1),
        68==e.keyCode&&map[obj[1][2]][obj[1][1]+1]!=0&&canMove===true&&obj[1][1]<mapGrid-1&&move("x",1)
    }

    document.addEventListener("keydown",direction);
// Отрисовка
    function drawP () {
        // for (let i = 0; i < map.length; i++) {
        //     for (let q = 0; q < map[i].length; q++) {
        //         if (map[i][q]>0) {
        //             ctx.fillStyle = "rgb(255 0 0 / "+map[i][q]+"%)";
        //         } else {
        //             ctx.fillStyle = "rgb(255 0 0 / 0%)";
        //         }
        //         ctx.fillRect(q*DMS*2, i*DMS, DMS*2, DMS);
        //     }
        // }
        // for (let i = 0; i < obj.length; i++) {
        //     if (obj[i][0]=="player") {
        //         ctx.fillStyle = "blue";
        //     }
        //     if (obj[i][0]=="blob") {
        //         // ctx.fillStyle = "green";
        //     }
        //     if (obj[i][0]=="wall") {
        //         // ctx.fillStyle = "yellow";
        //     }
        //     ctx.fillRect(obj[i][1]*DMS*2, obj[i][2]*DMS, DMS*2, DMS)
        //     ctx.fillStyle = "white"
        // }
    }
    drawP();
};