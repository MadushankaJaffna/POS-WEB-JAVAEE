$(function () {

    loadItem();
    $("#txtId").focus();
    $("#first").addClass('active');

});
var pagenumber=1;
function loadItem() {

    var ajaxConfig = {
        method:'GET',
        url:'http://localhost:8080/posweb/api/v1/items'+'?size='+5+'&page='+pagenumber,
        async:true,
        setRequestHeader:('Content-Type', 'application/json')
    };
    $.ajax(ajaxConfig).done(function (items,state,jqSHR) {
        $("#tbl-items tbody tr").remove();

        for (var i = 0; i < items.length; i++) {
            var html = '<tr class="mouseChange">' +
                '<td>' + items[i].code + '</td>' +
                '<td>' + items[i].description + '</td>' +
                '<td>' + items[i].qtyOnHand + '</td>' +
                '<td>' + items[i].unitPrice + '</td>' +
                '<td>' +
                '<i class="fa fa-trash red"></i>' +
                '</td>' +
                '</tr>';
            $("#tbl-items tbody").append(html);
        }
        showOrHideFooter();
        var itemCount = jqSHR.getResponseHeader("X-Count");
        pagination(itemCount);

    }).fail(function (jqSHR,state,error) {
        console.log(error);
    });


    /*var http = new XMLHttpRequest();

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            $("#tbl-items tbody tr").remove();

            var tbldata = JSON.parse(http.responseText);

            console.log(tbldata.length);
            for (var i = 0; i < tbldata.length; i++) {
                var html = '<tr class="mouseChange">' +
                    '<td>' + tbldata[i].code + '</td>' +
                    '<td>' + tbldata[i].description + '</td>' +
                    '<td>' + tbldata[i].qtyOnHand + '</td>' +
                    '<td>' + tbldata[i].unitPrice + '</td>' +
                    '<td>' +
                    '<i class="fa fa-trash red"></i>' +
                    '</td>' +
                    '</tr>';
                $("#tbl-items tbody").append(html);
            }
            showOrHideFooter();
            var itemCount = http.getResponseHeader("X-Count");
            pagination(itemCount);
        }
    };
    http.open('GET', 'http://localhost:8080/posweb/api/v1/items'+'?size='+5+'&page='+pagenumber, async = true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.send();*/

}
$("#btnSubmit").click(function () {
    var itemCode= $("#txtId").val();
    var itemDescription=$("#txtName").val();
    var qtyonHand = $("#txtQtyOnHand").val();
    var unitPrice = $("#txtUnitPrice").val();


    if($("#btnSubmit").text()=="Save") {

        if (itemCode.match("^I[0-9]+$") && itemDescription.match("^[A-Za-z]+$") && qtyonHand.match("^[0-9]+$") && unitPrice.match("^[0-9]+[.]?[0-9]+$")) {

            var item = {
                code: itemCode,
                description: itemDescription,
                qtyOnHand: qtyonHand,
                unitPrice: unitPrice
            };

            var ajaxConfig = {
                method:'POST',
                url:'http://localhost:8080/posweb/api/v1/items',
                async:true,
                data:JSON.stringify(item)
            };

            $.ajax(ajaxConfig).done(function (item,state,jqSHR) {
                loadItem();
            }).fail(function (jqSHR,state,error) {
                console.log(error);
                alert("Can not save item please try again");
            });

           /* var http = new XMLHttpRequest();

            http.onreadystatechange = function () {
                if (http.readyState == 4 && http.status == 200) {
                    loadItem();
                }

            };
            http.open('POST', 'http://localhost:8080/posweb/api/v1/items', async = true);
            http.send(JSON.stringify(item));*/


        } else {
            if (!itemCode.match("^I[0-9]+$")) {
                $("#txtId").addClass("invalid");
                $("#btnSubmit").text("Save");
            }
            if (!itemDescription.match("^[A-Za-z]+$")) {
                $("#txtName").addClass("invalid");
                $("#txtName").select();
            }
            if (!qtyonHand.match("^[0-9]+$")) {
                $("#txtQtyOnHand").addClass("invalid");
                $("#txtQtyOnHand").select();
            }
            if (!unitPrice.match("^[0-9]+[.]?[0-9]+$")) {
                $("#txtUnitPrice").addClass("invalid");
                $("#txtUnitPrice").select();
            }
        }
    }
    else{
        if (itemDescription.match("^[A-Za-z]+$") && qtyonHand.match("^[0-9]+$") && unitPrice.match("^[0-9]+[.]?[0-9]+")) {

            var item = {
                code: itemCode,
                description: itemDescription,
                qtyOnHand: qtyonHand,
                unitPrice: unitPrice
            };

            var ajaxConfig = {
                method:'PUT',
                url:'http://localhost:8080/posweb/api/v1/items',
                async:true,
                data:JSON.stringify(item)
            };

            $.ajax(ajaxConfig).done(function (item,state,jqSHR) {
                loadItem();
            }).fail(function (jqSHR,state,error) {
                console.log(error);
                alert("Cannot update Item Please Try again")
            });

           /* var http = new XMLHttpRequest();

            http.onreadystatechange = function () {
                if (http.readyState == 4 && http.status == 200) {
                    loadItem();
                }
            };

            http.open('PUT', 'http://localhost:8080/posweb/api/v1/items', async = true)
            http.send(JSON.stringify(item));*/


        } else{
            if (!itemDescription.match("^[A-Za-z]+$")) {
                $("#txtName").addClass("invalid");
                $("#txtName").select();
            }
            if (!qtyonHand.match("^[0-9]+$")) {
                $("#txtQtyOnHand").addClass("invalid");
                $("#txtQtyOnHand").select();
            }
            if (!unitPrice.match("^[0-9]+[.]?[0-9]+")) {
                $("#txtUnitPrice").addClass("invalid");
                $("#txtUnitPrice").select();
            }

        }
        $("#btnSubmit").text("Save");
    }
    $("#txtId").val("");
    $("#txtName").val("");
    $("#txtQtyOnHand").val("");
    $("#txtUnitPrice").val("");

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

$("#tbl-items").on('click','tbody tr td i',function () {

    var itemId = {
        id: $(this).parents("tr").children("td:first-child").text()
    };
    var ajaxConfig = {
        method:'DELETE',
        url:'http://localhost:8080/posweb/api/v1/items',
        async:true,
        data:JSON.stringify(itemId)
    };


    //var http = new XMLHttpRequest();
    if(confirm("Do You Wish To Delete This Item..!")){


        $.ajax(ajaxConfig).done(function (items,state,jqSHR) {
            loadItem();
            $("#txtId").val("");
            $("#txtName").val("");
            $("#txtQtyOnHand").val("");
            $("#txtUnitPrice").val("");
            $("#btnSubmit").text("Save");

        }).fail(function (jqSHR,state,error) {
            console.log(error);
            alert("Can not delete item please try again");
        });

        /*http.onreadystatechange = function () {
            if (http.readyState == 4 && http.status == 200) {
                loadItem();
                /!*$(this).parents("tr").fadeOut(1000, function(){
                    $(this).remove();

                });*!/
                $("#txtId").val("");
                $("#txtName").val("");
                $("#txtQtyOnHand").val("");
                $("#txtUnitPrice").val("");
                $("#btnSubmit").text("Save");

             }
        };
        http.open('DELETE', 'http://localhost:8080/posweb/api/v1/items', async = true);
        http.send(JSON.stringify(itemId));*/
    }
});

$("#tbl-items").on('click','tbody tr',function () {
    $("#txtId").val($(this).children('td:first-child').text());
    $("#txtId").readOnly=true;
    $("#txtName").val($(this).children('td:nth-child(2)').text());
    $("#txtQtyOnHand").val($(this).children('td:nth-child(3)').text());
    $("#txtUnitPrice").val($(this).children('td:nth-child(4)').text());

    $("#btnSubmit").text("Update");
});


$("#btnClear").click(function () {
    $("#btnSubmit").text("Save");
    $("#txtId").readOnly=false;
});


//pagination code start

$("#first").click(function () {
    $("#middle").removeClass('active');
    $("#last").removeClass('active');
    $("#first").addClass('active');
    pagenumber = $("#first").text();
    loadItem();

});
$("#middle").click(function () {
    $("#first").removeClass('active');
    $("#last").removeClass('active');
    $("#middle").addClass('active');
    pagenumber = $("#middle").text();
    loadItem();


});
$("#last").click(function () {
    $("#middle").removeClass('active');
    $("#first").removeClass('active');
    $("#last").addClass('active');
    pagenumber = $("#last").text();
    loadItem();


});
function pagination(number) {
    let pages = Math.ceil((number) / 5);
    if(number==0){
        $("#first").hide();
        $("#middle").hide();
        $("#last").hide();
    }

    else if(pages == 1){
        $("#first").show();
        $("#middle").hide();
        $("#last").hide();
    }
    else if (pages == 2){
        $("#first").show();
        $("#middle").show();
        $("#last").hide();
    }


    $("#backword").click(function () {
        var bval = $("#first").text();
        if(bval>3) {

            $("#first").show();
            $("#middle").show();
            $("#last").show();

            $("#first").text(parseInt(bval) - 3);
            $("#middle").text(parseInt(bval) - 2);
            $("#last").text(parseInt(bval) - 1);

            $("#first").removeClass('active');
            $("#middle").removeClass('active');
            $("#last").removeClass('active');

            jQuery=parseInt(bval) - 3;
            jQuery1=parseInt(bval) - 2;
            jQuery2=parseInt(bval) - 1;


            if(pagenumber==jQuery){
                $("#first").addClass('active');
            }
            if(pagenumber==jQuery1){
                $("#middle").addClass('active');
            }
            if(pagenumber==jQuery2){
                $("#last").addClass('active');
            }
        }
    });

    $("#forword").click(function () {
        var fval = $("#last").text();
        if(fval<pages)
        {
            if(pages-fval>=3) {
                $("#first").text(parseInt(fval) + 1);
                $("#middle").text(parseInt(fval) + 2);
                $("#last").text(parseInt(fval) + 3);
            }
            else if(pages-fval==2){
                $("#first").text(parseInt(fval) + 1);
                $("#middle").text(parseInt(fval) + 2);
                $("#last").hide();
            }
            else if(pages-fval==1){
                $("#first").text(parseInt(fval) + 1);
                $("#middle").hide();
                $("#last").hide();
            }

            $("#first").removeClass('active');
            $("#middle").removeClass('active');
            $("#last").removeClass('active');

            var jQuery3 =parseInt(fval) + 1;
            var jQuery4 =parseInt(fval) + 2;
            var jQuery5 =parseInt(fval) + 3;

            if(pagenumber==jQuery3){
                $("#first").addClass('active');
            }
            if(pagenumber==jQuery4){
                $("#middle").addClass('active');
            }
            if(pagenumber==jQuery5){
                $("#last").addClass('active');
            }
        }
    });
}