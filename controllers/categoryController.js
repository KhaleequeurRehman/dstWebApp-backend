const Category = require("../models/categoryModel");

// createCategory 
exports.createCategory = async (req,res)=>{
    const category = await Category.create(req.body);
    res.status(201).json({
        success: true,
        message: "Category created successfully",
        category
    });
}

// getAllCategories 
exports.getAllCaterories = async (req,res)=>{
    const category = await Category.find();
    res.status(200).json({
        success: true,
        message: "Get categories successfully",
        category
    });
}

// getSingleCategory
exports.getSingleCategory = async (req,res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return res.status(404).json({
            success: false,
            message: "Category not found",
          });
      }
    res.status(200).json({
        success: true,
        message: "Get category successfully",
        category
      });
}

// updateCategory
exports.updateCategory = async (req,res) => {
    let category = await Category.findById(req.params.id);
    if (!category) {
        return res.status(404).json({
            success: false,
            message: "Category not found",
          });
      }
    category.name = req.body.name;
    await category.save()
    // category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    //     new: true,
    //     runValidators: true,
    //   });
    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        category
      });
}

// deleteCategory 
exports.deleteCategory = async (req,res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        // return next(new ErrorHander("Category not found", 404));
        res.status(404).json({
            success: false,
            message: "Category not found",
          });
      }else{
        await category.remove();
        res.status(200).json({
            success: true,
            message: "Category Delete successfully",
          });
      }
    
   
}