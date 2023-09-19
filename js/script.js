window.onload = function() {
    let canv    = document.createElement("canvas"),
        ctx     = canv.getContext('2d')
    // canv.classList = "game_canvas"

    document.body.querySelector(".menu").remove()
    document.body.append(canv)

    canv.width = Math.floor(window.innerWidth)
    canv.height = Math.floor(window.innerHeight)

    let ground1 = new Image();
        ground1.src = 'img/tst.jpg';

    ctx.drawImage(ground1, 0, 0, 1000, 1000)

    console.log(canv.toDataURL());
};