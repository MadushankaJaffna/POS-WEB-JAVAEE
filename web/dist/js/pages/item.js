$(function () {

    loadItem();
    $("#tbl-items").on('click','tbody tr td i',function () {
        if(confirm("Do You Wish To Delete This Item..!")){
            $(this).parents("tr").fadeOut(1000, function(){
                $(this).remove();
                showOrHideFooter();
            });
        }
    });
    showOrHideFooter();
});

function loadItem() {

    $("#tbl-items tbody tr").remove();
    for(var i=0;i < item.length;i++){
        var html = '<tr>'+
            '<td>'+item[i].code+'</td>'+
            '<td>'+item[i].description+'</td>'+
            '<td>'+item[i].qty+'</td>'+
            '<td>'+item[i].unitPrice+'</td>'+
            '<td>'+
            '<i class="fa fa-trash red"></i>'+
            '</td>'+
            '</tr>'
        $("#tbl-items tbody").append(html);
    }
}
$("#btn_submit").click(function () {
    var itemCode= $("#txtId").val();
    var itemDescription=$("#txtName").val();
    var qtyonHand = $("#txtQtyOnHand").val();
    var unitPrice = $("#txtUnitPrice").val();

    if(itemCode.match("^I[0-9]+$") && itemDescription.match("^[A-Za-z]+$") && qtyonHand.match("^[0-9]+$") && unitPrice.match("^[0-9]+$")) {

        var html = '<tr>'+
            '<td>'+itemCode+'</td>'+
            '<td>'+itemDescription+'</td>'+
            '<td>'+qtyonHand+'</td>'+
            '<td>'+unitPrice+'</td>'+
            '<td>'+
            '<i class="fa fa-trash red"></i>'+
            '</td>'+
            '</tr>'
        $("#tbl-items tbody").append(html);
    }
    else{
        if(!itemCode.match("^I[0-9]+$")){
            $("#txtId").addClass("invalid");
            $("#txtId").select();
        }
        if(!itemDescription.match("^[A-Za-z]+$")){
            $("#txtName").addClass("invalid");
            $("#txtName").select();
        }
        if(!qtyonHand.match("^[0-9]+$")){
            $("#txtQtyOnHand").addClass("invalid");
            $("#txtQtyOnHand").select();
        }
        if(!unitPrice.match("^[0-9]+$")){
            $("#txtUnitPrice").addClass("invalid");
            $("#txtUnitPrice").select();
        }
    }
    showOrHideFooter();
});


$("#txtId,#txtName,#txtQtyOnHand,#txtUnitPrice").keyup(function () {
    $("#txtId,#txtName,#txtQtyOnHand,#txtUnitPrice").removeClass("invalid");
});

function showOrHideFooter() {
    if ($("#tbl-items tbody tr").length > 0) {
        $("#tbl-items tfoot").hide();
    } else {
        $("#tbl-items tfoot").show();
    }
}