import * as React from "react";
import { Checkbox } from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import postApi from '../services/post';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import './common.css'
import { Link } from '@mui/material';
import moment from 'moment'

export default function SideBar() {
  const [categories, setCategories] = React.useState([{}]);
  const [posts, setPosts] = React.useState([]);
  const [refPosts, setRefPosts] = React.useState([]);
  React.useEffect(() => {
    async function fetchData() {
      // You can await here  
      const catRes = await postApi(null, '/get/categories', 'get');
      const postRes = await postApi(null, '/get/posts', 'get');
      if (catRes.status === 200) {
        catRes.data.data.map((obj)=>{
          obj.checked = false;
          return obj;
        })
        setCategories([...catRes.data.data])
      }
      if (postRes.status === 200) {
        setPosts([...postRes.data.data])
        setRefPosts([...postRes.data.data])
      }
    }
    fetchData();
  }, []);
  const checkboxHandler = (i) => {
    const tc = categories.map((ct, index)=> {
      if(i=== index){
      ct.checked = !ct.checked
      }
      return ct;
    })
    setCategories([...tc])
   if(categories.filter((c)=>c.checked)?.length > 0){
    let tmpPosts = [];
    categories.map((checkedCat)=>{
      if(checkedCat.checked){
        const filteredPost = refPosts.filter((obj) => +obj.category_id === checkedCat.id)
        tmpPosts= tmpPosts.concat([...filteredPost]);
      }
    return checkedCat;
    });
    setPosts([...tmpPosts])
  } else {
    setPosts([...refPosts]);
  }

  }
  return (
    <div className="sidebar-main">
      <div className="categories">
        {categories?.map((cat, i) => {
          return <div key={cat.id}><FormControlLabel control={<Checkbox checked={cat.checked} />} label={cat.title} onChange={() => checkboxHandler(i)} />
          </div>
        })
        }
      </div>
      <div className="posts">
        {posts?.map((p, i) => {
          return <div key={p.id} style={{padding:'10px'}}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
              <Link underline="hover" target="_blank" href={p.ref_url}><Typography  sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  {p.title}
                  
                </Typography>
                </Link>
                <Typography  sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  posted by:{p.user_name} | posted at: {moment(p.created_at).format('DD/MM/YYYY')}
                  
                </Typography>
              </CardContent>
            </Card>
            {/* <FormControlLabel control={<Checkbox checked={cat.checked} />} label={cat.title} onChange={()=>checkboxHandler(i)}/> */}
          </div>
        })
        }
      </div>
    </div>
  );
}