var query = "";
$(function () {

    loadOrders();
});


function loadOrders() {

    var ajaxConfig = {
        method:'GET',
        url:'http://localhost:8080/posweb/api/v1/search' + '?query=' + query,
        async :true
    };

    $.ajax(ajaxConfig).done(function (search,state,jqSHR) {
        $("#tbl-orders tbody tr").remove();
        for (var i = 0; i < search.length; i++) {
            var html = '<tr>' +
                '<td>' + search[i].oid + '</td>' +
                '<td>' + search[i].odate + '</td>' +
                '<td>' + search[i].cid + '</td>' +
                '<td>' + search[i].cname + '</td>' +
                '<td>' + search[i].total + '</td>' +
                '</tr>';
            $("#tbl-orders tbody").append(html);
        }
    }).fail(function (jqSHR,state,error) {
    console.log(error);
    });


   /* var http = new XMLHttpRequest();

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            $("#tbl-orders tbody tr").remove();
            var orders = JSON.parse(http.responseText);

            for (var i = 0; i < orders.length; i++) {
                var html = '<tr>' +
                    '<td>' + orders[i].oid + '</td>' +
                    '<td>' + orders[i].odate + '</td>' +
                    '<td>' + orders[i].cid + '</td>' +
                    '<td>' + orders[i].cname + '</td>' +
                    '<td>' + orders[i].total + '</td>' +
                    '</tr>';
                $("#tbl-orders tbody").append(html);
            }
        }
    };
    http.open('GET', 'http://localhost:8080/posweb/api/v1/search' + '?query=' + query, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send();*/
}

$("#txtSearch").keyup(function () {
    query = $("#txtSearch").val();
    loadOrders();
});