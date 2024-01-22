const sreenHeight = window.screen.height;

$(".right-content2").height(sreenHeight - 310);

function getYearBasedOnMonth() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더합니다

  // 1월부터 3월까지는 작년 년도를 반환
  if (currentMonth >= 1 && currentMonth <= 3) {
    return currentYear - 1;
  } else {
    // 4월부터 12월까지는 현재 년도를 반환
    return currentYear;
  }
}

function numberWithCommas(number) {
  return (number + "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var cust_list = null;

getCust();
function getCust() {
  $("#cust_cd").empty();
  var option = $("<option></option>");
  $("#cust_cd").append(option);

  //get data
  var dataPost = {};
  dataPost.type = "get_cust";
  dataPost.menucode = "M000000871";
  dataPost.UID = nvl($("#UID").val(), "");
  $.ajax({
    type: "POST",
    url: "/ajax.do",
    dataType: "json",
    data: dataPost,
    success: function (response, status, request) {
      if (status === "success") {
        if (response.status == 200) {
          cust_list = response.data;
          for (var i = 0; i < response.data.length; i++) {
            var item = response.data[i];
            var optionValue = item["cust_cd"];
            var optionText = item["cust_name"];

            var option = $(
              "<option value=" + optionValue + ">" + optionText + "</option>"
            );
            $("#cust_cd").append(option);
          }

          $("#cust_cd").select2();
          callData();
        }
      }
    },
    error: function (xmlHttpRequest, txtStatus, errorThrown) {},
  });
}

var last_date = new Date();

function refreshScreen() {
  var cur_date = new Date();

  var diff = Math.floor((cur_date - last_date) / 1000);
  var min = Math.floor((300 - diff) / 60);
  var sec = (300 - diff) % 60;
  $("#refresh_time").text(min + ":" + sec.toString().padStart(2, "0"));

  // 년, 월, 일, 요일 정보를 추출합니다.
  var year = last_date.getFullYear();
  var month = last_date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더합니다.
  var day = last_date.getDate();
  var dayOfWeek = last_date.toLocaleDateString("ko-KR", { weekday: "long" });

  // 포맷에 맞게 문자열을 구성합니다.
  var formattedDate =
    "기준일 : " + year + "년 " + month + "월 " + day + "일 (" + dayOfWeek + ")";

  $("#cur_date").text(formattedDate);

  if (diff >= 300) {
    last_date = cur_date;
    callData();
  }
}

setInterval(refreshScreen, 1000);

$("#search").on("click", function () {
  last_date = new Date();
  callData();
});

function callData() {
  if ($("#LOADYN").val() == "Y") {
    $.isLoading({
      tpl: '<span class="isloading-wrapper %wrapper%"><div class="loadingio-spinner-ellipsis-bus78131cg"><div class="ldio-8a4hfl22cb6"><div></div><div></div><div></div><div></div><div></div></div></div></span>',
    });
  }

  //get data
  var dataPost = {};
  dataPost.type = "get_data";
  dataPost.menucode = "M000000871";
  dataPost.UID = nvl($("#UID").val(), "");
  dataPost.cust_cd = $("#cust_cd").val();
  dataPost.year = getYearBasedOnMonth();
  dataPost.search_type = $("#search_type").val();

  $.ajax({
    type: "POST",
    url: "/ajax.do",
    dataType: "json",
    data: dataPost,
    success: function (response, status, request) {
      if (status === "success") {
        if (response.status == 200) {
          $("#diff_title").text(
            "[ " + getYearBasedOnMonth() + "년 발주대비 입고현황 ]"
          );

          $("#last_notice").text("최종등록일 : " + response.last_notice);
          $("#last_po").text("최종발주등록일 : " + response.last_po);
          $("#last_remain").text("최종발주등록일 : " + response.last_remain);

          notice_list = response.notice_list;
          po_list = response.po_list;
          remain_list = response.remain_list;
          diff_list = response.diff_list;

          $("#delv_plan_qty").text(
            response.delv_plan_qty == 0
              ? ""
              : numberWithCommas(response.delv_plan_qty)
          );
          $("#delv_plan_amount").text(
            response.delv_plan_amount == 0
              ? ""
              : numberWithCommas(response.delv_plan_amount)
          );

          $("#delv_qty").text(
            response.delv_qty == 0 ? "" : numberWithCommas(response.delv_qty)
          );
          $("#delv_amount").text(
            response.delv_amount == 0
              ? ""
              : numberWithCommas(response.delv_amount)
          );

          $("#delv_remain_qty").text(
            response.delv_remain_qty == 0
              ? ""
              : numberWithCommas(response.delv_remain_qty)
          );
          $("#delv_remain_amount").text(
            response.delv_remain_amount == 0
              ? ""
              : numberWithCommas(response.delv_remain_amount)
          );

          plan_list = response.plan_list;
          delv_list = response.delv_list;
          delv_remain_list = response.delv_remain_list;

          for (var i = 0; i < 10; i++) {
            if (i >= notice_list.length) {
              $("#notice_date" + i).text("");
              $("#notice_title" + i).text("");
            } else {
              var item = notice_list[i];

              $("#notice_date" + i).text(item.notice_date);
              $("#notice_title" + i).text(item.title);
            }
          }

          for (var i = 0; i < 10; i++) {
            if (i >= po_list.length) {
              $("#po_dday" + i).text("");
              $("#po_createdate" + i).text("");
              $("#po_delv_req_date" + i).text("");
              $("#po_item_no" + i).text("");
              $("#po_item_name" + i).text("");
              $("#po_po_qty" + i).text("");
            } else {
              var item = po_list[i];

              $("#po_dday" + i).text(item.po_dday);
              $("#po_createdate" + i).text(item.po_createdate);
              $("#po_delv_req_date" + i).text(item.delv_req_date);
              $("#po_item_no" + i).text(item.item_no);
              $("#po_item_name" + i).text(item.item_name);
              $("#po_po_qty" + i).text(
                item.po_po_qty == 0 ? "" : numberWithCommas(item.po_po_qty)
              );
            }
          }

          for (var i = 0; i < 10; i++) {
            if (i >= remain_list.length) {
              $("#remain_dday" + i).text("");
              $("#remain_item_no" + i).text("");
              $("#remain_item_name" + i).text("");
              $("#remain_po_qty" + i).text("");
              $("#remain_delv_qty" + i).text("");
              $("#remain_remain_qty" + i).text("");
            } else {
              var item = remain_list[i];

              $("#remain_dday" + i).text(item.remain_dday);
              $("#remain_item_no" + i).text(item.item_no);
              $("#remain_item_name" + i).text(item.item_name);
              $("#remain_po_qty" + i).text(
                item.remain_po_qty == 0
                  ? ""
                  : numberWithCommas(item.remain_po_qty)
              );
              $("#remain_delv_qty" + i).text(
                item.remain_delv_qty == 0
                  ? ""
                  : numberWithCommas(item.remain_delv_qty)
              );
              $("#remain_remain_qty" + i).text(
                item.remain_remain_qty == 0
                  ? ""
                  : numberWithCommas(item.remain_remain_qty)
              );
            }
          }

          for (var i = 0; i < 3; i++) {
            if (i >= remain_list.length) {
              $("#m04" + i).text("");
              $("#m05" + i).text("");
              $("#m06" + i).text("");
              $("#m07" + i).text("");
              $("#m08" + i).text("");
              $("#m09" + i).text("");
              $("#m10" + i).text("");
              $("#m11" + i).text("");
              $("#m12" + i).text("");
              $("#m01" + i).text("");
              $("#m02" + i).text("");
              $("#m03" + i).text("");
              $("#msum" + i).text("");
            } else {
              var item = remain_list[i];

              $("#m04" + i).text(
                item.m04 == 0 ? "" : numberWithCommas(item.m04)
              );
              $("#m05" + i).text(
                item.m05 == 0 ? "" : numberWithCommas(item.m05)
              );
              $("#m06" + i).text(
                item.m06 == 0 ? "" : numberWithCommas(item.m06)
              );
              $("#m07" + i).text(
                item.m07 == 0 ? "" : numberWithCommas(item.m07)
              );
              $("#m08" + i).text(
                item.m08 == 0 ? "" : numberWithCommas(item.m08)
              );
              $("#m09" + i).text(
                item.m09 == 0 ? "" : numberWithCommas(item.m09)
              );
              $("#m10" + i).text(
                item.m10 == 0 ? "" : numberWithCommas(item.m10)
              );
              $("#m11" + i).text(
                item.m11 == 0 ? "" : numberWithCommas(item.m11)
              );
              $("#m12" + i).text(
                item.m12 == 0 ? "" : numberWithCommas(item.m12)
              );
              $("#m01" + i).text(
                item.m01 == 0 ? "" : numberWithCommas(item.m01)
              );
              $("#m02" + i).text(
                item.m02 == 0 ? "" : numberWithCommas(item.m02)
              );
              $("#m03" + i).text(
                item.m03 == 0 ? "" : numberWithCommas(item.m03)
              );
              $("#msum" + i).text(
                item.msum == 0 ? "" : numberWithCommas(item.msum)
              );
            }
          }
        }
      }

      if ($("#LOADYN").val() == "Y") {
        $.isLoading("hide");
      }
    },
    error: function (xmlHttpRequest, txtStatus, errorThrown) {
      if ($("#LOADYN").val() == "Y") {
        $.isLoading("hide");
      }
    },
  });
}
