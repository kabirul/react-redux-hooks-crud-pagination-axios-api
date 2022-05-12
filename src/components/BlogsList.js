import React, { useState, useEffect } from "react";
import BlogDataService from "../services/BlogService";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table"
import { FaEdit,FaTrash,FaPhabricator,FaPlusSquare } from "react-icons/fa";
import Pagination from "@material-ui/lab/Pagination";

const BlogsList = () => {
	
  const [blogs, setBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchTitle, setSearchTitle] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  
  
  const pageSizes = [5, 10, 15];

  useEffect(() => {
      retrieveBlogs();
  },[page, pageSize]);

  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };
  
  
 const getRequestParams = (searchTitle, page, pageSize) => {
    let params = {};
    if(searchTitle) {
      params["title"] = searchTitle;
    }
    if(page) {
      params["page"] = page - 1;
    }
    if(pageSize) {
      params["size"] = pageSize;
    }	
    return params;
  }
  
   const handlePageChange = (event, value) => {
	    setPage(value);	
    };
  
  
  const handlePageSizeChange = (event) => {	    
		 setPageSize(event.target.value);
         setPage(1);			
  };  
   
  

  const retrieveBlogs = () => {
	  
	   // console.log("page",page);	
		//console.log("pageSize",pageSize);
		//console.log("searchTitle",searchTitle);
	  
	   const params = getRequestParams(searchTitle, page, pageSize); 		   
	  
    BlogDataService.getAll(params)
      .then(response => {
			
		const {blogs,totalPages}=response.data;	
		
        setBlogs(blogs);
		setCount(totalPages);
		
       // console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveBlogs();
    setCurrentBlog(null);
    setCurrentIndex(-1);
  };

  const setActiveBlog = (blog, index) => {
    setCurrentBlog(blog);
    setCurrentIndex(index);
  };
  
  
  const deleteBlog = (id) => {    
    BlogDataService.remove(id)
      .then(response => {
        console.log(response.data);
         refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }
   

  const removeAllBlogs = () => {
    BlogDataService.removeAll()
      .then(response => {
        console.log(response.data);
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  };

  const findByTitle = () => {
    BlogDataService.findByTitle(searchTitle)
      .then(response => {
        setBlogs(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div className="list row">
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByTitle}
            >
              Search
            </button>
          </div>
        </div>
      </div>
	  
      <div className="col-md-12">
        <h4>Blogs List</h4>	
		<div className="mt-3">
            {"Items per Page: "}
            <select onChange={handlePageSizeChange} value={pageSize}>
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
		 <Pagination
              className="my-3"
              count={count}
              page={page}
              siblingCount={1}
              boundaryCount={1}
              variant="outlined"
              shape="rounded"
              onChange={handlePageChange}
            />
		 </div>
           <Link to={"/add"} className="btn btn-sm btn-primary"><FaPlusSquare /> Add Blog</Link>
		   <button className="m-3 btn btn-sm btn-danger" onClick={removeAllBlogs}><FaTrash /> Remove All</button>
           <Table striped bordered hover>
		  <thead>
			<tr>
			  <th width="8%">#</th>
			  <th width="26%">Title</th>
			  <th width="40%">Description</th>
			  <th width="14%">Status</th>
			  <th width="12%">Action</th>
			</tr>
		  </thead>
		  <tbody>
		   {blogs && blogs.map((blog, index) => (
			<tr>
			  <td>{index+1}</td>
			  <td className={"list-group-item " + (index === currentIndex ? "active" : "")} onClick={() => setActiveBlog(blog, index)} key={index}>{blog.title}</td>
			  <td>{blog.description}</td>
			  <td>{blog.published ? "Published" : "Pending"}</td>
			  <td>
			     <Link to={"#"} onClick={() => setActiveBlog(blog, index)} key={index} className="pdr5"><FaPhabricator /></Link>
			     <Link to={"/blogs/" + blog.id} className="pdr5"><FaEdit /></Link>				
				 <Link to={"#"} onClick={() => deleteBlog(blog.id)}><FaTrash /></Link>  			   
			  </td>
			</tr>
             ))}
          </tbody>
        </Table>         
      </div>
      <div className="col-md-12">
        {currentBlog ? (
          <div>
            <h4>Tutorial</h4>
            <div>
              <label>
                <strong>Title:</strong>
              </label>{" "}
              {currentBlog.title}
            </div>
            <div>
              <label>
                <strong>Description:</strong>
              </label>{" "}
              {currentBlog.description}
            </div>
            <div>
              <label>
                <strong>Status:</strong>
              </label>{" "}
              {currentBlog.published ? "Published" : "Pending"}
            </div>

            <Link
              to={"/blogs/" + currentBlog.id}
              className="badge badge-warning"
            >
              Edit
            </Link>
          </div>
        ) : (
          <div>           
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsList;
