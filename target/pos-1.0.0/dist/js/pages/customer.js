$(function () {

    loadcustomer();
    $("#txtId").focus();
    $("#first").addClass('active');
});

var pagenumber=1;

function loadcustomer() {

    var http = new XMLHttpRequest();


    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {

            $("#tbl-customer tbody tr").remove();

            var tbldata = JSON.parse(http.responseText);

            for (var i = 0; i < tbldata.length; i++) {
                var html = '<tr class="mouseChange">' +
                    '<td>' + tbldata[i].id + '</td>' +
                    '<td>' + tbldata[i].name + '</td>' +
                    '<td>' + tbldata[i].address + '</td>' +
                    '<td>' +
                    '<i class="fa fa-trash red"></i>' +
                    '</td>' +
                    '</tr>';
                $("#tbl-customer tbody").append(html);
            }
            showOrHideFooter();
            var customerCount = http.getResponseHeader("X-Count");
            pagination(customerCount);
        }
    };
    http.open('GET', 'http://localhost:8080/posweb/api/v1/customers'+'?size='+5+'&page='+pagenumber, async = true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.send();

}

$("#btnSubmit").click(function () {
        var cusId = $("#txtId").val();
        var cusName = $("#txtName").val();
        var cusAddress = $("#txtCustomerAddress").val();

    if($("#btnSubmit").text()=="Save") {
        if (cusId.match("^C[0-9]+$") && cusName.match("^([A-Za-z]+[]?[A-Za-z]+)+$") && cusAddress.match("^[A-Za-z]+$")) {
            var customer = {
                            id: cusId,
                            name: cusName,
                            address: cusAddress
                            };
            loadcustomer();
            var http = new XMLHttpRequest();
            http.onreadystatechange = function () {
                if (http.readyState == 4&& http.status == 400) {

                }
            };
            http.open('POST', 'http://localhost:8080/posweb/api/v1/customers', async = true)
            http.send(JSON.stringify(customer));

        } else {
            if (!cusId.match("^C[0-9]+$")) {
                $("#txtId").addClass("invalid");
                $("#txtId").select();
            }
            if (!cusName.match("^[A-Za-z]+$")) {
                $("#txtName").addClass("invalid");
                $("#txtName").select();
            }
            if (!cusAddress.match("^[A-Za-z]+$")) {
                $("#txtCustomerAddress").addClass("invalid");
                $("#txtCustomerAddress").select();
            }
        }
    }
    else {
        if (cusName.match("^[A-Za-z]+$") && cusAddress.match("^[A-Za-z]+$")) {
            var customer = {
                id: cusId,
                name: cusName,
                address: cusAddress
            };
            var http = new XMLHttpRequest();
            http.onreadystatechange = function () {

            };
            http.open('PUT', 'http://localhost:8080/posweb/api/v1/customers', async = true)
            http.send(JSON.stringify(customer));
            loadcustomer();
        } else {
            if (!cusName.match("^[A-Za-z]+$")) {
                $("#txtName").addClass("invalid");
                $("#txtName").select();
            }
            if (!cusAddress.match("^[A-Za-z]+$")) {
                $("#txtCustomerAddress").addClass("invalid");
                $("#txtCustomerAddress").select();
            }
        }
        $("#btnSubmit").text("Save");
    }

    $("#txtId").val("");
    $("#txtName").val("");
    $("#txtCustomerAddress").val("");

});
$("#txtId,#txtName,#txtCustomerAddress").keyup(function () {
    $("#txtId,#txtName,#txtCustomerAddress").removeClass("invalid");
});
function showOrHideFooter(){
    if ($("#tbl-customer tbody tr").length > 0){
        $("#tbl-customer tfoot").hide();
    }else{
        $("#tbl-customer tfoot").show();
    }
}
$("#tbl-customer").on('click','tbody tr td i',function () {
        var http = new XMLHttpRequest();
        var cusId = {
            id: $(this).parents("tr").children("td:first-child").text()
        };
        if (confirm("Do You Wish To Delete This Customer..!")) {
            http.onreadystatechange = function () {
                if(http.readyState==4 && http.status==200){
                loadcustomer();
                    /*
                        $(this).parents("tr").fadeOut(1000, function () {
                            $(this).remove();
                    });*/
                    $("#txtId").val("");
                    $("#txtName").val("");
                    $("#txtCustomerAddress").val("");
                    $("#btnSubmit").text("Save");

                }else if(http.status==500&&http.readyState==2){
                    console.log(http.status);
                    console.log(http.readyState)
                    alert("Customer Already has an Order!")
                }
            };
            http.open('DELETE', 'http://localhost:8080/posweb/api/v1/customers', async = true);
            http.send(JSON.stringify(cusId));
        }
    });

$("#tbl-customer").on('click','tbody tr',function () {
    $("#txtId").val($(this).children('td:first-child').text());
    $("#txtId").readOnly=true;
    $("#txtName").val($(this).children('td:nth-child(2)').text());
    $("#txtCustomerAddress").val($(this).children('td:nth-child(3)').text());
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
    loadcustomer();
});
$("#middle").click(function () {
    $("#first").removeClass('active');
    $("#last").removeClass('active');
    $("#middle").addClass('active');
    pagenumber = $("#middle").text();
    loadcustomer();
});
$("#last").click(function () {
    $("#middle").removeClass('active');
    $("#first").removeClass('active');
    $("#last").addClass('active');
    pagenumber = $("#last").text();
    loadcustomer();
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



