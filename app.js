var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/blog_app");
app.use(methodOverride("_method"));
app.use(express.static("public"));




var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
});

var Blog = mongoose.model("Blog", blogSchema);

// Routes

app.get("/", function(req, res) {
    res.redirect("/blogs");
});

// Index Route
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("index", {blogs: blogs});
        }
    });
});

// New Route
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

// Create Route
app.post("/blogs", function(req, res) {
    console.log(req.body.blog);
    Blog.create(req.body.blog, function(err, blog) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(blog);
            res.redirect("/blogs");
        }
    });
});

// Show Route
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {blog: blog});
        }
    });
});

// Edit Route
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("edit", {blog: blog});
        }
    });
});



// Update Route
app.put("/blogs/:id", function(req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(blog);
            res.redirect("/blogs/" + blog.id);
        }
    });
});




// Delete Route
app.delete("/blogs/:id", function(req, res) {
    console.log(req.body.blog);
    Blog.findByIdAndRemove(req.params.id, function(err, blog) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(blog);
            res.redirect("/blogs");
        }
    });
});



app.listen(process.env.PORT, process.env.IP, function(req, res) {
    console.log("The Blog App has started!");
});