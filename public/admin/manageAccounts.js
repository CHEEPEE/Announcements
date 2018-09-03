function manageAccounts() {
  ReactDOM.render(
    <React.Fragment>
      <div className="row m-2">
        <div className="col" id = "mainContent">
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
  createAccount(){
    let email = $("#userEmail").val();
    let password = $("#userPassword").val();
    ref.collection("users").doc("createUser").update({
      email:email,
      password:password
    }).then(function(){
      $("#userEmail").val("");
      $("#userPassword").val("");
    });
  }
  render() {
    return (
      <div className = "container-fluid m-1 p-3 shadow">
        <div className="row pr-5 pl-3">
          <h3 className="text-dark">Create Account</h3>
        </div>
        <div className="row pr-5 pl-3 mt-3">
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
        <div className="row pr-5 pl-3">
          <button
            type="submit"
            onClick={this.createAccount.bind(this)}
            class="btn btn-dark w-100"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }
}

class AccountsComponent extends React.Component {
  getAccountsList() {
    ref.collection("accounts")
    .where("userType", "==", "subAdmin")
    .onSnapshot(function(querySnapshot) {
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
  createAccount(){
    ReactDOM.render(
      <AccountCreateForm/>,
      document.querySelector("#featuresColumn")
    )
  }
  componentDidMount() {
    this.getAccountsList();
  }
  state = {};
  render() {
    return (
      <React.Fragment>
        <div className="row m-2 mt-3 text-dark">
          <div className = "col">
          <h3>Accounts</h3>
          </div>
          <div className = "col">
          <button type="button" class="btn btn-info" onClick = {this.createAccount.bind(this)}>Add Account</button>
          </div>
        </div>
        <div className="list-group" id="accountsList" />
      </React.Fragment>
    );
  }
}

class AccountsItem extends React.Component {
  state = {
    categoryName: "Not Set Yet",
    objProp:this.props
  };
  getCategoryName() {
    let sup = this;
    if (this.state.objProp.categoryId != null) {
      ref
        .collection("announcementCategory")
        .doc(this.state.objProp.categoryId)
        .onSnapshot(function(querySnapshot) {
          sup.setState({
            categoryName: querySnapshot.data().categoryName
          });
        });
    }
  }
  updateAccount() {
    ReactDOM.render(
      <UpdateAccount
        email={this.state.objProp.email}
        category={this.state.categoryName}
        uid={this.state.objProp.id}
      />,
      document.querySelector("#featuresColumn")
    );
  }
  componentDidMount() {
    this.getCategoryName();
  }

  render() {
    return (
      <React.Fragment>
        <div className="list-item row m-2 p-3 bg-light">
          <div className="col">
            <div className="row ml-2">{this.state.objProp.email}</div>
            <div className="row ml-2"><small>{this.state.categoryName}</small></div>
          </div>
          <div className="col d-flex flex-row-reverse">
            <button
              type="button"
              onClick={this.updateAccount.bind(this)}
              class="btn btn-info"
            >
              Manage Account
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

class UpdateAccount extends React.Component {
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
        document.querySelector("#categoryForAccounts")
      );
    });
  }

  updateAccountCategory(){
    let updatedCatId = $("#categoryForAccounts").val();
    ref.collection("accounts").doc(this.props.uid).update({
      "categoryId":updatedCatId
    });
    ReactDOM.render(<AccountsComponent/>, document.querySelector("#mainContent"))
    $("#updateAccountCategoryModal").modal('hide');
  }
  sendPasswordReset(){
    var auth = firebase.auth();
    var emailAddress = this.props.email;

    auth.sendPasswordResetEmail(emailAddress).then(function() {
      // Email sent.
      console.log(emailAddress);
      ReactDOM.render(
       <React.Fragment>
        Email Sent
       </React.Fragment>,
        document.querySelector("#featuresColumn")
      );
    }).catch(function(error) {
      // An error happened.
      console.log(error);
    });
  }
  componentDidMount() {
    this.getCategories();
  }
  render() {
    return (
      <React.Fragment>
        <div className="row m-3">
          <h3 className="text-dark">Update Account</h3>
        </div>
        <div className="container-fluid shadow m-1 p-2">
          <div className="row pt-2 m-2">
            <h3 className="text-info"> {this.props.email}</h3>
          </div>
          <div className="row m-2">
            {this.props.category}{" "}
            <span data-toggle="modal" data-target="#updateAccountCategoryModal" class="ml-3 p-2 badge badge-secondary">Change</span>
          </div>
          <div className="row m-2">
            <button type="button" onClick = {this.sendPasswordReset.bind(this)} class="btn btn-info">
              Send Reset Password To Email
            </button>
          </div>
        </div>
        {/* update account category */}
        <div
          className="modal fade"
          id="updateAccountCategoryModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Modal title
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row p-2 mt-3">
                  <div class="form-group w-100">
                    <label for="exampleFormControlSelect1">
                      Category Select
                    </label>
                    <select class="form-control w-100" id="categoryForAccounts" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button onClick = {this.updateAccountCategory.bind(this)} type="button" className="btn btn-primary">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
