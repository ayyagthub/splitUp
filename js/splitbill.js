const generateBtn = document.getElementById("generateBtn");

const orderCountInput = document.getElementById("orderCount");
const personCountInput = document.getElementById("personCount");

const orderContainer = document.getElementById("orderContainer");
const assignContainer = document.getElementById("assignContainer");

const summaryContainer = document.getElementById("summaryContainer");

const grandTotal = document.getElementById("grandTotal");


// DATA
let assignments = {};
let orderData = [];


// FORMAT RUPIAH
function formatRupiah(number) {
    return "Rp " + number.toLocaleString("id-ID");
}


// GENERATE ORDER INPUT
generateBtn.addEventListener("click", () => {

    const orderCount = parseInt(orderCountInput.value);

    orderContainer.innerHTML = "";

    for(let i = 0; i < orderCount; i++) {

        orderContainer.innerHTML += `
        
        <div class="item">

            <input 
                type="text" 
                placeholder="Nama Pesanan"
                class="item-name"
            >

            <input 
                type="number" 
                placeholder="Harga"
                class="item-price"
            >

            <input 
                type="number" 
                placeholder="Qty"
                class="item-qty"
                value="1"
            >

            <div class="subtotal">
                Rp 0
            </div>

        </div>
        
        `;
    }

    activateCalculation();
});


// AKTIFKAN HITUNG
function activateCalculation() {

    const items = document.querySelectorAll(".item");

    items.forEach(item => {

        const priceInput = item.querySelector(".item-price");
        const qtyInput = item.querySelector(".item-qty");

        const subtotalText = item.querySelector(".subtotal");

        function calculateItem() {

            const price = parseInt(priceInput.value) || 0;
            const qty = parseInt(qtyInput.value) || 0;

            const subtotal = price * qty;

            subtotalText.innerText = formatRupiah(subtotal);

            calculateGrandTotal();
        }

        priceInput.addEventListener("input", calculateItem);
        qtyInput.addEventListener("input", calculateItem);
    });
}


// TOTAL BILL
function calculateGrandTotal() {

    const subtotals = document.querySelectorAll(".subtotal");

    let total = 0;

    subtotals.forEach(sub => {

        const number = parseInt(
            sub.innerText
            .replace("Rp", "")
            .replace(/\./g, "")
            .replace(/\s/g, "")
        ) || 0;

        total += number;
    });

    grandTotal.innerText = formatRupiah(total);
}


// BUTTON HITUNG TOTAL
document.querySelector(".btn.dark")
.addEventListener("click", generateAssignments);



// GENERATE ASSIGNMENTS
function generateAssignments() {

    assignContainer.innerHTML = "";

    const items = document.querySelectorAll(".item");

    orderData = [];

    items.forEach((item, index) => {

        const name =
            item.querySelector(".item-name").value || `Item ${index+1}`;

        const price =
            parseInt(item.querySelector(".item-price").value) || 0;

        const qty =
            parseInt(item.querySelector(".item-qty").value) || 0;

        orderData.push({
            name,
            price,
            qty
        });
    });

    assignments = {};

    const personCount = parseInt(personCountInput.value);

    orderData.forEach((order, orderIndex) => {

        assignments[orderIndex] = {};

        let peopleHTML = "";

        for(let p = 1; p <= personCount; p++) {

            assignments[orderIndex][p] = 0;

            peopleHTML += `
    
                <div class="person">

                    <div class="avatar">
                        O${p}
                    </div>

                    <button
                        class="qty-btn minus-btn"
                        onclick="changeQty(${orderIndex}, ${p}, -1)"
                    >
                        −
                    </button>

                    <span
                        class="person-count"
                        id="count-${orderIndex}-${p}"
                    >
                        0
                    </span>

                    <button
                        class="qty-btn plus-btn"
                        onclick="changeQty(${orderIndex}, ${p}, 1)"
                    >
                        +
                    </button>

                </div>

            `;
        }

        assignContainer.innerHTML += `
        
        <div class="assign-box">

            <div class="assign-header">

                <div>
                    <h4>${order.name}</h4>
                    <small>${formatRupiah(order.price)} / item</small>
                </div>

                <span id="remaining-${orderIndex}">
                    ${order.qty} / ${order.qty}
                </span>

            </div>

            <div class="people">
                ${peopleHTML}
            </div>

        </div>
        
        `;
    });

    generateSummary();
}



// TAMBAH KURANG
function changeQty(orderIndex, person, change) {

    const order = orderData[orderIndex];

    const current =
        assignments[orderIndex][person];

    const totalAssigned =
        Object.values(assignments[orderIndex])
        .reduce((a,b) => a+b, 0);

    // PLUS
    if(change === 1) {

        if(totalAssigned >= order.qty) return;

        assignments[orderIndex][person]++;
    }

    // MINUS
    if(change === -1) {

        if(current <= 0) return;

        assignments[orderIndex][person]--;
    }

    // UPDATE UI
    document.getElementById(
        `count-${orderIndex}-${person}`
    ).innerText =
        assignments[orderIndex][person];

    const newAssigned =
        Object.values(assignments[orderIndex])
        .reduce((a,b) => a+b, 0);

    const remaining =
        order.qty - newAssigned;

    document.getElementById(
        `remaining-${orderIndex}`
    ).innerText =
        `${remaining} / ${order.qty}`;

    generateSummary();
}



// SUMMARY
function generateSummary() {

    summaryContainer.innerHTML = "";

    const personCount =
        parseInt(personCountInput.value);

    for(let p = 1; p <= personCount; p++) {

        let itemsHTML = "";

        let total = 0;

        let itemCount = 0;

        orderData.forEach((order, index) => {

            const qty =
                assignments[index]?.[p] || 0;

            if(qty > 0) {

                const subtotal =
                    qty * order.price;

                total += subtotal;

                itemCount += qty;

                itemsHTML += `
                
                <p>
                    ${qty}x ${order.name}
                    <span>
                        ${formatRupiah(subtotal)}
                    </span>
                </p>
                
                `;
            }
        });

        summaryContainer.innerHTML += `
        
        <div class="summary-card">

            <div class="summary-top">

                <div class="summary-avatar">
                    O${p}
                </div>

                <div>
                    <h4>Orang ${p}</h4>
                    <small>${itemCount} Items</small>
                </div>

            </div>

            <div class="summary-items">
                ${itemsHTML || "<p>Belum ada item</p>"}
            </div>

            <div class="summary-total">

                <span>Total</span>

                <h2>
                    ${formatRupiah(total)}
                </h2>

            </div>

        </div>
        
        `;
    }
}

// RESET
document
.getElementById("resetBtn")
.addEventListener("click", () => {

    // KOSONGKAN ORDER
    orderContainer.innerHTML = "";

    // KOSONGKAN ASSIGN
    assignContainer.innerHTML = "";

    // KOSONGKAN SUMMARY
    summaryContainer.innerHTML = "";

    // RESET TOTAL
    grandTotal.innerText = "Rp 0";

    // RESET INPUT
    orderCountInput.value = 1;
    personCountInput.value = 1;

    // RESET DATA
    assignments = {};
    orderData = [];
});


// KEMBALI KE HALAMAN AWAL
document
.getElementById("backBtn")
.addEventListener("click", () => {

    window.location.href = "../index.html";

});