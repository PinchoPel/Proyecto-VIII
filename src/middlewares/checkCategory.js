const Category = require("../api/model/categories");

const checkCategory = async (req,res,next) => {
    let  {categoryName} = req.params;

    let categoryExist = await Category.findOne({categoria:categoryName});
try {
    if (categoryExist) {
        next();
    }
    else{
        return res.status(400).json("Categoría no encontrada")
    }
} catch (error) {
    return res.status(400).json("Categoría no encontrada")
}
};

module.exports = {checkCategory};