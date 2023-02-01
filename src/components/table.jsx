//imports
    import * as React from 'react';
    import { DataGrid,GridActionsCellItem } from '@mui/x-data-grid';
    import Box from '@mui/material/Box';
    import Stack from '@mui/material/Stack';
    import Button from '@mui/material/Button';
    import * as XLSX from 'xlsx';
    import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
    import CardContent from '@mui/material/CardContent';
    import Typography from '@mui/material/Typography';
    import DeleteIcon from '@mui/icons-material/Delete';
    import Dialog from '@mui/material/Dialog';
    import DialogActions from '@mui/material/DialogActions';
    import DialogContent from '@mui/material/DialogContent';
    import DialogContentText from '@mui/material/DialogContentText';
    import DialogTitle from '@mui/material/DialogTitle';
    import { randomInt } from '@mui/x-data-grid-generator';



const data = [
  { id: 1, class: 'Snow', firstName: 'Jon', age: 35,gender:'M',DOB:'12/12/1999',PIN:'815301',sc:90,math:91,eng:89},
  { id: 2, class: 'Lannister', firstName: 'Cersei', age: 42,gender:'F',DOB:'12/12/1999' ,PIN:'815301',sc:24,math:91,eng:89},
  { id: 3, class: 'Lannister', firstName: 'Jaime', age: 45,gender:'M',DOB:'12/12/1999',PIN:'815301',sc:50,math:91,eng:89 },
  { id: 4, class: 'Stark', firstName: 'Arya', age: 16 ,gender:'M',DOB:'12/12/1999',PIN:'815301',sc:40,math:91,eng:89},
  { id: 5, class: 'Targaryen', firstName: 'Daenerys', age: "null" ,gender:'M',DOB:'12/12/1999',PIN:'815301',sc:60,math:91,eng:89},
  { id: 6, class: 'Melisandre', firstName: "null", age: 150,gender:'F',DOB:'12/12/1999',PIN:'815301',sc:90,math:91,eng:89 },
  { id: 7, class: 'Clifford', firstName: 'Ferrara', age: 44,gender:'M' ,DOB:'12/12/1999',PIN:'815301',sc:90,math:91,eng:89},
  { id: 8, class: 'Frances', firstName: 'Rossini', age: 36 ,gender:'F',DOB:'12/12/1999',PIN:'815301',sc:90,math:91,eng:89},
  { id: 9, class: 'Roxie', firstName: 'Harvey', age: 65,gender:'F',DOB:'12/12/1999',PIN:'815301',sc:90,math:91,eng:89 },
];
const allowedExtensions = ["csv"];
//creating a anys function for getting data of students add rows
const createRow = (id,user,age) => {
	return { id: id, class: user, age: age,sc:30,math:40,eng:50 };
  };
export default function DataTable() {
	const [rows, setRows] = React.useState(data);
  const [csvdata,setData] = React.useState([]);
  const [avg, setavg] = React.useState( {"sc":0,"math":0,"eng":0});
  const [open, setOpen] = React.useState(false);
  
  const handleOpen = () => {
    if (!open) {
      setOpen(true);
  }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteUser = React.useCallback(
    (id) => () => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    },
    [],
  );

  const columns = [
    // { field: 'column', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First Name', width: 130, editable: true },
    { field: 'class', headerName: 'Last Name', width: 130 , editable: true},
    { field: 'gender', headerName: 'Gender',cellEditor: 'agSelectCellEditor',type: "singleSelect",valueOptions: ["M", "F"], width: 90 , editable: true,},
    { field: 'DOB', headerName: 'Date Of Birth', type:"date",width: 130 , editable: true},
    { field: 'PIN', headerName: 'Pin Code',type:'number', width: 100 , editable: true},
    {field: 'age',headerName: 'Age',type: 'number', width: 90,editable: true},
    {field: 'sc',headerName: 'Science',type: 'number',width: 90,editable: true},
    {field: 'math',headerName: 'Maths',type: 'number',width: 90,editable: true},
    {field: 'eng',headerName: 'English',editable: true,type: 'number',width: 90},
    {field: 'actions',headerName: 'Delete',type: 'actions',width: 80,getActions: (params) => [
          <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={deleteUser(params.id)}/>]},
  ];

	  const handleAddRow = () => {
		const num= rows.length
		setRows((prevRows) => [...prevRows, createRow(randomInt(num,10000),"name",1)]);
	  };

    const getExention = (file) => {
      const parts = file.name.split('.')
      const extension = parts[parts.length - 1]
      return allowedExtensions.includes(extension) // return boolean
    }
    const convertToJson = (headers, data) => {
      const rows = []
      data.forEach(row => {
        let rowData = {}
        row.forEach((element, index) => {
          rowData[headers[index]] = element
          rowData.id = randomInt(rows.length,10000)
        })
        rows.push(rowData)
        rowData.DOB = rowData.DOB.split('T')[0]
        // console.log(rowData.firstName,rowData.DOB)
        setRows((prevRows) => [...prevRows,rowData ]);
  
      });
      return rows
    }
  
  const importExcel = (e) => {
      const file = e.target.files[0]
  
      const reader = new FileReader()
      reader.onload = (event) => {
        //parse data
        const bstr = event.target.result
        const workBook = XLSX.read(bstr, { type: "binary" })
        console.log(workBook)
        //get first sheet
        const workSheetName = workBook.SheetNames[0]
        const workSheet = workBook.Sheets[workSheetName]
        //convert to array
        const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 })
        // console.log(fileData)
        const headers = fileData[0]
        //removing header
        fileData.splice(0, 1)
        setData(convertToJson(headers, fileData))
      }
  
      if (file) {
        if (getExention(file)) {
          reader.readAsBinaryString(file)
        }
        else {
          alert("Invalid file input, Select Excel, CSV file")
        }
      } else {
        setData([])
      }
    }
    
const stats =()=>{
  let eng=0
      let sc =0
      let math =0
  for (let index = 0;index < rows.length; index++) {

    sc = rows[index]['sc']+sc;
    math=rows[index]['math']+math;
    eng = rows[index]['eng']+eng;
  }
    let di = rows.length
    
    setavg( {"sc":sc/di,"math":math/di,"eng":eng/di})
}



const processRowUpdate = (newRow) => {
  const updatedRow = { ...newRow, isNew: false };
if ((updatedRow.sc  >= 0 && updatedRow.sc <= 100) && (updatedRow.eng >=0 && updatedRow.eng <=100) && (updatedRow.math >= 0 && updatedRow.math <=100)) { 
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    console.log('updated',open)
    return updatedRow  
}
else if(updatedRow.sc  < 0 || updatedRow.sc > 100 || updatedRow.eng < 0 || updatedRow.eng >100 || updatedRow.math < 0 || updatedRow.math >100){
  console.log('dont update')
  handleOpen()
  return rows
}  else {
  console.log('else update')
  handleOpen()
  return rows
}
};


const card=(
  <React.Fragment>
  <Typography variant='h5'color='darkgoldenrod'>
    Average of student
    </Typography>
  <CardContent >
    <Typography variant='h5' sx={{ fontSize: 24 }} color="black" >
      Science:  
    </Typography>
    <Typography variant='h5' sx={{ fontSize: 24 }} color="#8884d8" >
      {Math.round(avg['sc'])}%
    </Typography>
    <Typography variant='h5' sx={{ fontSize: 24 }} color="black">
      Math: 
    </Typography>
    <Typography variant='h5' sx={{ fontSize: 24 }} color="#82ca9d">
    {Math.round(avg['math'])}%
    </Typography>
    <Typography variant='h5' sx={{ fontSize: 24 }} color="black">
      English: 
    </Typography>
    <Typography variant='h5'sx={{ fontSize: 24 }} color="#82009d">
      {Math.round(avg['eng'])}%
    </Typography>
  </CardContent>
</React.Fragment>
)

  return (
    <Box>
      <Stack direction="row" spacing={1}>
      <div>
      <BarChart width={1200} height={300} data={rows}>
			<XAxis dataKey="firstName" />
			<YAxis />
			<CartesianGrid strokeDasharray="3 3" />
			<Tooltip />
			<Legend />
			<Bar dataKey="sc" fill="#8884d8" />
      <Bar dataKey="math" fill="#82ca9d" />
      <Bar dataKey="eng" fill="#82009d" />
		</BarChart>
      </div>
      <Box>
      {card}
      </Box>        
    </Stack>
	<Box sx={{width:'80%', mx: 3 ,padding:2,}}>
      <Stack direction="row" spacing={1}>
		<Button size="small" onClick={handleAddRow}>
          Add a row
        </Button>
			<label htmlFor="csvInput" style={{ display: "block" }}>
				Enter CSV File
			</label>
			<input
				onChange={importExcel}
				id="csvInput"
				name="file"
				type="File"
			/>
      </Stack>
      <Box sx={{height: 400,padding:2}}>
        <DataGrid 
        rows={rows} columns={columns}  
        pageSize={5} 
        rowsPerPageOptions={[5]}
        checkboxSelection={false}
        experimentalFeatures={{ newEditingApi: true }}
        // setRowid={randomInt(rows.length,10000)}
        processRowUpdate ={processRowUpdate}
        onProcessRowUpdateError={(error) => error} 
        onStateChange={stats}
		/>
      </Box>
    </Box>
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {"Marks error"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please enter marks in range 0f 0-100
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ok</Button>
        </DialogActions>
      </Dialog>
    </div>
    </Box>
  );
}
