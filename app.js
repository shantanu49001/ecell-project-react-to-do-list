const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");//mongoose1--->include
const _=require("lodash");
//const date=reuire(__dirname+"/date.ejs");
const app=express();
//var items=[];--->mongoose run 
//const app k baad hi 
app.set('view engine', 'ejs');//use ejs as view engine
//baki website pr diya hua code already done hai
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect("mongodb/localhost:27017/todolistDB",{useNewUrlParser:true});//mongoose 2--->connecting
//3.creating mongoose schema
const itemsSchema={
  name:String
};
//4.creating mongoose model 
const Item=mongoose.model("Item",itemsSchema);
//5.mongoose
const item1=new Item({
  name:"Welcome to your to do list"
});
const item2=new item({
  name:"Hit the +button to add a new item"
});
const item3=new item({
name:"Hit this to delete an item"
});
const defaultItems=[item1,item2,item3];//defau;t wale push kr duye
const listSchema={
  name:String,
  items:[itemsSchema]
};
const List=mongoose.model("List",listSchema);
//------->mongoose<----------------------------
app.get("/",function(req,res){//home page 
  //logic code server k side pr 
//calling the mongoose method-->6
Item.find({},function(err,foundItems){//it has two methods
//console.log(foundItems);
if(foundItems.length==0){
Item.insertMany(defaultItems,function(err){//methdo in momgoose
if(err){
  console.log("Error");
}
});
res.redirect("/");
}
else{
  res.render("list",{listTitle:"Today",newListItems:foundItems});
 // console.log("Added new to list");
}
});
});
//res.redirect("/");

 //   var day = today.toLocaleDateString("en-US",options);
app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        //Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        //Show an existing list

        res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
      }
    }
  });



});

  
    
       
 
 //   res.render("list", { kindOfDay: day,newListItem:items});//this formatted day as string is passes into the list in the ejs. });//acc to ejs docuentation it will replcae kinf of day by weekend
//list file ka naam hai jaha replace krna hai

app.post("/",function(req,res){//app function for making a post request by form 
 const itemName=req.body.newItem;//new iyem is name of input type and isko use krna se pehle bdy module add krna padega
 const listName=new req.body.list;
 const item=new Item({
   name: itemName
 });
  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
 });
app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function (err, foundList) {
      if (!err) {
        res.redirect("/" + listName);
      }
    });
  }


});

app.get("/about", function (req, res) {
  res.render("about");
});
app.listen(3000,function(){
console.log("Server running on port 3000");//hyper me print
})