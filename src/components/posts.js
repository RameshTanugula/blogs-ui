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

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useNavigate } from "react-router-dom";
const columns = [
    {
        field: 'title',
        headerName: 'Post Title',
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

export default function Posts() {
    const [categories, setCategories] = React.useState([]);
    const [posts, setPosts] = React.useState([]);
    const [showModal, setShowModal] = React.useState(false);
    const [post, setPost] = React.useState('');
    const [selectedPosts, setSelectedPosts] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState('');
    const [refUrl, setRefUrl] = React.useState('');
    let navigate = useNavigate();
    const renderToolBar = () => {
        return (

            <Stack direction="row" spacing={2} style={{ marginTop: '10px', marginLeft: '10px' }}>
                <Button onClick={() => onDelete()} variant="outlined" disabled={!(selectedPosts?.length > 0)} startIcon={<DeleteIcon />}>
                    Delete
                </Button>
                <Button variant="outlined" onClick={() => onEdit()} disabled={!(selectedPosts?.length === 1)} startIcon={<EditIcon />}>
                    Edit
                </Button>
                <Button variant="contained" disabled={selectedPosts?.length !== 0} style={{ float: 'right' }} onClick={() => { openModal() }}>
                    Add Post
                </Button>
            </Stack>

        )
    }
    const addPost = async () => {
        let res;
        const user_id = window.localStorage.getItem('user_id');
        const user_name = window.localStorage.getItem('user_name');
        const payload = { user_id, user_name, title: post, ref_url: refUrl, category_id: selectedCategory }
        if (selectedPosts?.length === 1) {
            res = await postApi(payload, '/update/posts/' + selectedPosts[0].id, 'put');

        } else {
            res = await postApi(payload, '/save/posts', 'post');
        }
        if (res?.status === 200) {
            setSelectedPosts([])
            setShowModal(false);
            const catRes = await postApi(null, '/get/posts', 'get');
            if (catRes.status === 200) {
                setPosts([...catRes.data.data])
            }
        }

    }
    const onDelete = async () => {
        let deleteStr = [];
        posts.filter((obj) => obj.isChecked).map((mapObj) => {
            deleteStr.push(mapObj.id)
            return mapObj;
        })
        const res = await postApi({ ids: deleteStr.toString() }, '/delete/posts', 'delete');
        if (res?.status === 200) {
            setSelectedPosts([])
            setShowModal(false);
            const catRes = await postApi(null, '/get/posts', 'get');
            if (catRes.status === 200) {
                setPosts([...catRes.data.data])
            }
        }
    }
    const openModal = () => {
        setPost('');
        setSelectedCategory('');
        setRefUrl('');
        setSelectedPosts([])
        setShowModal(true);
    }
    // const handleOpen = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const onEdit = () => {
        setPost(selectedPosts?.length === 1 ? selectedPosts[0].title : '')
        setSelectedCategory(+(selectedPosts[0]?.category_id))
        setRefUrl(selectedPosts[0]?.ref_url);
        setShowModal(true);
    }
    React.useEffect(() => {
        async function fetchData() {
            // You can await here  
            const catRes = await postApi(null, '/get/categories', 'get');
            const postRes = await postApi(null, '/get/posts', 'get');
            if (catRes.status === 200) {
                setCategories([...catRes.data.data])
            }
            if (postRes.status === 200) {
                setPosts([...postRes.data.data])
            }
        }
        fetchData();
    }, []);
    const onCellClick = (e, key) => {
        const tmpCat = posts.map((catObj) => {
            if (key === '' && catObj.id === e.id) {
                catObj.isChecked = !catObj.isChecked;
            } else if (key === 'all') {
                catObj.isChecked = !catObj.isChecked;
            }
            return catObj;
        })
        setPosts([...tmpCat]);
        const selectedPost = posts.filter((obj) => obj.isChecked);
        setSelectedPosts([...selectedPost]);
    }
    const navigateTo=()=>{
        navigate('/admin/categories');
      }
    return (
        <Box sx={{
            '& .css-f3jnds-MuiDataGrid-columnHeaders ': {
                background: 'green'
            },
            height: 400, width: '40%', mt: 10
        }}>
             <Typography>Posts</Typography> 
      <Button variant="contained" style={{marginTop: '20px'}} onClick={()=>navigateTo()}> Goto Categories</Button>
         
            {!showModal && <DataGrid
                rows={posts}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
                components={{ Toolbar: renderToolBar }}
                onCellClick={(e) => onCellClick(e, '')}
                onColumnHeaderClick={(e) => onCellClick(e, 'all')}
            />}
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
                                name="Post"
                                type="text"
                                label="Post"
                                onChange={(e) => setPost(e.target.value)}
                                value={post}
                            />

                            <FormControl fullWidth style={{ marginTop: '15px' }}>
                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedCategory}
                                    placeholder="please select Category"
                                    label="Category"
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    width={'100%'}
                                >
                                    {categories.map((cat) => {
                                        return <MenuItem key={cat.id} value={cat.id}>{cat.title}</MenuItem>

                                    })}
                                </Select>
                            </FormControl>
                            <TextField
                                name="Ref url"
                                type="text"
                                label="Reference URL"
                                onChange={(e) => setRefUrl(e.target.value)}
                                value={refUrl}
                            />
                            <Stack direction="row" spacing={2}>
                                <Button variant="contained" style={{ marginTop: '20px' }} onClick={() => handleClose()}> Cancel</Button>
                                <Button variant="contained" style={{ marginTop: '20px' }} onClick={() => addPost()}> {selectedPosts?.length === 1 ? 'Edit' : 'Save'} Post</Button>
                            </Stack>
                        </Box>
                    </Modal>
                </div>
            }
        </Box>
    );
}