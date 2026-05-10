const btnSplit = document.getElementById('btn-split');
const btnPatungan = document.getElementById('btn-patungan');

if (btnSplit) {
    btnSplit.addEventListener('click', () => {
        window.location.href = 'pages/splitbill.html';
    });
}

if (btnPatungan) {
    btnPatungan.addEventListener('click', () => {
        window.location.href = 'pages/patungan.html';
    });
}