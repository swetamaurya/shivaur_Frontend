import {attendance_API} from './apis.js'

const token = localStorage.getItem('token');
async function all_data_load_dashboard(){
    const attendanceTableBody = document.getElementById('attendanceTableBody');
    let x;
    try{
        const response = await fetch(`${attendance_API}/today`,{
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type':'application/json'
            }
        });
        
        let res = await response.json();
        console.log(res);
        let thData = document.getElementById('dateData').cells
        res.attendanceStatus.map((e,index)=>{
            let date = e.date.split('-')[2];
            let row = `<tr><td>${e.name}</td>`
            for(var i=1; i<thData.length; i++){
                if(thData[i].innerText == date){
                    if(e.status === "Absent"){
                        row+='<td>X</td>'
                    }
                    else{
                  row+=`<td class="text-center">${date}</td>`
                    }
                }
                else if(Number(thData[i].innerText) > Number(date)){
                    continue
                }
                else{
                    row+='<td>X</td>';
                }
            }
            row+='</tr>'
            attendanceTableBody.innerHTML += row;
        })
    }
    catch(error){
        console.log(error);
    }
}
document.addEventListener("DOMContentLoaded", all_data_load_dashboard);