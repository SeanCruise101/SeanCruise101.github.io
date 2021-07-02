var canvas = document.getElementById('normal');
var ctx = canvas.getContext('2d');
var image = document.createElement('img');
var rawImage = null;
var width = 0;
var height = 0;
var cameraX = 0;
var cameraY = 0;

var scaleRange = document.getElementById('scaleRange');
var scaleLabel = document.getElementById('scaleLabel');

var clothRange = document.getElementById('clothRange');
var clothLabel = document.getElementById('clothCount');

var download = document.getElementById('download');

function submit(event) {
    let reader = new FileReader();
    reader.onload = function() {
        image.onload = function() {
            document.body.appendChild(image);
            //Adds Image at bottom^
            width = this.width;
            height = this.height;
            if(width > 420)
            {
                width = 420;
            }
            else if (height > 420)
            {
                height = 420;
            }
            init();
            listAllColors();
        }
        image.src = reader.result;
    }
    reader.readAsDataURL(event.target.files[0]);
}

function init() {
    let scale = parseInt(document.getElementById('scaleRange').value);
    let clothScale = parseInt(document.getElementById('clothRange').value);
    canvas.width = width * scale + 1;
    canvas.height = height * scale + 1;


    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, 0, 0, width * scale, height * scale);
    ctx.lineWidth = 1;
    rawImage = ctx.getImageData(0, 0, width, height);

    let xBigLine = 0;
    let yBigLine = 0;

    //Draws the actual canvas
    for(let x = 0; x < canvas.width; x += scale) {
        ctx.beginPath();
        ctx.imageSmoothingEnabled = false;

        if(xBigLine == 10) {
            xBigLine = 0;
            ctx.lineWidth = 3;
        } else {
            ctx.lineWidth = 1;
        }

        ctx.moveTo(x + 0.5, 0 + 0.5);
        ctx.lineTo(x + 0.5, canvas.height + 0.5);
        ctx.stroke();
        xBigLine++;
    }

    for(let y = 0; y < canvas.height; y += scale) {
        ctx.beginPath();
        ctx.imageSmoothingEnabled = false;

        if(yBigLine == 10) {
            yBigLine = 0;
            ctx.lineWidth = 3;
        } else {
            ctx.lineWidth = 1;
        }

        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
        yBigLine++;
    }
}

scaleRange.addEventListener('change', (event) => {
    init();
})

clothRange.addEventListener('change', (event) => {
    init();
})
function updateScaleLabel() {
    scaleLabel.innerText = "Canvas Size (inches): " + scaleRange.value;
}

function updateClothLabel() {
    clothCount.innerText = "Cloth count: " + clothRange.value;
}//Still needs to be fixed

function listAllColors() {
    let map = new Map();
    console.log(rawImage.data.length);

    console.log(rgbToHex(rawImage.data[0], rawImage.data[1], rawImage.data[2]))
    for(let i = 0; i < rawImage.data.length; i += 4) {
        let r = rawImage.data[i + 0];
        let g = rawImage.data[i + 1];
        let b = rawImage.data[i + 2];
        let a = rawImage.data[i + 3];

        if(a > 0) {
            map.set("#" + rgbToHex(r, g, b), "#" + rgbToHex(r, g, b));
        }
    }

   /* map.forEach(element => {
        let p = document.createElement('p');
        let box = document.createElement('div');
        box.width = "10px";
        box.height = "10px";
        p.textContent = element;
        p.style.textAlign = "center";
        p.style.color = "black";
        p.style.backgroundColor = element;
        document.body.appendChild(p);
    });*/
}

download.addEventListener('click', (event) => {
    image = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
    var link = document.createElement('a');
    link.download = "my-image.png";
    link.href = image;
    link.click();
})

function rgbToHex(r, g, b) {
    return ((r << 16) | (g << 8) | b).toString(16);
}

