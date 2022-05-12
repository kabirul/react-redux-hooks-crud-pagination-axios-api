import React, { useState } from "react";
import BlogDataService from "../services/BlogService";
import { Link } from "react-router-dom";
import { FaPhabricator } from "react-icons/fa";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const AddBlog = () => {
	
  const initialBlogState = {
    id: null,
    title: "",
    description: "",
    published: false
  };
  
  const [blog, setBlog] = useState(initialBlogState);
  const [submitted, setSubmitted] = useState(false);
  
  
	const validationSchema = () => {
		return Yup.object().shape({
			title: Yup.string().required('Title is required'),
			description: Yup.string().required('Description is required'),   
		});
	};	
	
	const initialValues = {
		title: "",
		description: ""    
	};	
	const handleSubmit = (data) => {
	   console.log(JSON.stringify(data, null, 2));
	};

  const handleInputChange = event => {
    const { name, value } = event.target;
    setBlog({ ...blog, [name]: value });
  };

  const saveBlog = () => {
    var data = {
      title: blog.title,
      description: blog.description
    };

    BlogDataService.create(data)
      .then(response => {
        setBlog({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          published: response.data.published
        });
        setSubmitted(true);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const newBlog = () => {
    setBlog(initialBlogState);
    setSubmitted(false);
  };

  return (
     <div className="list row">
      <div className="col-md-12">
	   <h4>Add Blog</h4>	
           <Link to={"/blogs"} className="btn btn-sm btn-primary mb15"><FaPhabricator /> Blogs</Link>
	  <Formik enableReinitialize={true} initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}> 
      {submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
          <button className="btn btn-success" onClick={newBlog}>
            Add
          </button>
        </div>
      ) : (
        <div>
		 <Form>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <Field
              type="text"
              className="form-control"
              id="title"
              required
              value={blog.title}
              onChange={handleInputChange}
              name="title"
            />
			<ErrorMessage name="title" component="div" className="text-danger" />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <Field
              type="text"
              className="form-control"
              id="description"
              required
              value={blog.description}
              onChange={handleInputChange}
              name="description"
            />
			 <ErrorMessage name="description" component="div" className="text-danger" />
          </div>

          <button onClick={saveBlog} className="btn btn-success">
            Submit
          </button>
		   </Form>
        </div>
      )}
	  </Formik>
    </div>
   </div>	
  );
};

export default AddBlog;
