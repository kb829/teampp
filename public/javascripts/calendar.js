var today = new Date();//오늘 날짜//내 컴퓨터 로컬을 기준으로 today에 Date 객체를 넣어줌
        var date = new Date();//today의 Date를 세어주는 역할
        function prevCalendar() {
         today = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
         buildCalendar(); //달력 cell 만들어 출력
        }
        function nextCalendar() {
             today = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
             buildCalendar();//달력 cell 만들어 출력
        }
        function buildCalendar(){//현재 달 달력 만들기
            var doMonth = new Date(today.getFullYear(),today.getMonth(),1);
            var lastDate = new Date(today.getFullYear(),today.getMonth()+1,0);
            var tbCalendar = document.getElementById("calendar");
            var tbCalendarYM = document.getElementById("tbCalendarYM");
             tbCalendarYM.innerHTML = today.getFullYear() + "년 " + (today.getMonth() + 1) + "월";
            while (tbCalendar.rows.length > 2) {
                  tbCalendar.deleteRow(tbCalendar.rows.length-1);
             }
             var row = null;
             row = tbCalendar.insertRow();
             var cnt = 0;// count, 셀의 갯수를 세어주는 역할
             for (i=0; i<doMonth.getDay(); i++) {
                  cell = row.insertCell();//열 한칸한칸 계속 만들어주는 역할
                  cnt = cnt + 1;//열의 갯수를 계속 다음으로 위치하게 해주는 역할
             }
            /*달력 출력*/
             for (i=1; i<=lastDate.getDate(); i++) {
                  cell = row.insertCell();//열 한칸한칸 계속 만들어주는 역할
                  cell.innerHTML ="<button style='width:40px;height:40px; font-size:20px;color: black; background-color:white; border: 1px solid transparent; border-radius: 4px;'>" + i;//셀을 1부터 마지막 day까지 HTML 문법에 넣어줌
                  cnt = cnt + 1;//열의 갯수를 계속 다음으로 위치하게 해주는 역할
              if (cnt % 7 == 1) {/*일요일 계산*/
                cell.innerHTML = "<button style='width:40px;height:40px; font-size:20px;color: red; background-color:white; border: 1px solid transparent; border-radius: 4px;'>" + i
              }
              if (cnt%7 == 0){/* 1주일이 7일 이므로 토요일 구하기*/
                  cell.innerHTML = "<button style='width:40px;height:40px; font-size:20px;color: skyblue; background-color:white; border: 1px solid transparent; border-radius: 4px;'>" + i
                   row = calendar.insertRow();
              }
              /*오늘의 날짜에 노란색 칠하기*/
              if (today.getFullYear() == date.getFullYear()
                 && today.getMonth() == date.getMonth()
                 && i == date.getDate()) {
                cell.bgColor = "#B666DB";//셀의 배경색을 노랑으로
               }
             }
            }
buildCalendar();