$(function () {

 loadcustomer();
    $("#txtId").focus();
    $("#tbl-customer").on('click','tbody tr td i',function () {
        if (confirm("Do You Wish To Delete This Customer..!")) {
            $(this).parents("tr").fadeOut(1000, function () {
                $(this).remove();
                showOrHideFooter();
            });
        }
    });
    showOrHideFooter();
});

var customers = [];
function loadcustomer() {

    var http = new XMLHttpRequest();

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {

            $("#tbl-customer tbody tr").remove();

            var tbldata = JSON.parse(http.responseText);

            for (var i = 0; i < tbldata.length; i++) {
                var html = '<tr>' +
                    '<td>' + tbldata[i].id + '</td>' +
                    '<td>' + tbldata[i].name + '</td>' +
                    '<td>' + tbldata[i].address + '</td>' +
                    '<td>' +
                    '<i class="fa fa-trash red"></i>' +
                    '</td>' +
                    '</tr>';
                $("#tbl-customer tbody").append(html);
            }
        }
    };
    http.open('GET', 'http://localhost:8080/posweb/api/v1/customers', async = true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.setHeaderValue({'size': 5, 'page': 1})
    http.send();

}
    $("#btnSubmit").click(function () {
        var cusId = $("#txtId").val();
        var cusName = $("#txtName").val();
        var cusAddress = $("#txtCustomerAddress").val();

        if (cusId.match("^C[0-9]+$") && cusName.match("^[A-Za-z]+$") && cusAddress.match("^[A-Za-z]+$")) {
            var html = '<tr>' +
                '<td>' + cusId + '</td>' +
                '<td>' + cusName + '</td>' +
                '<td>' + cusAddress + '</td>' +
                '<td>' +
                '<i class="fa fa-trash red"></i>' +
                '</td>' +
                '</tr>';
            $("#tbl-customer tbody").append(html);
            showOrHideFooter();
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

    });


$("#txtId,#txtName,#txtCustomerAddress").keyup(function () {
    $("#txtId,#txtName,#txtCustomerAddress").removeClass("invalid");
});

function showOrHideFooter(){
    console.log($("#tbl-customer tbody tr").length);
    if ($("#tbl-customer tbody tr").length > 0){
        $("#tbl-customer tfoot").hide();
    }else{
        $("#tbl-customer tfoot").show();
    }
}

