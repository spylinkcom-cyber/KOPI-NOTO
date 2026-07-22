// ==========================
// KOPI NOTO POS
// SCRIPT.JS BAGIAN 1
// ==========================

// ===== Tanggal & Jam =====
function updateClock() {
    const now = new Date();

    document.getElementById("tanggal").innerHTML =
        now.toLocaleDateString("id-ID");

    document.getElementById("jam").innerHTML =
        now.toLocaleTimeString("id-ID");
}

setInterval(updateClock,1000);
updateClock();

// ===== Kasir =====

let namaKasir="";

function loginKasir(){

    namaKasir=document.getElementById("kasir").value;

    if(namaKasir==""){
        alert("Masukkan nama kasir");
        return;
    }

    localStorage.setItem("kasir",namaKasir);

    alert("Selamat bekerja "+namaKasir);

}

namaKasir=localStorage.getItem("kasir") || "";

// ==========================
// DATA MENU
// ==========================

const menu=[

{
nama:"Americano",
kategori:"Coffee",
harga:15000
},

{
nama:"Hazelnut",
kategori:"Coffee",
harga:15000
},

{
nama:"Butterscotch",
kategori:"Coffee",
harga:15000
},

{
nama:"Mocha",
kategori:"Coffee",
harga:15000
},

{
nama:"Brown Sugar",
kategori:"Coffee",
harga:15000
},

{
nama:"Pandan",
kategori:"Coffee",
harga:15000
},

{
nama:"Caramel",
kategori:"Coffee",
harga:15000
},

{
nama:"Spanish",
kategori:"Coffee",
harga:15000
},

{
nama:"Cappuccino",
kategori:"Coffee",
harga:15000
},

{
nama:"Vanilla Regal",
kategori:"Coffee",
harga:15000
},

{
nama:"Chocolate",
kategori:"Non Coffee",
harga:15000
},

{
nama:"Choco TeetuNatu",
kategori:"Non Coffee",
harga:15000
},

{
nama:"Matcha",
kategori:"Non Coffee",
harga:15000
},

{
nama:"Palm Sugar Regal",
kategori:"Non Coffee",
harga:15000
},

{
nama:"Taro",
kategori:"Non Coffee",
harga:15000
},

{
nama:"Vanilla Biscuit",
kategori:"Non Coffee",
harga:15000
},

{
nama:"Lemon Tea",
kategori:"Tea",
harga:13000
},

{
nama:"Lychee Tea",
kategori:"Tea",
harga:13000
}

];

// ==========================
// KERANJANG
// ==========================

let cart=[];

// ==========================
// TAMPILKAN MENU
// ==========================

function tampilMenu(){

let html="";

menu.forEach((item,index)=>{

html+=`

<div class="menu-card">

<h3>${item.nama}</h3>

<p>${item.kategori}</p>

<h4>Rp${item.harga.toLocaleString()}</h4>

<button onclick="tambahCart(${index})">

Tambah

</button>

</div>

`;

});

document.getElementById("menuContainer").innerHTML=html;

}

tampilMenu();

// ==========================
// TAMBAH KE KERANJANG
// ==========================

function tambahCart(index){

let item=menu[index];

let ada=cart.find(x=>x.nama==item.nama);

if(ada){

ada.qty++;

}else{

cart.push({

nama:item.nama,

harga:item.harga,

qty:1

});

}

renderCart();

}

// ==========================
// RENDER CART
// ==========================

function renderCart(){

let tbody=document.getElementById("cart");

tbody.innerHTML="";

let total=0;

cart.forEach((item,i)=>{

let subtotal=item.qty*item.harga;

total+=subtotal;

tbody.innerHTML+=`

<tr>

<td>${item.nama}</td>

<td>

<button onclick="kurangQty(${i})">-</button>

${item.qty}

<button onclick="tambahQty(${i})">+</button>

</td>

<td>

Rp${item.harga.toLocaleString()}

</td>

<td>

Rp${subtotal.toLocaleString()}

</td>

</tr>

`;

});

document.getElementById("grandTotal").innerHTML=

"Rp"+total.toLocaleString();

}

// ==========================
// TAMBAH QTY
// ==========================

function tambahQty(i){

cart[i].qty++;

renderCart();

}

// ==========================
// KURANG QTY
// ==========================

function kurangQty(i){

cart[i].qty--;

if(cart[i].qty<=0){

cart.splice(i,1);

}

renderCart();

}

// ==========================
// HITUNG TOTAL
// ==========================

function getTotal(){

let total=0;

cart.forEach(item=>{

total+=item.qty*item.harga;

});

return total;

  }

// ==========================
// PEMBAYARAN
// ==========================

let totalCash = 0;
let totalQRIS = 0;
let nomorTransaksi = Number(localStorage.getItem("nomorTransaksi")) || 1;

function hitungBayar(){

    const total = getTotal();
    const metode = document.getElementById("metode").value;

    if(metode==="QRIS"){

        document.getElementById("bayar").value = total;

        document.getElementById("kembalian").innerHTML =
        "QRIS - Rp0";

        return;
    }

    const bayar = Number(document.getElementById("bayar").value);

    if(bayar < total){

        alert("Uang pembayaran kurang.");

        return;
    }

    const kembali = bayar-total;

    document.getElementById("kembalian").innerHTML =
    "Kembalian : Rp"+kembali.toLocaleString("id-ID");

}

// ==========================
// SIMPAN TRANSAKSI
// ==========================

function simpanTransaksi(){

    if(cart.length===0){

        alert("Keranjang masih kosong.");

        return;

    }

    const total = getTotal();

    const metode =
    document.getElementById("metode").value;

    let bayar = 0;
    let kembali = 0;

    if(metode==="Tunai"){

        bayar = Number(document.getElementById("bayar").value);

        if(bayar<total){

            alert("Pembayaran kurang.");

            return;

        }

        kembali = bayar-total;

        totalCash += total;

    }else{

        bayar = total;
        kembali = 0;

        totalQRIS += total;

    }

    const transaksi={

        nomor:"TRX"+String(nomorTransaksi).padStart(5,"0"),

        tanggal:new Date().toLocaleDateString("id-ID"),

        jam:new Date().toLocaleTimeString("id-ID"),

        kasir:namaKasir,

        metode:metode,

        bayar:bayar,

        kembali:kembali,

        total:total,

        item:cart

    };

    nomorTransaksi++;

    localStorage.setItem(
        "nomorTransaksi",
        nomorTransaksi
    );

    let data =
    JSON.parse(localStorage.getItem("transaksi")) || [];

    data.push(transaksi);

    localStorage.setItem(
        "transaksi",
        JSON.stringify(data)
    );

    tampilRiwayat();

    cart=[];

    renderCart();

    document.getElementById("bayar").value="";

    document.getElementById("kembalian").innerHTML="Rp0";

    alert("Transaksi berhasil disimpan.");

}

// ==========================
// RIWAYAT
// ==========================

function tampilRiwayat(){

    let data=
    JSON.parse(localStorage.getItem("transaksi")) || [];

    let html="";

    data.reverse().forEach(trx=>{

        html+=`

        <div class="history-item">

        <b>${trx.nomor}</b><br>

        ${trx.tanggal} ${trx.jam}<br>

        Kasir : ${trx.kasir}<br>

        ${trx.metode}<br>

        Total : Rp${trx.total.toLocaleString("id-ID")}

        </div>

        `;

    });

    document.getElementById("history").innerHTML=html;

}

tampilRiwayat();

// ==========================
// TOTAL PEMBAYARAN
// ==========================

function totalPembayaran(){

    let data=
    JSON.parse(localStorage.getItem("transaksi")) || [];

    let cash=0;
    let qris=0;

    data.forEach(t=>{

        if(t.metode==="Tunai"){

            cash+=t.total;

        }else{

            qris+=t.total;

        }

    });

    return{

        cash,

        qris,

        total:cash+qris

    };


}

// ==========================
// HITUNG KEMBALIAN OTOMATIS
// ==========================

const inputBayar = document.getElementById("bayar");
const metodeBayar = document.getElementById("metode");

inputBayar.addEventListener("input", hitungKembalianOtomatis);
metodeBayar.addEventListener("change", hitungKembalianOtomatis);

function hitungKembalianOtomatis(){

    const total = getTotal();
    const metode = metodeBayar.value;

    // Jika belum ada transaksi
    if(total <= 0){
        document.getElementById("kembalian").innerHTML = "Rp0";
        return;
    }

    // QRIS
    if(metode === "QRIS"){

        inputBayar.value = total;

        document.getElementById("kembalian").innerHTML =
        `
        Total : Rp${total.toLocaleString("id-ID")}<br>
        Metode : QRIS<br>
        Kembalian : Rp0
        `;

        return;
    }

    // Tunai
    let bayar = Number(inputBayar.value);

    if(isNaN(bayar)) bayar = 0;

    const kembali = bayar - total;

    if(kembali < 0){

        document.getElementById("kembalian").innerHTML =
        `
        Total : Rp${total.toLocaleString("id-ID")}<br>
        Kurang : Rp${Math.abs(kembali).toLocaleString("id-ID")}
        `;

    }else{

        document.getElementById("kembalian").innerHTML =
        `
        Total : Rp${total.toLocaleString("id-ID")}<br>
        Bayar : Rp${bayar.toLocaleString("id-ID")}<br>
        Kembalian : Rp${kembali.toLocaleString("id-ID")}
        `;

    }

}

// ==========================
// LOCAL STORAGE TRANSAKSI
// ==========================

const STORAGE_KEY = "kopi_noto_transaksi";

// Ambil semua transaksi
function ambilTransaksi() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// Simpan semua transaksi
function simpanSemuaTransaksi(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Simpan satu transaksi
function simpanTransaksi() {

    if (cart.length === 0) {
        alert("Keranjang masih kosong.");
        return;
    }

    const transaksi = 
        id: "TRX" +

}
// ===============================
// RIWAYAT TRANSAKSI LENGKAP
// ===============================

function tampilRiwayat(keyword = "") {

    const history = document.getElementById("history");

    let data = JSON.parse(localStorage.getItem("kopi_noto_transaksi")) || [];

    if (keyword !== "") {
        keyword = keyword.toLowerCase();

        data = data.filter(trx =>
            trx.id.toLowerCase().includes(keyword) ||
            trx.kasir.toLowerCase().includes(keyword) ||
            trx.metode.toLowerCase().includes(keyword)
        );
    }

    if (data.length === 0) {
        history.innerHTML = `
        <div class="history-item">
        Belum ada transaksi.
        </div>`;
        return;
    }

    let html = "";

    data.slice().reverse().forEach((trx,index)=>{

        let daftarMenu = "";

        trx.menu.forEach(item=>{

            daftarMenu += `
            ${item.nama} x${item.qty}<br>
            `;

        });

        html += `

        <div class="history-item">

        <h3>${trx.id}</h3>

        <p>${trx.tanggal} ${trx.jam}</p>

        <p><b>Kasir :</b> ${trx.kasir}</p>

        <p><b>Pembayaran :</b> ${trx.metode}</p>

        <p><b>Total :</b>
        Rp${trx.total.toLocaleString("id-ID")}</p>

        <button onclick="lihatDetail(${index})">
        Detail
        </button>

        <button onclick="hapusTransaksi('${trx.id}')">
        Hapus
        </button>

        </div>

        `;

    });

    history.innerHTML = html;

}function lihatDetail(index){

    let data =
    JSON.parse(localStorage.getItem("kopi_noto_transaksi")) || [];

    data.reverse();

    const trx = data[index];

    let isi="";

    trx.menu.forEach(item=>{

        isi +=
        item.nama+
        " x"+
        item.qty+
        " = Rp"+
        (item.qty*item.harga).toLocaleString("id-ID")+
        "\n";

    });

    alert(

`Detail Transaksi

ID : ${trx.id}

Kasir : ${trx.kasir}

Tanggal : ${trx.tanggal}

Jam : ${trx.jam}

---------------------

${isi}

---------------------

Metode :
${trx.metode}

Bayar :
Rp${trx.bayar.toLocaleString("id-ID")}

Kembalian :
Rp${trx.kembalian.toLocaleString("id-ID")}

Total :
Rp${trx.total.toLocaleString("id-ID")}`

);

}function hapusTransaksi(id){

    if(!confirm("Hapus transaksi ini?"))
    return;

    let data =
    JSON.parse(localStorage.getItem("kopi_noto_transaksi")) || [];

    data = data.filter(trx=>trx.id!==id);

    localStorage.setItem(
        "kopi_noto_transaksi",
        JSON.stringify(data)
    );

    tampilRiwayat();

}function rekapHariIni(){

    let data =
    JSON.parse(localStorage.getItem("kopi_noto_transaksi")) || [];

    let cash=0;
    let qris=0;
    let total=0;

    data.forEach(trx=>{

        total+=trx.total;

        if(trx.metode==="Tunai")
            cash+=trx.total;
        else
            qris+=trx.total;

    });

    return{

        transaksi:data.length,

        cash:cash,

        qris:qris,

        total:total

    };

}// ==========================================
// LAPORAN TUTUP SHIFT
// ==========================================

function laporanTutup() {

    const transaksi = JSON.parse(localStorage.getItem("kopi_noto_transaksi")) || [];

    const kasir = localStorage.getItem("kasir") || "-";

    const tanggal = new Date().toLocaleDateString("id-ID");

    const modal = Number(document.getElementById("modal").value) || 0;

    const pemasukanLain =
        Number(document.getElementById("pemasukanLain").value) || 0;

    let pengeluaran = JSON.parse(localStorage.getItem("pengeluaran")) || [];

    let totalPengeluaran = 0;

    pengeluaran.forEach(item => {

        totalPengeluaran += item.nominal;

    });

    let totalCash = 0;
    let totalQRIS = 0;
    let totalCup = 0;
    let totalPenjualan = 0;

    let daftar = "";

    transaksi.forEach(trx => {

        totalPenjualan += trx.total;

        if (trx.metode == "Tunai")
            totalCash += trx.total;
        else
            totalQRIS += trx.total;

        trx.menu.forEach(menu => {

            totalCup += menu.qty;

            daftar +=
                menu.nama +
                " x" +
                menu.qty +
                "\n";

        });

    });

    let kasBersih =
        totalCash +
        totalQRIS +
        pemasukanLain -
        modal -
        totalPengeluaran;

    let laporan =

`${tanggal}

${kasir} Pulang

======================

Total Transaksi : ${transaksi.length}

Cup Terjual : ${totalCup}

======================

Menu Terjual

${daftar}

======================

Cash :
Rp${totalCash.toLocaleString("id-ID")}

QRIS :
Rp${totalQRIS.toLocaleString("id-ID")}

======================

Total Penjualan

Rp${totalPenjualan.toLocaleString("id-ID")}

======================

Modal

Rp${modal.toLocaleString("id-ID")}

Pemasukan Lain

Rp${pemasukanLain.toLocaleString("id-ID")}

Pengeluaran

Rp${totalPengeluaran.toLocaleString("id-ID")}

======================

Kas Bersih

Rp${kasBersih.toLocaleString("id-ID")}

======================

Status

COCOK
`;

    localStorage.setItem("laporanHariIni", laporan);

    alert(laporan);

}// ==========================================
// KIRIM KE WHATSAPP
// ==========================================

function kirimWA(){

    const laporan =
    localStorage.getItem("laporanHariIni");

    if(!laporan){

        alert("Belum ada laporan.");

        return;

    }

    const nomor =
    "6282343670585";

    window.open(

"https://wa.me/6282343670585"
"?text="+encodeURIComponent(laporan)

    );

}
