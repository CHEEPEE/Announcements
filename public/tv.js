class Carousel extends React.Component {
    state = {  }

    getTVAnnouncements() {
        ref
          .collection("announcements")
          .where("announcementType", "==", "TVannouncement")
          .orderBy("timestamp")
          .onSnapshot(function(querySnapshot) {
            let categoryObjects = [];
            querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
    
              var details = doc.data().announcementDetails;
              console.log(details);
              let repdetails = details;
              let obj = {
                key: doc.data().key,
                announcementCaption: doc.data().announcementCaption,
                announcementDetails: repdetails,
                imagePath: doc.data().imagePath
              };
              categoryObjects.push(obj);
            });
            categoryObjects.reverse();
            var listItem = categoryObjects.map(function(object,index){
                let active ="";
                if(index == 0){
                    active = "active";
                }   
                 
                return <CarouselItem
                    key={object.key}
                    id={object.key}
                    caption={object.announcementCaption}
                    des={object.announcementDetails}
                    imagePath={object.imagePath}
                    active = {active}
                />
            }
            );
            ReactDOM.render(
            <React.Fragment>
             {listItem}
             </React.Fragment>
             ,
              document.querySelector("#carItems")
            );
            $('.carousel').carousel({
                interval: 2000
              })
          });
      }

      
      componentDidMount() {
        this.getTVAnnouncements();
      }
    render() { 
        return (
           <div id="carouselExampleFade" className="carousel slide h-100 w-100" data-ride="carousel">
            <div className="carousel-inner h-100 w-100" id ="carItems">
            
            </div>
          </div>
        );
    }
}

class CarouselItem extends React.Component {
    state = {
        active:this.props.active
    };
    render() { 
        return ( 
            <div className={" h-100 w-100 carousel-item "+this.state.active}
            style = {{
                backgroundImage:"url(" + this.props.imagePath + ")",
                backgroundSize:"cover",
                backgroundPosition:"center"
              }}
            >
            </div>
         );
    }
}

ReactDOM.render(
    <Carousel/>,document.querySelector("#app")
)
 

