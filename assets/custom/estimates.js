const token = localStorage.getItem("token");
    // get API for Estimate start

    var res;
    window.onload = async () => {
        var tableData = document.getElementById('tableData');
        const status = 'pending';
        const url = 'http://localhost:3000/estimates/get';
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        res = await response.json();
        console.log(res);
        var x = '';
        for (var i = 0; i < res.length; i++) {
            var e = res[i]
            x += `<tr data-id="${e._id}">
            <td>${i + 1}</td><td>${e.estimatesId}</td><td>${e.client}</td><td>${e.estimateDate}</td><td>${e.expiryDate}</td><td>${e.GrandTotal}</td><td>${status}
            <td class="text-end">
                      <div class="dropdown dropdown-action">
                        <a href="#" class="action-icon dropdown-toggle" data-bs-toggle="dropdown"
                          aria-expanded="false"><i class="material-icons">more_vert</i></a>
                        <div class="dropdown-menu dropdown-menu-right">
                          <a class="dropdown-item" href="edit-estimate.html?id=${e._id}"><i class="fa-solid fa-pencil m-r-5"></i>
                            Edit</a>
                          <a class="dropdown-item" href="estimate-view.html?id=${e._id}"><i class="fa-solid fa-eye m-r-5"></i>
                            View</a>
  
                          <a class="dropdown-item" onclick="handleClickOnDeleteEstimate('${e._id}')" href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#delete_estimate" ><i class="fa-regular fa-trash-can m-r-5"></i> Delete</a>
                        </div>
                      </div>
                    </td>
            </td></tr>`
        }
        tableData.innerHTML = x;
    }
    // get API for Estimate end
    let estimateDeleteId;
    function handleClickOnDeleteEstimate(id){
      estimateDeleteId = id;
    }

    async function handleClickToDeleteEstimateData() {
        var _id = estimateDeleteId;
        try {
            // const token = localStorage.getItem('authToken');
            const url = 'http://localhost:3000/estimates/delete';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': ` Bearer ${token}`
                },
                body: JSON.stringify({ _id })
            })
            const resp = await response.json();
            console.log(resp);
            const row = document.querySelector(`tr[data-id="${_id}"]`);
            row.remove();
        } catch (error) {
            alert(error)
            console.log(error);
        }
    }