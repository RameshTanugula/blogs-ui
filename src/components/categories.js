import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/joy/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import postApi from '../services/post';
import { useNavigate } from "react-router-dom";

const columns = [
  {
    field: 'title',
    headerName: 'Category Name',
    width: 150,
    editable: true,
  },
  
];
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default  function Categories() {
    const [categories, setCategories] = React.useState([]);
    const [showModal, setShowModal] = React.useState(false);
    const [category, setCategory] = React.useState('');
    const [selectedCategories, setSelectedCategories] = React.useState([])
    let navigate = useNavigate();

    const renderToolBar = ()=>{
      return (
        
       <Stack direction="row" spacing={2} style={{marginTop:'10px', marginLeft:'10px'}}>
        <Button onClick={()=> onDelete()} variant="outlined" disabled={!(selectedCategories?.length > 0)} startIcon={<DeleteIcon />}>
          Delete
        </Button>
        <Button variant="outlined" onClick={() => onEdit()} disabled={!(selectedCategories?.length === 1)} startIcon={<EditIcon />}>
            Edit
          </Button>
          <Button variant="contained" disabled={!(selectedCategories?.length === 0)} style={{ float: 'right' }} onClick={() => {openModal()}}>
            Add Category
            </Button>
            </Stack>
            
      )
    }
    const addCategory = async () =>{
      let res;
      if(selectedCategories?.length === 1) {
        res = await postApi({title: category}, '/update/categories/'+ selectedCategories[0].id, 'put');
      
      } else{
       res = await postApi({title: category, user_id:1, user_name:'Admin'}, '/save/categories', 'post');
      }
      if(res?.status === 200){
      setSelectedCategories([])
      setShowModal(false);
      const catRes = await postApi(null, '/get/categories', 'get');
      if(catRes.status === 200){
        setCategories([...catRes.data.data])
      }
      }
      
    }
    const onDelete = async ()=>{
      let deleteStr = [];
      categories.filter((obj)=> obj.isChecked).map((mapObj)=>{
        deleteStr.push(mapObj.id)
        return mapObj;
      });
      const res = await postApi({ids:deleteStr.toString()}, '/delete/categories', 'delete');
      if(res?.status === 200){
      setSelectedCategories([])
      setShowModal(false);
      const catRes = await postApi(null, '/get/categories', 'get');
      if(catRes.status === 200){
        setCategories([...catRes.data.data])
      }
    }
  }
    const openModal = ()=>{
      setCategory('');
      setSelectedCategories([]);
      setShowModal(true);
    }
  // const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const onEdit = () =>{
    setCategory(selectedCategories?.length === 1 ? selectedCategories[0].title : '')
    setShowModal(true);
  }
      React.useEffect(() => {
        async function fetchData() {
          // You can await here  
        const catRes = await postApi(null, '/get/categories', 'get');
      if(catRes.status === 200){
        setCategories([...catRes.data.data])
      }
        }
        fetchData();
      }, []);
    const onCellClick=(e, key)=>{
      const tmpCat = categories.map((catObj)=>{
        if(key === '' && catObj.id === e.id){
          catObj.isChecked = !catObj.isChecked;
        } else if(key === 'all'){
          catObj.isChecked = !catObj.isChecked;
        }
        return catObj;
      })
      setCategories([...tmpCat]);
      const selectedCategories = categories.filter((obj)=> obj.isChecked);
     setSelectedCategories([...selectedCategories]);
    }
    const navigateToPosts=()=>{
      navigate('/admin/posts')
    }
  return (
    <Box sx={{ height: 400, width: '40%', mt:10,
    '& .css-f3jnds-MuiDataGrid-columnHeaders ':{
      background: 'green'
  },
   }}>
      <Typography>Categories</Typography> 
      <Button variant="contained" style={{marginTop: '20px'}} onClick={()=>navigateToPosts()}> Goto Posts</Button>
         
     {!showModal && <DataGrid
        rows={categories}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        components={{ Toolbar: renderToolBar }}
        onCellClick={(e)=>onCellClick(e, '')}
        onColumnHeaderClick={(e)=>onCellClick(e, 'all')}
      /> }
{showModal && 
  <div>
     <Modal
        open={showModal}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <TextField
            name="Category"
            type="text"
            label="Category"
            onChange={(e)=>setCategory(e.target.value)}
            value={ category}
          />
          <Stack direction="row" spacing={2}>     
          <Button variant="contained" style={{marginTop: '20px'}} onClick={()=>handleClose()}> Cancel</Button>
          <Button variant="contained" style={{marginTop: '20px'}} onClick={()=>addCategory()}> {selectedCategories?.length === 1 ? 'Edit' : 'Save'} Category</Button>
        </Stack>
        </Box>
      </Modal>
    </div>
    }
    </Box>
  );
}