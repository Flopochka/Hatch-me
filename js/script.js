//  Создание переменных
let canv        = document.createElement("canvas"),
    score       = document.createElement("p"),
    InnerHeight = 0.8*Math.floor(window.innerHeight),
    InnerWidth  = 0.8*Math.floor(window.innerWidth),
    DefaultSize = 0,
    mapGrid     = 8,
    obj         = [["blob", mapGrid-3, mapGrid-3, null], ["player", 2, 2, 0]],
    map         = [],
    difficult   = 1,
    canMove     = true,
    moveLoop    = 0, 
    steep       = 0,
    DMS         = 128;
const   spikesImg   =new Image,
        playerImg   =new Image,
        blobImg     =new Image;
spikesImg.src       ="img/spikes.png",
playerImg.src       ="img/player.png",
blobImg.src         ="img/blob.png";
canv.style.backgroundSize=100/mapGrid+"% "+100/mapGrid+"%,"+100/mapGrid+"% "+100/mapGrid+"%,"+400/mapGrid+"% "+400/mapGrid+"%";
window.onload = () => {
    
}
function InitGame() {
    //  Функция обновления размеров канваса
    function CanvResize(){
        InnerHeight =.8*Math.floor(window.innerHeight),
        InnerWidth  =.8*Math.floor(window.innerWidth),
        DefaultSize =InnerHeight>InnerWidth?InnerWidth:InnerHeight,
        canv.style.width    = DefaultSize+"px",
        canv.style.height   = DefaultSize+"px",
        canv.width          = mapGrid * 128,
        canv.height         = mapGrid * 128;
    }
    //  Инициализация канваса и интерфейса
    CanvResize(),
    score.className="score",
    score.innerHTML="Steep: 0",
    window.addEventListener("resize",()=>{CanvResize();draw();}),
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
        for(let a=0;a<2;a++)for(let a=1;a<map.length-1;a++)for(let m=1;m<map[a].length-1;m++)map[a][m]>0&&(map[a][m]=Math.floor((map[a-1][m]+map[a][m-1]+map[a+1][m]+map[a][m+1])/4)+1);
        // Удаление рамки
        let mapPull=[];
        for(let l=1;l<map.length-1;l++){
            let p=[];
            for(let a=1;a<map[l].length-1;a++)p.push(map[l][a]);
            mapPull.push(p)
        }
        map=mapPull;
    }
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
                ctx.clearRect(a*DMS, b*DMS, DMS, DMS),
                ctx.clearRect(c*DMS, d*DMS, DMS, DMS);
                if (a == c) {
                    ctx.drawImage(color, (a+(1-size)/2)*DMS, (b+(1-size)/2+(d-b)*g)*DMS, DMS*size, DMS*size)
                } else {
                    ctx.drawImage(color, (a+(1-size)/2+(c-a)*g)*DMS, (b+(1-size)/2)*DMS, DMS*size, DMS*size)
                }
                e += 1/19,
                g += 0.05;
            }, 10);
        setTimeout(() => {clearInterval(f);}, 190);
    }
    // Анимация появления
    function createAnimate (x, y, color) {
        let g = 1/19,
            f = setInterval(() => {
                ctx.fillStyle = color;
                ctx.clearRect(x*DMS, y*DMS, DMS, DMS)
                ctx.drawImage(color, (x+(1-g)/2)*DMS, (y+(1-g)/2)*DMS, DMS*g, DMS*g)
                g += 1/19;
            }, 10);
        setTimeout(() => {clearInterval(f);}, 190);
    }
    // Повторная отрисовка
    function draw () {
        ctx.clearRect(0, 0, DMS*mapGrid, DMS*mapGrid)
        ctx.drawImage(playerImg, obj[1][1]*DMS, obj[1][2]*DMS, DMS, DMS)
        ctx.drawImage(blobImg, obj[0][1]*DMS, obj[0][2]*DMS, DMS, DMS)
        for (let i = 0; i < obj.length; i++) {
            if (obj[i][0]=="wall") {
                ctx.drawImage(spikesImg, obj[i][1]*DMS, obj[i][2]*DMS, DMS, DMS)
            }
        }
    }
    // Победа
    function Win (e) {
        alert("Эта пабедааааа")
    }
    // Движение блёбы
    function blobMove () {
        let tier = [], ox = obj[0][1], oy = obj[0][2], d20 = Math.round(Math.random()*20), b0=0, b1, b2, tierPool
        ox > 0          &&tier.push([map[oy][ox-1], ox-1, oy]),
        oy > 0          &&tier.push([map[oy-1][ox], ox, oy-1]),
        ox < mapGrid-1  &&tier.push([map[oy][ox+1], ox+1, oy]),
        oy < mapGrid-1  &&tier.push([map[oy+1][ox], ox, oy+1])
        tier.sort(sortArr);
        if (difficult == 1) {b0=19, b1=16, b2=12}
        if (difficult == 2) {b0=16, b1=10, b2=4}
        if (tier[0][0]!=0) {tierPool = tier[0]}
        if (d20<b0&&tier.length>1&&tier[1][0]!=0) {tierPool = tier[1]}
        if (d20<b1&&tier.length>2&&tier[2][0]!=0) {tierPool = tier[2]}
        if (d20<b2&&tier.length>3&&tier[3][0]!=0) {tierPool = tier[3]}
        tier = tierPool
        try {
            MoveAnimate(obj[0], tier, blobImg);
            obj[0][1] = tier[1]
            obj[0][2] = tier[2]
        } catch{} 
    }
    // Добавлние стенки
    function addEntt () {
        let i = 0
        do {
            i = [Math.round(Math.random()*(mapGrid-1)), Math.round(Math.random()*(mapGrid-1))]
            console.log(obj.length-1, map[i[1]][i[0]], i[1], i[0], map[i[1]][i[0]] != 0&&(obj[0][1]!=i[0]||obj[0][2]!=i[1]))
            if (map[i[1]][i[0]] != 0&&(obj[0][1]!=i[0]||obj[0][2]!=i[1])) {
                obj.push(["wall", i[0], i[1], 0])
                createAnimate(i[0], i[1], spikesImg)
                break
            }
        } while (!(map[i[1]][i[0]] != 0&&(obj[0][1]!=i[0]||obj[0][2]!=i[1])));
    }
    // Движение игрока
    function move(e,n){
        draw();
        if (e == "y") {
            MoveAnimate(obj[1], [0, obj[1][1], obj[1][2]+n], playerImg)
            obj[1][2]+=n
        }
        if (e == "x") {
            MoveAnimate(obj[1], [0, obj[1][1]+n, obj[1][2]], playerImg)
            obj[1][1]+=n
        }
        if ((obj[0][1]==obj[1][1]&&obj[0][2]==obj[1][2])) {
            setTimeout(() => {Win();}, 210);
        } else{
            canMove = false
            setTimeout(() => {canMove = true}, 210);
            moveLoop++;
            if (moveLoop > 4) {
                moveLoop = 0
                addEntt();
            }
            steep++
            score.innerHTML = "Steep: "+steep
            MapPotential();
            blobMove();
            // drawP();
        }
    }
    // Определение направления движения игрока
    function direction(e){
        87==e.keyCode&&map[obj[1][2]-1][obj[1][1]]!=0&&canMove===true&&obj[1][2]>0&&move("y",-1),
        65==e.keyCode&&map[obj[1][2]][obj[1][1]-1]!=0&&canMove===true&&obj[1][1]>0&&move("x",-1),
        83==e.keyCode&&map[obj[1][2]+1][obj[1][1]]!=0&&canMove===true&&obj[1][2]<mapGrid-1&&move("y",1),
        68==e.keyCode&&map[obj[1][2]][obj[1][1]+1]!=0&&canMove===true&&obj[1][1]<mapGrid-1&&move("x",1)
    }
    // Появление игрока и блёпки
    createAnimate(obj[0][1], obj[0][2], blobImg)
    createAnimate(obj[1][1], obj[1][2], playerImg)
    setTimeout(() => {draw();}, 200);
    // Движение игрока при нажатии клавиши
    document.addEventListener("keydown",direction);
    // Движение при свайпе
    canv.addEventListener('swiped-right',   ()=>{map[obj[1][2]][obj[1][1]+1]!=0&&canMove===true&&obj[1][1]<mapGrid-1&&move("x",1)});
    canv.addEventListener('swiped-up',      ()=>{map[obj[1][2]-1][obj[1][1]]!=0&&canMove===true&&obj[1][2]>0&&move("y",-1)});
    canv.addEventListener('swiped-down',    ()=>{map[obj[1][2]+1][obj[1][1]]!=0&&canMove===true&&obj[1][2]<mapGrid-1&&move("y",1)});
    canv.addEventListener('swiped-left',    ()=>{map[obj[1][2]][obj[1][1]-1]!=0&&canMove===true&&obj[1][1]>0&&move("x",-1)});
    // Рассчёт привлекательности карты
    MapPotential();
    
// Отрисовка
    function drawP () {
        for (let i = 0; i < map.length; i++) {
            for (let q = 0; q < map[i].length; q++) {
                if (map[i][q]>0) {
                    ctx.fillStyle = "rgb(255 0 0 / "+map[i][q]+"%)";
                } else {
                    ctx.fillStyle = "rgb(255 0 0 / 0%)";
                }
                ctx.fillRect(q*DMS*2, i*DMS, DMS*2, DMS);
            }
        }
    }
};