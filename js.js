function dongy() {
    alert("Yay! Anh cung yeu em!");
}

function khong() {
    let noBtn = document.getElementById("khong");

    let x = window.innerWidth - noBtn.offsetWidth;
    let y = window.innerHeight - noBtn.offsetHeight;

    let nnX = Math.random() * x;
    let nnY = Math.random() * y;

    noBtn.style.left = nnX + "px";
    noBtn.style.top = nnY + "px";
}