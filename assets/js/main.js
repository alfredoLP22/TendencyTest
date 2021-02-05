const $loader = document.querySelector(".loader"),
$form = document.getElementById("addOrder"),
$bodyTable = document.getElementById("body-content");

let $detailContent = document.getElementById("detail-content"),
$number_order = document.getElementById("number_order");

let data = [];
let IdOrder = 0;
let numberOrder = 0;
const refreshTable = () =>{
    $bodyTable.innerHTML ='';
    for(let valor of data){
        $bodyTable.innerHTML += `
            <tr>
                <td>${valor.number}</td>
                <td><a href='#' data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="getDetail(${valor.id})">View details</a></td>
                <td><a href='#' class="btn btn-success"  onclick="payOrder(${valor.id})">Pay</a></td>
            </tr>
        `
    }
}
const getData = ()=>{
    fetch('https://eshop-deve.herokuapp.com/api/v2/orders',{
        headers: {"Authorization":"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwUGFINU55VXRxTUkzMDZtajdZVHdHV3JIZE81cWxmaCIsImlhdCI6MTYwNTY0NDA0NzA1OH0.skfIY_7CAANkxmhoq37OI4jYRE8flx1ENq1v1VaRevJiroYNFQYz7Oy6hL1YZ1OJkevXSQFuLMHTqY0w6d5nPQ"}
    })
    .then((response) =>(response.ok ? response.json() : Promise.reject(response) ))
    .then((json) =>{
        data = json.orders;
        refreshTable();
        IdOrder = data[data.length - 1].id + 1;
        numberOrder = data[data.length - 1].number + 1;
    })
    .catch(err=>{
        console.error(err);
    })
}
const getDetail = (id) =>{
    $detailContent.innerHTML ='';
    let order = data.find(x=>x.id == id)
        $number_order.innerHTML = `# Order: ${order.number}`;
           $detailContent.innerHTML =` <tr>
                    <td>${order.items[0].sku}</td>
                    <td>${order.items[0].name}</td>
                    <td>${order.items[0].quantity}</td>
                    <td>${order.items[0].price}</td>
             </tr>`;
}
const payOrder = (id) =>{
    let index = data.findIndex(x=>x.id == id);
    data.splice(index,1);
    refreshTable();
    Swal.fire('Tanks for your buy!')
}
//document.addEventListener("click",getDetail);
document.addEventListener("DOMContentLoaded",getData);
$form.addEventListener("submit",e=>{
    e.preventDefault();
    const formData = new FormData(e.target);
    let order = {
        id:IdOrder++,
        number:numberOrder++,
        items:[{
            sku:formData.get("SKU"),
            name:formData.get("Name"),
            quantity: formData.get("Quantity"),
            price:formData.get("Price")
        }]
    }
    data.push(order);
    refreshTable();
});