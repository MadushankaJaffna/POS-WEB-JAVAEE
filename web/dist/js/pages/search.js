$(function () {

    loadOrder();
    $("#tbl-orders").on('click','tbody tr td i',function () {
        if (confirm("Do You Wish To Delete This Order..!")) {
            $(this).parents("tr").fadeOut(1000, function () {
                $(this).remove();
            });
        }
    });

});
var sval;
function searchOrder() {
var test=true;
    for(var i=0;i < order.length;i++) {
        if (sval == order[i].ordrId || sval == order[i].customerId || sval == order[i].customersName) {
            $("#tbl-orders tbody tr").remove();
            var html = '<tr>' +
                '<td>' + order[i].ordrId + '</td>' +
                '<td>' + order[i].date + '</td>' +
                '<td>' + order[i].customerId + '</td>' +
                '<td>' + order[i].customersName + '</td>' +
                '<td>' + order[i].total + '</td>' +
                '<td>' +
                '<i class="fa fa-trash red"></i>' +
                '</td>' +
                '</tr>';
            $("#tbl-orders tbody").append(html);
        test=false;
        }
    }
    if(test){loadOrder()}
}
$('#txtSearch').keyup(function () {
    sval = $('#txtSearch').val();
    searchOrder();

});
function loadOrder() {
    $("#tbl-orders tbody tr").remove();
    for(var i=0;i < order.length;i++) {
            var html = '<tr>' +
                '<td>' + order[i].ordrId + '</td>' +
                '<td>' + order[i].date + '</td>' +
                '<td>' + order[i].customerId + '</td>' +
                '<td>' + order[i].customersName + '</td>' +
                '<td>' + order[i].total + '</td>' +
                '<td>' +
                '<i class="fa fa-trash red"></i>' +
                '</td>' +
                '</tr>';
            $("#tbl-orders tbody").append(html);
        }
}