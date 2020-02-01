
var customerName = [];
var itemdetail= [];
var orderDetailsList = [];
$(function () {
    $("#txtId").focus();

    /////////////////load customer id to Dropdown box/////////////////////////////

    var ajaxConfig1 = {
        method:'GET',
        url:'http://localhost:8080/posweb/api/v1/custom',
        async:true,
        setRequestHeader:('Content-Type', 'application/json')
    };

    $.ajax(ajaxConfig1).done(function (custom,state,jqSHR) {
        for(var i=0;i<custom.length;i++){
            var data = '<option>'+custom[i].id+'</option>';
            customerName.push({id:custom[i].id,name:custom[i].name});
            $('#txtId').append(data);
        }
    }).fail(function (jqSHR,state,error) {
        console.log(error);
        alert("cannot load all customers to drop Down Box");
    });

   /* var http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            var tbldata = JSON.parse(http.responseText);
               console.log(tbldata);
            for(var i=0;i<tbldata.length;i++){
                var data = '<option>'+tbldata[i].id+'</option>';
                customerName.push({id:tbldata[i].id,name:tbldata[i].name});
                $('#txtId').append(data);
                }
            }
        };
    http.open('GET', 'http://localhost:8080/posweb/api/v1/custom', async = true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.send();*/


    ////////////////////////////load Item to Drop Down Box////////////////////////////////////

    var ajaxConfig2 = {
        method:'POST',
        url:'http://localhost:8080/posweb/api/v1/custom',
        async:true,
        setRequestHeader:('Content-Type', 'application/json')
    };

    $.ajax(ajaxConfig1).done(function (custom,state,jqSHR) {
        for(var l=0;l<custom.length;l++){
            var data = '<option>'+custom[l].code+'</option>';
            itemdetail.push({codeId:custom[l].code,discript:custom[l].description,qtyon:custom[l].qtyOnHand,unitp:custom[l].unitPrice});
            $('#txtCode').append(data);
        }
    }).fail(function (jqSHR,state,error) {
        console.log(error);
        alert("cannot load all items to drop Down Box");
    });


    /*var http1 = new XMLHttpRequest();

    http1.onreadystatechange = function () {
        if (http1.readyState == 4 && http1.status == 200) {
            var tbldata = JSON.parse(http1.responseText);

            for(var l=0;l<tbldata.length;l++){
                var data = '<option>'+tbldata[l].code+'</option>';
                itemdetail.push({codeId:tbldata[l].code,discript:tbldata[l].description,qtyon:tbldata[l].qtyOnHand,unitp:tbldata[l].unitPrice})
                $('#txtCode').append(data);
            }
        }
    };
    http1.open('POST', 'http://localhost:8080/posweb/api/v1/custom', async = true);
    http1.setRequestHeader('Content-Type', 'application/json');
    http1.send();*/


//////////////////////////////////// Delete From Table /////////////////////////////////////

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

       // if($('#txtQty').text() > $('#txtQtyOnHand').text){

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

        orderDetailsList.push({
            code: code,
            description: description,
            qtyOnHand: qty,
            unitPrice: unitprice
        });

        /*}
        else {
            alert("There is not This Much of Item to sell")
            $('#txtQty').addClass('invalid');
            $('#txtQty').focus();
        }*/

    });

$("#txtQty").keyup(function () {
    $("#txtQty").removeClass("invalid");
});

$('#txtId').mouseup(function () {
    var valueofId = $('#txtId').val();
    for(var i=0; i<customerName.length;i++){

        if(valueofId==customerName[i].id){
            $('#txtName').val(customerName[i].name);
        }
    }
});

$('#txtCode').mouseup(function () {
    var itemCode = $('#txtCode').val();
    for(var i=0; i<itemdetail.length;i++){
        if(itemCode==itemdetail[i].codeId){
           $('#txtDescription').val(itemdetail[i].discript);
           $('#txtQtyOnHand').val(itemdetail[i].qtyon);
           $('#txtUnitPrice').val(itemdetail[i].unitp);
        }
    }
});

function showOrHideFooter() {

    if ($("#tbl-placeorder tbody tr").length > 0) {
        $("#tbl-placeorder tfoot").hide();
    } else {
        $("#tbl-placeorder tfoot").show();
    }
}

$('#placeOrder').click(function () {
    var cusId = $("#txtId").val();

    var ajaxConfig = {
        method:'POST',
        url:'http://localhost:8080/posweb/api/v1/order'+'?&cusId='+cusId,
        async:true,
        setRequestHeader:("Content-Type", "application/json"),
        data:JSON.stringify(orderDetailsList)
    }

    $.ajax(ajaxConfig).done(function (order,state,jqSHR) {
        alert("Order Placed Successfully !");
        showOrHideFooter();
    }).fail(function (jqSHR,state,error) {
        console.log(error);
        alert("Cannot Place Order");
    });

    /*var http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            alert("Order Placed Successfully !")
        }
        showOrHideFooter();
    };

    http.open('POST', 'http://localhost:8080/posweb/api/v1/order'+'?&cusId='+cusId, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(JSON.stringify(orderDetailsList));*/
});