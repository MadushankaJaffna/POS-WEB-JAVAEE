$(function () {
    $("#txtId").focus();
    for(var i=0;i<customers.length;i++){
        var data = '<option>'+customers[i].id+'</option>';
        $('#txtId').append(data);
    }

    for(var l=0;l<item.length;l++){
        var data = '<option>'+item[l].code+'</option>';
        $('#txtCode').append(data);
    }

    $("#tbl-placeorder").on('click','tbody tr td i',function () {
        if (confirm("Do You Wish To Delete This OrderDetail..!")) {
            $(this).parents("tr").fadeOut(1000, function () {
               alert( (this).parents("tr").children("td").val());
                $(this).remove();
                showOrHideFooter();
            });
        }
    });
    showOrHideFooter();
});
    var netTotal=0;
    $('#submit').click(function () {
        var code = $('#txtCode').val();
        var description =$('#txtDescription').val();
        var qty =$('#txtQty').val();
        var unitprice=$('#txtUnitPrice').val();
        var total =$('#txtUnitPrice').val()*$('#txtQty').val();
        netTotal=netTotal+parseInt(total);
        var html = '<tr>'+
            '<td class="text-center">'+code+'</td>'+
            '<td>'+description+'</td>'+
            '<td>'+qty+'</td>'+
            '<td>'+unitprice+'</td>'+
            '<td><u>'+total+'</u></td>'+
            '<td><i class="fa fa-trash red"></i></td>'+
            '</tr>';
        $('#tbl-placeorder tbody').append(html);
        $("#total h5").remove();
        $('#total').append('<h5><b>'+netTotal+'</b></h5>');
        showOrHideFooter();
    });

$('#txtId').mouseup(function () {
    var valueofId = $('#txtId').val();
    for(var i=0; i<customers.length;i++){
        if(valueofId==customers[i].id){
            $('#txtName').val(customers[i].name);
        }
    }
});
$('#txtCode').mouseup(function () {
    var itemCode = $('#txtCode').val();
    for(var i=0; i<item.length;i++){
        if(itemCode==item[i].code){
           itemDesc= $('#txtDescription').val(item[i].description);
            $('#txtQtyOnHand').val(item[i].qty);
           unitPrice=$('#txtUnitPrice').val(item[i].unitPrice);

        }
    }
});

function showOrHideFooter() {
    console.log($("#tbl-placeorder tbody tr").length);
    if ($("#tbl-placeorder tbody tr").length > 0) {
        $("#tbl-placeorder tfoot").hide();
    } else {
        $("#tbl-placeorder tfoot").show();
    }
}

$('#placeOrder').click(function () {
    $('#tbl-placeorder tbody tr').remove();
    showOrHideFooter();
});