function manageCategory(){
ReactDOM.render(
    <React.Fragment>
    <div className = "row m-2 mt-3 text-dark">
       <h3>
           Manage Categories
        </h3> 
    </div>
    <div className = "row m-2">
        <div className = "col">
          <AddCategoryButton/>
          <CategoryList/>
        </div>
        <div className = "col" id = "featuresColumn">

        </div>
        
    </div>

    </React.Fragment>
    ,document.querySelector("#mainContainer")
);
}

class AddCategoryButton extends React.Component {
    addCategory(){
        ReactDOM.render(
            <AddCategory/>
            ,document.querySelector("#featuresColumn")
        )
    }
    render() { 
        return (   
        <div className = "row w-100">
        <button type="button" class="w-100 btn btn-dark" onClick = {this.addCategory.bind(this)}>Add Category</button>
        </div> );
    }
}


class AddCategory extends React.Component {
    state = {
        buttonMessage : "Save Category",
        buttonState:""
    }
    buttonState(){
        this.setState({
            buttonMessage: this.state.buttonMessage == "Save Category"? "Loading . . .":"Save Category",
            buttonState: this.state.buttonState == ""? "disabled":"",

        })
    }
    saveCategory(){
        let sup = this;
        this.buttonState();
        let categoryName = $("#categoryName").val();
        let categoryDesciption = $("#categoryDesciption").val();
        let pushKey = ref.collection("announcementCategory").doc().id;
        ref.collection("announcementCategory").doc(pushKey).set({
            key: pushKey,
            categoryName: categoryName,
            categoryDesciption: categoryDesciption,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function(docRef) {
            $("#categoryName").val("");
            $("#categoryDesciption").val("");
            sup.buttonState();
            ReactDOM.render(
                <AlerMessage message = {"Successfully Added "+categoryName} messageType = "success"/>
                ,document.querySelector("#featuresColumn")
            );
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
            sup.buttonState();
            ReactDOM.render(
                <AlerMessage message = {"Saving Category : "+categoryName+" Failed"} messageType = "danger"/>
                ,document.querySelector("#addCategoryErrorMessage")
            );
        });

    }
    render() { 
        return ( 
            <React.Fragment>
                 <div className="row pr-5">
                <h3 className="text-dark">Add Catgory</h3>
                </div>
                <div className="row pr-5  mt-3">
                <div className="form-group w-100">
                    <label className = "text-secondary" for="exampleInputEmail1">Category Name</label>
                    <input
                    type="email"
                    className="form-control border-0 bg-light"
                    id="categoryName"
                    aria-describedby="emailHelp"
                    placeholder="Category Name"
                    />
                </div>
                </div>
                <div className="row pr-5  mt-3">
                <div className="form-group w-100">
                    <label className = "text-secondary" for="exampleInputEmail1">Category Description</label>
                    <textarea
                    type="text"
                    className="form-control border-0 bg-light"
                    id="categoryDesciption"
                    aria-describedby="emailHelp"
                    placeholder="Description"
                    rows="7"
                    />
                </div>
                </div>
                <div className="row pr-5">
                <button type="submit" onClick = {this.saveCategory.bind(this)} class={"btn btn-dark w-100 "+this.state.buttonState}>{this.state.buttonMessage}</button>
                </div>
                <div className = "row" id = "addCategoryErrorMessage">

                </div>
            </React.Fragment>
        );
    }
}

class CategoryList extends React.Component {
    state = {  }
    getCategoryList(){
        ref.collection("announcementCategory").onSnapshot(function(querySnapshot) {
            let categoryObjects = [];
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                categoryObjects.push(doc.data());
            });

            var listItem = categoryObjects.map((object)=>
            <CategoryItems key = {object.key} id={object.key} categoryName = {object.categoryName}/>
            );
            ReactDOM.render(
              <React.Fragment>{listItem}</React.Fragment>,document.querySelector("#categoryList")
            );
        });
    }
    
    componentDidMount() {
        this.getCategoryList();
    }
    
    render() { 
        return ( 
           <div className = "row">
                <div className="list-group w-100 mr-4" id = "categoryList">

                </div>
           </div>

         );
    }
}

class CategoryItems extends React.Component {
    state = {  }
    render() { 
        return ( 
        
        <div className="list-group-item text-dark font-weight-bold w-100 bg-light border-0 mt-3 list-group-item-action flex-column align-items-start">
            {this.props.categoryName}
        </div>
         );
    }
}
 

 

class AlerMessage extends React.Component {

    render() { 
        return ( 
            <div class={"alert alert-"+this.props.messageType} role="alert">
            {this.props.message}
            </div>
         );
    }
}
 
