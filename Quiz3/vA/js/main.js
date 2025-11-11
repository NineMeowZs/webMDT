window.onload = loadTable;

async function loadTable(){
    const data = await getDataFromServer();
    showDataRows(data);
}

const showDataRows = (data) => {
    const tbody = document.getElementById('data-table');
    for (let i = 0; i < Object.keys(data).length; i++){
        const row = document.createElement('tr');
        const rowData = data[i];
        console.log(rowData);
        const cell = document.createElement('td');
        cell.className = 'editable';
        cell.textContent = rowData.student_id;
        cell.contentEditable = false; // ID should not be editable
        row.appendChild(cell);

        const cell2 = document.createElement('td');
        cell2.className = 'editable';
        cell2.textContent = rowData.student_name;
        cell2.contentEditable = false;
        row.appendChild(cell2);

        const cell3 = document.createElement('td');
        cell3.className = 'editable';
        cell3.textContent = rowData.student_email;
        cell3.contentEditable = false;
        row.appendChild(cell3);

        const cell4 = document.createElement('td');
        cell4.className = 'editable';
        cell4.textContent = rowData.student_age;
        cell4.contentEditable = false;
        row.appendChild(cell4);

        const cell5 = document.createElement('td');

        const updateButton = document.createElement('button');
        updateButton.className = 'btn btn-success update-btn';
        const updateIcon = document.createElement('i');
        updateIcon.className = 'fa fa-check';
        updateButton.appendChild(updateIcon);
        updateButton.appendChild(document.createTextNode(' Update'));
        updateButton.onclick = function() { onUpdateButtonClick(row); };
        updateButton.style.display = 'none';
        cell5.appendChild(updateButton);

        const editButton = document.createElement('button');
        editButton.className = 'btn btn-warning edit-btn';
        const editIcon = document.createElement('i');
        editIcon.className = 'fa fa-pencil';
        editButton.appendChild(editIcon);
        editButton.appendChild(document.createTextNode(' Edit'));
        editButton.onclick = function() { onEditButtonClick(row); };
        editButton.style.marginRight = '10px';
        cell5.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger delete-btn';
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fa fa-trash';
        deleteButton.appendChild(deleteIcon);
        deleteButton.appendChild(document.createTextNode(' Delete'));
        deleteButton.onclick = function() { onDeleteButtonClick(row); };
        cell5.appendChild(deleteButton);
        row.appendChild(cell5);

        tbody.appendChild(row);
    }
}

function onUpdateButtonClick(row) {
    const id = row.querySelector('td:nth-child(1)').textContent;
    const name = row.querySelectorAll('.editable')[1].textContent;
    const email = row.querySelectorAll('.editable')[2].textContent;
    const age = row.querySelectorAll('.editable')[3].textContent;
    
  }

function onEditButtonClick(row) {
    const allCells = document.querySelectorAll('td.editable');
    

}

function onDeleteButtonClick(row) {
    
    const id = row.querySelector('td:nth-child(1)').textContent;
    console.log('Deleted Data ID:', id);
    deleteDataFromServer(id);
    alert('Data deleted successfully!');
    row.remove();
}

function showEditDeleteButtons(row){
    row.querySelector('.update-btn').style.display = 'none'; // hide Update button
    row.querySelector('.edit-btn').style.display = 'inline-block'; // show Edit button
    row.querySelector('.delete-btn').style.display = 'inline-block'; // show Delete button
}

// ------------------------------------------------------------------------------------------
// Server communication functions
// ทำส่วนนี้ให้สมบูรณ์

const getDataFromServer = async() => {
    // ควร return ข้อมูลที่ได้จาก server กลับไป
    const data = testquiz3;
    return testquiz3;
}


const deleteDataFromServer = async(id) => {

}

