function manageAccounts() {
  ReactDOM.render(
    <React.Fragment>
      <div className="row m-2">
        <div className="col">
          <AccountsComponent />
        </div>
        <div className="col" id="featuresColumn">
          <AccountCreateForm />
        </div>
      </div>
    </React.Fragment>,
    document.querySelector("#mainContainer")
  );
}

class AccountCreateForm extends React.Component {
  state = {};
  getCategories() {
    ref.collection("announcementCategory").onSnapshot(function(querySnapshot) {
      let categoryObjects = [];
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        categoryObjects.push(doc.data());
      });
      var listItem = categoryObjects.map(object => (
        <OptionItem
          key={object.key}
          id={object.key}
          value={object.key}
          name={object.categoryName}
        />
      ));
      ReactDOM.render(
        <React.Fragment>{listItem}</React.Fragment>,
        document.querySelector("#categoryOptions")
      );
    });
  }
  createAccount() {
    let email = $("#userEmail").val();
    let password = $("#userPassword").val();
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function() {
        console.log("Account Created");
        firebase
          .auth()
          .sendPasswordResetEmail(email)
          .then(function() {
            // Email sent.
          })
          .catch(function(error) {
            // An error happened.
          });
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
  }
  render() {
    return (
      <React.Fragment>
        <div className="row pr-5">
          <h3 className="text-dark">Create Account</h3>
        </div>
        <div className="row pr-5  mt-3">
          <div className="form-group w-100">
            <label className="text-secondary" for="exampleInputEmail1">
              Email
            </label>
            <input
              type="email"
              className="form-control border-0 bg-light"
              id="userEmail"
              aria-describedby="emailHelp"
              placeholder="Email"
            />
          </div>
          <div className="form-group w-100">
            <label className="text-secondary" for="exampleInputEmail1">
              Password
            </label>
            <input
              type="password"
              id="userPassword"
              className="form-control border-0 bg-light"
              aria-describedby="emailHelp"
              placeholder="Password"
            />
          </div>
        </div>
        <div className="row pr-5">
          <button
            type="submit"
            onClick={this.createAccount.bind(this)}
            class="btn btn-dark w-100"
          >
            Create Account
          </button>
        </div>
      </React.Fragment>
    );
  }
}

class AccountsComponent extends React.Component {
  getAccountsList() {
    ref.collection("accounts").onSnapshot(function(querySnapshot) {
      let objects = [];
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        objects.push(doc.data());
      });

      var listItem = objects.map(object => (
        <AccountsItem
          key={object.userId}
          id={object.userId}
          email={object.email}
          categoryId={object.categoryId}
        />
      ));
      ReactDOM.render(
        <React.Fragment>{listItem}</React.Fragment>,
        document.querySelector("#accountsList")
      );
    });
  }
  componentDidMount() {
    this.getAccountsList();
  }
  state = {};
  render() {
    return (
      <React.Fragment>
        <div className="row m-2 mt-3 text-dark">
          <h3>Accounts</h3>
        </div>
        <div className="list-group" id="accountsList" />
      </React.Fragment>
    );
  }
}

class AccountsItem extends React.Component {
  state = {
    categoryName: "Not Set Yet"
  };
  getCategoryName() {
    let sup = this;
    if (this.props.categoryId != null) {
      ref
        .collection("announcementCategory")
        .doc(this.props.categoryId)
        .onSnapshot(function(querySnapshot) {
          sup.setState({
            categoryName: querySnapshot.data().categoryName
          });
        });
    }
  }
updateAccount(){
    ReactDOM.render(
        <UpdateAccount/>,document.querySelector("#featuresColumn")
    )
}
  componentDidMount() {
    this.getCategoryName();
    
  }


  render() {
    return (
    <React.Fragment>
    
      <div className="list-item row m-2 p-3 bg-light">
        <div className = "col">
            <div className="row ml-2">{this.props.email}</div>
            <div className="row ml-2">{this.state.categoryName}</div>
        </div>
        <div className = "col" onClick = {this.updateAccount.bind(this)}>
            Manage Account
        </div>
      </div>
      </React.Fragment>
    );
  }
}

class UpdateAccount extends React.Component {
    state = {  }
    getCategories(){
        ref.collection("announcementCategory").onSnapshot(function(querySnapshot) {
            let categoryObjects = [];
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                categoryObjects.push(doc.data());
            });
    
            var listItem = categoryObjects.map((object)=>
            <OptionItem key = {object.key} id={object.key} value = {object.key} name = {object.categoryName}/>
            );
            ReactDOM.render(
              <React.Fragment>{listItem}</React.Fragment>,document.querySelector("#categoryForAccounts")
            );
        });
    }
    componentDidMount(){
        this.getCategories();
    }
    render() { 
        return ( 
        <React.Fragment>
            <div className = "row">
                User Email
            </div>
            <div className = "row">
            <div class="form-group w-100">
                    <label for="exampleFormControlSelect1">Department Select</label>
                    <select class="form-control w-100" id="categoryForAccounts">
                    </select>
                </div>
            </div>
        </React.Fragment>    
             );
    }
}
 


