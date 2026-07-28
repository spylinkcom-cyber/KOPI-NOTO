let produk = [
    {nama:"Kopi Es", harga:15000, stok:30},
    {nama:"Americano", harga:15000, stok:2},
    {nama:"Lemon Tea", harga:13000, stok:1},
    {nama:"Lychee Tea", harga:13000, stok:1}
];

let riwayat = JSON.parse(localStorage.getItem("riwayat")) || [];
let totalUang = Number(localStorage.getItem("uang")) || 0;
let totalGelas = Number(localStorage.getItem("gelas")) || 0;

function simpan(){
    localStorage.setItem("riwayat", JSON.stringify(riwayat));
    localStorage.setItem("uang", totalUang);
    localStorage.setItem("gelas", totalGelas);
}

function tampilDashboard(){
    document.getElementById("uang").innerHTML =
        "Rp" + totalUang.toLocaleString("id-ID");

    document.getElementById("gelas").innerHTML = totalGelas;
}

function tampilStok(){

    let html = `
    <tr>
        <th>Menu</th>
        <th>Ready</th>
    </tr>`;

    produk.forEach(p=>{

        html += `
        <tr>
            <td>${p.nama}</td>
            <td class="${p.stok<=5 ? 'red':'green'}">${p.stok}</td>
        </tr>`;
    });

    document.getElementById("stok").innerHTML = html;
}

function tampilRiwayat(){

    let html = "";

    riwayat.forEach(r=>{

        html += `
        <tr>
            <td>${r.jam}</td>
            <td>${r.menu}</td>
            <td>${r.qty}</td>
            <td>Rp${r.total.toLocaleString("id-ID")}</td>
        </tr>`;
    });

    document.getElementById("history").innerHTML = html;
}

function jual(){

    let id = document.getElementById("menu").value;
    let qty = parseInt(document.getElementById("qty").value);

    if(qty <= 0) return;

    if(qty > produk[id].stok){

        alert("Stok Ready Habis atau Tidak Mencukupi");
        return;
    }

    produk[id].stok -= qty;

    let total = produk[id].harga * qty;

    totalUang += total;
    totalGelas += qty;

    let sekarang = new Date();

    riwayat.unshift({
        jam: sekarang.toLocaleTimeString("id-ID"),
        menu: produk[id].nama,
        qty: qty,
        total: total
    });

    simpan();

    tampilDashboard();
    tampilStok();
    tampilRiwayat();

    alert("Transaksi Berhasil");
}

function resetRiwayat(){

    if(confirm("Reset semua riwayat?")){

        riwayat = [];
        totalUang = 0;
        totalGelas = 0;

        simpan();

        tampilDashboard();
        tampilRiwayat();
    }
}

tampilDashboard();
tampilStok();
tampilRiwayat();
